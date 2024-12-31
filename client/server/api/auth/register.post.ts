export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return $fetch<any>('http://localhost:3001/api/auth/register/', {
    method: 'POST',
    body,
  })
})
