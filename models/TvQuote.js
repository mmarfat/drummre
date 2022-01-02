// Model za 'tv quote'

const mongoose = require('mongoose')


const TvQuoteSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
    trim: true
  },
  quote: {
    type: String,
    required: true,
    trim: true
  },
  source: {
    type: String,
    required: true,
    trim: true
  },
  user: { // Povezivanje pojedinog quotea s korisnikom
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }

})

module.exports = mongoose.model('TvQuote', TvQuoteSchema)