const Joi = require('joi')
const dbConfig = require('./db')

const schema = Joi.object({
  appInsights: Joi.object(),
  cache: {
    expiresIn: Joi.number().default(1000 * 3600 * 24 * 3), // 3 days
    options: {
      host: Joi.string().default('redis-hostname.default'),
      partition: Joi.string().default('ffc-lnr-map-web'),
      password: Joi.string().allow(''),
      port: Joi.number().default(6379),
      tls: Joi.object()
    }
  },
  cookie: {
    cookieNameCookiePolicy: Joi.string().default('ffc_lnr_cookie_policy'),
    cookieNameAuth: Joi.string().default('ffc_lnr_auth'),
    cookieNameSession: Joi.string().default('ffc_lnr_session'),
    isSameSite: Joi.string().default('Lax'),
    isSecure: Joi.boolean().default(true),
    password: Joi.string().min(32).required(),
    ttl: Joi.number().default(1000 * 3600 * 24 * 3) // 3 days
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
  osMapApiKey: Joi.string().default('').allow(''),
  useRedis: Joi.boolean().default(false)
})

const config = {
  appInsights: require('applicationinsights'),
  cache: {
    options: {
      host: process.env.REDIS_HOSTNAME,
      password: process.env.REDIS_PASSWORD,
      port: process.env.REDIS_PORT,
      tls: process.env.NODE_ENV === 'production' ? {} : undefined
    }
  },
  cookie: {
    cookieNameCookiePolicy: 'ffc_lnr_cookie_policy',
    cookieNameAuth: 'ffc_lnr_auth',
    cookieNameSession: 'ffc_lnr_session',
    isSameSite: 'Lax',
    isSecure: process.env.NODE_ENV === 'production',
    password: process.env.COOKIE_PASSWORD
  },
  env: process.env.NODE_ENV,
  staticCacheTimeoutMillis: process.env.STATIC_CACHE_TIMEOUT_IN_MILLIS,
  isDev: process.env.NODE_ENV === 'development',
  port: process.env.PORT,
  serviceUri: process.env.SERVICE_URI,
  publicApi: process.env.PUBLIC_API,
  osMapApiKey: process.env.OS_MAP_API_KEY,
  useRedis: process.env.NODE_ENV !== 'test'
}

const { error, value } = schema.validate(config, { abortEarly: false })

if (error) {
  throw new Error(`The server config is invalid. ${error.message}`)
}

value.dbConfig = dbConfig

module.exports = value
