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

// Auth facebook - GET /auth/facebook
router.get('/facebook', passport.authenticate("facebook"))

// Facebook auth callback - GET /auth/facebook/callback
router.get('/facebook/callback', passport.authenticate("facebook", {
      failureRedirect: "/login?login_failed",
    }),
    function (req, res) {
      res.redirect("/");
    },
)

// Logout - /auth/logout
router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

module.exports = router