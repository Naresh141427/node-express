const express = require("express")
const { open } = require("sqlite")
const sqlite3 = require("sqlite3")
const path = require("path")

const dbPath = path.join(__dirname, "products_database.db")

const app = express()
app.use(express.json())


let db = null
const initializeDbAnsServer = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        })

        console.log("DB Connected Successfully")

        await db.run(`
            CREATE TABLE IF NOT EXISTS products(
                product_id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_name TEXT,
                price DECIMAL(10,2),
                rating DECIMAL(3,1),
                category TEXT
            )
        `)

        const checkData = await db.get("SELECT count(*) as count FROM products")
        if (checkData.count === 0) {

            await db.run(
                `
            INSERT INTO products (product_name, price, rating, category)
            VALUES
                ('Smart Watch Model X', 199.99, 4.5, 'Electronics'),
                ('Wireless Bluetooth Earbuds', 79.50, 4.2, 'Electronics'),
                ('4K Ultra HD 55-inch TV', 499.00, 4.7, 'Electronics'),
                ('Gaming Laptop Pro', 1299.99, 4.8, 'Electronics'),
                ('Portable Power Bank 20000mAh', 45.99, 4.3, 'Electronics'),
                ('Smart Home Hub', 89.99, 4.1, 'Electronics'),
                ('Noise-Cancelling Headphones', 249.00, 4.6, 'Electronics'),
                ('DSLR Camera Kit', 799.00, 4.7, 'Electronics'),
                ('Mechanical Keyboard', 119.99, 4.8, 'Electronics'),
                ('Wireless Mouse', 39.99, 4.4, 'Electronics'),
                ('10-inch Tablet', 329.00, 4.3, 'Electronics'),
                ('Smart Speaker', 59.99, 4.5, 'Electronics'),
                ('Fitness Tracker', 99.00, 4.2, 'Electronics'),
                
                ('Men''s Classic T-Shirt', 19.99, 4.0, 'Apparel'),
                ('Women''s Denim Jacket', 89.00, 4.4, 'Apparel'),
                ('Running Shoes', 120.00, 4.5, 'Apparel'),
                ('Leather Wallet', 49.95, 4.6, 'Apparel'),
                ('Wool Winter Scarf', 35.00, 4.3, 'Apparel'),
                ('Men''s Slim-Fit Jeans', 75.00, 4.1, 'Apparel'),
                ('Women''s Summer Dress', 65.00, 4.2, 'Apparel'),
                ('Sports Bra', 39.99, 4.5, 'Apparel'),
                ('Men''s Hoodie', 55.00, 4.4, 'Apparel'),
                ('Leather Belt', 42.00, 4.3, 'Apparel'),
                ('Women''s Ankle Boots', 130.00, 4.6, 'Apparel'),
                ('Kids Pajama Set', 29.99, 4.7, 'Apparel'),
                ('Sunglasses', 150.00, 4.5, 'Apparel'),

                ('Non-Stick Cookware Set', 149.99, 4.7, 'Home & Kitchen'),
                ('Coffee Maker', 89.99, 4.4, 'Home & Kitchen'),
                ('Robot Vacuum Cleaner', 299.00, 4.6, 'Home & Kitchen'),
                ('Air Fryer', 119.00, 4.8, 'Home & Kitchen'),
                ('Blender', 79.99, 4.3, 'Home & Kitchen'),
                ('Bed Sheet Set (Queen)', 59.99, 4.2, 'Home & Kitchen'),
                ('Set of 6 Wine Glasses', 45.00, 4.5, 'Home & Kitchen'),
                ('Knife Set with Block', 99.99, 4.6, 'Home & Kitchen'),
                ('Weighted Blanket', 89.00, 4.7, 'Home & Kitchen'),
                ('Smart LED Light Bulbs (4-Pack)', 49.99, 4.4, 'Home & Kitchen'),
                ('Stand Mixer', 349.00, 4.9, 'Home & Kitchen'),
                ('Shower Curtain', 25.50, 4.0, 'Home & Kitchen'),
                ('Digital Kitchen Scale', 19.99, 4.7, 'Home & Kitchen'),

                ('The Midnight Library', 15.99, 4.5, 'Books'),
                ('Atomic Habits', 19.99, 4.8, 'Books'),
                ('Where the Crawdads Sing', 14.50, 4.7, 'Books'),
                ('The Great Gatsby', 9.99, 4.4, 'Books'),
                ('1984', 12.99, 4.6, 'Books'),
                ('Sapiens: A Brief History of Humankind', 22.00, 4.7, 'Books'),
                ('The Psychology of Money', 18.00, 4.6, 'Books'),
                ('Cookbook for Beginners', 29.99, 4.3, 'Books'),
                ('Sci-Fi Collection', 35.00, 4.5, 'Books'),
                ('Fantasy Novel', 16.99, 4.2, 'Books'),
                ('Mystery Thriller', 14.99, 4.1, 'Books'),
                ('Biography of Einstein', 24.99, 4.6, 'Books'),

                ('Yoga Mat', 29.99, 4.5, 'Sports & Outdoors'),
                ('2-Person Camping Tent', 129.00, 4.4, 'Sports & Outdoors'),
                ('Insulated Water Bottle', 34.99, 4.7, 'Sports & Outdoors'),
                ('Basketball', 24.99, 4.6, 'Sports & Outdoors'),
                ('Dumbbell Set (20 lbs)', 79.99, 4.5, 'Sports & Outdoors'),
                ('Hiking Backpack', 89.99, 4.6, 'Sports & Outdoors'),
                ('Bicycle', 399.00, 4.3, 'Sports & Outdoors'),
                ('Fishing Rod and Reel Combo', 99.99, 4.2, 'Sports & Outdoors'),
                ('Sleeping Bag', 75.00, 4.4, 'Sports & Outdoors'),
                ('Tennis Racket', 150.00, 4.5, 'Sports & Outdoors'),
                ('Soccer Ball', 19.99, 4.3, 'Sports & Outdoors'),
                ('Jump Rope', 15.99, 4.6, 'Sports & Outdoors'),

                ('Vitamin C Serum', 24.99, 4.5, 'Health & Beauty'),
                ('Moisturizing Cream', 19.99, 4.4, 'Health & Beauty'),
                ('Sunscreen SPF 50', 15.00, 4.6, 'Health & Beauty'),
                ('Shampoo & Conditioner Set', 39.99, 4.3, 'Health & Beauty'),
                ('Electric Shaver', 79.99, 4.5, 'Health & Beauty'),
                ('Makeup Brush Set', 30.00, 4.2, 'Health & Beauty'),
                ('Hair Dryer', 59.99, 4.6, 'Health & Beauty'),
                ('Essential Oil Diffuser', 39.99, 4.4, 'Health & Beauty'),
                ('Bath Bombs Gift Set', 25.99, 4.7, 'Health & Beauty'),
                ('Beard Grooming Kit', 45.00, 4.6, 'Health & Beauty'),
                ('Protein Powder (2 lbs)', 49.99, 4.5, 'Health & Beauty'),
                ('Electric Toothbrush', 69.99, 4.6, 'Health & Beauty'),
                ('Nail Polish Set', 22.00, 4.1, 'Health & Beauty'),

                ('LEGO Classic Set', 59.99, 4.8, 'Toys & Games'),
                ('Plush Teddy Bear', 24.99, 4.7, 'Toys & Games'),
                ('Board Game: Settlers of Catan', 49.00, 4.7, 'Toys & Games'),
                ('RC Car', 45.99, 4.2, 'Toys & Games'),
                ('Puzzle (1000 Pieces)', 19.99, 4.5, 'Toys & Games'),
                ('Action Figure', 15.99, 4.3, 'Toys & Games'),
                ('Art & Craft Kit', 29.99, 4.6, 'Toys & Games'),
                ('Kids Science Experiment Kit', 39.99, 4.5, 'Toys & Games'),
                ('Playing Cards', 9.99, 4.8, 'Toys & Games'),
                ('Building Blocks Set', 35.00, 4.7, 'Toys & Games'),
                ('Dollhouse', 129.99, 4.4, 'Toys & Games'),
                ('Water Blaster', 22.00, 4.1, 'Toys & Games'),

                ('Organic Coffee Beans (1kg)', 35.00, 4.6, 'Grocery'),
                ('Extra Virgin Olive Oil', 19.99, 4.7, 'Grocery'),
                ('Almond Milk (6-Pack)', 22.99, 4.5, 'Grocery'),
                ('Quinoa (2 lbs)', 15.99, 4.4, 'Grocery'),
                ('Dark Chocolate Bars (4-Pack)', 12.99, 4.8, 'Grocery'),
                ('Herbal Tea Assortment', 18.00, 4.5, 'Grocery'),
                ('Gluten-Free Pasta', 5.99, 4.2, 'Grocery'),
                ('Organic Honey', 14.99, 4.6, 'Grocery'),
                ('Mixed Nuts', 16.99, 4.5, 'Grocery'),
                ('Sparkling Water (12-Pack)', 19.99, 4.3, 'Grocery'),
                ('Gourmet Spice Rub', 9.99, 4.7, 'Grocery'),
                ('Cereal', 4.99, 4.0, 'Grocery');
            `
            )

            console.log("100 products added to the products database")
        }


        console.log("Database initialized and ready.")


        app.listen(3001, () => {
            console.log("Server running at http://localhost:3001/")
        })

    } catch (e) {
        console.error(`DB Error: ${e.message}`)
    }
}

