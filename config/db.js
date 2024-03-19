import fs from "fs";
import sqlite3 from "sqlite3";
import main from "./setup.js";

const dbFilePath = "./config/experiences.db";
let db;

if (fs.existsSync(dbFilePath)) {
  db = new sqlite3.Database(dbFilePath, (err) => {
    if (err) {
      console.error("Database connection error:", err.message);
    } else {
      console.log("Connected to the existing SQLite database.");
    }
  });
} else {
  db = new sqlite3.Database(dbFilePath, (err) => {
    if (err) {
      console.error("Database connection error:", err.message);
    } else {
      console.log("Connected to the SQLite database.");
    }
  });
  main(db); // Run the main function to execute sqlite file
}

export default db;
