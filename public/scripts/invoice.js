/* globals $ converter location */
"use strict";

$(function() {
    var $invoiceNumber = $("#invoiceNumber"),
        $invoiceDate = $("#date-input"),
        $invoicePlace = $("#place-input");

    var $companyLogo = $("#hiddenData"),
        $companyName = $("#companyName"),
        $companyCity = $("#companyCity"),
        $companyAddress = $("#companyAddress"),
        $accountablePerson = $("#companyMOL"),
        $eik = $("#companyIdentity"),
        $zdds = $("#companyZDDS");

    var $clientName = $("#clientName"),
        $clientCity = $("#clientCity"),
        $clientAddress = $("#clientAddress"),
        $clientMOL = $("#clientMOL"),
        $clientIdentity = $("#clientIdentity"),
        $clientZdds = $("#clientZDDS");

    var $productsTableBody = $("#products tbody"),
        $products = $productsTableBody.find("tr"),
        $invoiceValue = $("#inv-value"),
        $ddsValue = $("#dds-value"),
        $ddsRate = $("#dds-rate"),
        $dds = $("#dds"),
        $total = $("#value-end"),
        $inWords = $("#inwords");


    var $addProductsBtn = $("#add-more-products"),
        $saveInvoiceBtn = $("#save-invoice"),
        $updateInvoiceBtn = $("#update-invoice");


    var productNameSelector = ".productName",
        productUnitSelector = ".productUnit",
        productQuantitySelector = ".productQuantity",
        productPriceSelector = ".productPrice",
        productValueSelector = ".productValue";


    // Init
    updateZdds($eik, $zdds);
    updateZdds($clientIdentity, $clientZdds);
    $.each($products, function(_, product) {
        var $product = $(product);
        updateProductValue($product);
    });
    updateInvoiceSum();
    updateInvoiceValues();


    // Attach events
    $productsTableBody.on("input", "tr", function() {
        var $this = $(this);
        updateProductValue($this);
        updateInvoiceSum();
        updateInvoiceValues();
    });

    $productsTableBody.on("focusout", "tr .productPrice", function() {
        var $this = $(this),
            value = +$this.val();

        $this.val(value.toFixed(2));
    });

    $ddsRate.on("change", function() {
        updateInvoiceValues();
    });

    $eik.on("change", function() {
        updateZdds($eik, $zdds);
    });

    $clientIdentity.on("change", function() {
        updateZdds($clientIdentity, $clientZdds);
    });

    $addProductsBtn.on("click", function() {
        var $productForm = $products.first().clone(),
            $productFields = $productForm.children();

        $.each($productFields, function(_, field) {
            $(field).children().val("");
        });

        $productForm.find(productNameSelector).autocomplete({
            source: function (req, res) {
                $.ajax({
                        url: "/product/search/" + req.term,
                        type: "GET",
                        dataType: "jsonp",
                        data: {
                            term: req.term
                        },          // request is the value of search input
                        success: function (data) {
                            res($.map(data, function (item) {
                                return {
                                    //autocomplete default values REQUIRED
                                    label: item.name,
                                    value: item.name
                                }
                            }));
                        },
                        error: function(xhr) {
                            console.log(xhr.status + ' : ' + xhr.statusText);
                        }
                });
            },

            // The minimum number of characters a user must type before a search is performed.
            minLength: 1
        });

        $productsTableBody.append($productForm);
    });

    $saveInvoiceBtn.on("click", function() {
        var url = "/invoice",
            invoice = getInvoce();

        $.ajax({
            url: url,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(invoice),
            success: function() {
                location.href = "/invoice/all";
            },
            error: function(err) {
                let status = err.statusCode().status;

                if (status === 401) {
                    location.href = "/login";
                }
            }
        });
    });

    $updateInvoiceBtn.on("click", function() {
        var id = $updateInvoiceBtn.attr("data-id"),
            url = "/invoice/" + id,
            invoice = getInvoce();

        $.ajax({
            url: url,
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify(invoice),
            success: function() {
                location.href = "/invoice/all";
            },
            error: function(err) {
                let status = err.statusCode().status;

                if (status === 401) {
                    location.href = "/login";
                }
            }
        })
    });



    // Functions
    function stylingValue(value) {
        return `${value.toFixed(2)} лв.`;
    }

    function getNumberFromStylizedValue(value) {
        return +value.split(" ")[0];
    }

    function updateZdds($identity, $zdds) {
        var eik = $identity.val();

        if (eik.trim()) {
            $zdds.val("BG" + eik);
        }
    }

    function updateProductValue($product) {
        var quantity = $product.find(productQuantitySelector).val(),
            price = $product.find(productPriceSelector).val(),
            value = +quantity * price;

        $product.find(productValueSelector).val(stylingValue(value));
    }

    function updateInvoiceSum() {
        var $currentProducts = $productsTableBody.find("tr"),
            sum = 0;

        $.each($currentProducts, function(_, product) {
            var productValue = $(product).find(productValueSelector).val();
            if (productValue) {
                productValue = getNumberFromStylizedValue(productValue);
                sum += productValue;
            }
        });

        $invoiceValue.val(stylingValue(sum));
        $ddsValue.val(stylingValue(sum));
    }

    function updateInvoiceValues() {
        var ddsRate = +$ddsRate.val(),
            sum = getNumberFromStylizedValue($invoiceValue.val()),
            dds,
            total,
            slovom;

        dds = sum * ddsRate / 100;
        total = sum + dds;
        slovom = converter.number2lv(total);

        $dds.val(stylingValue(dds));
        $total.val(stylingValue(total))
        $inWords.val(slovom);
    }

    function getInvoce() {
        var $currentProducts = $productsTableBody.find("tr"),
            products = [];

        $.each($currentProducts, function(_, product) {
            var $product = $(product);
            products.push({
                name: $product.find(productNameSelector).val(),
                price: +$product.find(productPriceSelector).val(),
                quantity: +$product.find(productQuantitySelector).val(),
                unit: $product.find(productUnitSelector).val()
            });
        });


        var invoice = {
            number: $invoiceNumber.val(),
            date: new Date($invoiceDate.val()),
            place: $invoicePlace.val(),
            company: {
                name: $companyName.val(),
                identity: $eik.val(),
                address: $companyAddress.val(),
                city: $companyCity.val(),
                accountablePerson: $accountablePerson.val(),
                logo: $companyLogo.val()
            },
            client: {
                name: $clientName.val(),
                identity: $clientIdentity.val(),
                address: $clientAddress.val(),
                city: $clientCity.val(),
                accountablePerson: $clientMOL.val()
            },
            products: products,
            sum: getNumberFromStylizedValue($invoiceValue.val()),
            vat: getNumberFromStylizedValue($ddsValue.val()),
            total: getNumberFromStylizedValue($total.val()),
            dds: getNumberFromStylizedValue($dds.val())
        };

        return invoice;
    }
});