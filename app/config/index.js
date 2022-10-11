const Joi = require('joi')

const schema = Joi.object({
  appInsights: Joi.object(),
  cookie: {
    isSecure: Joi.boolean().default(true)
  },
  env: Joi.string().valid('development', 'test', 'production').default(
    'development'
  ),
  staticCacheTimeoutMillis: Joi.number().default(7 * 24 * 60 * 60 * 1000),
  isDev: Joi.boolean().default(false),
  port: Joi.number().default(3000),
  serviceUri: Joi.string().uri(),
  serviceName: Joi.string().default('Local Nature Recovery'),
  publicApi: Joi.string().default('https://environment.data.gov.uk/arcgis/rest/services/RPA/'),
  osMapApiKey: Joi.string().default('').allow('')
})

const config = {
  appInsights: require('applicationinsights'),
  cookie: {
    isSecure: process.env.NODE_ENV === 'production'
  },
  env: process.env.NODE_ENV,
  staticCacheTimeoutMillis: process.env.STATIC_CACHE_TIMEOUT_IN_MILLIS,
  isDev: process.env.NODE_ENV === 'development',
  port: process.env.PORT,
  serviceUri: process.env.SERVICE_URI,
  publicApi: process.env.PUBLIC_API,
  osMapApiKey: process.env.OS_MAP_API_KEY
}

const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The server config is invalid. ${result.error.message}`)
}

module.exports = result.value
