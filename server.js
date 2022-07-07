const express = require('express');
const { getApi, getTopics, getArticleById, patchArticleById, getArticles } = require('./controllers/controller');

const app = express();

app.use(express.json());

app.get('/api', getApi);

app.get('/api/topics', getTopics)

app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticleById);
app.patch('/api/articles/:article_id', patchArticleById);


// Bad path error handler
app.use('*', (request, response) => {
    response.status(404).send({ message: '404: path not found' });
})

// Custom error handler
app.use((error, request, response, next) => {
    const { status, message } = error;
    if (status) {
        response.status(status).send({ message });
    } else {
        next(error);
    }
})

// 500 error handler
app.use((error, request, response, next) => {
    console.log('shouldn\'t be here')
    response.status(500).send({ message: '500: server error' })
})

module.exports = app;