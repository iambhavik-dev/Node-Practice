const express = require('express');
const path = require('path');


const app = express();

const port = process.env.PORT || 3000;
const public_path = path.join(__dirname, '../public');
const qrCodeRouter = require('./qr/qr-code-router');



app.use(express.static(public_path));
app.use(express.json())

app.use('/', qrCodeRouter);


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})