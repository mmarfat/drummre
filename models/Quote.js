// Model za 'quote of the day' - nepotrebno nama za aplikaciju

const mongoose = require('mongoose')

function getDate() {
    let d = new Date()
    return `${d.getDate()}-${d.getMonth() + 1}-${d.getYear() + 1900}`
}

const QuoteSchema = new mongoose.Schema({
    quote: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: String,
        default: getDate()
    }
})

module.exports = mongoose.model('Quote', QuoteSchema)