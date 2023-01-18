// testing function
function test(req, res) {
    res.status(200)
        .send({
            message: 'success!!'
        });
}



module.exports = { test }