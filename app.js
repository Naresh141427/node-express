require("dotenv").config()

const express = require("express")
const { open } = require("sqlite")
const sqlite3 = require("sqlite3")
const path = require("path")



const productRoutes = require("./routes/productRoutes")
const userRoutes = require("./routes/userRoutes")

const app = express()
app.use(express.json())
app.use((request, response, next) => {
    request.userDb = userDb
    request.productsDb = productsDb
    next()

})


const userDbPath = path.join(__dirname, process.env.USER_DB_PATH || "users_database.db")
const productsDbPath = path.join(__dirname, process.env.PRODUCT_DB_PATH || "products_database.db")
const PORT = process.env.PORT || 3001



let userDb = null;
let productsDb = null
const initializeDbAndServer = async () => {
    try {
        userDb = await open({
            filename: userDbPath,
            driver: sqlite3.Database
        })
        console.log("User DB connected successfully")

        productsDb = await open({
            filename: productsDbPath,
            driver: sqlite3.Database
        })
        console.log("Prodcuts DB connected successfully")

        await userDb.run(
            `
            CREATE TABLE IF NOT EXISTS user(
                user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_name TEXT UNIQUE,
                password TEXT
            )
        `
        )

        await productsDb.run(`
            CREATE TABLE IF NOT EXISTS products(
                product_id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_name TEXT,
                price DECIMAL(10,2),
                rating DECIMAL(3,1),
                category TEXT
            )
        `)

        const checkData = await productsDb.get("SELECT COUNT(*) as count FROM products")

        if (checkData.count === 0) {
            await productsDb.run(
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
        console.log("Database's connection established")
        app.listen(3001, () => console.log(`server started runnig at http://localhost:${PORT}`))
    } catch (e) {
        console.error(`DB Initilaization Error: ${e.message}`)
        process.exit(1)
    }
}


initializeDbAndServer()




app.use("/products", productRoutes)
app.use("/user", userRoutes)