// Model za Show

// Ovdje bi jos trebalo dodat stvari poput tags, category, description, actors i slicno da imamo
// neke podatke s kojima mozemo ucit model

const mongoose = require('mongoose')

const ShowSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: true
    },
    rating: {
        type: String,
        required: true
    },
    user: { // Povezivanje pojedine emisije s korisnikom
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Show', ShowSchema)