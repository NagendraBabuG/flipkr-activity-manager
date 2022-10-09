const express = require('express')
const mongoose = require('mongoose')
const ejs = require('ejs')
const bcrypt = require('bcrypt')
const cors = require('cors')
const bodyparser = require('body-parser')
const jwt = require('jsonwebtoken')
const PORT = 3000 || process.env
const employee = require('./models/employee')
const admin = require('./models/admin')
var multer = require('multer');
const user = require('./models/user')
const { boolean } = require('mathjs')
const app = express()
var upload = multer();


const JWT_SECRET = '2ayisadzsldszaladlweoewqorwqoqwlaaxlweqzcvnmfda@#$%@lldladsdalwoerutqql/a/s.ccmcvncvldsaw'
//app.use(cors())
app.use(express.static('public'))
app.use(upload.array());
//app.use(express.bodyParser());
//app.use(bodyparser.json({ limit: "30mb", extended: true }))
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }))
//app.use(express.json())

app.set('view engine', ejs)


app.get('/', (req, res) => {
    res.send('welcome');
})



const CONNECTION_URL = 'mongodb+srv://apn:Gnb0009@cluster0.a7xl6ew.mongodb.net/?retryWrites=true&w=majority'
app.get('/signup', async (req, res) => {
    res.render('signupAdmin.ejs')
})
app.post('/signup', async (req, res) => {
    console.log('sign up method')
    console.log(req.body)
    if (!req.body) {
        return res.json({ status: 'error' })
    }
    const username = req.body.username, password = req.body.password, useremail = req.body.useremail, phoneNumber = req.body.phoneNumber
    const Organization = req.body.Organization

    if (!username || typeof username !== 'string') {
        return res.json({ status: 'error', error: 'invalid username' })
    }
    if (!password || typeof password !== 'string') {
        return res.json({ status: 'error', error: 'invalid password' })
    }
    if (!useremail) return res.json({ status: 'error', error: 'useremail is required' })
    if (password.length < 6) {
        return res.json({ status: 'error', error: 'Password is too small, should be atleast 6 Characters' })
    }
    if (!phoneNumber || typeof phoneNumber !== 'string') {
        return res.json({ status: 'error', error: 'invalid phoneNumber' })
    }
    if (!Organization || typeof Organization !== 'string') {
        return res.json({ status: 'error', error: 'invalid Organization' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    console.log('hashed Password ', hashedPassword)

    try {
        const adminCreated = await admin.create({
            name: username,
            email: useremail,
            contact: phoneNumber,
            Organization: Organization,
            password: hashedPassword


        })


    }
    catch (error) {
        console.log(error)
        if (error.code == 11000) {
            return res.json({ status: "error", error: "duplicate username or email is already registered" })

        }
        else {
            return res.json({ status: "error" })
        }

    }
    console.log('Successfully Created employer')


    return res.json({ status: "ok" })
})
app.get('/dashboardA', (req, res) => {
    res.render('dashboardAdmin.ejs')

})


app.get('/dashboardE', (req, res) => {
    res.render('dashboardEmployee.ejs')
})

app.get('/login', (req, res) => {
    res.render('login.ejs')
})

app.post('/login', async (req, res) => {
    console.log(req.body)
    //console.log(req)

    const password = req.body.password, useremail = req.body.useremail
    const findUser = await employee.findOne({ email: useremail })
    if (!findUser) {
        const findAdmin = await admin.findOne({ email: useremail })
        if (findAdmin) {
            if (await bcrypt.compare(password, findAdmin.password)) {
                const token = jwt.sign({
                    id: findAdmin._id,
                    useremail: findAdmin.email
                },
                    JWT_SECRET)
                console.log('successfully signed in')
                res.redirect('/dashboardA')

                //res.json({ status: 'ok', data: token })
            }
            // return res.json({ status: 'error', error: "invalid email or Password" })

        }
        res.redirect('/login')
    }
    else {
        if (await bcrypt.compare(password, findUser.password)) {
            const token = jwt.sign(
                {
                    id: findUser._id,
                    useremail: findUser.useremail
                },
                JWT_SECRET
            )
            //const isAdmin = findUser.isAdmin;
            // if (isAdmin) res.redirect('/dashboardA')
            // else res.redirect('/dashboardE')
            console.log('successfully signed in')
            res.redirect('/dashboardE')
            //return;

        }
        // return res.json({ status: 'error', error: 'Invalid email or password' })
        res.redirect('/login')

    }

    //return res.json({ status: 'error' })


})




app.get('*', (req, res) => {
    res.render('pageNotFound.ejs')
})
mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on Port : ${PORT}`)
    })
}).catch((error) => console.log(error.message))