const jwt = require('jsonwebtoken')
const JWT_SECRET = '2ayisadzsldszaladlweoewqorwqoqwlaaxlweqzcvnmfda@#$%@lldladsdalwoerutqql/a/s.ccmcvncvldsaw'
const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, JWT_SECRET)
        console.log(verifyUser)
    }
    catch (error) {
        res.status(401).send(error)
    }
}