initializeDbAnsServer()

// GET ALL PRODUCTS
// app.get("/products", async (request, response) => {
//     try {
//         const query = `
//             SELECT *
//             FROM products
//             ORDER BY price DESC
//             LIMIT 50
//             OFFSET 10

//         `
//         const products = await db.all(query)
//         response.send({
//             message: "success",
//             products,
//             length: products.length
//         })

//     } catch (e) {
//         console.error(e.message)
//         response.status(500).send(e.message)
//     }
// })

// GET SPECIFIC PRODUCTS
// app.get("/products/:productId", async (request, response) => {
//     const { productId } = request.params
//     try {
//         const query = `
//             SELECT *
//             FROM products
//             WHERE product_id = ?
//         `
//         const products = await db.get(query, [productId])
//         response.send({
//             message: "success",
//             products
//         })

//     } catch (e) {
//         console.error(e.message)
//         response.status(500).send(e.message)
//     }
// })

// app.get("/products/", async (request, response) => {
//     const { category, rating, price } = request.query

//     // Start with a basic query that is always true
//     let query = "SELECT * FROM products WHERE 1=1"

//     // Create an array to hold our query parameters safely
//     const queryArgs = []
//     try {
//         //checking for category
//         if (category) {
//             // FIX: Added a space before AND
//             query += " AND category like ?"
//             queryArgs.push(`%${category}%`)
//         }

