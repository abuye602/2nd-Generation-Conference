# Daniel Initiative Event Registration

## Overview:

This is a web-based event registration system for the Daniel Initiative's Ignite Conference. The application allows participants to register for the event by submitting their personal information through a user-friendly form.

## Features

- Responsive design that works on both desktop and mobile devicesReal-time form validation for all input fields
- Submission to Google Apps Script backend for data processing
- Visual feedback with loading indicators and notifications
- Data validation to prevent duplicate registrations

## Technologies Used

- HTML5
- CSS3
- JavaScript (Vanilla)
- Google Apps Script (backend)
- Google Sheets (data storage)

## Usage

1. Fill out the registration form with your details:

   - Full Name
   - Email Address
   - Ministry or Church
   - Age
   - Number of Attendees

2. Click the "Register Now" button to submit your information
3. Wait for the confirmation notification

## Form Validation

- Name: Cannot contain numbers and must not be empty
- Email: Must be in a valid email format
- Ministry: Cannot be empty
- Age: Must be between 1 and 88
- Attendees: Must select an option from the dropdown

## Backend Integration

The form submits data to a Google Apps Script endpoint which:

- Validates the submission
- Checks for duplicate email addresses
- Stores the data in a Google Sheet
- Returns a JSON response with status information

## Development

To modify or extend this project:

1. Edit the HTML, CSS, or JavaScript files as needed
2. Test changes using a local development server (VS Code Live Server recommended)
3. Deploy updated files to your hosting provider
# 2nd-Generation-Conference
