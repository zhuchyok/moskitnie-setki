export default defineEventHandler((event) => {
  return sendRedirect(event, '/api/v1/tenant/favicon', 302)
})
