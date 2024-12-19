before documentatioin an importatnt information:-
the superAdmin is :- {
    "email":"admin1@admin.com",
    "password":"Admin@123"
}


Project Documentation
Overview

This project is a user authentication and profile management system with OTP-based verification, password reset functionality, and role-based access control (RBAC) for administrators. The system ensures secure registration, login, and password management while allowing admins to manage user roles and permissions effectively. The project leverages modern technologies such as JWT (JSON Web Tokens), bcrypt for password hashing, Multer for handling file uploads, and Prisma as the ORM for database management.

Key Features:

- User Registration and OTP Verification
- Login with JWT Authentication
- Forget Password and OTP-based Reset
- Role-based Access Control (RBAC) for Admins
- File Uploads using Multer

1. User Flow
1.1 Registration and OTP Verification

1. Registration: Users can register with their email, name, and password.
2. OTP Sending: After registration, an OTP is generated and sent to the user's email for account verification.
3. OTP Verification: The user needs to verify their email by submitting the OTP through the verify OTP API. Upon successful verification, the user’s account is activated.

1.2 Login and Profile Management

- Once the user verifies their account, they can log in by providing their email and password.
- After successful login, the system generates a JWT token that is used for subsequent authentication on protected routes.
- Users can manage their profiles after logging in, including updating personal details and changing their profile picture.

1.3 Forget Password

1. Request Forget Password: If the user forgets their password, they must first call the request forget password API. This will generate and send an OTP to their registered email.
2. Password Reset: The user must provide the email, OTP, and new password to reset the password via the forget password API.

2. Technologies Used

- bcrypt: Used for password hashing to ensure secure storage of user passwords.
- Multer: Utilized for handling file uploads, such as profile images.
- JWT (JSON Web Tokens): Provides secure authentication for users after login, enabling them to access protected routes.
- Prisma: ORM used for database interactions, allowing efficient querying and management of user and admin data.
- Node.js & Express: Backend framework to handle API routes, including user registration, OTP verification, login, and admin functionalities.
- Nodemailer: For sending OTPs and other email notifications to users.

3. Authentication Flow
3.1 User Registration

- POST /register: Registers a new user. The user must provide a valid email, name, and password. If the user already exists, an error is returned.
- After successful registration, an OTP is generated and sent to the user's email for verification.

3.2 OTP Verification

- POST /verify-otp: The user enters the OTP sent to their email for account verification. Once verified, they can proceed with login.

3.3 User Login

- POST /login: After OTP verification, users can log in by providing their email and password. If credentials are valid, a JWT is returned for subsequent authentication.

3.4 Forget Password

- POST /request-forget-password: Users request a password reset by providing their email. An OTP is sent to their email.
- POST /forget-password: Users submit the OTP received via email and their new password to reset their password.

4. Admin Section and Role-based Access Control (RBAC)
4.1 Super Admin Features

The super admin has full access to all modules and can manage all functionalities within the application.
1. Create New Admins: The super admin can create new admins by providing the necessary information.
2. Assign Modules and Permissions: The super admin can assign specific modules (e.g., User Management) to new admins and define permissions for each module.
   - Example: A new admin may have the "User Management" module permission to create or update user profiles but not to handle password resets.

4.2 Admin Permissions

Admins with specific roles and permissions can access only the modules they are assigned. This ensures a granular level of access control, providing more flexibility in managing the system.

5. Middleware and Error Handling
5.1 Middleware

Several middlewares are used for validation and error handling:
- File Validation (Multer Middleware): Ensures that only valid image files are uploaded.
- Email Validation: Ensures that email is in a valid format and that the user has not already registered.
- JWT Authentication: Protects routes by verifying the JWT token in headers to ensure that only authenticated users can access certain APIs.
- OTP Validation: Verifies the OTP entered by the user during registration, verification, or password reset.

5.2 Error Handling

The application uses a centralized error handler to catch and return meaningful error messages to the user, ensuring smooth user experience and debugging.

6. File Uploads

Profile image uploads are handled using Multer. The images are temporarily stored on the server and can be accessed or updated via the user profile API.

Installation

1. Clone the repository:
   git clone https://github.com/your-repo/project-name.git
   cd project-name

2. Install dependencies:
   npm install

3. Configure environment variables by creating a .env file in the root directory:
   DATABASE_URL="mysql://user:password@localhost:3306/database_name"
   JWT_SECRET="your_jwt_secret"
   JWT_REFRESH_SECRET="your_jwt_refresh_secret"
   OTP_EXPIRE_TIME=10 # OTP expiration time in minutes
   DIRECTORY_URL="path_to_directory"

4. Run database migrations:
   npx prisma migrate dev

5. Start the application:
   npm start

10. Conclusion

This project provides a secure and flexible user authentication system with OTP verification and password management features. It also includes a powerful admin panel with role-based access control, enabling super admins to manage users, roles, and permissions efficiently. With technologies like JWT, bcrypt, Prisma, and Multer, the system ensures high performance, security, and scalability.

