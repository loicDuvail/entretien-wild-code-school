const { createPool } = require("mysql");
const pool = createPool({
    user: "root",
    host: "localhost",
    password: "",
    database: "entretien",
});
module.exports = pool;
