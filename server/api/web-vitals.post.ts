// Web Vitals tracking endpoint
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Log Web Vitals metrics
  console.log('Web Vitals:', {
    name: body.name,
    value: body.value,
    id: body.id,
    timestamp: new Date().toISOString()
  })

  // In production, you might want to store these in a database
  // or send to monitoring service like DataDog, New Relic, etc.

  return { success: true }
})
