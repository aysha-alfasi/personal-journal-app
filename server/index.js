const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session); 
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const { Pool } = require("pg");
const app = express();
const port = process.env.PORT || 5000;

// <♡> middlewares <♡>

// <♡ express JSON />
app.use(express.json());

// <♡ Express URL-encoded />
app.use(express.urlencoded({ extended: true }));

// <♡ cors />
app.use(
  cors({
    origin: "https://personal-journal-app-frontend.onrender.com", // ♡> React front-end URL
    credentials: true,
  })
);

// <♡ cookie-parser />
app.use(cookieParser());

// <♡ express-session />
app.use(
  session({
    store: new pgSession({
      pool: pool,          
      tableName: "session", 
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,        
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
      sameSite: "lax",
    },
  })
);

app.use(flash());

// <♡ passport />
passport.use(
  new LocalStrategy(async (username, password, cb) => {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
      );
      const user = rows[0];
      if (!user) return cb(null, false, { message: "Incorrect username" });

      const match = await bcrypt.compare(password, user.password_hash);
      if (match) {
        return cb(null, user);
      } else {
        return cb(null, false, { message: "Incorrect password" });
      }
    } catch (err) {
      console.log(err);
    }
  })
);

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  cb(null, rows[0]);
});

app.use(passport.initialize());
app.use(passport.session());

//  <♡> PostgreSQL connection <♡>
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
 ssl: {
    rejectUnauthorized: false,
  },
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Database connected:", res.rows);
  }
});

// <♡> API Endpoints <♡>
app.get("/contents/:userId", async (req, res) => {
  const userId = req.params.userId; //♡ > Get userId from the URL
  try {
    const result = await pool.query(
      "SELECT * FROM contents WHERE user_id = $1 ORDER BY content_date DESC",
      [userId]
    );
    res.json(result.rows); //♡ > Return the content for this user
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching content");
  }
});

// <♡ Registeration />
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const { rows } = await pool.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username",
      [username, email, hashedPassword]
    );

    // <♡ Manually log in the user after successful registration
    const user = rows[0];

    // <♡ Serialize user info into the session
    req.login(user, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Failed to login after registration" });
      }
      res.status(201).json(user); // <♡ Send back user data
    });
  } catch (err) {
    res.status(400).json({ error: "Username already exists" });
  }
});

// <♡ login />
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    req.logIn(user, (err) => {
      if (err) return next(err);
      console.log('User after login:', req.user);
      return res.status(200).json(user); 
    });
  })(req, res, next);
});

// <♡ protected profile routes />
app.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }

  const userId = req.user.id;
  pool.query("SELECT * FROM users WHERE id = $1", [userId], (err, result) => {
    if (err) {
      console.error("Error fetching profile:", err);
      return res.status(500).send("Error fetching profile");
    }
    res.json(result.rows[0]); //♡ > Send user data as a response
  });
});

// <♡ JournalDetails />
app.get("/contents/:id", (req, res) => {
  const contentId = req.params.id;

  pool.query(
    "SELECT * FROM contents WHERE id = $1",
    [contentId],
    (err, result) => {
      if (err) {
        console.error("Error fetching content:", err);
        return res.status(500).json({ error: "Failed to fetch content" });
      }
      if (result.rows.length > 0) {
        res.json(result.rows[0]);
      } else {
        res.status(404).json({ error: "Content not found" });
      }
    }
  );
});

// <♡ MoodStatistics />
app.get("/mood-statistics/:userId", async (req, res) => {
  const userId = req.user?.id;

  try {
    const result = await pool.query(
      "SELECT mood, COUNT(*) AS count FROM contents WHERE user_id = $1 GROUP BY mood",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching mood statistics", err);
    res.status(500).send("Error fetching mood statistics");
  }
});

// <♡ logout />
app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send("Error during logout");
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send("Error destroying session");
      }
      res.clearCookie("connect.sid");
      res.status(200).send("Logged out successfully");
    });
  });
});

// <♡ Add />
app.post("/contents", async (req, res) => {
  console.log(req.user);
  const userId = req.user?.id;

  const { title, content_field, mood } = req.body;
  const result = await pool.query(
    "INSERT INTO contents (title, content_field, mood, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
    [title, content_field, mood, userId]
  );
  res.json(result.rows[0]);
});

// <♡ Edit />
app.put("/contents/:id", async (req, res) => {
  const { title, content_field, mood } = req.body;
  const { id } = req.params;

  try {
    const result = await pool.query(
      "UPDATE contents SET title = $1, content_field = $2, mood = $3 WHERE id = $4 RETURNING *",
      [title, content_field, mood, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Content not found." });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating content:", error);
    res.status(500).json({ message: "Failed to update content." });
  }
});

// <♡ Delete />
app.delete("/contents/:id", async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    "DELETE FROM contents WHERE id = $1 RETURNING *",
    [id]
  );
  if (result.rowCount === 0) {
    return res.status(404).send({ message: "Entry not found" });
  }

  res.status(200).send({ message: "Entry deleted successfully" });
});

// <♡> Starting the server <♡>

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
