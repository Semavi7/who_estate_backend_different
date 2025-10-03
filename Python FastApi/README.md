# Who Estate Backend - Python FastAPI Version

This is a Python FastAPI replica of the original NestJS Who Estate backend application.

## Project Structure

```
Python/
├── main.py                 # FastAPI application entry point
├── requirements.txt        # Python dependencies
├── .env.example           # Environment variables template
├── routers/               # API route handlers
│   ├── __init__.py
│   ├── auth.py           # Authentication endpoints
│   ├── user.py           # User management
│   ├── properties.py     # Property management
│   ├── client_intake.py  # Client intake forms
│   ├── feature_options.py # Feature options management
│   ├── messages.py       # Contact messages
│   └── track_view.py     # View tracking
├── models/               # Pydantic models
│   ├── __init__.py
│   ├── user.py
│   ├── reset_token.py
│   ├── property.py
│   ├── client_intake.py
│   ├── feature_option.py
│   ├── message.py
│   └── track_view.py
├── services/             # External service integrations
│   ├── __init__.py
│   ├── file_upload.py   # Google Cloud Storage integration
│   └── mailer.py        # Email service
└── dependencies.py       # FastAPI dependencies and middleware
```

## Features

- **Authentication**: JWT-based authentication with password reset functionality
- **User Management**: CRUD operations for users with role-based access control
- **Property Management**: Full property listing system with geospatial queries
- **File Upload**: Google Cloud Storage integration with watermarking
- **Email Service**: SMTP-based email sending for password resets
- **Tracking**: View tracking and analytics
- **MongoDB**: Async MongoDB integration using Motor

## Installation

1. Clone the repository
2. Navigate to the Python directory:
   ```bash
   cd Python
   ```

3. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Copy environment file:
   ```bash
   cp .env.example .env
   ```

6. Configure your environment variables in `.env`

7. Run the application:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 3001
   ```

## Environment Variables

See `.env.example` for all required environment variables.

## API Endpoints

- `GET /` - Health check
- `POST /auth/login` - User login
- `POST /auth/forgot-password` - Password reset request
- `POST /auth/reset-password` - Password reset

- `GET /user` - Get all users (public)
- `POST /user` - Create user (admin/member)
- `GET /user/{id}` - Get user by ID
- `PUT /user/{id}` - Update user
- `DELETE /user/{id}` - Delete user (admin)

- `GET /properties` - Get all properties (public)
- `POST /properties` - Create property (admin/member)
- `GET /properties/{id}` - Get property by ID (public)
- `PUT /properties/{id}` - Update property
- `DELETE /properties/{id}` - Delete property

## Database Collections

The application uses the following MongoDB collections:
- `users` - User accounts
- `properties` - Property listings
- `client_intakes` - Client intake forms
- `feature_options` - Property feature options
- `messages` - Contact messages
- `track_views` - View tracking data
- `reset_tokens` - Password reset tokens

## Development

The application uses:
- **FastAPI** for the web framework
- **Motor** for async MongoDB access
- **Pydantic** for data validation
- **JWT** for authentication
- **Google Cloud Storage** for file uploads
- **aiosmtplib** for email sending

## Deployment

For production deployment, consider using:
- **Docker** for containerization
- **Google Cloud Run** or **AWS Lambda** for serverless deployment
- **MongoDB Atlas** for managed database
- **Google Cloud Storage** for file storage

## License

This project is part of the Who Estate application.