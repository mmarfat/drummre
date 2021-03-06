const express = require('express')
const router = express.Router()
const axios = require('axios')
const { ensureAuth } = require('../middleware/auth')

const Show = require('../models/Show')
const Recommended = require('../models/Recommended')

// lajkanje showa
router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        const id = await Show.findOne({ user: req.user.id, id: req.body.id }).lean()
        if (id === null) {
            await Show.create(req.body)
        }
        res.redirect('/likes')
    } catch (err) {
        console.log(err)
        res.render('errors/500')
    }
})

// brisanje showa iz like-ova
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        await Show.deleteOne({ user: req.user.id, id: req.params.id })
        await Recommended.deleteOne({ user: req.user.id, parent_id: req.params.id })
        res.redirect('/likes')
    } catch (error) {
        console.log(error)
        return res.render('errors/500')
    }
})

router.get('/:id', ensureAuth, async (req, res) => {
    try {
        const showInfo = await axios.get(`https://api.tvmaze.com/shows/${req.params.id}`)
        const showImage = (showInfo.data.image === null) ? 'https://domel.hr/wp-content/uploads/2020/12/placeholder.png' : showInfo.data.image.original
        const showSummaryHTML = (showInfo.data.summary === null) ? 'No available summary.' : showInfo.data.summary
        const showSummary = showSummaryHTML.replace(/<[^>]*>?/gm, '');
        const showRating = (showInfo.data.rating.average === null) ? 'N/A' : showInfo.data.rating.average
        res.render('info', {
            name: req.user.firstName,
            image: req.user.image,
            id: req.params.id,
            showImage: showImage,
            showName: showInfo.data.name,
            summary: showSummary,
            rating: showRating,
            tags: showInfo.data.genres,
            imdb: showInfo.data.externals.imdb
        })
    } catch (error) {

    }
})



module.exports = router

