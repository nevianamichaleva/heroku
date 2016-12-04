/* globals module */
"user strict";
const DEFAULT_PAGE = 1,
    PAGE_SIZE = 10

module.exports = function(data) {
    return {
        getReference(req, res) {
            if (!req.user) {
                return res.redirect("/login");
            }
            let user = req.user.username;
            data.getAllProducts(user)
                .then(product => {
                    data.getAllClients(user)
                        .then(client => {
                            res.render("reference", {
                                model: product,
                                model1: client,
                                user: req.user
                            })
                        })
                })
                .catch(err => {
                    console.log(err);
                });
        },
        getPlace(req, res) {
            if (!req.user) {
                return res.redirect("/login");
            }
            let place = req.query.place;
            let user = req.user.username;

            data.searchInvoicesByPlace(user, place)
                .then(invoice => {
                    res.render("invoice-listplace", {
                        model: invoice,
                        user: req.user
                    })
                })
                .catch(err => {
                    //TODO
                    console.log(err);
                })
        },
        getContragent(req, res) {
            if (!req.user) {
                return res.redirect("/login");
            }
            let contragent = req.query.contragent;
            let user = req.user.username;
            //console.log(contragent, user);
            data.searchInvoicesByContragent(user, contragent)
                .then(invoice => {
                    res.render("invoice-listplace", {
                        model: invoice,
                        user: req.user
                    })
                })
                .catch(err => {
                    //TODO
                    console.log(err);
                })
        },
        getProduct(req, res) {
            if (!req.user) {
                return res.redirect("/login");
            }
            let product = req.query.product;
            let user = req.user.username;
            //console.log(contragent, user);
            data.searchInvoicesByProduct(user, product)
                .then(invoice => {
                    //console.log('RController: ' + invoice);
                    res.render("products", {
                        model: invoice,
                        user: req.user,
                        unit: product
                    })
                })
                .catch(err => {
                    //TODO
                    console.log(err);
                })
        },
        getInvoicesBetweenDates(req, res) {
            if (!req.user) {
                return res.redirect("/login");
            }
            let startDate = req.query.startDate,
                endDate = req.query.endDate,
                user = req.user.username,
                page = Number(req.query.page || DEFAULT_PAGE);

            //console.log(startDate);
            data.getInvoicesBetweenDates(user, startDate, endDate, page, PAGE_SIZE)
                .then(result => {
                    let {
                        invoices,
                        count
                    } = result;
                    if (count === 0) {
                        return res.render("invoice-list", {
                            model: invoices,
                            user: req.user,
                            params: { page, pages: 0 }
                        });
                    }
                    if (page < 1) {
                        return res.redirect("/reference/period?page=1");
                    }

                    let pages = count / PAGE_SIZE;
                    if (parseInt(pages, 10) < pages) {
                        pages += 1;
                        pages = parseInt(pages, 10);
                    }
                    if (page > pages) {
                        page = pages;
                        return res.redirect(`/reference/period?page=${page}`);
                    }
                    return res.render("invoice-list", {
                        model: invoices,
                        user: req.user,
                        params: { page, pages }
                    });
                })
                .catch(err => {
                    //TODO
                    console.log(err);
                })
        }
    }
}