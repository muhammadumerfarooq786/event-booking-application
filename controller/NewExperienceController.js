import db from "../config/db.js";

export const NewExperience = (req, res) => {
  const requiredFields = [
    "exp_name",
    "exp_type",
    "country",
    "region",
    "lon",
    "lat",
    "exp_description",
  ];

  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res
        .status(400)
        .json({ error: `${field.toLocaleUpperCase()} Field Value is Missing` });
    }
  }

  db.run(
    `
    INSERT INTO experiences (exp_name, exp_type, country, region, lon, lat, exp_description, bookings)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      req.body.exp_name,
      req.body.exp_type,
      req.body.country,
      req.body.region,
      req.body.lon,
      req.body.lat,
      req.body.exp_description,
      req.body.bookings ? req.body.bookings : 0,
    ],
    function (err) {
      if (err) {
        res.status(500).json({ db_error: "Error while Adding Experience" });
        return;
      }
      res.status(200).json({ success: "Successfully Added the Experience" });
    }
  );
};
