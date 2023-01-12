const express = require('express');
const qrCode = require('qrcode');

const router = new express.Router();


const options = {
    errorCorrectionLevel: 'H',
    type: 'terminal',
    quality: 0.95,
    margin: 1
}

router.post('/scan', async (req, res) => {

    try {
        const qrCodeImage = await qrCode.toDataURL(req.body.data, options);
        res.status(200).send({
            img: qrCodeImage
        });
    }
    catch (ex) {
        res.send({
            err: ex.toString()
        })
    }

});


module.exports = router;