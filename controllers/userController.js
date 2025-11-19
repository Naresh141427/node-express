require("dotenv").config()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const SECRETE_KEY = process.env.JWT_SECRET

const register = async (request, response) => {
    const { username, password } = request.body
    try {
        const userCheckQuery = `
            SELECT *
            FROM user
            WHERE user_name = ?
        `
        const dbUser = await request.userDb.get(userCheckQuery, [username])
        if (dbUser) return response.status(400).send({ message: "user already exists" })
        const addUserDb = `
            INSERT INTO user(user_name, password)
            VALUES (?, ?)
            `
        const hashedPassword = await bcrypt.hash(password, 10)
        const result = await request.userDb.run(addUserDb, [username, hashedPassword])
        if (result.changes === 0) {
            return response.status(400).send("somthing went wrong")
        }
        response.send({
            message: "user created successfully",
            userId: result.lastID
        })



    } catch (e) {
        console.error(`user register error: ${e.message}`);
        response.status(500).send(e.message)
    }
}

const login = async (request, response) => {
    const { username, password } = request.body
    try {
        const userCheckQuery = `
            SELECT * 
            FROM user
            WHERE user_name = ?
        `;
        const dbUser = await request.userDb.get(userCheckQuery, [username])
        if (!dbUser) return response.status(401).send({ message: "invalid user" })
        const isPasswordMatched = bcrypt.compare(password, dbUser.password)
        if (!isPasswordMatched) return response.status(401).send({ message: "invalid password" })
        const payload = {
            userId: dbUser.user_id,
            username: dbUser.user_name
        }
        const jwtToken = jwt.sign(payload, SECRETE_KEY, { expiresIn: "1hr" })
        response.send({ jwtToken })

    } catch (e) {
        console.error(`login register error: ${e.message}`);
        response.status(500).send(e.message)
    }
}

module.exports = { register, login }