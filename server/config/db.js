const {Pool} = require("pg")
const pool= new Pool({
  user: "postgres",
  host: "localhost",
  database: "creator-store",
  password: "Suraj@@40325",
  port: 5432,
})

module.exports = pool;