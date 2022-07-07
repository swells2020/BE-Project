const request = require('supertest');
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
                expect(response.body).toEqual({ message: '404: path not found' })
            })
    })
})
describe('GET /api/topics', () => {
    test('tests the connection to the GET /api/topics endpoint', () => {
        return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body: { topics } }) => {
                const testArray = [];
                expect(topics.length).toBe(3);
                topics.forEach(topic =>
                    testArray.push([topic.slug, topic.description])
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
            .then(({ body: { article } }) => {
                expect(article.article_id).toEqual(1)
                expect(article.title).toEqual(testObject1.title)
                expect(article.topic).toEqual(testObject1.topic)
                expect(article.author).toEqual(testObject1.author)
                expect(article.body).toEqual(testObject1.body)
                expect(article.votes).toEqual(testObject1.votes)
            })
            
    })
    test('tests the new comment count property where comments exist', () => {
        return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({ body: { article } }) => {
                expect(article.comment_count).toEqual('11');
            })
    })
    test('tests the new comment count property where comments do not exist', () => {
        return request(app)
            .get('/api/articles/2')
            .expect(200)
            .then(({ body: { article } }) => {
                expect(article.comment_count).toEqual('0');
            })
    })
    test('tests the error handling for bad parametric paths', () => {
        return request(app)
            .get('/api/articles/13')
            .expect(404)
            .then(({ body: { message } }) => {
                expect(message).toBe('404: parametric endpoint not found');
            })
    })
    test('tests the error handling for bad parametric requests', () => {
        return request(app)
            .get('/api/articles/thirteen')
            .expect(400)
            .then(({ body: { message } }) => {
                expect(message).toBe('400: bad request - invalid parametric endpoint format');
            })
    })
})
describe('PATCH /api/articles/:article_id', () => {
    test('tests the connection to the PATCH /api/articles/:article_id parametric endpoint', () => {
        const patchData = { votes: 1 };
        const result = {
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: '2020-07-09T20:11:00.000Z',
            votes: 101
        }
        return request(app)
            .patch('/api/articles/1')
            .send(patchData)
            .expect(200)
            .then(({ body: { article } }) => {
                expect(article).toEqual(result);
            })
    })
    test('tests the error handling for bad request body (invalid key)', () => {
        const patchData = { votes: 'one' };
        return request(app)
            .patch('/api/articles/1')
            .send(patchData)
            .expect(400)
            .then(({ body: { message } }) => {
                expect(message).toBe('400: bad request - invalid data format');
            })
    })
    test('tests the error handling for bad request body (invalid value)', () => {
        const patchData = { votez: 1 };
        return request(app)
            .patch('/api/articles/1')
            .send(patchData)
            .expect(400)
            .then(({ body: { message } }) => {
                expect(message).toBe('400: bad request - invalid data format');
            })
    })
    test('tests the error handling for bad parametric paths', () => {
        return request(app)
            .patch('/api/articles/13')
            .expect(404)
            .then(({ body: { message } }) => {
                expect(message).toBe('404: parametric endpoint not found');
            })
    })
    test('tests the error handling for bad parametric requests', () => {
        return request(app)
            .patch('/api/articles/thirteen')
            .expect(400)
            .then(({ body: { message } }) => {
                expect(message).toBe('400: bad request - invalid parametric endpoint format');
            })
    })
})
describe('GET /api/articles', () => {
    test('tests the connection to the GET /api/articles endpoint', () => {
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body: { articles } }) => {
                const testArray = [];
                expect(articles.length).toBe(12);
                articles.forEach(article =>
                    testArray.push([article.title, article.topic, article.author, article.votes])
                )
                expect(testArray.length).toBe(12);
            })
    })
    test('tests the new comment count property where comments exist', () => {
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body: { articles } }) => {
                const testArray = [];
                expect(articles.length).toBe(12);
                articles.forEach(article =>
                    testArray.push([article.comment_count])
                )
                expect(testArray.length).toBe(12);
            })
        })
        test('tests the new sort by created_at descending option where comments exist', () => {
            return request(app)
                .get('/api/articles')
                .expect(200)
                .then(({ body: { articles } }) => {
                    const testArray = [];
                    expect(articles.length).toBe(12);
                    articles.forEach(article =>
                        testArray.push([article.created_at])
                    )
                    expect(testArray.length).toBe(12);
                    expect(testArray[0][0]).toBe('2020-11-03T09:12:00.000Z');
                    expect(testArray[11][0]).toBe('2020-01-07T14:08:00.000Z');
                })
            })
})
describe('GET /api/users', () => {
    test('tests the connection to the GET /api/users endpoint', () => {
        return request(app)
            .get('/api/users')
            .expect(200)
            .then(({ body: { users } }) => {
                const testArray = [];
                expect(users.length).toBe(4);
                users.forEach(user =>
                    testArray.push([user.user_id, user.username, user.name, user.avatar_url])
                )
                expect(testArray[0].includes('butter_bridge')).toBe(true)
                expect(testArray[0].includes('jonny')).toBe(true)
                expect(testArray[0].includes('https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg')).toBe(true)
                expect(testArray[1].includes('icellusedkars')).toBe(true)
                expect(testArray[1].includes('sam')).toBe(true)
                expect(testArray[1].includes('https://avatars2.githubusercontent.com/u/24604688?s=460&v=4')).toBe(true)
                expect(testArray[2].includes('rogersop')).toBe(true)
                expect(testArray[2].includes('paul')).toBe(true)
                expect(testArray[2].includes('https://avatars2.githubusercontent.com/u/24394918?s=400&v=4')).toBe(true)
                expect(testArray[3].includes('lurker')).toBe(true)
                expect(testArray[3].includes('do_nothing')).toBe(true)
                expect(testArray[3].includes('https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png')).toBe(true)
            })
    })
});
