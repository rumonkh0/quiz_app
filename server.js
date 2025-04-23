const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const moment = require("moment");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

const auth = require("./routes/auth");
const quiz = require("./routes/quiz");
const classroom = require("./routes/classroom");
const question = require("./routes/question");

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  // Add a timestamp before the morgan log output
  function getTime() {
    return new Date().toLocaleTimeString();
  }

  // Morgan setup
  const customMorgan = morgan("dev", {
    stream: {
      write: (message) => {
        process.stdout.write(`[${getTime()}] ${message}`);
      },
    },
  });

  app.use(customMorgan);
  // morgan.token("timestamp", () => {
  //   return moment().format("YYYY-MM-DD HH:mm:ss");
  // });

  // app.use(morgan(":timestamp :method :url :status :response-time ms"));
}

// Enable CORS
app.use(cors());
// app.use(cors({
//   origin: "http://localhost:3000",  
//   credentials: true,                 
// }));

//Mount routes
app.use("/api/v1/auth", auth);
app.use("/api/v1/quizzes", quiz);
app.use("/api/v1/classrooms", classroom);
app.use("/api/v1/questions", question);
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Hello from quiz app!" });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
