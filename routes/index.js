const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const axios = require('axios')
const fs = require('fs')
const path = require("path");

const Show = require('../models/Show')
const Quote = require('../models/Quote')
const Recommended = require('../models/Recommended')

const ContentBasedRecommender = require('content-based-recommender')

// Osnovno preporučivanje -> problem (API) nema sve serije dostupne odjednom.
/*const recommender = new ContentBasedRecommender({
    minScore: 0.1,
    maxSimilarDocuments: 5
})

const documents = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../public/data/shows.json")))

var strippedDocuments = []
documents.forEach(document => {
    const picked = (({ id, combined_features }) => ({ id, combined_features }))(document);
    picked.content = picked.combined_features;
    delete picked.combined_features;
    strippedDocuments.push(picked)
})

recommender.train(strippedDocuments)

const recommenderObject = recommender.export()
//await Recommender.create()
var recObjectStringified = JSON.stringify(recommenderObject);

fs.writeFile(path.resolve(__dirname, "../public/data/recommender.json"), recObjectStringified, function (err) {
    if (err) {
        console.log('There has been an error saving your configuration data.');
        console.log(err.message);
        return;
    }
    console.log('Configuration saved successfully.')
});*/

// Model može biti istreniran prethodno i onda pohranjen u JSON datoteku.
const object = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../public/data/recommender.json")))
const recommender = new ContentBasedRecommender();
recommender.import(object);

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

async function getRecommendedShows(shows, user) {
    let alreadyRecommended = []
    for (let s of shows) {
        const recommended = await Recommended.findOne({ parent_id: s.id }).lean()
        if (recommended !== null) {
            alreadyRecommended.push(s.id)
        }
    }

    for (let s of shows) {
        if (!alreadyRecommended.includes(s.id)) {
            let similarShows = await recommender.getSimilarDocuments(`${s.id}`, 0, 4)
            let tempShows = []
            for (let ss of similarShows) {
                let resp = await axios.get(`https://api.tvmaze.com/shows/${ss.id}`)
                let resp_data = await resp.data
                resp_data.rating.average = (resp_data.rating.average === null ? 'N/A' : resp_data.rating.average)
                tempShows.push(resp_data)
            }
            await Recommended.create({
                parent_id: s.id,
                parent_name: s.name,
                shows: tempShows,
                user: user
            })
        }
    }
}

// Recommendations - GET /recommendations
router.get('/recommendations', ensureAuth, async (req, res) => {
    try {
        const shows = await Show.find({ user: req.user.id }).lean()
        await getRecommendedShows(shows, req.user.id)

        const recommendedShows = await Recommended.find({ user: req.user.id }).lean()

        res.render('recommendations', {
            name: req.user.firstName,
            image: req.user.image,
            recommendedShows
        })
    } catch (err) {
        console.error(err)
        res.render('errors/500')
    }
})


module.exports = router

