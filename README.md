# Node Members Only

A Node.js application that allows users to sign up, log in, and post messages. Only logged-in users can see the author of each message.

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Mohamed-24-03-2022/node-members-only.git
   ```
2. Navigate to the project directory:
   ```sh
   cd node-members-only
   ```
3. Install the dependencies:
   ```sh
   npm install
   ```
4. Set up the database:
   - Ensure you have PostgreSQL installed and running.
   - Create a `.env` file in the root directory and add your database configuration:
     ```
     HOST=your-database-url
     DB_USER=pg-user
     PW=your-pg-user-password
     DB=top_members_only
     DB_PORT=5432
     ADMIN_PW=your-admin-password
     ```

## Usage

1. Start the server:
   ```sh
   npm start
   ```
2. Open your browser and navigate to [`http://localhost:3000`](http://localhost:3000).

## Features

- User authentication with Passport.js
- User roles (admin, member)
- Message creation and deletion
- Form validation with express-validator

## Technologies Used

- Node.js
- Express.js
- PostgreSQL
- Passport.js
- bcryptjs
- express-session
- connect-pg-simple
- dotenv
- express-validator
