# Markdown Notes Backend (WIP - README outdated)

A backend service for a markdown-based note-taking application. This service provides user authentication, note and folder management. It currently uses SQLite as the database engine and is built with Express.js.

## Features

- **User Authentication**: Register and log in users with JWT-based authentication.
- **Note Management**: Create, read, update, and delete markdown notes.
- **Folder Hierarchy**: Organize notes into folders (including nested folders).
- **Security & Rate Limiting**: Basic security headers and rate limiting middleware.

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite
- **Authentication**: JWT
- **Logging**: Integrated logging (e.g., `logger`)
- **Rate Limiting**: `express-rate-limit`

## Prerequisites

- **Node.js** (v14 or higher recommended)
- **npm**
- **SQLite** (no additional server needed; uses local file-based database)
- A `.env` file containing at least:


```bash
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

## Installation

1. **Clone the repository**:
```bash
git clone https://github.com/your-username/markdown-notes-be.git
cd markdown-notes-be
```

2. **Install Dependencies**:
```bash
npm install

```

3. **Set up Environment Variables**: Create a `.env` file in the project root:
```bash
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

4. **Initialize Database**: The database will be automatically created and the necessary tables set up upon server start if they don't exist.

## Running the Server

```bash
npm start
```


## Authentication

- **JWT (JSON Web Tokens)** are used for authentication.
- Endpoints that require authentication must include an `Authorization` header
- Obtain a token via the `/auth/login` endpoint

## API Endpoints

### Auth Routes

**Base Path**: `/api/v1/auth`

- **POST `/register`**
    
    - **Description**: Registers a new user.
	- **Request Body**:
```json
{ 
  "email": "user@example.com", 
  "password": "your_password" 
}
```

- **Response**:
	
- **201 Created**: User registered successfully, returns a JWT token and a basic user info
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsIn",
  "user": {
    "id": "70e6e29f-1a90-4726-a1b6-176cb92dbfdd",
    "email": "user@example.com"
  }
}
```
	
- **409 Bad Request**: Registration failed: Email already exists.
- **400 Bad Request**: Invalid input.
- **500 Internal Server Error**: An unexpected error occurred on the server side while processing the request.**


- **POST `/login`**
    
    - **Description**: Logs in an existing user.
	- **Request Body**:
```json
{ 
  "email": "user@example.com", 
  "password": "your_password" 
}
```

- **Response**:
	
	- **200 OK**: Returns a JWT token and basic user info
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsIn",
  "user": {
    "id": "70e6e29f-1a90-4726-a1b6-176cb92dbfdd",
    "email": "user@example.com"
  }
}
```
	
- **400 Bad Request**: The request is malformed, such as missing `email` or `password` fields.
- **401 Unauthorized**: The provided credentials are incorrect (e.g., wrong password).
- **404 Not Found**: The user does not exist in the database (e.g., the given `email` is not registered).
- **500 Internal Server Error**: An unexpected error occurred on the server side while processing the request.


### Notes Routes

**Base Path**: `/api/v1/notes`  
**Authentication Required**: Yes (Send `Authorization: Bearer <token>`)

- **POST `/`**

- **Description**: Creates a new note.
- **Request Body**:
```json
{
  "title": "My Note",
  "content": "# Markdown content...",
  "folderId": "optional_folder_id"
}
```
- **Response**:
- **201 Created**: Note created successfully.
- **400 Bad Request**: Invalid input type.
- **401 Unauthorized**: Request user is missing
	- **500 Internal Server Error**: An unexpected error occurred on the server while processing the request.


- **POST `/:noteId`**

- **Description**: Updates an existing note.
- **Request Body**:
```json
{
  "title": "Updated Title", 
  "content": "# Updated markdown content" 
}
```
- **Response**:
- **200 OK**: Note updated.
- **400 Bad Request**: Invalid input type.
- **401 Unauthorized**: Request user is missing
- **404 Not Found**: Note not found
	- **500 Internal Server Error**: An unexpected error occurred on the server while processing the request.

- **GET `/`**

- **Description**: Retrieves an overview of all notes for the authenticated user. May include filters or sorting in the future.
- **Response**:
    - **200 OK**: Returns a list of notes (without detailed content)
```javascript
{
  id: 0,
  name: 'Root',
  children: [
  {
    id: '1',
    name: 'Folder 1',
    children: [
	  {
	    id: '2',
	    name: 'Folder 2',
	    children: [
		  {
		    id: '4',
		    name: 'Folder 4',
		    children: [],
		    notes: [{ id: '5', title: 'Note 5', folder_id: '4' }]
		  }
	    ],
	    notes: [{ id: '3', title: 'Note 3', folder_id: '2' }]
	  },
	  {
	    id: '3',
	    name: 'Folder 3',
	    children: [],
	    notes: [{ id: '4', title: 'Note 4', folder_id: '3' }]
	  }
    ],
    notes: [{ id: '2', title: 'Note 2', folder_id: '1' }]
  }],
  notes: [{ id: '1', title: 'Note 1', folder_id: null }]
};
```
 - **500 Internal Server Error**: An unexpected error occurred on the server while processing the request.

