<script setup lang="ts">
defineProps<{
  src: string
  webpSrc?: string
  alt: string
  width?: number
  height?: number
  loading?: 'lazy' | 'eager'
  fetchpriority?: 'high' | 'low' | 'auto'
  class?: string
}>()
</script>

<template>
  <picture v-if="webpSrc">
    <source :srcset="webpSrc" type="image/webp" />
    <img
      :src="src"
      :alt="alt"
      :width="width"
      :height="height"
      :loading="loading"
      :fetchpriority="fetchpriority"
      :class="$props.class"
      decoding="async"
    />
  </picture>
  <img
    v-else
    :src="src"
    :alt="alt"
    :width="width"
    :height="height"
    :loading="loading"
    :fetchpriority="fetchpriority"
    :class="$props.class"
    decoding="async"
  />
</template>
