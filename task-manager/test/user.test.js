const supertest = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user.model');

const { defaultUser, defaultUserId, setupDatabase } = require('./global/db');

beforeEach(setupDatabase);


test('Should able to add new user', async () => {
    await supertest(app)
        .post('/users')
        .send({
            name: 'Test1',
            email: 'test1@gmail.com',
            password: 'test@123'
        })
        .expect(200);
});


test('Should login existing user', async () => {
    const response = await supertest(app)
        .post('/users/login')
        .send({
            email: defaultUser.email,
            password: defaultUser.password
        })
        .expect(200);

    // Asset that user added to database correctly
    const user = User.findById(response.body.response.user._id);
    expect(user).not.toBeNull();

    // Assert for the response
    expect(response.body.response).toMatchObject({
        user: {
            email: 'dev@gmail.com',
            name: 'dev',
            age: 13
        }
    })

});

test('Should not login', async () => {
    await supertest(app)
        .post('/users/login')
        .send({
            email: defaultUser.email,
            password: 'dummyPass'
        })
        .expect(401);
})


test('Should get users profile', async () => {
    await supertest(app)
        .get('/users')
        .set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
        .send()
        .expect(200)
});

test('Should get users profile', async () => {
    await supertest(app)
        .get('/users')
        .send()
        .expect(401)
});

test('Should delete user', async () => {
    await supertest(app)
        .delete(`/users/${defaultUserId._id}`)
        .set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
        .send()
        .expect(200)
});

test('Should not delete user for unauthorize user', async () => {
    await supertest(app)
        .delete(`/users/${defaultUserId._id}`)
        .send()
        .expect(401)
})
