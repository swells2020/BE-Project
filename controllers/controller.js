const { fetchApi, fetchTopics } = require("../models/model");


exports.getApi = (request, response) => {
    fetchApi().then(({ rows }) => {
        response.send({ rows });
    })
};

exports.getTopics = (request, response) => {
    fetchTopics().then(({ rows }) => {

        console.log(rows);
        response.send({ rows });
    })
};