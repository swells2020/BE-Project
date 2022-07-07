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

exports.checkRequestBodyFormat = (value, entries, table) => {
    const queryString1 = format(`    
    SELECT
        data_type
    FROM
        information_schema.columns
    WHERE
        table_name = '%2$s'
    AND 
        column_name = '%1$s'
    `, entries[0][0], table);

    return db
        .query(queryString1)
        .then(({ rows }) => {
            const queryString2 = format(`    
            SELECT
                CAST(%1$s as %2$s)
            `, entries[0][1], rows[0].data_type)

            return db.query(queryString2)
        })
        .then(() => {
            return Promise.resolve();
        })
        .catch((error) => {
            return Promise.reject({ status: 400, message: '400: bad request - invalid data format' });
        })
};