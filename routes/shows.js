const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

const Show = require('../models/Show')
const Recommended = require('../models/Recommended')

// lajkanje showa
router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        const id = await Show.findOne({ id: req.body.id }).lean()
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
        await Show.deleteOne({ id: req.params.id })
        await Recommended.deleteOne({ parent_id: req.params.id })
        res.redirect('/likes')
    } catch (error) {
        console.log(error)
        return res.render('errors/500')
    }
})



module.exports = router