//         //checking for rating
//         if (rating) {
//             // FIX: Added a space before AND
//             query += " AND rating >= ?"
//             queryArgs.push(rating)
//         }

//         //checking for price
//         if (price) {
//             // FIX: Added a space before AND
//             query += " AND price >= ?"
//             queryArgs.push(price)
//         }

//         //adding ordering at the end
//         // FIX: Added a space before ORDER
//         query += " ORDER BY product_name ASC;"

//         // FIX: Added 'await'
//         const products = await db.all(query, queryArgs)

//         response.send({
//             message: "success",
//             products
//         })

//     } catch (e) {
//         console.error(e.message)
//         response.status(500).send(e.message)
//     }
// })

// app.post("/products/", async (request, response) => {
//     const { productName, price, rating, category } = request.body

//     try {
//         const query = `
//             INSERT INTO products(product_name,price,rating,category)
//             VALUES(?,?,?,?)
//         `
//         const result = await db.run(query, [productName, price, rating, category])
//         response.send({
//             message: "product added to the cart successfully",
//             productId: result.lastID
//         })
//     } catch (e) {
//         console.error(`PUT Error: ${e.message}`)
//         response.status(500).send(e.message)
//     }
// })

// app.put("/products/:productId", async (request, response) => {
//     const { productId } = request.params
//     const { productName, price, rating, category } = request.body
//     try {
//         const query = `

