const express = require('express')
const dotenv = require('dotenv')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const path = require('path')
const passport = require('passport')
const session = require('express-session')
const favicon = require('serve-favicon')
const MongoStore = require('connect-mongo')
const connectDB = require('./configs/db')

// Učitaj konfiguracijsku datoteku
dotenv.config({ path: './configs/config.env' })

// Passport config
require('./configs/passport')(passport)

// Poveži se s bazom podataka
connectDB()

const app = express()

// favicon sličica
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.png')));

// Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Method override - omogućuje delete
app.use(methodOverride((req, res) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        let method = req.body._method
        delete req.body._method
        return method
    }
}))

// View engine
app.engine('.hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', '.hbs')

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/shows', require('./routes/shows'))

const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Application started - PORT: ${PORT}`))