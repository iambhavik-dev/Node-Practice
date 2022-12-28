const supertest = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/task.model');
const task = require('../src/models/task.model');

const { defaultUser, defaultUserId, setupDatabase } = require('./global/db')

beforeEach(setupDatabase);


test('Should able to add new task', async () => {
    const response = await supertest(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${defaultUser.tokens[0].token}`)
        .send({
            description: 'New test task'
        })
        .expect(200);

    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
    expect(task.completed).toEqual(false);

})