<script setup lang="ts">
/** OrderForm - Форма оформления заявки
 * Извлечена из Calculator.vue для переиспользования
 */

interface Props {
  /** Общая сумма заказа */
  totalPrice: number
  /** Текст способа получения (для отображения в форме) */
  deliveryText?: string
}

const props = withDefaults(defineProps<Props>(), {
  deliveryText: ''
})

const emit = defineEmits<{
  submit: [data: {
    name: string
    phone: string
    address: string
    comment: string
  }]
}>()

const isModalOpen = defineModel<boolean>('open', { default: false })

const form = reactive({
  name: '',
  phone: '',
  address: '',
  comment: '',
  agree: false
})

const resetForm = () => {
  form.name = ''
  form.phone = ''
  form.address = ''
  form.comment = ''
  form.agree = false
}

const handleSubmit = () => {
  if (!form.agree) return
  emit('submit', {
    name: form.name,
    phone: form.phone,
    address: form.address,
    comment: form.comment
  })
  resetForm()
  isModalOpen.value = false
}

const closeModal = () => {
  isModalOpen.value = false
}
</script>

<template>
  <Teleport to="body">
    <div v-if="isModalOpen"
         class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <!-- Scrollable wrapper -->
      <div class="absolute inset-0 overflow-y-auto flex items-center justify-center p-4">
        <div class="bg-white rounded-[2rem] md:rounded-[4rem] shadow-2xl w-full max-w-2xl relative transform animate-in zoom-in-95 duration-500 my-auto">
          <button @click="closeModal"
                  class="absolute top-6 right-6 md:top-10 md:right-10 text-gray-300 hover:text-brand-dark transition-all hover:rotate-90 z-10">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div class="p-8 md:p-20">
            <div class="mb-8 md:mb-12">
              <h3 class="text-3xl md:text-4xl font-black text-brand-dark mb-3 uppercase tracking-tighter">Оформление</h3>
              <p class="text-gray-400 font-medium text-sm md:text-base">Заполните данные, и мы перезвоним для уточнения деталей</p>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-6 md:space-y-8">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div class="space-y-2 md:space-y-3">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 md:ml-6">Ваше имя</label>
                  <input v-model="form.name"
                         type="text"
                         required
                         placeholder="Иван Иванов"
                         class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue focus:bg-white rounded-2xl md:rounded-3xl px-6 md:px-8 py-4 md:py-5 outline-none transition-all font-bold text-sm md:text-base shadow-inner" />
                </div>
                <div class="space-y-2 md:space-y-3">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 md:ml-6">Телефон</label>
                  <input v-model="form.phone"
                         type="tel"
                         required
                         placeholder="+7 (___) ___-__-__"
                         class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue focus:bg-white rounded-2xl md:rounded-3xl px-6 md:px-8 py-4 md:py-5 outline-none transition-all font-bold text-sm md:text-base shadow-inner" />
                </div>
              </div>
              <div class="space-y-2 md:space-y-3">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 md:ml-6">Адрес (если доставка/монтаж)</label>
                <input v-model="form.address"
                       type="text"
                       placeholder="Город, улица, дом, кв"
                       class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue focus:bg-white rounded-2xl md:rounded-3xl px-6 md:px-8 py-4 md:py-5 outline-none transition-all font-bold text-sm md:text-base shadow-inner" />
              </div>
              <div class="space-y-2 md:space-y-3">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 md:ml-6">Комментарий</label>
                <textarea v-model="form.comment"
                          rows="2"
                          placeholder="Любые пожелания"
                          class="w-full bg-gray-50 border-2 border-transparent focus:border-brand-blue focus:bg-white rounded-2xl md:rounded-3xl px-6 md:px-8 py-4 md:py-5 outline-none transition-all font-bold text-sm md:text-base shadow-inner resize-none"></textarea>
              </div>

              <label class="flex items-start gap-4 md:gap-5 cursor-pointer group p-1 md:p-2">
                <div class="relative flex items-center mt-1">
                  <input type="checkbox"
                         v-model="form.agree"
                         required
                         class="peer appearance-none w-6 h-6 md:w-7 md:h-7 border-2 border-gray-100 rounded-lg md:rounded-xl checked:bg-brand-blue checked:border-brand-blue transition-all shadow-sm" />
                  <svg xmlns="http://www.w3.org/2000/svg"
                       class="h-4 w-4 md:h-5 md:w-5 absolute left-1 text-white opacity-0 peer-checked:opacity-100 transition-all scale-50 peer-checked:scale-100"
                       fill="none"
                       viewBox="0 0 24 24"
                       stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span class="text-[9px] md:text-[10px] text-gray-400 font-black leading-relaxed uppercase tracking-widest group-hover:text-gray-600 transition-colors">
                  Я даю согласие ООО "Бикос" на обработку моих персональных данных в соответствии с <NuxtLink to="/privacy" class="text-brand-blue underline decoration-2 underline-offset-4">Политикой обработки данных</NuxtLink>
                </span>
              </label>

              <button type="submit"
                      :disabled="!form.agree"
                      :class="[
                        'w-full font-black py-5 md:py-6 rounded-2xl md:rounded-[2rem] transition-all shadow-2xl active:scale-95 uppercase text-[10px] md:text-xs tracking-[0.3em] mt-4 md:mt-6',
                        form.agree ? 'bg-brand-blue hover:bg-[#1e5a9a] text-white shadow-brand-blue/40' : 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none'
                      ]">
                Заказать
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
