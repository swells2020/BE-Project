const format = require('pg-format')
const db = require('../db/connection');

exports.checkParametricFormat = (value, column, table) => {
    const queryString = format(`
    SELECT
        %2$s
    FROM
        %3$s
    WHERE
        %2$s=%1$s;
    `, value, column, table)
    return db
        .query(queryString)
        .then(() => {
            return Promise.resolve();
        })
        .catch((error) => {
            return Promise.reject({ status: 400, message: '400: bad request' });
        })
}

exports.checkParametricValue = (value, column, table) => {
    const queryString = format(`
    SELECT
    %1$s
    FROM
    %2$s
    `, column, table)
    return db
        .query(queryString)
        .then(({ rows }) => {
            const values = rows.map(row => {
                return row.article_id.toString();
            })
            if (values.includes(value)) {
                return Promise.resolve();
            } else {
                return Promise.reject({ status: 404, message: '404: invalid path' })
            }
        })
}
