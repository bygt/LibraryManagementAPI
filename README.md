# Library Management System API

This project provides an API for a library management system. Users can borrow books, return books, and rate books through this API.

## Features

- User Management: Users can be created and retrieved.
- Book Management: Books can be created and retrieved.
- Borrowing and Returning Books: Users can borrow books and return books.
- Rating Books: Users can rate books on a scale of 1 to 5.

## Technologies Used

- Node.js: Backend server environment.
- Express.js: Web application framework for Node.js.
- Sequelize: Promise-based Node.js ORM for database management.
- MySQL: Relational database management system.

### Prerequisites

- Node.js 
- MySQL 

### Installation

1. Clone this repository to your local machine:

```bash
git clone https://github.com/bygt/library-management-api
```

2. Navigate to the project directory:

```bash
cd library-management-api
```

3. Install dependencies by running the following command:

```bash
npm install
```

4. Create the database. This project was developed with MySQL.

5. Configure environment variables:

```bash
cp .env.example .env
```

Open the `.env` file and fill in the required information for the database connection.

6. Start the application by running the following command:

```bash
npm start
```

## Usage

Using the API, users can perform various operations related to users, books, and transactions.

### User Operations

- **Get All Users:** `GET /users`
- **Get a Specific User:** `GET /users/:user_id`
- **Create a New User:** `POST /users`
    - Request Body:
      ```json
      {
        "username": "username"
      }
      ```

### Book Operations

- **Get All Books:** `GET /books`
- **Get a Specific Book:** `GET /books/:book_id`
- **Create a New Book:** `POST /books`
    - Request Body:
      ```json
      {
        "book_name": "book_name"
      }
      ```

### Borrowing and Returning Books

- **Borrow a Book:** `POST /users/:user_id/borrow/:book_id`
- **Return a Book:** `POST /users/:user_id/return/:book_id`

### Rating a Book

- **Rate a Book:** `POST /users/:user_id/rate/:book_id/score/:score`

## Contributing

To contribute, please open an issue or send a pull request.
