const express = require('express');
const path = require('path');
const { getSystemInformation } = require('./js/system-info');

const PORT = process.env.PORT || 3000;
const public_path = path.join(__dirname, '../public')

const app = express();

app.use(express.static(public_path));
app.use(express.json())


app.get('/info', async (req, res) => {
    res
        .status(200)
        .send({
            data: await getSystemInformation()
        });
});

app.listen(PORT, () => {
    console.log(`Listening on port : ${PORT}`);
});