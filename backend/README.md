# CookMaster AI Backend

A robust Express.js backend for the CookMaster AI recipe application, built with Neon PostgreSQL database.

## Features

- **User Management**: User registration, authentication, and profile management
- **Recipe Management**: CRUD operations for recipes with AI-generated content
- **Category Management**: Recipe categorization and filtering
- **Favorites System**: User favorite recipes management
- **Search & Filtering**: Advanced recipe search and filtering capabilities
- **Security**: JWT authentication, rate limiting, and input validation
- **Database**: Neon PostgreSQL with optimized queries and indexing

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: Neon PostgreSQL
- **Authentication**: JWT
- **Validation**: Joi
- **Security**: Helmet, Rate Limiting
- **Password Hashing**: bcryptjs

## Prerequisites

- Node.js (v16 or higher)
- Neon PostgreSQL database account
- npm or yarn

## Installation

1. **Clone the repository**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   ./setup-env.sh
   ```

   Fill in your environment variables in `.env`:

   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # Database Configuration (Neon)
   DATABASE_URL=postgresql://username:password@host:port/database

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key

   # API Keys
   GEMINI_API_KEY=your-gemini-api-key

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. **Database Setup**

   ```bash
   # Initialize database with schema
   npm run init-db

   # Seed categories (optional)
   npm run seed-categories
   ```

5. **Start the server**

   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## API Endpoints

### Users

- `GET /api/user-lists/email/:email` - Get user by email
- `POST /api/user-lists` - Create new user
- `PUT /api/user-lists/:id` - Update user
- `GET /api/user-lists` - Get all users (admin)

### Recipes

- `POST /api/recipes` - Create new recipe
- `GET /api/recipes` - Get all recipes
- `GET /api/recipes/category/:category` - Get recipes by category
- `GET /api/recipes/user/:userEmail` - Get user created recipes
- `GET /api/recipes/:id` - Get recipe by ID
- `PUT /api/recipes/:id` - Update recipe
- `DELETE /api/recipes/:id` - Delete recipe
- `GET /api/recipes/search` - Search recipes

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create new category (admin)
- `PUT /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Favorites

- `POST /api/user-favorites` - Save recipe to favorites
- `GET /api/user-favorites/user/:userEmail` - Get user favorites
- `DELETE /api/user-favorites/:userEmail/:recipeId` - Remove favorite
- `GET /api/user-favorites/check/:userEmail/:recipeId` - Check if favorited
- `GET /api/user-favorites/count/:recipeId` - Get favorite count

## Database Schema

### Users Table

- `id` (SERIAL PRIMARY KEY)
- `email` (VARCHAR UNIQUE)
- `name` (VARCHAR)
- `picture` (TEXT)
- `credits` (INTEGER DEFAULT 10)
- `pref` (JSONB)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Recipes Table

- `id` (SERIAL PRIMARY KEY)
- `recipe_name` (VARCHAR)
- `description` (TEXT)
- `ingredients` (JSONB)
- `steps` (JSONB)
- `calories` (INTEGER)
- `cook_time` (INTEGER)
- `serve_to` (INTEGER)
- `image_prompt` (TEXT)
- `category` (VARCHAR)
- `recipe_image` (TEXT)
- `user_email` (VARCHAR FOREIGN KEY)
- `likes` (INTEGER DEFAULT 0)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Categories Table

- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR UNIQUE)
- `icon` (VARCHAR)
- `color` (VARCHAR)
- `created_at` (TIMESTAMP)

### User Favorites Table

- `id` (SERIAL PRIMARY KEY)
- `user_email` (VARCHAR FOREIGN KEY)
- `recipe_id` (INTEGER FOREIGN KEY)
- `created_at` (TIMESTAMP)

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

All API responses follow a consistent error format:

```json
{
  "error": {
    "message": "Error description",
    "status": 400
  }
}
```

## Security Features

- **Helmet**: Security headers
- **Rate Limiting**: Request throttling
- **Input Validation**: Joi schema validation
- **SQL Injection Protection**: Parameterized queries
- **JWT Authentication**: Secure token-based auth

## Development

### Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests

### Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `DATABASE_URL` - Neon PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret

- `GEMINI_API_KEY` - Google Gemini AI API key
- `RATE_LIMIT_WINDOW_MS` - Rate limiting window
- `RATE_LIMIT_MAX_REQUESTS` - Max requests per window

## Deployment

### Prerequisites

- Neon PostgreSQL database
- Environment variables configured
- Node.js runtime

### Steps

1. Set up your Neon database
2. Configure environment variables
3. Run database migrations
4. Deploy to your hosting platform (Heroku, Vercel, etc.)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
