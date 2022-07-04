const request = require('supertest')
const app = require('../server');
const db = require('../db/connection');
const data = require('../db/data/test-data/index');
const seed = require('../db/seeds/seed');

beforeAll(() => {
    return seed(data).then();
})

afterAll(() => {
    return db.end();
});

describe('app', () => {
    test('tests the server connection', () => {
        return request(app)
            .get('/api')
            .expect(200)
            .then();
    })
    test('tests the database connection', () => {
        return request(app)
            .get('/api')
            .expect(200)
            .then(({ body: { rows } }) => {
                const testArray = [];
                rows.forEach(row =>
                    testArray.push(row.tablename)
                )
                expect(testArray.length).toBe(4);
                expect(testArray.includes('comments')).toBe(true);
                expect(testArray.includes('articles')).toBe(true);
                expect(testArray.includes('users')).toBe(true);
                expect(testArray.includes('topics')).toBe(true);
            })
    })
    test('tests bad path error handler', () => {
        return request(app)
            .get('/invalid-path')
            .expect(404)
            .then(response => {
                expect(response.body).toEqual({ message: '404: invalid path' })
            })
    })
});