// middleware koji provjerava je li korisnik ulogiran ili nije

module.exports = {
    ensureAuth: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        } else {
            res.redirect('/')
        }
    },

    ensureGuest: function (req, res, next) {
        if (req.isAuthenticated()) {
            res.redirect('/search')
        } else {
            return next()
        }
    }
}