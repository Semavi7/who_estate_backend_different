# WhoEstate Backend - Java Spring Boot

This is a Java Spring Boot application that replicates the functionality of the .NET WhoEstate backend.

## Prerequisites

- Java 17 or higher
- Maven 3.6.0 or higher
- MongoDB installed and running
- SMTP server for email functionality (Gmail used in example)

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd JavaSpringBoot
   ```

2. **Configure application properties**
   Update the `src/main/resources/application.properties` file with your settings:
   ```properties
   # MongoDB Configuration
   spring.data.mongodb.uri=mongodb://localhost:27017/who_estate
   spring.data.mongodb.database=who_estate
   
   # JWT Configuration
   app.jwtSecret=your-super-secret-jwt-key-here-must-be-at-least-32-characters-long
   app.jwtExpirationInMs=604800
   
   # Email Configuration
   spring.mail.host=smtp.gmail.com
   spring.mail.port=587
   spring.mail.username=your-email@gmail.com
   spring.mail.password=your-app-password
   ```

3. **Build the project**
   ```bash
   mvn clean install
   ```

4. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

   Or build a JAR file and run it:
   ```bash
   mvn clean package
   java -jar target/whoestate-backend-0.0.1-SNAPSHOT.jar
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/{id}` - Update user
- `PUT /api/users/{id}/password` - Update user password
- `DELETE /api/users/{id}` - Delete user (Admin only)

### Properties
- `GET /api/properties` - Get all approved properties
- `GET /api/properties/{id}` - Get property by ID
- `POST /api/properties` - Create new property
- `PUT /api/properties/{id}` - Update property
- `DELETE /api/properties/{id}` - Delete property (Admin only)
- `GET /api/properties/user/{userId}` - Get properties by user ID
- `GET /api/properties/city/{city}` - Get properties by city
- `GET /api/properties/type/{propertyType}` - Get properties by type

### Messages
- `GET /api/messages` - Get all messages (Admin only)
- `GET /api/messages/{id}` - Get message by ID
- `POST /api/messages` - Create new message
- `DELETE /api/messages/{id}` - Delete message
- `GET /api/messages/sender/{senderId}` - Get messages by sender ID
- `GET /api/messages/receiver/{receiverId}` - Get messages by receiver ID
- `GET /api/messages/property/{propertyId}` - Get messages by property ID
- `GET /api/messages/conversation/{senderId}/{receiverId}` - Get conversation between users

### Track Views
- `GET /api/trackviews` - Get all track views (Admin only)
- `GET /api/trackviews/{id}` - Get track view by ID
- `POST /api/trackviews` - Create new track view
- `DELETE /api/trackviews/{id}` - Delete track view
- `GET /api/trackviews/user/{userId}` - Get track views by user ID
- `GET /api/trackviews/property/{propertyId}` - Get track views by property ID
- `GET /api/trackviews/user/{userId}/property/{propertyId}` - Get track views by user and property

### Client Intakes
- `GET /api/client-intakes` - Get all client intakes (Admin only)
- `GET /api/client-intakes/{id}` - Get client intake by ID
- `POST /api/client-intakes` - Create new client intake
- `DELETE /api/client-intakes/{id}` - Delete client intake (Admin only)

### Feature Options
- `GET /api/feature-options` - Get all active feature options
- `GET /api/feature-options/{id}` - Get feature option by ID
- `POST /api/feature-options` - Create new feature option (Admin only)
- `PUT /api/feature-options/{id}` - Update feature option (Admin only)
- `DELETE /api/feature-options/{id}` - Delete feature option (Admin only)
- `GET /api/feature-options/category/{category}` - Get feature options by category

### Files
- `POST /api/files/upload` - Upload file
- `DELETE /api/files/delete/{fileName}` - Delete file

## Default Admin User

On application startup, a default admin user is created:
- Email: `refiyederya@gmail.com`
- Password: `123456`

## Technologies Used

- Java 17
- Spring Boot 3.3.4
- Spring Data MongoDB
- Spring Security with JWT
- Spring Mail
- Maven
- MongoDB

## Project Structure

```
src/
├── main/
│   ├── java/
│   │   └── com/whoestate/
│   │       ├── controller/     # REST controllers
│   │       ├── entity/         # Entity classes
│   │       ├── dto/            # Data Transfer Objects
│   │       ├── repository/     # MongoDB repositories
│   │       ├── service/        # Service interfaces
│   │       │   └── impl/       # Service implementations
│   │       ├── config/         # Configuration classes
│   │       └── WhoEstateApplication.java
│   └── resources/
│       └── application.properties
```

## Testing

You can test the application using:
- Swagger UI (when configured)
- Postman or similar API testing tools
- Direct HTTP requests to the endpoints