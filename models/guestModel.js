const mongoose = require('mongoose')

const guest = mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  age: Number,
  dateAdded: Date
})

module.exports = mongoose.model('Guest', guest)
