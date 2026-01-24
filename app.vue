<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
/* Critical CSS - Above the fold styles */
html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
  background-color: #ffffff;
  color: #334155;
}

/* Preload critical fonts */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* Critical button styles */
.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-all shadow-lg;
}

.btn-secondary {
  @apply bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold py-3 px-6 rounded-full transition-all;
}

/* Hero section critical styles */
.hero-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.hero-text {
  @apply text-4xl md:text-6xl font-black text-white mb-6;
}

/* Navigation critical styles */
.nav-link {
  @apply text-white hover:text-blue-200 transition-colors font-medium;
}

.nav-link.active {
  @apply text-blue-300;
}
</style>
