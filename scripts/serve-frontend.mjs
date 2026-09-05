import http from 'node:http'
import handler from 'serve-handler'

const port = Number(process.env.PORT || 3000)
const host = '0.0.0.0'

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be a valid TCP port')
}

const server = http.createServer((request, response) => handler(request, response, {
  public: 'dist',
  cleanUrls: false,
  rewrites: [{ source: '**', destination: '/index.html' }],
  headers: [
    { source: '**/*.{js,css,png,jpg,jpeg,webp,svg,woff,woff2}', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
    { source: '**', headers: [{ key: 'X-Content-Type-Options', value: 'nosniff' }] },
  ],
}))

server.listen(port, host, () => {
  console.log(`DTPT Techs frontend listening on http://${host}:${port}`)
})

const shutdown = signal => {
  console.log(`${signal} received, shutting down frontend server`)
  server.close(error => {
    if (error) {
      console.error(error)
      process.exitCode = 1
    }
  })
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
