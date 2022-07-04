const express = require('express');
const { getApi, getTopics } = require('./controllers/controller');

const app = express();

app.use(express.json());

app.get('/api', getApi);

app.get('/api/topics', getTopics)

app.use('*', (request, response) => {
    response.status(404).send({ message: '404: invalid path' });
})

app.use((error, request, response, next) => {
    response.status(500).send({ message: '500: server error' })
})

module.exports = app;