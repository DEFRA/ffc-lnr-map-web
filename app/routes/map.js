const { getParcels } = require('../api')
const createReference = require('../lib/create-reference')
const { findParcels, set } = require('../repositories/parcel-repository')
const config = require('../config')
const sbiSchema = require('./schemas/sbi')
const Joi = require('joi')

module.exports = [{
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
      const { parcels, center } = await getParcels(sbi)
      return h.view('interactive-map', { apiKey, sbi, parcels, amendedParcels: {}, center, mapStyle })
    }
  }
},
{
  method: 'GET',
  path: '/map/verify',
  options: {
    validate: {
      query: Joi.object({
        reference: Joi.string().required(),
        sbi: Joi.string().required()
      }),
      failAction: async (request, h, error) => {
        return h.redirect('/').takeover()
      }
    },
    handler: async (request, h) => {
      const reference = request.query.reference
      const sbi = request.query.sbi
      const mapStyle = request.query.mapStyle || ''
      const apiKey = config.osMapApiKey || ''
      const amendedParcels = await findParcels(reference)
      const { parcels, center } = await getParcels(sbi)
      const amendedPropertyIds = amendedParcels.parcels.features.map(feature => feature.properties.id)
      const parcelsFiltered = parcels.features.filter(feature => amendedPropertyIds.includes(feature.properties.id))
      console.log('parcelsFiltered', amendedPropertyIds, parcelsFiltered, parcels)
      const transformParcels = {
        type: 'FeatureCollection',
        crs: { type: 'name', properties: { name: 'EPSG:27700' } },
        features: parcelsFiltered
      }
      return h.view('interactive-map', { apiKey, sbi, parcels: transformParcels, amendedParcels: amendedParcels.parcels, center, mapStyle })
    }
  }
},
{
  method: 'POST',
  path: '/map',
  options: {
    handler: async (request, h) => {
      const { sbi, data } = request.payload
      const reference = createReference()
      await set(reference, sbi, { parcels: data })
      return h.response({ reference }).code(200)
    }
  }
}]
