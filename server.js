const express = require('express');
const { getApi } = require('./controllers/controller');

const app = express();

app.use(express.json());

app.get('/api', getApi);



app.use('*', (request, response) => {
    response.status(404).send({ message: '404: invalid path' });
})

module.exports = app;