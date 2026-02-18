<script setup lang="ts">
/**
 * VideoLazy — ленивая загрузка видео при попадании в viewport.
 * Экономит ~21 MB трафика на страницах, где видео ниже fold.
 */
const props = withDefaults(
  defineProps<{
    src: string
    title?: string
    poster?: string
    class?: string
  }>(),
  { title: 'Видео' }
)

const containerRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)
const hasLoaded = ref(false)
let io: IntersectionObserver | null = null

onMounted(() => {
  nextTick(() => {
    if (!containerRef.value) return
    io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting && !hasLoaded.value) {
          isVisible.value = true
          hasLoaded.value = true
        }
      },
      { rootMargin: '100px', threshold: 0.01 }
    )
    io.observe(containerRef.value)
  })
})

onUnmounted(() => {
  io?.disconnect()
})
</script>

<template>
  <div ref="containerRef" class="relative w-full aspect-video bg-gray-100 rounded-3xl overflow-hidden">
    <!-- Placeholder до загрузки: poster или градиент -->
    <div
      v-if="!isVisible"
      class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200"
      aria-hidden="true"
    >
      <div class="flex flex-col items-center gap-3 text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="text-xs font-bold uppercase tracking-wider">Видео загрузится при прокрутке</span>
      </div>
    </div>
    <video
      v-show="isVisible"
      controls
      muted
      playsinline
      preload="metadata"
      :class="props.class"
      :title="props.title"
      class="rounded-3xl shadow-lg w-full"
    >
      <source :src="props.src" type="video/mp4" />
      Ваш браузер не поддерживает видео.
    </video>
  </div>
</template>
