# HTTPS для setki21.ru

Если браузер показывает **«Это ненадёжное подключение»** — сайт отдаётся по HTTP. Нужно включить HTTPS на VDS.

## Что нужно на сервере

1. **Домен setki21.ru** должен указывать на IP вашего VDS (A-запись в DNS).
2. **Порт 80** открыт (для проверки Let's Encrypt).
3. **Порт 443** открыт (HTTPS).
4. **Nginx** (или Caddy) стоит перед Docker и принимает 80/443, проксирует на контейнеры `web` и `api`.

## Вариант 1: Nginx на хосте + Let's Encrypt

Установка на VDS (Debian/Ubuntu):

```bash
# Nginx и certbot
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx

# Временно остановите контейнер, который слушает 80 (если есть)
# Либо настройте nginx как единственный вход на 80/443 и проксируйте на localhost:3000 и localhost:8080

# Получить сертификат для setki21.ru и www.setki21.ru
sudo certbot certonly --nginx -d setki21.ru -d www.setki21.ru
# Сертификаты появятся в /etc/letsencrypt/live/setki21.ru/

# Конфиг nginx: создать /etc/nginx/sites-available/setki21
# (см. пример ниже), затем:
sudo ln -s /etc/nginx/sites-available/setki21 /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

Пример конфига `/etc/nginx/sites-available/setki21`:

```nginx
# Редирект HTTP -> HTTPS
server {
    listen 80;
    server_name setki21.ru www.setki21.ru;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name setki21.ru www.setki21.ru;

    ssl_certificate     /etc/letsencrypt/live/setki21.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/setki21.ru/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;

    location /api/ {
        proxy_pass http://127.0.0.1:8080;   # порт moskit-api
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;   # порт Nuxt web
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Важно: в `docker-compose.yml` на VDS порты 80 и 443 не должны быть заняты контейнерами, если nginx слушает на хосте. Либо пусть только nginx слушает 80/443 и проксирует на `localhost:3000` и `localhost:8080` (и контейнеры привязаны к 127.0.0.1:3000 и 127.0.0.1:8080).

## Вариант 2: Nginx в Docker

В проекте есть `nginx.conf` с HTTPS. Чтобы его использовать:

1. Получить сертификаты на хосте (certbot) и смонтировать в контейнер nginx:
   - `/etc/letsencrypt/live/setki21.ru/fullchain.pem` → `/etc/letsencrypt/live/default/fullchain.pem` в контейнере
   - `privkey.pem` аналогично.
2. Запускать контейнер nginx на портах 80 и 443, он проксирует на `api:8080` и `web:3000`.

После настройки обновите страницу по адресу **https://setki21.ru** — предупреждение должно исчезнуть.

## Продление сертификата

Let's Encrypt выдаёт сертификат на 90 дней. Продление:

```bash
sudo certbot renew
sudo systemctl reload nginx
```

Имеет смысл добавить в cron: `0 3 * * * certbot renew --quiet && systemctl reload nginx`.

---

## Nginx Proxy Manager (NPM): 502 после включения HTTPS

Если вы включили HTTPS в NPM и сайт выдаёт **502 Bad Gateway**, скорее всего прокси пытается ходить к бэкенду по HTTPS, а приложение слушает только HTTP.

### Что исправить

1. **Details (основной хост)**  
   - Forward Hostname: `setki21-site` (или как у вас называется контейнер/сервис Nuxt).  
   - Forward Port: `80`.  
   - К бэкенду прокси должен обращаться по **HTTP** (внутри сети TLS не нужен). В NPM для «Scheme» в деталях прокси обычно имеется в виду входящий трафик; внутренний запрос к `setki21-site:80` — всегда HTTP.

2. **Custom Locations (/api и /health)**  
   - Сейчас у вас: Forward к `moskit-api:8080` с **Scheme: https**.  
   - **Исправление:** для обеих локаций (`/api` и `/health`) поставьте **Scheme: http**.  
   - moskit-api принимает только HTTP на порту 8080; при Scheme https прокси пытается открыть TLS до бэкенда → ошибка соединения → 502.

3. **Опции (Details)**  
   - Включите **Websockets Support**, если фронт или API используют WebSocket.  
   - По желанию включите **Trust Upstream Forwarded Proto Headers**, чтобы приложение видело исходный `https` в заголовках.

4. **Проверка бэкендов**  
   - Убедитесь, что контейнеры `setki21-site` (web) и `moskit-api` запущены и в одной сети с NPM (или доступны по тем именам/портам, что указаны в NPM).  
   - Из контейнера NPM: `curl -s http://setki21-site:80` и `curl -s http://moskit-api:8080/health` должны отвечать.

После смены Scheme на **http** в Custom Locations сохраните прокси-хост и откройте снова https://setki21.ru — 502 должен пропасть.

### Если 502 остаётся: проверка на VDS

Выполните на сервере (SSH на 45.10.43.248).

**1. Какие контейнеры запущены и в какой сети:**

```bash
docker ps --format "table {{.Names}}\t{{.Ports}}\t{{.Status}}"
docker network ls
# Узнать сеть NPM (часто nginx-proxy-manager_default или npm_default):
docker ps -a --filter "name=proxy" --format "{{.Names}}"
docker inspect <имя_контейнера_npm> --format '{{range $k, $v := .NetworkSettings.Networks}}{{$k}}{{end}}'
```

**2. В одной ли сети NPM и бэкенды:**

NPM должен резолвить имена хостов (setki21-site, moskit-api или atra-kernel). Если setki21 и API в другом docker-compose — подключите их к сети NPM или используйте **IP контейнера** вместо имени.

Узнать IP контейнера (например, Nuxt):

```bash
docker ps --filter "name=web" --filter "name=setki21" -q | head -1 | xargs -I {} docker inspect {} --format '{{.NetworkSettings.Networks}}'
# или по имени сервиса:
docker inspect setki21_src-web-1 2>/dev/null --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}'
```

**3. Проверка с хоста: отвечает ли бэкенд**

Подставьте реальное имя или IP контейнера (например `web` из docker-compose setki-21 может быть `setki21_src-web-1`):

```bash
# Главная (Nuxt) — порт внутри контейнера обычно 3000, снаружи может быть 3003
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3003
# или по имени контейнера, если в одной сети:
docker run --rm --network host curlimages/curl:latest curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3003
```

API (порт 8083 снаружи по docker-compose, внутри 8080):

```bash
curl -s http://127.0.0.1:8083/health
```

**4. Имена для NPM**

В docker-compose setki-21 сервисы называются **api** и **web**; снаружи порты **8083** (API) и **3003** (web). Если на VDS у вас другие имена (например setki21-site, atra-kernel), в NPM в поле «Forward Hostname / IP» должно быть именно то имя (или IP), которое резолвится из сети NPM. **Forward Port:** для web — порт **внутри** контейнера (3000 для Nuxt, не 3003); для api — **8080** (не 8083).

**5. Custom Locations — порядок и порты**

- Если есть правило для `/api/orders`, оно должно быть **выше** правила для `/api` (более конкретный путь первым).
- Для каждого бэкенда Scheme = **http**, Forward Port = внутренний порт контейнера (8080 для API, 3000 для Nuxt, 3010 для orders-api).

**6. Если NPM и setki-21 на одном хосте, но в разных сетях**

Вместо имени контейнера можно указать **IP хоста** и **внешний порт** (чтобы не зависеть от Docker network):

- **Details** (основной сайт): Forward Hostname / IP = `host.docker.internal` или `172.17.0.1` (Linux), Forward Port = `3003` (если web снаружи на 3003). На Linux без host.docker.internal используйте `172.17.0.1` или реальный IP хоста в docker-сети.
- **Custom Location /api**: Forward Hostname = `172.17.0.1` (или host.docker.internal), Forward Port = `8083`, Scheme = **http**.
- **Custom Location /health**: то же, что для /api.

После правок в NPM нажмите Save и проверьте https://setki21.ru снова.
