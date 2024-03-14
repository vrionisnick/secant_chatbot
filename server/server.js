require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
// const { dbConfig } = require('./config'); // Import your configuration

const app = express();
//const port = process.env.PORT || 5000;
const port = 5000;
console.log("[*] SERVER STARTING");
console.log(process.env.PORT);


app.use(express.json());
app.use(cors());

// Create a MySQL connection pool using env variables
// const pool = mysql.createPool(dbConfig);
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});




// Endpoint to receive and store answers from the React app
app.post('/submit-answers', (req, res) => {
  const { question, user_token, answer_date, answer, status, session_id } = req.body;

  // Format the answer_date to MySQL datetime format
  const formattedDate = new Date(answer_date).toISOString().slice(0, 19).replace('T', ' ');

  // Update previous answers to not be the latest
  const updateQuery = `
    UPDATE secant_answers_copy
    SET latest_answer = 0
    WHERE question = ? AND session_id = ?`;

  pool.query(updateQuery, [question, session_id], (updateError, updateResults) => {
    if (updateError) {
      console.error('Error updating previous answers:', updateError);
      return res.status(500).send('Error updating previous answers');
    }

    // Insert the new answer as the latest
    const insertQuery = `
      INSERT INTO secant_answers_copy (question, user_token, answer_date, answer, status, session_id, latest_answer) 
      VALUES (?, ?, ?, ?, ?, ?, 1)`;

    pool.query(insertQuery, [question, user_token, formattedDate, answer, status, session_id], (insertError, insertResults) => {
      if (insertError) {
        console.error('Error saving answer to database:', insertError);
        return res.status(500).send('Error saving answer to database');
      }
      res.status(200).send('Answer saved successfully');
    });
  });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
