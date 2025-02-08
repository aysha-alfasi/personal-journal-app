const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 5000;


// <♡> middlewares <♡>

// <♡ express JSON />
app.use(express.json());

// <♡ Express URL-encoded />
app.use(express.urlencoded({ extended: true }));

// <♡ cors />
app.use(
  cors({
    origin: "http://localhost:3000", // ♡> React front-end URL
    credentials: true,
  })
);

//  <♡> PostgreSQL connection <♡>

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
  });


  // <♡> API Endpoints <♡>
  
 


  // <♡> Starting the server <♡>

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    });




