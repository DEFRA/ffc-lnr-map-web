const { getParcels } = require('../api')
const config = require('../config')
const sbiSchema = require('./schemas/sbi')
const Joi = require('joi')

module.exports = {
  method: 'GET',
  path: '/map',
  options: {
    validate: {
      query: Joi.object()
        .concat(sbiSchema),
      failAction: async (request, h, error) => {
        return h.redirect('/').takeover()
      }
    },
    handler: async (request, h) => {
      const sbi = request.query.sbi
      const mapStyle = request.query.mapStyle || ''
      const apiKey = config.osMapApiKey || ''
      console.log('sbi', sbi)
      console.log('mapStyle', mapStyle)
      console.log('apiKey', apiKey)
      const { parcels, center } = await getParcels(sbi)
      return h.view('interactive-map', { apiKey, sbi, parcels, center, mapStyle })
    }
  }
}
