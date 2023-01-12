const $textElement = document.querySelector("#text-to-convert");
const $submitBtnElement = document.querySelector("#generate");
const $qrImageElement = document.querySelector("#qr-img");


$submitBtnElement
    .addEventListener('click', (event) => {
        generateQrCode();
    });



function generateQrCode() {

    const text = $textElement.value;

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "data": text
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
    };

    fetch("http://localhost:3000/scan", requestOptions)
        .then((response) => response.json())
        .then(response => {
            setQRCode(response.img);
        })
        .catch(error => console.log('error', error));
}

function setQRCode(dataString) {

    $qrImageElement.style.display = 'block';
    $qrImageElement.src = dataString;
}

