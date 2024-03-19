import db from "../config/db.js";

export const NewBooking = (req, res) => {
  const { people, expId } = req.body;

  if (!people || !expId) {
    return res
      .status(400)
      .json({ error: "Missing required fields: people or expId" });
  }

  db.run(
    `
    INSERT INTO bookings (expId, people)
    VALUES (?, ?)
    `,
    [expId, people],
    function (err) {
      if (err) {
        res.status(500).json({ error: "Error while adding booking" });
        return;
      }
      res.status(200).json({ success: "Booking successfully added" });
    }
  );
};
