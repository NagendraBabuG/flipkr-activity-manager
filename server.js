const express = require('express')
const mongoose = require('mongoose')
const ejs = require('ejs')
const bcrypt = require('bcrypt')
const cors = require('cors')
const bodyparser = require('body-parser')
const PORT = 3000 || process.env
const employee = require('./models/employee')
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
    const username = req.body.username, password = req.body.password, useremail = req.body.useremail, phoneNumber = req.body.phoneNumber
    const department = req.body.department, doj = req.body.doj

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
    if (!department || typeof department !== 'string') {
        return res.json({ status: 'error', error: 'invalid department' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    console.log('hashed Password ', hashedPassword)

    try {
        const employeeCreated = await employee.create({
            name: username,
            email: useremail,
            contact: phoneNumber,
            Department: department,
            DateOfJoin: doj,
            isAdmin: true,
            password: hashedPassword


        })
        console.log(employeeCreated)

    }
    catch (error) {
        console.log(error)
        if (error.code == 11000) {
            return res.json({ status: "error", error: "duplicate employeename or employeeemail" })

        }
        else {
            return res.json({ status: "error" })
        }

    }
    console.log('Successfully Created employer')

    return res.json({ status: "ok" })
})


mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on Port : ${PORT}`)
    })
}).catch((error) => console.log(error.message))