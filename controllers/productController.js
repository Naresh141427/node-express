

const getProducts = async (request, response) => {
    try {
        const query = `
            SELECT * FROM products
        `;

        const products = await request.productsDb.all(query);

        response.send({
            message: "success",
            products
        });

    } catch (e) {
        console.error(`Get error: ${e.message}`);
        response.status(500).send(e.message);
    }
};


module.exports = { getProducts };