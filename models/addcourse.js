const {Schema, model} = require('mongoose')

const course = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  img: String,
  UserId:{
    type:Schema.Types.ObjectId,
    ref:`User`
  },
})

module.exports = model('Courses', course)