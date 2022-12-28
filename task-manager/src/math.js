const calculateTip = (total, tipPercentage) => {
    const tip = total * tipPercentage;
    return total + tip;
}

const fahrenheitToCelsius = (fahrenheit) => {
    return (fahrenheit - 32) / 1.8;
}

const celsiusToFahrenheit = (celsius) => {
    return (celsius * 1.8) + 32;
}


const add = (digitOne, digitTwo) => {
    return new Promise((resolve, reject) => {
        resolve(digitOne + digitTwo);
    })
}


module.exports = {
    calculateTip,
    fahrenheitToCelsius,
    celsiusToFahrenheit,
    add
}