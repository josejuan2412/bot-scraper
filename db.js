import mysql from "mysql";

export const mysqlDB = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "4md34dm1n",
    port: "3307",
    database: "scraper",
  },
  {
    multipleStatements: true,
  },
);
