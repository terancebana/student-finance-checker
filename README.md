# Student Finance Tracker

A vanilla HTML, CSS, and JavaScript application designed to help students track their finances. This project was built to be fully responsive, accessible, and modular, without relying on any external frameworks.

## ✨ Features Implemented

* **Responsive UI**: Mobile-first design that adapts seamlessly to tablet and desktop screens.
* **CRUD Operations**: Create, Read, Update, and Delete transactions with a user-friendly modal form.
* **Persistent Data**: All transactions and settings are automatically saved to `localStorage`, so your data is never lost on refresh.
* **Data Management**: Export all data to a JSON file for backup, and import data from a valid JSON file.
* **Live Regex Search**: A powerful search bar that filters transactions in real-time using regular expressions. Includes a case-insensitivity toggle and highlights all matches.
* **Dashboard Analytics**: An at-a-glance view of total spending, transaction count, top spending category, and a budget cap status monitor.
* **Budget Cap**: Set a spending limit in the settings and receive live feedback on your budget status via ARIA live regions for screen readers.
* **Robust Form Validation**: All form inputs are validated using regex to ensure data integrity.
* **Full Accessibility (a11y)**: Built with semantic HTML, full keyboard navigation, visible focus states, a "skip-to-content" link, and ARIA attributes for an inclusive user experience.

## 🗂️ Regex Catalog

The following regular expressions are used for form validation:

1.  **Description**: `^\S(?:.*\S)?$`
    * **Purpose**: Forbids leading or trailing whitespace to keep data clean.
    * **Example**: Matches `"Good"`, rejects `"  Bad  "`.
2.  **Amount**: `^(0|[1-9]\d*)(\.\d{1,2})?$`
    * **Purpose**: Validates positive numbers with up to two decimal places.
    * **Example**: Matches `12.50` and `100`, rejects `05.00`.
3.  **Date**: `^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$`
    * **Purpose**: Enforces a strict `YYYY-MM-DD` format.
    * **Example**: Matches `2025-10-16`, rejects `2025-10-1`.
4.  **Advanced (Duplicate Words Search)**: `\b(\w+)\s+\1\b`
    * **Purpose**: An example search pattern to find accidental duplicate words using a back-reference (`\1`).
    * **Example**: Finds "the the" in a description like "Lunch at the the cafe".

## ⌨️ Keyboard Navigation Map

* **`Tab`**: Move focus to the next interactive element.
* **`Shift + Tab`**: Move focus to the previous element.
* **`Enter`**: Activate a focused button, link, or submit a form.
* **`Escape`**: Close the Add/Edit Transaction modal dialog.
* **`Space`**: Activate a focused button.

## ♿ Accessibility Notes

* **Semantic Landmarks**: Uses `<header>`, `<main>`, `<nav>`, and `<footer>` for clear page structure.
* **Focus Management**: A "skip-to-content" link is provided, and all interactive elements have a clear `:focus-visible` style.
* **ARIA Live Regions**: Budget status changes and confirmation messages are announced to screen readers to provide critical feedback.

## 🧪 How to Run Tests

The regular expression validators can be tested easily:
1.  Open the `tests.html` file in your browser.
2.  The results of the automated assertion tests will be displayed on the page.