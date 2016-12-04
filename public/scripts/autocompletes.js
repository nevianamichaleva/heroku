/* globals $ */
"use strict";

$(function() {
    let $clientName = $("#clientName"),
        $productName = $(".productName");

    $clientName.autocomplete({
        source: function (req, res) {
            $.ajax({
                    url: "/client/search/" + req.term,
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
                                value: item.name,

                                //extend values
                                city: item.city,
                                address: item.address,
                                identity: item.identity,
                                mol: item.accountablePerson,
                                zdds: item.identitybg
                            }
                        }));
                    },
                    error: function(xhr) {
                        console.log(xhr.status + ' : ' + xhr.statusText);
                    }
            });
        },

        // The minimum number of characters a user must type before a search is performed.
        minLength: 1,

        select: function( event, ui ) {
            $("#clientCity").val(ui.item.city);
            $("#clientAddress").val(ui.item.address);
            $("#clientIdentity").val(ui.item.identity);
            $("#clientZDDS").val(ui.item.zdds);
            $("#clientMOL").val(ui.item.mol);
        }
    });

    $productName.autocomplete({
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
});