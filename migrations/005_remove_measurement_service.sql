-- Удалить услугу "Замер" из списка работ и услуг (цена замера считается по "Замер: База" и "% от мат.").
UPDATE global_settings
SET value = jsonb_set(
  value,
  '{services}',
  (SELECT jsonb_agg(s) FROM jsonb_array_elements(value->'services') AS s WHERE (s->>'id') IS DISTINCT FROM 'measurement')
)
WHERE key = 'global_pricing'
  AND value->'services' @> '[{"id": "measurement"}]';
