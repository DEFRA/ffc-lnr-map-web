const Joi = require('joi')

module.exports = [{
  method: 'GET',
  path: '/',
  options: {
    handler: async (_, h) => {
      return h.view('index')
    }
  }
},
{
  method: 'POST',
  path: '/',
  options: {
    validate: {
      payload: Joi.object({
        sbi: Joi.string().required()
      }),
      failAction: async (request, h, error) => {
        console.log('error', error)
        return h.view('index', { error }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      const sbi = request.payload.sbi
      return h.redirect(`/map?sbi=${sbi}`)
    }
  }
}]
