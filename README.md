# Leads Management System

A full-stack web application for managing sales leads, built with **Flask (backend)** and **React (frontend)**. The system allows users to register, upload CSV files of leads, and interactively view and filter those leads through a modern UI. Data is stored securely using **Supabase**.

---

## Overview

This project consists of two main components:

### 1. Backend – Flask API

* Handles user authentication and lead ingestion
* Validates and stores data in Supabase
* Provides endpoints for login, registration, CSV import, and lead retrieval
  ➡ See [`BackEnd/README.md`](./BackEnd/README.md) for full details

### 2. Frontend – React App

* Provides an interactive dashboard for users
* Supports CSV drag-and-drop import, filtering, and session management
* Uses Material-UI and Axios for a modern experience
  ➡ See [`frontend/README.md`](./frontend/README.md) for full details

---

## Key Features

* Secure user authentication and session handling
* CSV file upload and parsing
* Dynamic lead filtering by multiple fields
* Paginated and searchable data tables
* Supabase integration for scalable storage
* Fully responsive and modern UI

---

## Requirements

* Python 3.8+ for backend
* Node.js 16+ for frontend
* Supabase project with appropriate tables

---

## Getting Started

Clone the repo:

```bash
git clone https://github.com/your-org/leads-management-system.git
cd leads-management-system
```

Follow setup instructions in:

* [`BackEnd/README.md`](./BackEnd/README.md) for backend
* [`frontend/README.md`](./FrontEnd/README.md) for frontend

---

## Deployment

You may deploy each component independently:

* Backend: Flask + Gunicorn on a platform like Heroku, GCP, or AWS
* Frontend: Vercel, Netlify, or any static hosting service
* Connect both components via environment-based configuration for API URLs

## Screenshots

### User Interface

![Login Screen](./images/Login_Page.png)
*Login interface with user authentication*

![Dashboard](./images/Once_Logged_In.png)
*Main dashboard showing leads and filtering options*

![CSV Import](./images/Import_CSV.png)
*Drag-and-drop CSV import interface*

![Lead Management](./images/Filter.png)
*Interactive lead management table with filtering*


![Lead Management](./images/Alice_Medium.png)
*Intrest Level == Medium and SalesPerson==Alice Filered*




