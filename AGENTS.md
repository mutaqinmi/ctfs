# CTFs

## Project Overview

This project is designed to provide a comprehensive overview of Capture The Flag (CTF) competitions, which are cybersecurity challenges that test participants' skills in various areas such as cryptography, reverse engineering, web security, and more. The goal of this project is to create a resource that can help both beginners and experienced participants improve their skills and knowledge in the field of cybersecurity.

## Key Features
- **CTF Challenges**: A collection of CTF challenges categorized by difficulty level and topic, allowing users to practice and improve their skills.
- **Authentication**: A secure authentication system to manage user accounts and track progress.
- **Leaderboard**: A leaderboard to display top performers and encourage competition among participants.
- **Hints and Solutions**: Hints and solutions for each challenge to assist users in learning and understanding the concepts behind the challenges.
- **Admin Panel**: An admin panel for managing challenges, users, and other aspects of the platform.
- **Docker Instances**: The platform can be deployed using Docker, making it easy to set up and run in different environments.

## UI Design
The user interface is designed through Figma, here's a link to the Figma design: [Figma Design](https://www.figma.com/design/Rv0GuHNCLqfsZ9MEOy0NnP/ctfs?node-id=3-396&t=S0r9dx0dvreoAP2y-1)

## Tech Stack
- **Frontend and Backend**: The project is built using Sveltekit, Tailwind CSS, and TypeScript, providing a modern and efficient development experience.
- **Database**: PostgreSQL is used as the database to store user data, challenges, and other relevant information. Also, Drizzle ORM is used for database management and interactions.
- **Authentication**: Better Auth is used for secure user authentication and management.
- **Runtime**: The project running with Bun, a fast and efficient JavaScript runtime, ensuring optimal performance for the application.

## Project Structure
The project is organized into several key directories and files, each serving a specific purpose:
- **/static**: Contains static assets such as images, fonts, and other resources used in.
- **/src**: Contains the source code for the frontend and backend of the application.
- **/src/lib**: Contains utility functions and modules used throughout the application.
- **/src/lib/server**: Contains server-side logic and API routes for handling requests and responses.
- **/src/routes**: Contains the routing logic for the application, defining how different pages and components are accessed.

## To Do List Features
- [] Implement an authentication system for user registration and login.
- [] Create a database schema for storing user data, challenges, and progress.
- [] Develop the frontend interface for displaying challenges and user progress.
- [] Implement the backend logic for handling challenge submissions and scoring.
- [] Create a leaderboard to display top performers and encourage competition.
- [] Add hints and solutions for each challenge to assist users in learning and understanding the concepts behind the challenges.
- [] Develop an admin panel for managing challenges, users, and other aspects of the platform.
- [] Set up Docker instances for easy deployment and running of the platform in different environments.
