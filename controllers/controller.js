const users = require("../db/data/test-data/users");
const { fetchApi, fetchTopics, fetchArticlesById, updateArticlesById, fetchUsers, fetchArticles, addsCommentByArticleId } = require("../models/model");
const { checkParametricFormat, checkExistingValue } = require("../models/utils");

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
            return updateArticlesById(article_id, entries)
        })
        .then(({rows}) => {
            response.send({ article: rows[0] })
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
            next(error);
        })
};

exports.getUsers = (request, response, next) => {
    fetchUsers().then(({ rows }) => {
        response.send({ users: rows });
    })
        .catch((error) => {
            next(error);
        })
};

exports.postCommentByArticleId = (request, response, next) => {
    const { params: { article_id }, body } = request

    if(body.username) {
        body.author = body.username
        delete body.username
    }

    const entries = Object.entries(body);

    checkParametricFormat(article_id, 'article_id', 'articles')
        .then(() => {
            return checkExistingValue(body.author, 'username', 'users')
        })
        .then(() => {
            return addsCommentByArticleId(article_id, entries)
        })
        .then(({ rows }) => {
            response.status(201).send({ comment: rows })
        })
        .catch((error) => {
            next(error);
        })
};