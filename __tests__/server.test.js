const request = require('supertest')
const app = require('../server');
const db = require('../db/connection');
const data = require('../db/data/test-data/index');
const seed = require('../db/seeds/seed');

beforeEach(() => {
    return seed(data);
})

afterAll(() => {
    return db.end();
});

describe('app', () => {
    test('tests the server and database connection', () => {
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
    describe('GET /api/topics', () => {
        test('tests the connection to the /api/topics endpoint', () => {
            return request(app)
                .get('/api/topics')
                .expect(200)
                .then(({ body: { rows } }) => {
                    const testArray = [];
                    expect(rows.length).toBe(3);
                    rows.forEach(row =>
                        testArray.push([row.slug, row.description])
                    )
                    expect(testArray[0].includes('The man, the Mitch, the legend')).toBe(true)
                    expect(testArray[0].includes('mitch')).toBe(true)
                    expect(testArray[1].includes('Not dogs')).toBe(true)
                    expect(testArray[1].includes('cats')).toBe(true)
                    expect(testArray[2].includes('what books are made of')).toBe(true)
                    expect(testArray[2].includes('paper')).toBe(true)
                })
        })
    })
});