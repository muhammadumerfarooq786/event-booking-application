import db from "../config/db.js";

export const LoginUser = (req, res) => {
  const usernameOrEmail = req.query.usernameOrEmail;
  const password = req.query.password;

  if (!usernameOrEmail || !password) {
    res.status(400).json({ error: "Username/Email or Password is missing" });
    return;
  }

  db.get(
    `SELECT * FROM users WHERE (username = ? OR email = ?) AND password = ?`,
    [usernameOrEmail, usernameOrEmail, password],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: "Error while fetching user" });
        return;
      }

      if (result) {
        res
          .status(200)
          .json({ success: true, message: "Login successful!", user: result });
      } else {
        res
          .status(200)
          .json({ success: false, message: "Invalid credentials" });
      }
    }
  );
};
