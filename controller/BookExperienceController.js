import db from "../config/db.js";

export const BookExperience = (req, res) => {
  db.run(
    `UPDATE experiences SET bookings = bookings + 1 WHERE id = ?`,
    [req.query.id],
    function (err) {
      if (err) {
        res.status(500).json({ error: "Error while Updating Experience" });
        return;
      }
      res
        .status(200)
        .json({ success: "Successfully Updating the Experience Bookings" });
    }
  );
};
