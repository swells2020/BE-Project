const db = require('../db/connection');

exports.fetchApi = () => {
    return db.query(`
    SELECT 
        *
    FROM 
        pg_catalog.pg_tables
    WHERE
        schemaname != 'pg_catalog'
    AND
        schemaname != 'information_schema';
    `)
};

exports.fetchTopics = () => {
    return db.query(`
    SELECT
        *
    FROM
        topics;
    `)
};