//             UPDATE products
//             SET 
//                 product_name = ?,
//                 price = ?,
//                 rating = ?,
//                 category = ?
//             WHERE product_id = ?
//         `
//         const result = await db.run(query, [productName, price, rating, category, productId])
//         if (result.changes === 0) {
//             return response.status(400).send({ message: "product not found" })
//         }
//         response.send({
//             message: "product details updated successfully",
//             updatedRows: result.changes
//         })

//     } catch (e) {
//         console.error(e.message)
//         response.status(500).send(e.message)
//     }
// })

// app.delete("/products/:productId", async (request, response) => {
//     const { productId } = request.params
//     try {
//         const query = `
//             DELETE from products
//             WHERE product_id = ?
//         `
//         const result = await db.run(query, [productId])
//         if (result.changes === 0) {
//             return response.status(404).send({ message: "product not found" })
//         }

//         response.send({
//             message: "product deleted from the database",
//             deletedRows: result.changes
//         })

//     } catch (e) {
//         console.error(e.message)
//         response.status(500).send(e.message)
//     }
// })


app.get("/products/", async (request, response) => {
    const {
        search,
        category,
        maxPrice,
        minRating,
        sortBy = "product_name",
        order = "ASC",
        limit = 20,
        page = 1
    } = request.query
    try {

        let query = "SELECT * FROM products WHERE 1=1"
        const queryArgs = []

        if (search) {
            query += " AND product_name like ?"
            queryArgs.push(`%${search}%`)
        }

        if (category) {
            query += " AND category like ?"
            queryArgs.push(`%${category}%`)
        }

        if (maxPrice) {
            query += " AND price <= ?"
            queryArgs.push(parseFloat(maxPrice))
        }

        if (minRating) {
            query += " AND rating >= ?"
            queryArgs.push(parseFloat(minRating))
        }

        const allowedSorts = ["product_name", " privateDecrypt", "category", "rating"]
        const sortColumns = allowedSorts.includes(sortBy) ? sortBy : "product_name"
        const sortOrder = (order.toUpperCase() === "ASC") ? "ASC" : "DESC"

        query += ` ORDER BY ${sortColumns} ${sortOrder}`

        const limitNum = parseInt(limit)
        const pageNum = parseInt(page)
        const offsetNum = (pageNum - 1) * limitNum
        query += " LIMIT ? OFFSET ?"
        queryArgs.push(limitNum)
        queryArgs.push(offsetNum)

        const products = await db.all(query, queryArgs)

        response.send({
            message: "success",
            page: pageNum,
            limit: limitNum,
            products: products
        })
    } catch (e) {
        console.error(e.message)
        response.status(500).send(e.message)
    }
})

app.get("/products//summary/by-category/", async (request, response) => {
    const { minAvgRating = 4.0 } = request.query
    try {
        const query = `
            SELECT
                category,
                COUNT(*) AS total_products,
                AVG(rating) AS average_rating,
                MAX(price) AS maximum_price
            FROM
                products
            GROUP BY
                category
            HAVING
                AVG(rating) >= ?
            ORDER BY
                average_rating DESC
        `;

        const summary = await db.all(query, [minAvgRating])
        response.send({
            message: "category summary",
            summary

        })

    } catch (e) {
        console.error(e.message)
        response.status(500).send(e.message)
    }
})