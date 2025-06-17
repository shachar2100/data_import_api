
# Leads Management System – Backend

This is a **Flask-based RESTful API** for managing user accounts and importing lead data from CSV files. It uses **Supabase** as the backend database.

---

## Project Structure

```
BackEnd/
├── app/
│   ├── __init__.py       # Initialize Flask app
│   ├── routes.py         # Define API routes
│   ├── config.py         # Store configuration values
│   └── import_data.py    # CSV file import logic
├── uploads/              # Temp storage for uploaded CSVs
├── requirements.txt      # List of Python dependencies
└── README.md             # Project documentation
```

---

## Features

### User Management

* Register new users with unique usernames
* Authenticate users via login
* Identify users with UUIDs

### Lead Management

* Import leads from CSV files with validation
* Store and retrieve leads by user
* Filter by fields like source, status, or interest level

### Storage & Infrastructure

* Use Supabase for persistent data storage
* Secure API key management
* Support for efficient querying and filtering

---

## API Endpoints

### User Endpoints

* `POST /user` – Register a new user
* `POST /login` – Log in with username and password

### Lead Endpoints

* `POST /<username>` – Upload and import a CSV of leads
* `GET /<username>` – Retrieve all leads (supports filters)

---

## Supabase Schema

### `Users` Table

| Field       | Type      | Notes                           |
| ----------- | --------- | ------------------------------- |
| uuid        | UUID      | Primary key                     |
| userName    | Text      | Unique                          |
| password    | Text      | Plaintext now, should be hashed |
| created\_at | Timestamp | Auto-generated                  |

### `Leads` Table

| Field                | Type      | Notes                      |
| -------------------- | --------- | -------------------------- |
| id                   | UUID      | Primary key                |
| created\_at          | Timestamp | Auto-generated             |
| user\_uuid           | UUID      | Foreign key to Users table |
| lead\_id             | Text      | External identifier        |
| lead\_name           | Text      |                            |
| contact\_information | Text      |                            |
| source               | Text      | e.g., Referral, Website    |
| interest\_level      | Text      | High/Medium/Low            |
| status               | Text      | Open/Closed/etc.           |
| salesperson          | Text      | Assigned rep               |

---

## Expected CSV Format

Your CSV file should include the following columns:

* Lead ID
* Lead Name
* Contact Information
* Source
* Interest Level
* Status
* Assigned Salesperson

---

## Security Measures

* Safe file uploads using `secure_filename`
* Temporary files auto-deleted after processing
* Input validation and UUID-based user identification

---

## Error Handling

The API handles errors such as:

* Invalid or missing CSV files
* Failed database connections
* Incorrect login credentials
* Schema or type validation failures

---

## Getting Started

1. Install Python 3.8 or higher
2. Set up a virtual environment:

   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```
4. Set environment variables:

   ```bash
   export FLASK_APP=app
   export FLASK_ENV=development
   ```
5. Run the Flask server:

   ```bash
   flask run
   ```

   The API will be accessible at ` http://127.0.0.1:5000`.

---

## Development Notes

To generate `requirements.txt`:

```bash
pip freeze > requirements.txt
```

---

## Priorities and Roadmap

### High Priority

* \[PUT] Create new users
* \[POST] CSV ingestion from file path or upload
* \[GET] Retrieve all leads per salesperson
* \[GET] Filter leads by fields (source, status, etc.)
* \[GET] Paginate large result sets

### Lower Priority

* \[POST] Login system improvements
* \[PUT] Add/edit salespeople

---

## Future Improvements

* Secure authentication (e.g., hashed passwords, tokens)
* Restrict CSV uploads to the authenticated user
* Enable lead updates and row editing
* Role-based access control for multi-user support


