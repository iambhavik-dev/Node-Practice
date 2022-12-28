const { calculateTip,
    fahrenheitToCelsius,
    celsiusToFahrenheit,
    add
} = require('../src/math');


test('Should calculate total with tip', () => {
    const total = calculateTip(10, .3);
    expect(total).toBe(13);
});

test('Should convert 32 F to 0 C', () => {
    const celsius = fahrenheitToCelsius(32);
    expect(celsius).toBe(0);
});

test('Should convert 0 C to 32 F', () => {
    const fahrenheit = celsiusToFahrenheit(0);
    expect(fahrenheit).toBe(32);
})


test('Async flow', (done) => {
    setTimeout(() => {
        expect(1).toBe(1)
        done()
    }, 2000)
})


test('Async Addition', (done) => {
    add(2, 5)
        .then((sum) => {
            expect(sum).toBe(7)
            done()
        })
})
