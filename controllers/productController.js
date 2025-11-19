
const getProducts = async (request, response) => {
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


        const allowedSorts = ["product_name", "price", "category", "rating"]
        const sortColumns = allowedSorts.includes(sortBy) ? sortBy : "product_name"
        const sortOrder = (order.toUpperCase() === "ASC") ? "ASC" : "DESC"

        query += ` ORDER BY ${sortColumns} ${sortOrder}`

        const limitNum = parseInt(limit)
        const pageNum = parseInt(page)
        const offsetNum = (pageNum - 1) * limitNum

        query += " LIMIT ? OFFSET ?"
        queryArgs.push(limitNum)
        queryArgs.push(offsetNum)


        const products = await request.productsDb.all(query, queryArgs)

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
}



const getSpecificProduct = async (request, response) => {
    const { productId } = request.params
    try {
        const query = `
            SELECT *
            FROM products
            WHERE product_id = ?
        `
        const product = await request.productsDb.get(query, [productId])
        if (!product) {
            return response.status(404).send({ message: "Product not found" })
        }
        response.send({
            message: "success",
            product
        })

    } catch (e) {
        console.error(e.message)
        response.status(500).send(e.message)
    }
}

const addProduct = async (request, response) => {
    const { productname, price, rating, category } = request.body
    try {
        const addQuery = `
            INSERT INTO products(product_name,price,rating,category)
            VALUES(?, ?, ?, ?)
        `
        const result = await request.productsDb.run(addQuery, [productname, price, rating, category])

        response.send({
            message: "prodcut added successfully",
            productId: result.lastID
        })

    } catch (e) {
        console.error(`error adding prodcut deatils: ${e.message}`);
        response.status(500).send(e.message)

    }
}


const deleteSpecificProduct = async (request, response) => {
    const { productId } = request.params
    try {
        const query = `
            DELETE FROM products
            WHERE product_id = ?
        `
        const result = await request.productsDb.run(query, [productId])
        if (result.changes === 0) return response.status(404).send({ message: "product not found" })
        response.send({
            message: "product deleted successfully",
        })

    } catch (e) {
        console.error(e.message)
        response.status(500).send(e.message)
    }
}

const updateSpecificProductDetails = async (request, response) => {
    const { productId } = request.params
    if (!request.body) {
        return response.status(400).send({ message: "Invalid body format" });
    }
    const { productname, price, rating, category } = request.body

    try {
        const updatedColumntext = []
        const values = []

        if (productname !== undefined) {
            updatedColumntext.push("product_name = ?")
            values.push(productname)
        }
        if (price !== undefined) {
            updatedColumntext.push("price = ?")
            values.push(price)
        }
        if (rating !== undefined) {
            updatedColumntext.push("rating = ?")
            values.push(rating)
        }
        if (category !== undefined) {
            updatedColumntext.push("category = ?")
            values.push(category)
        }

        if (updatedColumntext.length === 0) {
            return response.status(400).send({ message: "no fields provided to update" })
        }
        const updateQuery = `
            UPDATE products
            SET ${updatedColumntext.join(", ")}
            WHERE product_id = ?
        `
        values.push(productId)
        const result = await request.productsDb.run(updateQuery, values)
        if (result.changes === 0) return response.status(404).send({ message: "product not found" })
        response.send({
            message: "product details updatd successfully"
        })

    } catch (e) {
        console.error(`something went wrong while updating product details:: ${e.message}`);
        response.status(500).send(e.message)
    }
}


module.exports = { getProducts, getSpecificProduct, addProduct, deleteSpecificProduct, updateSpecificProductDetails }
