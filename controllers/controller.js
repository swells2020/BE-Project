const { fetchApi, fetchArticlesById, fetchTopics, fetchUsers } = require("../models/model");
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
        response.send({ topics: rows });
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
            response.send({ article: rows[0] })
        })
        .catch((error) => {
            if (error.status === 404) {
                error.message = '404: article not found';
                next(error);
            } else {
                next(error);
            }
        })
};

exports.getUsers = (request, response) => {
    fetchUsers().then(({ rows }) => {
        response.send({ users: rows });
    })
        .catch((error) => {
            next(error);
        })
};