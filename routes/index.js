const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const axios = require('axios')

const Show = require('../models/Show')
const Quote = require('../models/Quote')



// Login - GET /
// Prikazi Login samo ako korisnik nije vec ulogiran (ensureGuest)
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login'
    })
})

// search - GET /search
router.get('/search', ensureAuth, async (req, res) => {
    try {

        // Dohvacanje quotea (provjerava jel vec postoji quote za ovaj dan da ne zove api na svakom refreshu stranice)

        let date = new Date()
        const todaysQuote = await Quote.findOne({ date: `${date.getDate()}-${date.getMonth() + 1}-${date.getYear() + 1900}` }).lean()
        if (todaysQuote !== null) {
            const { quote, author } = todaysQuote
            res.render('search', {
                name: req.user.firstName,
                image: req.user.image,
                quote: quote,
                author: author
            })
        } else {
            const resp = await axios.get('https://quotes.rest/qod?language=en')
            const { quote, author } = resp.data.contents.quotes[0]
            const quoteExists = await Quote.findOne({ quote: quote, author: author }).lean()
            if (quoteExists === null) {
                await Quote.create({ quote: quote, author: author })
            }
            res.render('search', {
                name: req.user.firstName,
                image: req.user.image,
                quote: quote,
                author: author
            })
        }
    } catch (err) {
        console.error(err)
        res.render('errors/500')
    }

})

// Likes - GET /likes
router.get('/likes', ensureAuth, async (req, res) => {
    try {
        const shows = await Show.find({ user: req.user.id }).lean()
        res.render('likes', {
            name: req.user.firstName,
            image: req.user.image,
            shows
        })
    } catch (err) {
        console.error(err)
        res.render('errors/500')
    }
})


module.exports = router

