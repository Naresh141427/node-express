const express = require("express")
const { open } = require("sqlite")
const sqlite3 = require("sqlite3")
const path = require("path")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const app = express()
app.use(express.json())
const dbPath = path.join(__dirname, "users_database.db")

let db = null



// creating user database and starting the server
const initializeDbAndServer = async () => {
    db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    })

    console.log("DB connected successfully")

    await db.run(
        `
            CREATE TABLE IF NOT EXISTS user(
                user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_name TEXT UNIQUE,
                password TEXT
            )
        `
    )

    app.listen(3001, () => console.log("server running at http://localhost:3001"))
}

initializeDbAndServer()

// registering the user for the first time
app.post("/user/register", async (request, response) => {
    const { userName, password } = request.body
    const hashedPassword = await bcrypt.hash(password, 10)
    try {
        const query = `
            SELECT *
            FROM user
            WHERE user_name = ?
        `;

        const dbUser = await db.get(query, [userName])
        if (dbUser) {
            return response.status(400).send({ message: "user already exists" })
        }
        const userCreateQuery = `
            INSERT INTO user(user_name, password)
            VALUES(?,?)
        `
        await db.run(userCreateQuery, [userName, hashedPassword])
        response.send({ message: "user created successfully" })

    } catch (e) {
        console.error(`User Register Error: ${e.message}`)
        response.status(500).send(e.message)
    }
})


// verifying the user login credentials and sending back jwt token to the user for subsequent request
app.post("/user/login", async (request, response) => {
    const { userName, password } = request.body
    try {
        const userQuery = `
            SELECT *
            FROM user
            WHERE user_name = ?
        `
        const dbUser = await db.get(userQuery, [userName])
        if (!dbUser) {
            return response.status(400).send({ message: "invalid username" })
        }
        const isPasswordMatched = await bcrypt.compare(password, dbUser.password)
        if (!isPasswordMatched) {
            return response.status(400).send({ message: "invalid password" })
        }

        const payLoad = {
            userId: dbUser.user_id,
            userName: dbUser.user_name
        }
        const SECRETE_KEY = "MY_SECRETE_KEY_123"
        const jwtToken = jwt.sign(payLoad, SECRETE_KEY, { expiresIn: "1h" })
        response.send(jwtToken)

    } catch (e) {
        console.error(`Log in error: ${e.message}`)
        response.status(500).send(e.message)
    }
})


// middleware function function to verufy the user jwt token

const authenticateToken = (request, response, next) => {
    let jwtToken;
    const authHeader = request.headers["authorization"]
    if (authHeader) {
        jwtToken = authHeader.split(" ")[1]
    }
    if (!jwtToken) {
        return response.status(401).send({ message: "Unauthorzed: no token provided" })
    }
    const SECRETE_KEY = "MY_SECRETE_KEY_123"

    jwt.verify(jwtToken, SECRETE_KEY, (error, payLoad) => {
        if (error) {
            return response.status(401).send({ message: "Unauthorized: invalid token" })
        }
        request.user = payLoad
        next()
    })
}