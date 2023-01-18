var $deviceName = document.querySelector("#device-name");
var $edition = document.querySelector("#edition");
var $os = document.querySelector("#os");
var $arch = document.querySelector("#arch");
var $processor = document.querySelector("#processor");
var $graphics = document.querySelector("#graphics");
var $ram = document.querySelector("#ram");


function fetchSystemInformation() {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        headers: myHeaders,
        method: 'GET',
    }

    fetch(`${location.origin}/info`, requestOptions)
        .then((response) => response.json())
        .then(response => {
            $deviceName.innerHTML = response.data.model
            $edition.innerHTML = response.data.edition
            $os.innerHTML = response.data.os
            $arch.innerHTML = response.data.architecture
            $processor.innerHTML = response.data.processor
            $graphics.innerHTML = response.data.graphics
            $ram.innerHTML = response.data.ram
        })
        .catch(error => console.error(error));
}



fetchSystemInformation();