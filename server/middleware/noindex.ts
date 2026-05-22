const NOINDEX_PREFIXES = ['/admin', '/cabinet', '/dealer']

export default defineEventHandler((event) => {
  const path = getRequestURL(event).pathname
  if (NOINDEX_PREFIXES.some(prefix => path.startsWith(prefix))) {
    setHeader(event, 'X-Robots-Tag', 'noindex, nofollow')
  }
})
