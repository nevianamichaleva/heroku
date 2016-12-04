/* globals require module Promise*/
"use strict";

module.exports = function(models) {
    let { Invoice } = models;
    return {
        createInvoice(data) {
            if (data.number.length !== 10) {
                return Promise.reject({ reason: "Number must be exactly 10 symbols" });
            }

            if (!data.user) {
                return Promise.reject({ reason: "User is required" });
            }

            let invoice = new Invoice(data);
            return new Promise((resolve, reject) => {
                invoice.save(err => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(invoice);
                });
            });
        },
        updateInvoice(id, data) {
            if (data.number.toString().length !== 10) {
                return Promise.reject({ reason: "Number must be exactly 10 symbols" });
            }

            return new Promise((resolve, reject) => {
                Invoice.findByIdAndUpdate(id, {
                        $set: data
                    }, { new: true },
                    (err, invoice) => {
                        if (err) {
                            return reject(err);
                        }

                        return resolve(invoice);
                    });
            });
        },
        getAllInvoices(user, page, pageSize) {
            if (!user) {
                return Promise.reject({ reason: "User is required" });
            }

            let skip = (page - 1) * pageSize,
                limit = pageSize;

            return Promise.all([
                new Promise((resolve, reject) => {
                    Invoice.find({ user: user })
                        .sort({ date: "desc" })
                        .skip(skip)
                        .limit(limit)
                        .exec((err, invoices) => {
                            if (err) {
                                return reject(err);
                            }

                            return resolve(invoices);
                        });
                }), new Promise((resolve, reject) => {
                    Invoice.count({})
                        .exec((err, count) => {
                            if (err) {
                                return reject(err);
                            }

                            return resolve(count);
                        });
                })
            ]).then(results => {
                let [invoices, count] = results;
                return { invoices, count };
            });
        },
        getInvoiceById(id) {
            return new Promise((resolve, reject) => {
                Invoice.findById(id, (err, invoice) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(invoice || null);
                });
            });
        },
        removeInvoice(id) {
            return new Promise((resolve, reject) => {
                Invoice.findByIdAndRemove(id, (err, invoice) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(invoice);
                });
            });
        },
        searchInvoicesByPlace(user, place) {
            if (!user) {
                return Promise.reject({ reason: "User is required" });
            }

            return new Promise((resolve, reject) => {
                Invoice.find({ user: user, "place": place }, (err, invoice) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(invoice);
                });
            });
        },
        searchInvoicesByContragent(user, contragent) {
            if (!user) {
                return Promise.reject({ reason: "User is required" });
            }

            return new Promise((resolve, reject) => {
                Invoice.find({ user: user, "client.name": contragent }, (err, invoice) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(invoice);
                });
            });
        },
        searchInvoicesByProduct(user, product) {
            if (!user) {
                return Promise.reject({ reason: "User is required" });
            }

            return new Promise((resolve, reject) => {
                Invoice.find({ user: user, products: { $elemMatch: { name: product } } }, (err, invoice) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(invoice);
                });
            });
        },
        //('invoices').find({date: {$gte: ISODate("2016-12-02T00:00:00.000Z"), $lt: ISODate("2016-12-03T00:00:00.000Z")}})
        getInvoicesBetweenDates(user, startDate, endDate, page, pageSize) {
            if (!user) {
                return Promise.reject({ reason: "User is required" });
            }

            let skip = (page - 1) * pageSize,
                limit = pageSize;
            return Promise.all([
                new Promise((resolve, reject) => {
                    Invoice.find({ user: user, date: { $gte: startDate, $lt: endDate } })
                        .sort({ number: "desc" })
                        .skip(skip)
                        .limit(limit)
                        .exec((err, invoices) => {
                            if (err) {
                                return reject(err);
                            }

                            return resolve(invoices);
                        });
                }), new Promise((resolve, reject) => {
                    Invoice.count({})
                        .exec((err, count) => {
                            if (err) {
                                return reject(err);
                            }

                            return resolve(count);
                        });
                })
            ]).then(results => {
                let [invoices, count] = results;
                return { invoices, count };
            });
        }
    };
};