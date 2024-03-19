import express from "express";
import activities from "./routes/Activities.js";
import newexperience from "./routes/NewExperience.js";
import bookexperience from "./routes/BookExperience.js";
import loginuser from "./routes/LoginUser.js";
import reservebooking from "./routes/ResearveBooking.js";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";

const app = express();
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(
  session({
    secret: "session",
    resave: false,
    saveUninitialized: true,
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  try {
    res.render("search", { SessionDetails: req.session.userdetails });
  } catch (error) {
    res.sendStatus(500);
  }
});
app.get("/add-experience", (req, res) => {
  try {
    res.render("experience", { SessionDetails: req.session.userdetails });
  } catch (error) {
    res.sendStatus(500);
  }
});
app.get("/login", (req, res) => {
  res.render("login");
});

app.use("/region", activities);
app.use("/new", newexperience);
app.use("/book", bookexperience);
app.use("/login", loginuser);
app.use("/reserve", reservebooking);

app.post("/login/create-session", (req, res) => {
  req.session.userdetails = req.body;
  res.sendStatus(200);
});

app.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      res.sendStatus(500);
    } else {
      res.redirect("/");
    }
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, console.log(`Server running on port ${PORT}`));
