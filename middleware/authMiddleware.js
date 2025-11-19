
const jwt = require("jsonwebtoken")

require("dotenv").config()

const SECRETE_KEY = process.env.JWT_SECRET

const authenticateToken = async (request, response, next) => {
    let jwtToken;
    const authHeader = request.headers["authorization"]
    if (authHeader) jwtToken = authHeader.split(" ")[1]
    if (!jwtToken) {
        return response.status(401).send("Unathorized: no token provided")
    }
    jwt.verify(jwtToken, SECRETE_KEY, (error, payload) => {
        if (error) return response.status(401).send("Unauthorized: invalid token")
        request.user = payload
        next()
    })
}

module.exports = authenticateToken