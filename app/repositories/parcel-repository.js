const turf = require('@turf/turf')
const { models } = require('../data')

const findParcels = async (reference) => {
  const parcels = await models.parcel.findOne({ where: { reference } })

  const transformParcels = {
    type: 'FeatureCollection',
    crs: { type: 'name', properties: { name: 'EPSG:27700' } },
    features: parcels.data.parcels
  }

  const centroid = turf.centroid(transformParcels)
  const center = centroid.geometry.coordinates

  return { parcels: transformParcels, center }
}

const set = async (reference, sbi, data) => {
  return models.parcel.create({ reference, sbi, data })
}

module.exports = {
  findParcels,
  set
}
