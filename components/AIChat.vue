<template>
  <div class="fixed bottom-6 right-6 z-[100] font-sans">
    <!-- Floating Button -->
    <button
      @click="toggleChat"
      class="w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 text-white"
      :style="{ backgroundColor: brandPrimary }"
    >
      <svg v-if="!isOpen" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <!-- Chat Window -->
    <transition name="chat-fade">
      <div v-if="isOpen" class="absolute bottom-20 right-0 w-[320px] sm:w-[380px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[600px] h-[80vh]">
        <!-- Header -->
        <div class="p-4 text-white flex items-center gap-3" :style="{ backgroundColor: brandPrimary }">
          <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 class="font-bold text-sm leading-tight">ИИ-Помощник</h3>
            <p class="text-[10px] opacity-80 uppercase tracking-wider font-bold">Онлайн • Ответит мгновенно</p>
          </div>
        </div>

        <!-- Messages Area -->
        <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50" ref="messagesContainer">
          <div v-for="(msg, index) in messages" :key="index" :class="['flex', msg.role === 'user' ? 'justify-end' : 'justify-start']">
            <div :class="[
              'max-w-[85%] p-3 rounded-2xl text-sm shadow-sm',
              msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
            ]" :style="msg.role === 'user' ? { backgroundColor: brandPrimary } : {}">
              {{ msg.content }}
            </div>
          </div>
          <div v-if="isLoading" class="flex justify-start">
            <div class="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex gap-1">
              <span class="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></span>
              <span class="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span class="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        </div>

        <!-- Footer / Input -->
        <div class="p-4 bg-white border-t border-gray-100">
          <!-- Privacy Consent -->
          <div v-if="!hasConsented" class="mb-3">
            <label class="flex items-start gap-3 cursor-pointer group">
              <input type="checkbox" v-model="consent" class="mt-1" />
              <span class="text-[10px] text-gray-400 leading-tight">
                Я согласен на обработку персональных данных и принимаю условия политики конфиденциальности.
              </span>
            </label>
          </div>

          <div class="flex gap-2">
            <input
              v-model="userInput"
              @keyup.enter="sendMessage"
              :disabled="!consent || isLoading"
              type="text"
              placeholder="Введите ваш вопрос..."
              class="flex-1 bg-gray-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 transition-all"
              :style="{ '--tw-ring-color': brandPrimary }"
            />
            <button
              @click="sendMessage"
              :disabled="!consent || isLoading || !userInput.trim()"
              class="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all disabled:opacity-50 disabled:grayscale"
              :style="{ backgroundColor: brandPrimary }"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, computed } from 'vue'
import { useTenantStore } from '~/stores/tenant'

const tenantStore = useTenantStore()
const brandPrimary = computed(() => tenantStore.config?.branding?.primary_color || '#2A6AB2')

const isOpen = ref(false)
const isLoading = ref(false)
const userInput = ref('')
const consent = ref(false)
const hasConsented = ref(false)
const messagesContainer = ref(null)

const messages = reactive([
  { role: 'assistant', content: 'Здравствуйте! Я ваш ИИ-помощник. Чем могу помочь в выборе москитных сеток?' }
])

const toggleChat = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    scrollToBottom()
  }
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value || !consent.value) return

  const text = userInput.value.trim()
  userInput.value = ''
  hasConsented.value = true // Hide checkbox after first message if consented
  
  messages.push({ role: 'user', content: text })
  isLoading.value = true
  scrollToBottom()

    try {
      console.log('[AI_CHAT] Sending message:', text)
      const response = await $fetch('/api/chat/public/send', {
        method: 'POST',
        body: {
          message: text,
          domain: window.location.hostname,
          session_id: localStorage.getItem('ai_session_id') || (Math.random().toString(36).substring(7))
        }
      })
      console.log('[AI_CHAT] Response received:', response)

    messages.push({ role: 'assistant', content: response.content })
  } catch (e) {
    messages.push({ role: 'assistant', content: 'Извините, произошла ошибка. Попробуйте позже или позвоните нам.' })
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}

onMounted(() => {
  if (!localStorage.getItem('ai_session_id')) {
    localStorage.setItem('ai_session_id', Math.random().toString(36).substring(7))
  }
})
</script>

<style scoped>
.chat-fade-enter-active, .chat-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.chat-fade-enter-from, .chat-fade-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #d1d5db;
}
</style>
