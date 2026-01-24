// Google Analytics 4
export default defineNuxtPlugin(() => {
  // Only load GA in production
  if (process.env.NODE_ENV === 'production') {
    // Google Analytics 4
    const GA_ID = 'G-22PN3WNKJN' // Measurement ID от Владельца

    // Load Google Analytics script
    const script = document.createElement('script')
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
    script.async = true
    document.head.appendChild(script)

    // Initialize GA4
    ;(window as any).dataLayer = (window as any).dataLayer || []
    function gtag(...args: any[]) {
      ;(window as any).dataLayer.push(args)
    }
    ;(window as any).gtag = gtag
    gtag('js', new Date())
    gtag('config', GA_ID, {
      page_title: document.title,
      page_location: window.location.href
    })

    // Web Vitals tracking
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      const sendToAnalytics = (metric: any) => {
        // Send to Google Analytics
        ;(window as any).gtag('event', metric.name, {
          event_category: 'Web Vitals',
          event_label: metric.id,
          value: Math.round(metric.value),
          non_interaction: true
        })

        // Send to our API for monitoring
        $fetch('/api/web-vitals', {
          method: 'POST',
          body: metric
        }).catch(console.error)
      }

      getCLS(sendToAnalytics)
      getFID(sendToAnalytics)
      getFCP(sendToAnalytics)
      getLCP(sendToAnalytics)
      getTTFB(sendToAnalytics)
    })

    // Track page views on route changes
    const router = useRouter()
    router.afterEach((to) => {
      ;(window as any).gtag('config', GA_ID, {
        page_path: to.fullPath,
        page_title: to.meta?.title || document.title
      })
    })

    // Track conversions (form submissions)
    const trackConversion = (eventName: string, value?: number) => {
      ;(window as any).gtag('event', 'conversion', {
        event_category: 'engagement',
        event_label: eventName,
        value: value
      })
    }

    // Make trackConversion globally available
    ;(window as any).trackConversion = trackConversion
  }
})
