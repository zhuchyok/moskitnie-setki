<script setup lang="ts">
/**
 * Модальное окно «Заказать обратный звонок»: имя, телефон, чекбокс политики конфиденциальности.
 * На главном сайте отправка на основной email; у дилеров — на email дилера (передаётся toEmail).
 */

interface Props {
  /** Email получателя (для дилера); если не передан — бэкенд использует CONTACT_EMAIL */
  toEmail?: string
}

const props = defineProps<Props>()

const isModalOpen = defineModel<boolean>('open', { default: false })

const form = reactive({
  name: '',
  phone: '',
  agree: false
})

const formErrors = reactive<Record<string, string>>({ name: '', phone: '' })
const submitError = ref('')
const isLoading = ref(false)
const submitSuccess = ref(false)

const tenant = useTenantStore()
const workingHoursText = computed(() => tenant.config?.branding?.working_hours?.trim() || 'Пн–Пт 10:00–18:00')
// Ссылка на политику конфиденциальности из админки дилера (legal.privacy_policy_url) или дефолт /privacy
const privacyPolicyUrl = computed(() => tenant.config?.legal?.privacy_policy_url?.trim() || '/privacy')

const PHONE_REGEX = /^\+7\s?\(\d{3,4}\)\s?\d{2,3}-\d{2}-\d{2}$|^\+7\d{10}$/
const PHONE_ALLOWED = /[\d+\s()\-]/g
const MAX_PHONE_DIGITS = 11
const PHONE_KEY_ALLOWED = /^[\d+\s\-()]$/

function formatPhoneDisplay(raw: string): string {
  const digits = (raw.match(/\d/g) || []).join('').slice(0, MAX_PHONE_DIGITS)
  if (digits.length === 0) return ''
  let d = digits
  if (d.startsWith('8') && d.length <= 11) d = '7' + d.slice(1)
  else if (!d.startsWith('7')) d = '7' + d
  d = d.slice(0, 11)
  if (d.length <= 1) return d === '7' ? '+7' : '+7 (' + d
  if (d.length <= 4) return '+7 (' + d.slice(1)
  if (d.length <= 7) return '+7 (' + d.slice(1, 4) + ') ' + d.slice(4)
  if (d.length <= 9) return '+7 (' + d.slice(1, 4) + ') ' + d.slice(4, 7) + '-' + d.slice(7)
  return '+7 (' + d.slice(1, 4) + ') ' + d.slice(4, 7) + '-' + d.slice(7, 9) + '-' + d.slice(9, 11)
}

function sanitizePhoneInput(value: string): string {
  const allowed = (value.match(PHONE_ALLOWED) || []).join('')
  if (!allowed.replace(/\D/g, '').length) return ''
  return formatPhoneDisplay(allowed)
}

function onPhoneKeydown(e: KeyboardEvent) {
  const key = e.key
  if (key.length === 1 && !PHONE_KEY_ALLOWED.test(key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
    e.preventDefault()
  }
}

function onPhoneInput(e: Event) {
  form.phone = sanitizePhoneInput((e.target as HTMLInputElement).value)
  formErrors.phone = ''
}

function validateForm(): boolean {
  formErrors.name = ''
  formErrors.phone = ''
  submitError.value = ''
  let valid = true
  if (!form.name.trim()) {
    formErrors.name = 'Введите имя'
    valid = false
  }
  const phone = form.phone.trim()
  if (!phone) {
    formErrors.phone = 'Введите телефон'
    valid = false
  } else if (!PHONE_REGEX.test(phone.replace(/\s/g, ''))) {
    formErrors.phone = 'Формат: +7 (XXX) XXX-XX-XX'
    valid = false
  }
  if (!form.agree) {
    submitError.value = 'Необходимо согласие с политикой конфиденциальности'
    valid = false
  }
  return valid
}

async function handleSubmit() {
  if (!validateForm()) return

  isLoading.value = true
  submitError.value = ''

  try {
    const body: Record<string, string | boolean> = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      agreePrivacy: form.agree
    }
    if (props.toEmail) body.toEmail = props.toEmail

    const data = await $fetch<{ success?: boolean; message?: string }>('/api/callback', {
      method: 'POST',
      body
    })

    if (data?.success) {
      submitSuccess.value = true
      form.name = ''
      form.phone = ''
      form.agree = false
      formErrors.name = ''
      formErrors.phone = ''
      setTimeout(() => {
        submitSuccess.value = false
        isModalOpen.value = false
      }, 2000)
    } else {
      submitError.value = (data as any)?.message || 'Ошибка отправки'
    }
  } catch (e: any) {
    submitError.value = e?.data?.message || e?.message || 'Ошибка отправки. Попробуйте позже.'
  } finally {
    isLoading.value = false
  }
}

