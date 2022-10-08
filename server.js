const express = require('express')
const mongoose = require('mongoose')
const ejs = require('ejs')
const bcrypt = require('bcrypt')
const cors = require('cors')
const bodyparser = require('body-parser')
const PORT = 3000 || process.env
const User = require('./models/user')
const app = express()

app.use(cors())
app.use(express.static('public'))

app.use(bodyparser.json({ limit: "30mb", extended: true }))

app.use(bodyparser.urlencoded({ limit: "30mb", extended: true }))
//app.use(express.json())

app.set('view engine', ejs)


app.get('/', (req, res) => {
    res.send('welcome');
})



const CONNECTION_URL = 'mongodb+srv://apn:Gnb0009@cluster0.a7xl6ew.mongodb.net/?retryWrites=true&w=majority'
app.get('/signup', async (req, res) => {
    res.render('signup.ejs')
})
app.post('/signup', async (req, res) => {
    console.log('sign up method')
    console.log(req.body)
    if (!req.body) {
        return res.json({ status: 'error' })
    }
    const username = req.body.username, password = req.body.password, useremail = req.body.useremail
    if (!username || typeof username !== 'string') {
        return res.json({ status: 'error', error: 'invalid username or email ' })
    }
    if (!password || typeof password !== 'string') {
        return res.json({ status: 'error', error: 'invalid password' })
    }
    if (!useremail) return res.json({ status: 'error', error: 'useremail is required' })
    if (password.length < 6) {
        return res.json({ status: 'error', error: 'Password is too small, should be atleast 6 Characters' })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log('hashed Password ', hashedPassword)

    try {
        const userCreated = await User.create({
            username: username,
            email: useremail,
            password: hashedPassword
        })
        console.log(userCreated)

    }
    catch (error) {
        console.log(error)
        if (error.code == 11000) {
            return res.json({ status: "error", error: "duplicate username or useremail" })

        }
        else {
            return res.json({ status: "error" })
        }

    }
    console.log('Successfully Created User')

    return res.json({ status: "ok" })
})


mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on Port : ${PORT}`)
    })
}).catch((error) => console.log(error.message))