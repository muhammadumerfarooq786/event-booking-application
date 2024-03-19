import db from "../config/db.js";

export const GetActivities = (req, res) => {
  const region = req.query.region;
  if (!region) {
    res.status(400).json({ error: "Region Value is Missing" });
    return;
  }

  db.all(
    `SELECT * FROM experiences WHERE LOWER(region) = ?`,
    [region.toLowerCase()],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: "Error while fetching activities" });
        return;
      }
      res.status(200).json(results);
    }
  );
};
