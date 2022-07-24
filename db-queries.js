const { pool } = require("./pg-client");

exports.getParents = (referer_id) => {
    return new Promise((resolve, reject) => {
        pool.query(
            `
        with recursive temp_table as (
            select
                id,
                name,
                referer_id,
                is_agency
            from account
            where
                id = ${referer_id}
            union
                select
                    a.id,
                    a.name,
                    a.referer_id,
                    a.is_agency
                from
                    account a
                inner join temp_table s on s.referer_id = a.id
        ) select * from temp_table;
        `,
            (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.rows);
                }
            }
        );
    });
};

exports.getChildren = (user_id) => {
    return new Promise((resolve, reject) => {
        pool.query(
            `
        with recursive temp_table as (
            select
                id,
                name,
                referer_id,
                is_agency
            from account
            where
                id = ${user_id}
            union
                select
                    a.id,
                    a.name,
                    a.referer_id,
                    a.is_agency
                from
                    account a
                inner join temp_table s on s.id = a.referer_id
        ) select * from temp_table;
        `,
            (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.rows);
                }
            }
        );
    });
};