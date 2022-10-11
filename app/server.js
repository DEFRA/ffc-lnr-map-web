const config = require('./config')
const Hapi = require('@hapi/hapi')

async function createServer () {
  const server = Hapi.server({
    port: config.port,
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      }
    },
    router: {
      stripTrailingSlash: true
    }
  })

  await server.register(require('@hapi/cookie'))
  await server.register(require('@hapi/crumb'))
  await server.register(require('@hapi/inert'))
  await server.register(require('./plugins/error-pages'))
  await server.register(require('./plugins/logging'))
  await server.register(require('./plugins/router'))
  await server.register(require('./plugins/view-context'))
  await server.register(require('./plugins/views'))

  if (config.isDev) {
    await server.register(require('blipp'))
  }

  return server
}

module.exports = createServer
