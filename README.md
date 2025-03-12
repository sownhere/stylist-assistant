# Personal Stylist Backend

This is the backend service for the Personal Stylist application.

## Project Structure

```
personal-stylist-backend/
├── user-service/       # User authentication and management
├── wardrobe-service/   # User wardrobe management
├── ai-service/         # AI styling recommendations
└── config/             # Shared configuration files
```

## Running Locally

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Setup

1. Clone the repository
   ```
   git clone https://github.com/yourusername/personal-stylist-backend.git
   cd personal-stylist-backend
   ```

2. Install dependencies for each service
   ```
   cd personal-stylist-backend/user-service
   npm install
   ```

3. Set up environment variables
   Create `.env` files in each service directory following the example in `.env.example`

4. Run the service
   ```
   npm run dev
   ```

## Running with Docker

### Prerequisites

- Docker
- Docker Compose

### Setup

1. Clone the repository
   ```
   git clone https://github.com/yourusername/personal-stylist-backend.git
   cd personal-stylist-backend
   ```

2. Start all services
   ```
   docker-compose up -d
   ```

3. To stop all services
   ```
   docker-compose down
   ```

## API Documentation

### User Service (Port 3001)

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/preferences` - Update user preferences

### OAuth Authentication

- `POST /api/users/auth/google` - Google OAuth authentication
- `POST /api/users/auth/apple` - Apple OAuth authentication

## Running Tests

```
cd personal-stylist-backend/user-service
npm test
```
