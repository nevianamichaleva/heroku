/* globals module */
"user strict";

const DEFAULT_PAGE = 1,
    PAGE_SIZE = 10

module.exports = function(data) {
    return {
        getInvoice(req, res) {
            if (req.user) {
                data.getCompanysettings(req.user._id)
                    .then(company => {
                        if (company === null) {
                            return res.redirect("/company/create");
                        }

                        return res.render("invoice", {
                            model: company,
                            user: req.user
                        });
                    });
            } else {
                res.render("invoice");
            }
        },
        getAllInvoices(req, res) {
            if (!req.user) {
                return res.redirect("/login");
            }

            let user = req.user.username,
                page = Number(req.query.page || DEFAULT_PAGE);

            data.getAllInvoices(user, page, PAGE_SIZE)
                .then((result => {
                    let {
                        invoices,
                        count
                    } = result;

                    if (count === 0) {
                        return res.render("invoice-list", {
                            model: invoices,
                            user,
                            params: { page, pages: 0 }
                        });
                    }

                    if (page < 1) {
                        return res.redirect("/invoice/all?page=1");
                    }

                    let pages = count / PAGE_SIZE;
                    if (parseInt(pages, 10) < pages) {
                        pages += 1;
                        pages = parseInt(pages, 10);
                    }
                    if (page > pages) {
                        page = pages;
                        return res.redirect(`/invoice/all?page=${page}`);
                    }
                    return res.render("invoice-list", {
                        model: invoices,
                        user: req.user,
                        params: { page, pages }
                    });
                }))
                .catch(err => {
                    //TODO
                    console.log(err);
                });
        },
        getInvoiceById(req, res) {
            if (!req.user) {
                return res.redirect("/login");
            }

            let id = req.params.id;
            data.getInvoiceById(id)
                .then(invoice => {
                    res.render("user-invoice", {
                        model: invoice,
                        user: req.user
                    })
                })
                .catch(err => {
                    //TODO
                    console.log(err);
                })
        },
        getInvoiceByIdAndRemove(req, res) {
            let id = req.params.id;
            data.removeInvoice(id)
                .then(() => {
                    res.redirect("/invoice/all");
                })
                .catch(err => {
                    //TODO
                    console.log(err);
                })
        },
        createInvoice(req, res) {
            if (!req.user) {
                return res.sendStatus(401);
            }

            let user = req.user.username,
                invoice = req.body;

            invoice.user = user;

            data.createInvoice(invoice)
                .then(() => {
                    invoice.client.user = user;
                    data.createClient(invoice.client);
                })
                .then(() => {
                    for (let product of invoice.products) {
                        product.user = user;
                        data.createProduct(product);
                    }
                })
                .then(() => {
                    res.sendStatus(201);
                })
                .catch(() => {
                    res.sendStatus(400);
                });
        },
        updateInvoice(req, res) {
            if (!req.user) {
                return res.sendStatus(401);
            }

            let user = req.user.username,
                id = req.params.id,
                invoice = req.body;

            data.updateInvoice(id, invoice)
                .then(() => {
                    invoice.client.user = user;
                    data.createClient(invoice.client);
                })
                .then(() => {
                    for (let product of invoice.products) {
                        product.user = user;
                        data.createProduct(product);
                    }
                })
                .then(() => {
                    res.sendStatus(201);
                })
                .catch(() => {
                    res.sendStatus(400);
                });
        }
    };
};