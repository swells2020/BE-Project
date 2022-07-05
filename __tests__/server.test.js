const request = require('supertest')
const app = require('../server');
const db = require('../db/connection');
const data = require('../db/data/test-data/index');
const seed = require('../db/seeds/seed');
const { convertTimestampToDate } = require('../db/helpers/utils');
const { response } = require('../server');

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
    describe('GET /api/articles/:article_id', () => {
        test('tests the connection to the GET /api/articles/:article_id parametric endpoint', () => {
            const testObject1 = {
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: 1594329060000,
                votes: 100,
            };

            return request(app)
                .get('/api/articles/1')
                .expect(200)
                .then(({ body: { rows } }) => {
                    expect(rows[0].article_id).toEqual(1)
                    expect(rows[0].title).toEqual(testObject1.title)
                    expect(rows[0].topic).toEqual(testObject1.topic)
                    expect(rows[0].author).toEqual(testObject1.author)
                    expect(rows[0].body).toEqual(testObject1.body)
                    expect(rows[0].votes).toEqual(testObject1.votes)
                })
        })
        test('tests the error handling for bad parametric paths', () => {
            return request(app)
                .get('/api/articles/13')
                .expect(404)
                .then(({ body: { message } }) => {
                    expect(message).toBe('404: invalid path');
                })
        })
        test('tests the error handling for bad parametric requests', () => {
            return request(app)
                .get('/api/articles/thirteen')
                .expect(400)
                .then(({ body: { message } }) => {
                    expect(message).toBe('400: bad request');
                })
        })
    })
});