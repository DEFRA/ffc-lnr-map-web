const { getParcels } = require('../api')
const config = require('../config')

module.exports = {
  method: 'GET',
  path: '/map',
  options: {
    handler: async (request, h) => {
      const sbi = request.query.sbi
      const mapStyle = request.query.mapStyle || ''
      const apiKey = config.osMapApiKey || ''
      console.log('sbi', sbi)
      console.log('mapStyle', mapStyle)
      console.log('apiKey', apiKey)
      const { parcels, center } = await getParcels(sbi)
      return h.view('map', { apiKey, sbi, parcels, center, mapStyle })
    }
  }
}
