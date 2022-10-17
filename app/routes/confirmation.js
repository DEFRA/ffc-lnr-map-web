const Joi = require('joi')

module.exports = {
  method: 'GET',
  path: '/confirmation',
  options: {
    validate: {
      query: Joi.object({
        reference: Joi.string().required(),
        sbi: Joi.string().required()
      }),
      failAction: async (request, h, error) => {
        return h.view('confirmation').takeover()
      }
    },
    handler: async (request, h) => {
      const reference = request.query.reference
      const sbi = request.query.sbi
      const url = `/map/verify?reference=${reference}&sbi=${sbi}`
      return h.view('confirmation', { sbi, reference, url })
    }
  }
}
