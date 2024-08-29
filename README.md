
# SHOPPER>COM>BR

This is a Fullstack project that consists of a frontend developed with Vue.js and a backend developed with Node.js and Express as a Technical Test – Junior Web Development.

## Project Structure

- **shopper-frontend**: Contains the frontend code of the application.
- **shopper-backend**: Contains the backend code of the application.

## Requirements

- Node.js (version 20.x or higher)
- NPM or Yarn
- Docker Compose

## How to Set Up the Project

- Clone the `shopper.com.br` repository to a directory on your computer.
- Go to the root directory and run the command `docker compose up -d`

  Or

### Backend

1. Navigate to the `shopper-backend` directory:

   ```bash
   cd shopper-backend
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Configure the environment variables by creating a `.env` file in the repository's root with the following keys:

   ```bash
   DB_HOST='localhost'
   DB_PORT='27017'
   DB_USER='root'
   DB_PASSWORD='example'
   DB_NAME='test'
   JWT_SECRET='jwt_secret'
   SERVER_URL='http://localhost:8080'
   SECRET='secret'
   GEMINI_API_KEY='gemini_token_api'
   GEMINI_MODEL='gemini-1.5-flash'
   ```

4. Run the tests (optional):

   ```bash
   npm test
   ```

5. Start the server:

   ```bash
   npm start
   ```

### Frontend

1. Navigate to the `shopper-frontend` directory:

   ```bash
   cd shopper-frontend
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Configure the environment variables by creating a `.env.production` file in the root directory of `shopper-backend` with the following key:

   ```bash
   VITE_SERVER_API='http://localhost:8080/api/v1'
   ```

4. Start the server:

   ```bash
   npm start
   ```
