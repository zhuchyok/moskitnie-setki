<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()

definePageMeta({
  layout: 'default',
  middleware: ['auth']
})

const title = 'Обратные звонки — Сетки 21'
useHead({
  title
})

type CallbackRow = {
  id: string
  date: string
  name: string
  phone: string
  city: string
  dealer: string
  domain: string
  extra: string
}

const callbacks = ref<CallbackRow[]>([])
const isLoading = ref(true)
const deletingCallbackId = ref<string | null>(null)

const fetchCallbacks = async () => {
  isLoading.value = true
  try {
    const config = useRuntimeConfig()
    const apiBase = config.public.apiUrl || ''
    const response = await $fetch('/api/v1/admin/callbacks', {
      baseURL: apiBase,
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    }) as any[]

    callbacks.value = (response || []).map((row: any) => ({
      id: row.id,
      date: row.created_at ? new Date(row.created_at).toLocaleString('ru-RU') : '—',
      name: row.name || '—',
      phone: row.phone || '—',
      city: row.city || '—',
      dealer: row.dealer_name || '—',
      domain: row.domain || '—',
      extra: row.extra_services || '—'
    }))
  } catch (e) {
    console.error('Failed to fetch callbacks', e)
    callbacks.value = []
  } finally {
    isLoading.value = false
  }
}

const deleteCallback = async (callbackId: string) => {
  if (deletingCallbackId.value) return
  const confirmed = window.confirm('Удалить звонок? Действие необратимо.')
  if (!confirmed) return

  deletingCallbackId.value = callbackId
  try {
    const config = useRuntimeConfig()
    const apiBase = config.public.apiUrl || ''
    await $fetch(`/api/v1/admin/callbacks/${callbackId}`, {
      method: 'DELETE',
      baseURL: apiBase,
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    })
    callbacks.value = callbacks.value.filter(item => item.id !== callbackId)
  } catch (e) {
    console.error('Failed to delete callback', e)
    window.alert('Не удалось удалить звонок')
  } finally {
    deletingCallbackId.value = null
  }
}

onMounted(fetchCallbacks)
</script>

<template>
  <div class="bg-gray-50 min-h-screen pb-20">
    <AdminHeader />

    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-2xl font-black text-brand-dark uppercase tracking-tighter">Звонки</h2>
      </div>

      <div class="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden">
        <div v-if="isLoading" class="p-20 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
          <p class="text-gray-400 font-black uppercase text-[10px] tracking-widest">Загрузка звонков...</p>
        </div>

        <div v-else-if="callbacks.length === 0" class="p-20 text-center">
          <p class="text-gray-400 font-black uppercase text-[10px] tracking-widest">Звонков пока нет</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                <th class="p-8">Дата</th>
                <th class="p-8">Имя</th>
                <th class="p-8">Телефон</th>
                <th class="p-8">Город</th>
                <th class="p-8">Дилер</th>
                <th class="p-8">Домен</th>
                <th class="p-8">Также интересует</th>
                <th class="p-8 text-right">Действия</th>
              </tr>
            </thead>
            <tbody class="text-sm font-bold text-brand-dark">
              <tr v-for="row in callbacks" :key="row.id" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td class="p-8 text-gray-400">{{ row.date }}</td>
                <td class="p-8">{{ row.name }}</td>
                <td class="p-8">
                  <a :href="`tel:${row.phone}`" class="text-brand-blue hover:underline">{{ row.phone }}</a>
                </td>
                <td class="p-8">{{ row.city }}</td>
                <td class="p-8 text-gray-400">{{ row.dealer }}</td>
                <td class="p-8 text-gray-400">{{ row.domain }}</td>
                <td class="p-8 text-gray-400">{{ row.extra }}</td>
                <td class="p-8 text-right">
                  <button
                    type="button"
                    :disabled="deletingCallbackId === row.id"
                    class="text-red-500 hover:text-red-600 disabled:opacity-40 transition-colors"
                    title="Удалить звонок"
                    @click="deleteCallback(row.id)"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M8.257 3.099c.366-.446.91-.724 1.486-.724h.514c.576 0 1.12.278 1.486.724l.651.793h2.481a.75.75 0 010 1.5h-.632l-.84 10.08a2 2 0 01-1.993 1.833H8.606a2 2 0 01-1.993-1.833l-.84-10.08h-.632a.75.75 0 010-1.5h2.481l.651-.793zM8.04 5.392l.81 9.72a.5.5 0 00.498.458h1.304a.5.5 0 00.498-.458l.81-9.72H8.04z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
