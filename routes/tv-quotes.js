const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

const TvQuote = require('../models/TvQuote')

// lajkanje quotea
router.post('/likes', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        const quote = await TvQuote.findOne({ user: req.user.id, quote: req.body.quote }).lean()
        if (quote === null) {
            await TvQuote.create(req.body)
        }
        res.redirect('/quotes/likes')
    } catch (err) {
        console.log(err)
        res.render('errors/500')
    }
})

// brisanje quotea iz like-ova
router.delete('/likes/:quote', ensureAuth, async (req, res) => {
    try {
        await TvQuote.deleteOne({ user: req.user.id, quote: req.params.quote })
        res.redirect('/quotes/likes/')
    } catch (error) {
        console.log(error)
        return res.render('errors/500')
    }
})


module.exports = router

