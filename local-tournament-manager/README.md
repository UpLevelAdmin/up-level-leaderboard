# Local Tournament Manager

A lightweight, local-first web application to manage Swiss tournaments and sync results to Google Sheets.

## 🚀 Setup & Installation

1.  **Install Node.js**: Ensure you have Node.js installed on your computer.
2.  **Install Dependencies**: Open a terminal in this folder and run:
    ```bash
    npm install
    ```
3.  **Start the App**:
    ```bash
    npm start
    ```
4.  **Open in Browser**: Go to `http://localhost:3000`.

## 🛠 Features

*   **Fast & Local**: All calculations happen instantly on your machine.
*   **Player Management**: Add players, drop/undrop them anytime.
*   **Swiss Pairings**: Automatically generates pairings based on points (Simplified Swiss for V1).
*   **Live Standings**: Instant leaderboard updates as you enter match results.
*   **Cloud Sync**: Push your local data to Google Sheets (Standings & Pairings sheets) with one click.

## 🔑 Google Sheets Sync Setup

To use the Sync feature, you need a Google Cloud Service Account:

1.  Go to [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a Project > Create a **Service Account**.
3.  Create a **JSON Key** for that service account and download it.
4.  Open the file, you will need the `client_email` and `private_key`.
5.  **Important**: Share your Google Sheet with the `client_email` address (Give 'Editor' permission).
6.  In the app, click **Settings** and paste your Sheet ID (from the URL), Email, and Private Key.

## 📁 Data Storage

All data is saved automatically to `data/tournament_data.json`.
*   You can back up this file anytime.
*   If you want to reset the tournament, simply delete this file or rename it.
