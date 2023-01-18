const {
    Decimal128
} = require("mongodb");
const Product = require("../model/product");

// get all products and get by featured and min max price

exports.getProducts = (req, res, next) => {
    var query = {}
    const featured = req.query.featured == "true";
    const minPrice = parseInt(req.query.minPrice);
    const maxPrice = parseInt(req.query.maxPrice);
    if (featured) {
        query.featured = true;
    }
    if (minPrice) {
        query.price = {
            "$gt": minPrice
        }
    }
    if (maxPrice) {
        query.price = {
            ...query.price,
            "$lt": maxPrice
        }
    }
    Product.find(query)
        .then(result => {
            if (result.length > 0) {
                res.status(200).json({
                    message: "data found sucessfuly",
                    count: result.length,
                    data: result
                })
            } else {
                res.status(404).json({
                    message: "data not found"
                })
            }
        })
        .catch(err => {
            console.log(err);
            err.statusCode = 500;
            err.message = "data not featched";
            throw err;
        })
}


// post request to add product

exports.postProduct = (req, res, next) => {
    console.log(req.body);
    const name = req.body.name;
    const price = parseInt(req.body.price);
    const rating = new Decimal128(req.body.rating);
    const featured = req.body.featured == "true";
    const company = req.body.company;
    const product = new Product({
        name: name,
        price: price,
        featured: featured,
        company: company,
        rating: rating
    });
    let error = product.validateSync();
    if (error) {
        console.log(error);
        const err = new Error("invalid input");
        err.statusCode = 403;
        err.message = "invalid input";
        err.data = error.errors;
        next(err);
    } else {
        product.save()
            .then(result => {
                console.log(result);
                res.status(200).send({
                    status: 200,
                    message: "Product saved sucessfuly",
                    product: result
                })
            })
            .catch(err => {
                console.log(err);
                err.statusCode = 500;
                err.message = "data not uploaded";
                next(err);
            })
    }
}

// update product by product id

exports.updateProduct = (req, res, next) => {
    const productId = req.params.productId;
    console.log(req.body);
    const name = req.body.name;
    const price = parseInt(req.body.price);
    const rating = new Decimal128(req.body.rating);
    const featured = req.body.featured == "true";
    const company = req.body.company;
    Product.findById(productId)
        .then(product => {
            product.name = name;
            product.price = price;
            product.featured = featured;
            product.company = company;
            product.rating = rating;
            product.validateSync()
            let error = product.validateSync();
            if (error) {
                console.log(error);
                const err = new Error("invalid input");
                err.statusCode = 403;
                err.message = "invalid input";
                err.data = error.errors;
                throw err;
            } else {
                return product.save()
            }
        })
        .then(result => {
            console.log(result);
            res.status(200).send({
                status: 200,
                message: "Product updated sucessfuly",
                product: result
            })
        })
        .catch(err => {
            next(err);
        })
}

// find and delet product by id


exports.deletProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findByIdAndDelete(productId)
        .then(result => {
            console.log(result);
            if (result) {
                res.status(200).send({
                    status: 200,
                    message: "Product deleted sucessfuly",
                    data: result
                })
            } else {
                const err = new Error("Product not found");
                err.statusCode = 404;
                err.message = "product not found";
                throw err;
            }
        })
        .catch(err => {
            next(err);
        })
}