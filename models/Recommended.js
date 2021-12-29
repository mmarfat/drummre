// Model za Show

// Ovdje bi jos trebalo dodat stvari poput tags, category, description, actors i slicno da imamo
// neke podatke s kojima mozemo ucit model

const mongoose = require('mongoose')

const RecommendedSchema = new mongoose.Schema({
    parent_id: {
        type: String,
        required: true
    },
    parent_name: {
        type: String,
        required: true
    },
    shows: {
        type: Array,
        required: true
    },
    user: { // Povezivanje pojedine emisije s korisnikom
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Recommended', RecommendedSchema)