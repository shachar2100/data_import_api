# Leads Management System Frontend

A modern React-based FrontEnd for managing leads and customer data. This application provides a user-friendly interface for importing, viewing, and filtering lead information.

## Features

- **User Authentication**
  - Secure login system
  - User registration
  - Session management

- **Lead Management**
  - Drag-and-drop CSV file import
  - Interactive data table
  - Column-based filtering
  - Real-time data updates

- **Modern UI/UX**
  - Material-UI components
  - Responsive design
  - Intuitive navigation
  - Visual feedback for user actions

## Getting Started

1. Make sure you have Node.js installed on your system
2. Navigate to the FrontEnd directory:
   ```bash
   cd FrontEnd
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## Usage

1. **Login/Create Account**
   - Use the login form to access your account
   - New users can create an account using the "Create Account" tab

2. **Importing Data**
   - Click the "Import CSV" button
   - Drag and drop your CSV file or click to browse
   - The system will automatically process and import your data

3. **Viewing and Filtering Data**
   - View all leads in the interactive table
   - Use the filter icons in column headers to filter data
   - Multiple filters can be applied simultaneously

4. **Logout**
   - Click the logout button in the top-right corner to end your session

## CSV File Format

The system expects CSV files with the following columns:
- Lead ID
- Lead Name
- Contact Information
- Source
- Interest Level
- Status
- Assigned Salesperson

## Technical Stack

- React with TypeScript
- Material-UI for components
- Axios for API communication
- React Router for navigation
