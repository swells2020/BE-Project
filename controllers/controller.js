const { fetchApi, fetchTopics, fetchArticlesById, updateArticlesById, fetchArticles } = require("../models/model");
const { checkParametricFormat, checkRequestBodyFormat } = require("../models/utils");

exports.getApi = (request, response, next) => {
    fetchApi()
        .then(({ rows }) => {
            response.send({ rows });
        })
        .catch((error) => {
            next(error);
        })
};

exports.getTopics = (request, response, next) => {
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
            return fetchArticlesById(article_id)
        })
        .then(({ rows }) => {
            response.send({ article: rows[0] })
        })
        .catch((error) => {
            next(error);
        })
};

exports.patchArticleById = (request, response, next) => {
    const { params: { article_id }, body } = request
    const entries = Object.entries(body);

    checkParametricFormat(article_id, 'article_id', 'articles')
        .then(() => {
            return checkRequestBodyFormat(article_id, entries, 'articles')
        })
        .then(() => {
            return updateArticlesById(article_id, entries, 'articles')
        })
        .then((result) => {
            response.send({ article: result.rows[0] })
        })
        .catch((error) => {
            next(error);
        })
};

exports.getArticles = (request, response, next) => {
    fetchArticles()
        .then(({ rows }) => {
            response.send({ articles: rows });
        })
        .catch((error) => {
            console.log(error)
            next(error);
        })
};