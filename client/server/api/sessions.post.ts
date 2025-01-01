export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')!
  const body = await readBody(event)

  return $fetch<any>('http://localhost:3001/api/sessions/', {
    method: 'POST',
    headers: {
      authorization: authHeader,
    },
    body,
  })
})
