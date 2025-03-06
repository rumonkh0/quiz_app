# Quiz App

## Introduction

The Quiz App is an interactive platform designed to facilitate online quizzes for students while providing teachers/admins with tools to create, manage, and analyze quiz performance. The application will be built using the **MERN (MongoDB, Express.js, React.js, Node.js) stack**, ensuring scalability, security, and performance.

## 1. Functional Requirements

### User Roles & Authentication

The system will have two main user roles:

- **Students**: Can browse available quizzes, take quizzes, and view performance reports.
- **Teachers/Admins**: Can create, edit, manage quizzes, and monitor student progress.

#### Authentication & Authorization:
- Secure user authentication using **JWT (JSON Web Token)**.
- Role-based access control to limit student and teacher/admin privileges.
- Support for social logins (Google, Facebook) if required.

### Quiz Management

Teachers/Admins will have full control over quiz creation and management:

- Create, edit, and delete quizzes.
- Add multiple types of questions:
  - **Multiple Choice Questions (MCQs)**
  - **True/False Questions**
  - **Fill in the Blanks**
  - **Short Answer Questions**
- Set quiz time limits and configure auto-submission.
- Randomize question order and answer choices for each attempt.
- Enable/disable **negative marking**.
- Preview quizzes before publishing.

### User Participation & Quiz Attempt

- Students can browse and attempt quizzes from a dashboard.
- A countdown timer will be displayed during quiz attempts.
- Auto-submission will be triggered when the timer expires.
- Students can review previous quiz attempts if allowed by the teacher/admin.
- Ability to resume a quiz in case of an accidental browser closure (with restrictions).

### Scoring & Feedback

- Auto-scoring for **MCQs** and **True/False** questions.
- Manual grading for **short-answer** or **essay-type** questions (if implemented in the future).
- Instant feedback on performance after quiz completion.
- **Detailed score report** including:
  - Correct and incorrect answers.
  - Percentage and total score.
  - Performance breakdown by topic or category.
- Optional feedback/comments from teachers.

### Leaderboard & Ranking

- Display top scorers based on quiz performance.
- Comparison of individual performance with peers.
- Filtering options based on quiz category, time period, or specific quizzes.

### Admin Dashboard

Admins will have control over the overall system, including:
- Managing users (add, remove, or modify students and teachers).
- Monitoring quiz participation and statistics.
- Generating reports for quiz results and student performance analytics.

## 2. Non-Functional Requirements

### Performance & Scalability

- Support concurrent users taking quizzes simultaneously without lag.
- Optimize API responses for fast quiz loading.
- Efficient database indexing for quick retrieval of quiz data.

### Security

- **Secure authentication** using **hashed passwords (bcrypt) and JWT tokens**.
- Prevent multiple logins from the same account (optional session-based control).
- Implement **anti-cheating mechanisms**:
  - Restrict **tab switching** during a quiz attempt.
  - Monitor IP address and device to prevent duplicate attempts.
  - Disable copy-paste functionality during quizzes.

### Usability & UI/UX

- **Responsive Design**: Works seamlessly on desktop and mobile devices.
- **Intuitive User Interface**: Simple and clean UI to enhance user experience.
- **Dark Mode Support**: Optional theme mode for user convenience.

### Technology Stack

#### Frontend:
- **React.js** (with Context API/Redux for state management)
- Tailwind CSS / Bootstrap for styling

#### Backend:
- **Node.js with Express.js** (RESTful API)
- **MongoDB** (NoSQL database for storing quiz data and user records)
- **Mongoose** (for database interactions)

#### Authentication:
- **JWT (JSON Web Token)** for secure user authentication.

#### Hosting & Deployment:
- **Frontend**: Vercel / Netlify
- **Backend**: AWS EC2 / Heroku / Render
- **Database**: MongoDB Atlas (cloud-hosted database)
- **File Storage** (for images, documents if required): Cloudinary / AWS S3

## Conclusion

This Quiz App will provide an engaging platform for students to participate in quizzes while ensuring teachers have robust tools for quiz management and result analysis. With a focus on **performance, security, and usability**, the MERN-based solution will be scalable, efficient, and easy to maintain.

---