function closeModal() {
  if (!isLoading.value) {
    submitSuccess.value = false
    submitError.value = ''
    isModalOpen.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="isModalOpen"
         class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
         @click.self="closeModal">
      <div class="absolute inset-0 overflow-y-auto flex items-center justify-center p-4">
        <div class="bg-white rounded-[2rem] md:rounded-[4rem] shadow-2xl w-full max-w-lg relative transform animate-in zoom-in-95 duration-500 my-auto">
          <button type="button"
                  @click="closeModal"
                  class="absolute top-6 right-6 md:top-10 md:right-10 text-gray-300 hover:text-brand-dark transition-all hover:rotate-90 z-10">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div class="p-8 md:p-16">
            <div v-if="submitSuccess" class="text-center py-6">
              <p class="text-xl font-black text-brand-dark uppercase">Заявка отправлена</p>
              <p class="text-gray-500 text-sm mt-2">Перезвоним в рабочее время: {{ workingHoursText }}.</p>
            </div>
            <template v-else>
              <div class="mb-6 md:mb-8">
                <h3 class="text-2xl md:text-3xl font-black text-brand-dark mb-2 uppercase tracking-tighter">Заказать обратный звонок</h3>
                <p class="text-gray-400 font-medium text-sm">Оставьте имя и телефон — перезвоним</p>
              </div>

              <form @submit.prevent="handleSubmit" class="space-y-5 md:space-y-6">
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4">Имя</label>
                  <input v-model="form.name"
                         type="text"
                         required
                         placeholder="Иван Иванов"
                         :class="[
                           'w-full bg-gray-50 border-2 focus:border-brand-blue focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold text-sm shadow-inner',
                           formErrors.name ? 'border-red-500 focus:border-red-500' : 'border-transparent'
                         ]" />
                  <p v-if="formErrors.name" class="text-red-500 text-xs font-bold ml-4">{{ formErrors.name }}</p>
                </div>
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4">Телефон</label>
                  <input :value="form.phone"
                         type="tel"
                         inputmode="tel"
                         autocomplete="tel"
                         required
                         placeholder="+7 (___) ___-__-__"
                         maxlength="18"
                         @keydown="onPhoneKeydown"
                         @input="onPhoneInput"
                         :class="[
                           'w-full bg-gray-50 border-2 focus:border-brand-blue focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold text-sm shadow-inner',
                           formErrors.phone ? 'border-red-500 focus:border-red-500' : 'border-transparent'
                         ]" />
                  <p v-if="formErrors.phone" class="text-red-500 text-xs font-bold ml-4">{{ formErrors.phone }}</p>
                </div>

                <label class="flex items-start gap-4 cursor-pointer group p-1">
                  <div class="relative flex items-center mt-1">
                    <input type="checkbox"
                           v-model="form.agree"
                           class="peer appearance-none w-6 h-6 border-2 border-gray-100 rounded-lg checked:bg-brand-blue checked:border-brand-blue transition-all shadow-sm" />
                    <svg xmlns="http://www.w3.org/2000/svg"
                         class="h-4 w-4 absolute left-1 text-white opacity-0 peer-checked:opacity-100 transition-all scale-50 peer-checked:scale-100"
                         fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span class="text-[9px] md:text-[10px] text-gray-400 font-black leading-relaxed uppercase tracking-widest group-hover:text-gray-600 transition-colors">
                    Я даю согласие на обработку персональных данных в соответствии с
                    <NuxtLink :to="privacyPolicyUrl" class="text-brand-blue underline decoration-2 underline-offset-4" target="_blank">Политикой конфиденциальности</NuxtLink>
                  </span>
                </label>

                <p v-if="submitError" class="text-red-500 text-xs font-bold ml-4">{{ submitError }}</p>

                <button type="submit"
                        :disabled="!form.agree || isLoading"
                        :class="[
                          'w-full font-black py-5 rounded-2xl transition-all shadow-2xl active:scale-95 uppercase text-[10px] md:text-xs tracking-[0.3em] mt-2',
                          form.agree && !isLoading ? 'bg-brand-blue hover:bg-[#1e5a9a] text-white shadow-brand-blue/40' : 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none'
                        ]">
                  {{ isLoading ? 'Отправка…' : 'Заказать звонок' }}
                </button>
              </form>
            </template>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