**DELETE `/:noteId`**

- **Description**: Soft-deletes a note.
- **Response**:
    - **200 OK**: Note deleted (marked as deleted in the database).
    - **404 Not Found**: Note not found.
    - **500 Internal Server Error**: An unexpected error occurred on the server while processing the request.


### Folders Routes

**Base Path**: `/api/v1/folders`  
**Authentication Required**: Yes

- **POST `/`**
    - **Description**: Creates a new folder.
    - **Request Body**:
```json
{
  "name": "Project Notes", 
  "parentFolderId": "optional_parent_folder_id"
}
```
- **Response**:
	- **201 Created**: Folder created.
	- **400 Bad Request**: Invalid input type.
	- **500 Internal Server Error**: An unexpected error occurred on the server while processing the request.

- **PUT `/:folderId`**
    
    - **Description**: Updates an existing folder (e.g., rename the folder).
    - **Request Body**:
```json
{
  "name": "Updated Folder Name"
}
```
- **Response**:
	- **200 OK**: Folder updated.
	- **400 Bad Request**: Invalid input type.
	- **404 Not Found**: Folder not found.
	- **500 Internal Server Error**: An unexpected error occurred on the server while processing the request.

- DELETE `/:folderId`
    
- **Description**: Soft-deletes a folder and all its descendant folders.
- **Response**:
	- **200 OK**: Folder and its descendants marked as deleted.
	- **404 Not Found**: Folder not found.
	- **500 Internal Server Error**: An unexpected error occurred on the server while processing the request.

## Database Structure

The database uses SQLite and contains the following tables:

- **Users**:
    
    - `id (TEXT, PRIMARY KEY)`
    - `email (TEXT, UNIQUE)`
    - `password (TEXT)`
    - `created_at (DATETIME, DEFAULT CURRENT_TIMESTAMP)`
    - `updated_at (DATETIME, DEFAULT CURRENT_TIMESTAMP)`
- **Folders**:
    
    - `id (TEXT, PRIMARY KEY)`
    - `name (TEXT, NOT NULL)`
    - `user_id (TEXT, NOT NULL, FOREIGN KEY -> users.id)`
    - `parent_folder_id (TEXT, NULL, FOREIGN KEY -> folders.id)`
    - `deleted (BOOLEAN, DEFAULT FALSE)`
    - `created_at (DATETIME, DEFAULT CURRENT_TIMESTAMP)`
    - `updated_at (DATETIME, DEFAULT CURRENT_TIMESTAMP)`
- **Notes**:
    
    - `id (TEXT, PRIMARY KEY)`
    - `title (TEXT, NOT NULL)`
    - `content (TEXT)`
    - `user_id (TEXT, NOT NULL, FOREIGN KEY -> users.id)`
    - `folder_id (TEXT, NULL, FOREIGN KEY -> folders.id)`
    - `deleted (BOOLEAN, DEFAULT FALSE)`
    - `created_at (DATETIME, DEFAULT CURRENT_TIMESTAMP)`
    - `updated_at (DATETIME, DEFAULT CURRENT_TIMESTAMP)`
- **Tags**:
    
    - `id (TEXT, PRIMARY KEY)`
    - `name (TEXT, NOT NULL)`
    - `user_id (TEXT, NOT NULL, FOREIGN KEY -> users.id)`
    - `deleted (BOOLEAN, DEFAULT FALSE)`
    - `created_at (DATETIME, DEFAULT CURRENT_TIMESTAMP)`
    - `updated_at (DATETIME, DEFAULT CURRENT_TIMESTAMP)`
- **NoteTags** (Many-to-Many Relationship Between Notes and Tags):
    
    - `note_id (TEXT, FOREIGN KEY -> notes.id)`
    - `tag_id (TEXT, FOREIGN KEY -> tags.id)`
    - **Primary Key**: `(note_id, tag_id)`

## Middleware

The project uses a custom middleware array (`enhance`) that applies rate limiting, security headers, and authentication checks to secured routes:

1. **Rate Limiting** (`limiter`):  
    Uses `express-rate-limit` to limit the number of requests a user can make within a time window (e.g., 10 requests per 15 minutes). 
    
2. **Security Headers** (`securityHeaders`):  
    Adds HTTP headers to improve security:
    
    - `X-Content-Type-Options: nosniff`
    - `X-Frame-Options: DENY`
    - `X-XSS-Protection: 1; mode=block`
    - `Strict-Transport-Security: max-age=31536000; includeSubDomains`
    
3. **Authentication** (`authenticateTokenMiddleware`):  
    Verifies the `Authorization: Bearer <token>` header. Decodes the JWT token and checks:
    
    - If it's properly signed.
    - If it's not expired.
    - If the user exists in the database.
    
    If validation fails, it returns `401 Unauthorized` or `403 Forbidden` as appropriate.
    

## License

MIT License.
