import express from 'express'
import next from 'next'
import path from 'path'

const dev = process.env.NODE_ENV === 'development'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  // Serve static uploads folder
  server.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads')))

  // Let Next.js handle other requests
  server.all('*', (req, res) => {
    return handle(req, res)
  })

  const port = process.env.PORT || 3000
  server.listen(port, () => {
    console.log(`[___▲___] Server ready on http://localhost:${port}`)
  })
})
