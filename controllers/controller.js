const { fetchApi, fetchArticlesById, fetchTopics } = require("../models/model");
const { checkParametricValue, checkParametricFormat } = require("../models/utils");


exports.getApi = (request, response) => {
    fetchApi()
        .then(({ rows }) => {
            response.send({ rows });
        })
        .catch((error) => {
            next(error);
        })
};

exports.getTopics = (request, response) => {
    fetchTopics().then(({ rows }) => {
        response.send({ rows });
    })
    .catch((error) => {
        next(error);
    })
};

exports.getArticleById = (request, response, next) => {
    const { params: { article_id } } = request
    checkParametricFormat(article_id, 'article_id', 'articles')
        .then(() => {
            return checkParametricValue(article_id, 'article_id', 'articles')
        })
        .then(() => {
            return fetchArticlesById(article_id)
        })
        .then(({ rows }) => {
            response.send({ rows })
        })
        .catch((error) => {
            next(error);
        })
};