const { fetchApi } = require("../models/model");


exports.getApi = (request, response) => {
    fetchApi().then(({ rows }) => {
        response.send({ rows });
    })
}