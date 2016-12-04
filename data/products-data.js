/* globals require module Promise*/
"use strict";

module.exports = function(models) {
    let { Product } = models;
    return {
        createProduct(data) {
            return new Promise((resolve, reject) => {
                Product.findOne({ user: data.user, name: data.name }, (err, product) => {
                    if (err) {
                        return resolve(err);
                    }

                    if (!product) {
                        let newProduct = new Product(data);
                        newProduct.save(err => {
                            if (err) {
                                return reject(err);
                            }

                            return resolve(newProduct);
                        });
                    }

                    return resolve(product);
                });
            });
        },
        getAllProducts(user) {
            return new Promise((resolve, reject) => {
                const query = Product.find({ user })
                    .sort({ name: "asc" });
                query.exec((err, products) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(products);
                });
            });
        },
        getProductById(id) {
            return new Promise((resolve, reject) => {
                Product.findById(id, (err, category) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(category);
                });
            });
        },
        getProductByPattern(pattern, user) {
            return new Promise((resolve, reject) => {
                let query = {};
                if (typeof pattern === "string") {
                    var regex = new RegExp(`.*${pattern}.*`, "gi");
                    query.$and = [{
                        name: regex,
                        user
                    }];
                }

                Product.find()
                    .where(query)
                    .sort({ name: "asc" })
                    .limit(20)
                    .lean()
                    .exec((err, products) => {
                    if (err) {
                        return reject(err);
                    }
                    console.log(products);
                    return resolve(products);
                });
            });
        }
    };
};