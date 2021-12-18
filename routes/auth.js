const express = require('express')
const router = express.Router()
const passport = require('passport')

// Auth google - GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

// Google auth callback - GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/search')
    }
)

// Logout - /auth/logout
router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

module.exports = router