/* globals require module $ jsPDF domtoimage Image window*/
"use strict";
var PDFGenerator = (function() {
    const invoiceClassName = '.big-invoice',
        buttonGenerateId = '#print-invoice',
        pdfView = 'landscape',
        imageType = 'PNG',
        pdfFileName = 'invoice' + $("#invoiceNumber").val() + '.pdf';
    return {
        generatePdf: function() {
            var $button = $(buttonGenerateId);
            var $elementToBeConverted = $(invoiceClassName)[0];
            $button.on("click", function() {
                var doc = new jsPDF(pdfView);
                domtoimage
                    .toBlob($elementToBeConverted)
                    .then(function(blob) {
                        var urlCreator = window.URL || window.webkitURL;
                        var imageUrl = urlCreator.createObjectURL(blob);
                        var img = new Image();
                        img.src = imageUrl;
                        // return Promise.resolve(
                        //new Promise(function (resolve){
                        img.onload = function() {
                            doc.addImage(img, imageType, 0, 0, 300, 200);
                            doc.save(pdfFileName);
                        }
                    });

            });
        }
    }
})();

PDFGenerator.generatePdf();