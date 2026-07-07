const express = require('express');
const connection = require('../connection');
const router = express.Router();

const ejs = require('ejs');
const pdf = require('html-pdf');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');
const auth = require('../services/authentication');

router.post('/generateReport', (req, res) => {
    const generateUuid = uuid.v1();
    const orderDetails = req.body;
    var productDetailsReport = JSON.parse(orderDetails.productDetails);

    const query = "INSERT INTO bills(uuid, name, email, contactNumber, paymentMethod, totalAmount, productDetails, billNumber) VALUES(?,?,?,?,?,?,?,?)";
    connection.query(query, [generateUuid, orderDetails.name, orderDetails.email, orderDetails.contactNumber, orderDetails.paymentMethod, orderDetails.totalAmount, orderDetails.productDetails, generateUuid], (err, result) => {
        if (!err) {
            ejs.renderFile(path.join(__dirname, '', "report.ejs"), {
                productDetails: productDetailsReport,
                name: orderDetails.name,
                email: orderDetails.email,
                contactNumber: orderDetails.contactNumber,
                paymentMethod: orderDetails.paymentMethod,
                totalAmount: orderDetails.totalAmount,
                billNumber: generateUuid
            }, (err, data) => {  // ✅ renamed result → data to avoid conflict
                if (err) {
                    return res.status(500).json(err);
                }
                // ✅ make sure folder exists
                if (!fs.existsSync('./generated_pdf')) {
                    fs.mkdirSync('./generated_pdf');
                }
                pdf.create(data).toFile("./generated_pdf/" + generateUuid + ".pdf", function (err, pdfRes) {  // ✅ fixed syntax & renamed res → pdfRes
                    if (err) {
                        console.log(err);
                        return res.status(500).json(err);
                    }
                    return res.status(200).json({ uuid: generateUuid });
                });
            });
        } else {
            return res.status(500).json(err);
        }
    });
});


router.post('/getPdf', auth.authenticateToken, (req, res) => {
    const orderDetails = req.body;
    const pdfPath = 'generated_pdf/' + orderDetails.uuid + '.pdf';

    if (fs.existsSync(pdfPath)) {
        res.contentType("application/pdf");
        fs.createReadStream(pdfPath).pipe(res);
    } else {
        var productDetailsReport = JSON.parse(orderDetails.productDetails);

        ejs.renderFile(path.join(__dirname, '', "report.ejs"), {
            productDetails: productDetailsReport,
            name: orderDetails.name,
            email: orderDetails.email,
            contactNumber: orderDetails.contactNumber,
            paymentMethod: orderDetails.paymentMethod,
            totalAmount: orderDetails.totalAmount,
            billNumber: orderDetails.uuid  // ✅ fixed: was using undefined generateUuid
        }, (err, data) => {
            if (err) {
                return res.status(500).json(err);
            }

            if (!fs.existsSync('./generated_pdf')) {
                fs.mkdirSync('./generated_pdf');
            }

            pdf.create(data).toFile("./generated_pdf/" + orderDetails.uuid + ".pdf", function (err, pdfRes) {  // ✅ fixed: was using undefined generateUuid
                if (err) {
                    console.log(err);
                    return res.status(500).json(err);
                }
                res.contentType("application/pdf");
                fs.createReadStream("./generated_pdf/" + orderDetails.uuid + ".pdf").pipe(res);  // ✅ stream pdf instead of returning uuid
            });
        });
    }
});

router.get('/getBills', (req, res) => {
    var query = "select *from bills order by id DESC";
    connection.query(query, (err, result) => {
        if (!err) {
            return res.status(200).json(result);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.delete('/delete/:id', auth.authenticateToken, (req, res, next) => {
    const id = req.params.id;
    var query = "delete *from bills where id = ?";
    connection.query(query, [id], (err, result) => {
        if (!err) {
            if (result.affectedRows == 0) {
                return res.status(404).json({ message: "bill id does not exist" })
            }
            return res.status(200).json({ message: "bill deleted successfully" })
        }
        else {
            return res.status(500).json(err)
        }
    })
})
module.exports = router;