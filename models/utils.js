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
        .then(({ rows }) => {
            if (rows.length !== 0) {
                return Promise.resolve();
            } else {
                return Promise.reject({ status: 404, message: '404: parametric endpoint not found' })
            }
        })
        .catch((error) => {
            if (error.status === 404) {
                return Promise.reject(error)
            } else {
                return Promise.reject({ status: 400, message: '400: bad request - invalid parametric endpoint format' });
            }
        })
};

exports.checkExistingValue = (existingValue, existingColumn, existingTable) => {
    const queryString = format(`
    SELECT
        %2$s
    FROM 
        %3$s
    WHERE
        %2$s=%1$L
    `, existingValue, existingColumn, existingTable)

    return db
        .query(queryString)
        .then(({ rows }) => {
            if (rows.length !== 0) {
                return Promise.resolve();
            } else {
                return Promise.reject({ status: 400, message: '400: bad request - invalid data format' })
            }
        })
}
