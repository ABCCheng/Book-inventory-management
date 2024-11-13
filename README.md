
# Book Inventory Management

This project is a web application for managing a book inventory. It allows users to add, view, filter, and export book data in a user-friendly interface.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Installation](#installation)
5. [Usage](#usage)
6. [API Endpoints](#api-endpoints)
7. [Project Structure](#project-structure)
8. [Future Enhancements](#future-enhancements)
9. [Contributing](#contributing)
10. [License](#license)

---

## Project Overview

The Book Inventory Management System is designed to help users manage a collection of books. Users can add new books with details such as title, author, genre, publication date, and ISBN. The system also supports filtering the inventory based on specific criteria and exporting the book list to CSV.

## Features

- **Add Books**: Enter new book details and add them to the inventory.
- **Filter Books**: Search for books by title, author, genre, or publication date.
- **View Book List**: Display all books in a paginated table format.
- **Export Data**: Export the book inventory in CSV format for easy backup or transfer.

## Tech Stack

- **Frontend**: Vue.js with Element UI for styling and form components
- **Backend**: Node.js with Express
- **Database**: MySQL
- **Other Libraries**: Body-Parser, CORS

## Installation

### Prerequisites

- **Node.js** (v14 or higher)
- **MySQL** (v5.7 or higher)

### Step 1: Clone the Repository

```bash
cd book-inventory-management
```

### Step 2: Backend Setup

1. Navigate to the backend folder:

   ```bash
   cd backend
   ```

2. Install backend dependencies:

   ```bash
   npm install
   ```

3. Configure the database:

   - Create a MySQL database for the project.
   - Modify the database variables:
        
    // create MySQL connector
    const db = mysql.createConnection({
      host: '',
      port: '',
      user: '',
      password: '',
      database: ''
    });

4. Create the database table by running the following SQL commands:

   ```sql
   CREATE TABLE inventory (
     id INT AUTO_INCREMENT PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     author VARCHAR(255) NOT NULL,
     genre VARCHAR(100),
     publication_date DATE,
     isbn VARCHAR(13) UNIQUE
   );
   ```

5. Start the backend server:

   ```bash
   npm start
   ```

   The backend server will run on `http://localhost:5000`.

### Step 3: Frontend Setup

1. Open a new terminal, navigate to the frontend folder:

   ```bash
   cd frontend
   ```

2. Install frontend dependencies:

   ```bash
   npm install
   ```

3. Start the frontend development server:

   ```bash
   npm run serve
   ```

   The frontend server will run on `http://localhost:8080`.

---

## Usage

1. **Add Books**: Use the "Add New Book" form to input book details and click "Add Book" to save it to the inventory.
2. **Filter Books**: Use the filter form to specify criteria and display books that match the criteria.
3. **View Book List**: The list of books will be displayed in a paginated table with sorting options.
4. **Export Data**: Click the "Export to CSV" button to download the inventory data in CSV format.

---

## API Endpoints

### **POST /books**

Adds a new book to the inventory.

- **Request Body**: JSON with `title`, `author`, `genre`, `publicationDate`, and `isbn`.

### **GET /books**

Fetches all books or filters them based on query parameters.

- **Query Parameters** (optional):
  - `title`
  - `author`
  - `genre`
  - `publicationDate`

### **GET /books/export/csv**

Exports the inventory in Json/CSV format.

---

## Project Structure

```plaintext
book-inventory-management
├── backend
│   ├── server.js
│   └── package.json
├── frontend
│   ├── public
│   │   └── indexl.html
│   ├── src
│   │   ├── App.vue
│   │   ├── Home.vue
│   │   └── main.js
│   ├── package.json
│   └── vue.config.js
└── README.md
```

---

## Future Enhancements

- **Pagination**: Add pagination to the book list for easier navigation through large datasets.
- **User Authentication**: Implement user accounts and login functionality.
- **Additional Export Formats**: Support export in other formats, such as PDF.
- **Book Cover Images**: Allow users to upload cover images for each book.

## Contributing

Contributions are welcome! If you'd like to contribute, please fork the repository and create a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

Enjoy using the Book Inventory Management System!
