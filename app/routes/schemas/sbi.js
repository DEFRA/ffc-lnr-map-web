const Joi = require('joi')

module.exports = Joi.object({
  sbi: Joi.number().integer().greater(105000000).less(1000000000).required()
}).error(errors => {
  errors.forEach(err => {
    switch (err.code) {
      case 'number.greater':
        err.message = 'The SBI is too short.'
        break
      case 'number.less':
        err.message = 'The SBI is too long.'
        break
      case 'number.unsafe':
        err.message = 'The SBI is too long.'
        break
      case 'number.base':
        err.message = 'The SBI must be a number.'
        break
      default:
        console.log(err)
        err.message = 'The SBI is invalid.'
        break
    }
  })
  return errors
})
