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
})
describe('POST /api/articles/:article_id/comments', () => {
    test('tests the connection to the POST /api/articles/:article_id/comments endpoint', () => {
        const postData = {
            username: 'butter_bridge',
            body: 'This is a test post.'
        }

        return request(app)
            .post('/api/articles/1/comments')
            .send(postData)
            .expect(201)
            .then(({ body: { comment } }) => {
                expect(comment[0].comment_id).toBe(19);
                expect(comment[0].author).toBe('butter_bridge');
                expect(comment[0].body).toBe('This is a test post.');
                expect(comment[0].votes).toBe(0);
            })
    })
    test('tests the error handling for a bad request body (invalid value)', () => {
        const postData = {
            username: 'butter_smidge',
            body: 'This is a test post.'
        }

        return request(app)
            .post('/api/articles/1/comments')
            .send(postData)
            .expect(400)
            .then(({ body: { message } }) => {
                expect(message).toBe('400: bad request - invalid data format');
            })
    })
    test('tests the error handling for a bad request body (invalid value)', () => {
        const postData = {
            uzername: 'butter_bridge',
            body: 'This is a test post.'
        }

        return request(app)
            .post('/api/articles/1/comments')
            .send(postData)
            .expect(400)
            .then(({ body: { message } }) => {
                expect(message).toBe('400: bad request - invalid data format');
            })
    })
    test('tests the error handling for bad parametric paths', () => {
        return request(app)
            .post('/api/articles/13/comments')
            .expect(404)
            .then(({ body: { message } }) => {
                expect(message).toBe('404: parametric endpoint not found');
            })
    })
    test('tests the error handling for bad parametric requests', () => {
        return request(app)
            .post('/api/articles/thirteen/comments')
            .expect(400)
            .then(({ body: { message } }) => {
                expect(message).toBe('400: bad request - invalid parametric endpoint format');
            })
    })
});
describe('GET /api/articles/:article_id/comments', () => {
    test('tests the connection to the GET /api/articles/:article_id/comments endpoint where comments exist', () => {
        return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({ body: { comments } }) => {
                const erroneousIds = comments.filter(comment => {
                    comment.article_id !== 1
                })
                expect(comments.length).toBe(11);
                expect(erroneousIds.length).toBe(0);
                comments.forEach((comment) => {
                    expect(comment).toEqual(
                        expect.objectContaining({
                            comment_id: expect.any(Number),
                            votes: expect.any(Number),
                            created_at: expect.any(String),
                            body: expect.any(String),
                            author: expect.any(String),
                        })
                    );
                });
            })
    })
    test('tests the connection to the GET /api/articles/:article_id/comments endpoint where no comments exist', () => {
        return request(app)
            .get('/api/articles/2/comments')
            .expect(200)
            .then(({ body: { comments } }) => {
                expect(comments.length).toBe(0);
            })
    })
    test('tests the error handling for bad parametric paths', () => {
        return request(app)
            .get('/api/articles/13/comments')
            .expect(404)
            .then(({ body: { message } }) => {
                expect(message).toBe('404: parametric endpoint not found');
            })
    })
    test('tests the error handling for bad parametric requests', () => {
        return request(app)
            .get('/api/articles/thirteen/comments')
            .expect(400)
            .then(({ body: { message } }) => {
                expect(message).toBe('400: bad request - invalid parametric endpoint format');
            })
    })
})
describe('GET /api/articles?queries', () => {
    describe('tests the connection to the GET /api/articles(queries) endpoint with the following queries:', () => {
        test('sort_by=title', () => {
            return request(app)
                .get('/api/articles?sort_by=title')
                .expect(200)
                .then(({ body: { articles } }) => {
                    expect(articles[0].title).toBe('Z');
                    expect(articles[11].title).toBe('A');
                })
        })
        test('sort_by=topic', () => {
            return request(app)
                .get('/api/articles?sort_by=topic')
                .expect(200)
                .then(({ body: { articles } }) => {
                    expect(articles[0].topic).toBe('mitch');
                    expect(articles[11].topic).toBe('cats');
                })
        })
        test('sort_by=author', () => {
            return request(app)
                .get('/api/articles?sort_by=author')
                .expect(200)
                .then(({ body: { articles } }) => {
                    expect(articles[0].author).toBe('rogersop');
                    expect(articles[11].author).toBe('butter_bridge');
                })
        })
        test('sort_by=created_at', () => {
            return request(app)
                .get('/api/articles?sort_by=created_at')
                .expect(200)
                .then(({ body: { articles } }) => {
                    expect(articles[0].article_id).toBe(3);
                    expect(articles[11].article_id).toBe(7);
                })
        })
        test('sort_by=votes', () => {
            return request(app)
                .get('/api/articles?sort_by=votes')
                .expect(200)
                .then(({ body: { articles } }) => {
                    expect(articles[0].title).toBe('Living in the shadow of a great man');
                })
        })
        test('sort_by=title&order=asc', () => {
            return request(app)
                .get('/api/articles?sort_by=title&order=asc')
                .expect(200)
                .then(({ body: { articles } }) => {
                    expect(articles[0].title).toBe('A');
                    expect(articles[11].title).toBe('Z');
                })
        })
        test('sort_by=topic&order=asc', () => {
            return request(app)
                .get('/api/articles?sort_by=topic&order=asc')
                .expect(200)
                .then(({ body: { articles } }) => {
                    expect(articles[0].topic).toBe('cats');
                    expect(articles[11].topic).toBe('mitch');
                })
        })
        test('sort_by=author&order=asc', () => {
            return request(app)
                .get('/api/articles?sort_by=author&order=asc')
                .expect(200)
                .then(({ body: { articles } }) => {
                    expect(articles[0].author).toBe('butter_bridge');
                    expect(articles[11].author).toBe('rogersop');
                })
        })
        test('sort_by=created_at&order=asc', () => {
            return request(app)
                .get('/api/articles?sort_by=created_at&order=asc')
                .expect(200)
                .then(({ body: { articles } }) => {
                    expect(articles[0].article_id).toBe(7);
                    expect(articles[11].article_id).toBe(3);
                })
        })
        test('sort_by=votes&order=asc', () => {
            return request(app)
                .get('/api/articles?sort_by=votes&order=asc')
                .expect(200)
                .then(({ body: { articles } }) => {
                    expect(articles[0].title).not.toBe('Living in the shadow of a great man');
                })
        })
        test('topic=cats', () => {
            return request(app)
                .get('/api/articles?topic=cats')
                .expect(200)
                .then(({ body: { articles } }) => {
                    const articleIds = articles.map(article => {
                        return article.article_id
                    })
                    expect(articles.length).toBe(1);
                    expect(articleIds.includes(5)).toBe(true);
                })
        })
        test('topic=mitch', () => {
            return request(app)
                .get('/api/articles?topic=mitch')
                .expect(200)
                .then(({ body: { articles } }) => {
                    const articleIds = articles.map(article => {
                        return article.article_id
                    })
                    expect(articles.length).toBe(11);
                    expect(articleIds.includes(5)).toBe(false);
                })
        })
    })
    test('tests the error handling for bad queries', () => {
        return request(app)
            .get('/api/articles?author=grumpy19')
            .expect(400)
            .then(({ body: { message } }) => {
                expect(message).toBe('400: bad request - invalid query');
            })
    })    
    test('tests the error handling for 0 responses', () => {
        return request(app)
            .get('/api/articles?topic=grumpy19')
            .expect(200)
            .then(({ body: { articles} }) => {
                expect(articles.length).toBe(0);
            })
    })
})