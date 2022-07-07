const format = require('pg-format')
const db = require('../db/connection');

exports.fetchApi = () => {
    return db
        .query(`
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
    return db
        .query(`
        SELECT
            *
        FROM
            topics;
        `)
};

exports.fetchArticlesById = (article_id) => {
    return db
        .query(`
        SELECT 
            articles.*, COUNT(comment_id) as comment_count
        FROM 
            articles
        LEFT JOIN 
            comments ON comments.article_id=articles.article_id
        WHERE 
            articles.article_id=$1
        GROUP BY
            articles.article_id
        `, [article_id]);
};

// SELECT animals.*, COUNT(northcoder_id) AS number_of_fans
// FROM animals
// LEFT JOIN northcoders ON northcoders.favourite_animal_id = animals.animal_id
// GROUP BY animal_id;

exports.updateArticlesById = (article_id, entries) => {
    const keys = entries[0][0];
    const values = entries[0][1];
    const queryString = format(`
    UPDATE
        articles
    SET
        %1$s=%1$s+%2$s
    WHERE
        article_id=%3$s
    RETURNING
        *
    `, keys, values, article_id)
    return db
        .query(queryString)

}