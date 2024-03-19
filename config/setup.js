import fs from "fs";
import sqlite3 from "sqlite3";

const executeSQLScript = (sqlScript, db) => {
  db.exec(sqlScript, (err) => {
    if (err) {
      console.error("SQL script execution error:", err.message);
    } else {
      console.log("SQL script executed successfully.");
    }
  });
};

const main = (db) => {
  const sqlScript = fs.readFileSync("./config/db.sqlite", "utf8");
  executeSQLScript(sqlScript, db);
};

export default main;
