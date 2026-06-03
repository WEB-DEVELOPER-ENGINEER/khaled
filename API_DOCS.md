# Sign2GPT Mobile API Documentation

Welcome to the Sign2GPT Backend API Documentation. This guide provides all necessary details for mobile developers to integrate with the backend services, including authentication, level progression, and AI-powered sign language recognition.

## Global Configurations

- **Base URL**: `https://<your-backend-domain>/api` (Replace with your actual deployed URL)
- **Standard Content-Type**: `application/json`
- **File Upload Content-Type**: `multipart/form-data`
- **Video Upload Limits**: Maximum 50MB per file. Supported formats: `.mp4`, `.avi`, `.mov`, `.webm`.
- **Authentication**: Most routes are protected and require a JSON Web Token (JWT) sent in the request header:
  ```http
  Authorization: Bearer <your_jwt_token>
  ```

---

## 1. System Health

### Check Server Status
Verify if the main Node.js backend is running.

- **Endpoint**: `GET /health` (Note: No `/api` prefix)
- **Auth Required**: No
- **Success Response** (`200 OK`):
  ```json
  {
    "status": "ok",
    "message": "Server is running"
  }
  ```

---

## 2. Authentication Endpoints

### Register User
Registers a new user and triggers a verification email.

- **Endpoint**: `POST /auth/signup`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Success Response** (`201 Created`):
  ```json
  {
    "success": true,
    "message": "Registration successful! Please check your email to verify your account."
  }
  ```
- **Error Responses**: 
  - `400 Bad Request`: `User already exists with this email`

### Verify Email
Verifies a user's email using the token sent to their inbox.

- **Endpoint**: `GET /auth/verify/:token`
- **Auth Required**: No
- **Parameters**: `token` (URL path parameter, valid for 24 hours)
- **Success Response** (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Email verified successfully!",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: `Invalid or expired verification token`

### Login User
Authenticates a user and returns a JWT token for session management.

- **Endpoint**: `POST /auth/login`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Success Response** (`200 OK`):
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "60d0fe4f5311236168a109ca",
      "email": "user@example.com"
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: `Please provide email and password`
  - `401 Unauthorized`: `Invalid credentials` or `Please verify your email before logging in`

---

## 3. Levels & Vocabulary

### Get All Levels
Retrieves the available sign language learning levels and their total word counts.

- **Endpoint**: `GET /levels`
- **Auth Required**: Yes
- **Success Response** (`200 OK`):
  ```json
  {
    "success": true,
    "levels": [
      {
        "id": "A1",
        "name": "A1",
        "wordCount": 17
      },
      {
        "id": "A2",
        "name": "A2",
        "wordCount": 16
      }
    ]
  }
  ```

### Get Level Words
Retrieves the vocabulary list and instructional video URLs for a specific level.

- **Endpoint**: `GET /levels/:levelId`
- **Auth Required**: Yes
- **Parameters**: `levelId` (e.g., `A1`, `B2`)
- **Success Response** (`200 OK`):
  ```json
  {
    "success": true,
    "level": "A1",
    "words": [
      {
        "word": "can",
        "url": "https://youtu.be/K3i9xrw5ur0?si=MKtwCIsXU5e6EaII"
      },
      {
        "word": "drink",
        "url": "https://youtu.be/x0dMDwKktGg?si=ZgUE0EEF6R8zHY48"
      }
    ]
  }
  ```
- **Error Responses**:
  - `404 Not Found`: `Level not found`

---

## 4. AI Video Submissions

All endpoints in this section require sending a video file via `multipart/form-data`. 

### Verify Sign Attempt (Practice Mode)
Uploads a video to compare the user's sign against a specific expected word.

- **Endpoint**: `POST /submissions/verify`
- **Auth Required**: Yes
- **Content-Type**: `multipart/form-data`
- **Form Data Fields**:
  - `video` (File): The video recording of the user.
  - `expectedWord` (Text): The word the user is attempting to sign (e.g., "apple").
- **Success Response** (`200 OK`):
  ```json
  {
    "success": true,
    "isMatch": true,
    "expectedWord": "apple",
    "predictedWord": "apple",
    "confidence": 0.95,
    "allPredictions": [
      { "class_name": "apple", "confidence": 0.95 },
      { "class_name": "orange", "confidence": 0.02 }
    ]
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: `Please upload a video file` or `Expected word is required`

### Get Supported AI Classes
Retrieves the full list of 100 sign language words supported by the AI model.

- **Endpoint**: `GET /submissions/classes`
- **Auth Required**: Yes
- **Success Response** (`200 OK`):
  ```json
  {
    "success": true,
    "classes": [
      "hello",
      "world",
      "apple",
      "drink"
    ]
  }
  ```

### Free-Form Prediction (English)
Translates a sign language video into English without requiring an expected word.

- **Endpoint**: `POST /submissions/predict`
- **Auth Required**: Yes
- **Query Parameters**: `?top_k=5` (Optional, defaults to 5. Limits the number of returned predictions).
- **Content-Type**: `multipart/form-data`
- **Form Data Fields**:
  - `video` (File): The video recording of the user.
- **Success Response** (`200 OK`):
  ```json
  {
    "success": true,
    "predictions": [
      { "class_name": "hello", "confidence": 0.98 },
      { "class_name": "world", "confidence": 0.01 }
    ]
  }
  ```

### Free-Form Prediction (English & Arabic)
Translates a sign language video into both English and Arabic without requiring an expected word.

- **Endpoint**: `POST /submissions/predict-ar`
- **Auth Required**: Yes
- **Query Parameters**: `?top_k=5` (Optional, defaults to 5).
- **Content-Type**: `multipart/form-data`
- **Form Data Fields**:
  - `video` (File): The video recording of the user.
- **Success Response** (`200 OK`):
  ```json
  {
    "success": true,
    "predictions": [
      {
        "class_name_en": "hello",
        "class_name_ar": "مرحبا",
        "confidence": 0.98
      }
    ]
  }
  ```
