export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')!

  return $fetch<any>('http://localhost:3001/api/sessions/open', {
    headers: {
      authorization: authHeader,
    },
  })
})
