# 🏛️ BCS Department Notice Board Management Panel

This is a faculty-facing web application designed to manage and publish notices directly to a Google Sheet, which can then be displayed on a public-facing student notice board (or another client application). The system is built using vanilla HTML/CSS/JavaScript for the frontend and Google Apps Script as a serverless backend.

## ✨ Features

* **Faculty Login:** Secure login using hardcoded or Google Sheet-based credentials (demonstrated using hardcoded check in the final JS).
* **Session Management:** Uses browser `localStorage` to maintain the login session.
* **CRUD Operations:**
    * **Create:** Add new notices with detailed fields (Title, Content, Teacher, Subject, Division, Year).
    * **Read:** Fetch and display all current notices with a "Latest First" view.
    * **Delete:** Remove existing notices directly from the management panel.
* **Responsive UI:** Fully responsive design ensures the management panel and the Add Notice modal look great on desktop and mobile devices.
* **Modal Form:** Clean, dedicated modal/popup for adding new notices, improving user focus.
* **Data Integrity:** Uses `<select>` dropdowns for Division and BCS Year to ensure consistent data input.
* **Loading Feedback:** Integrated loading spinner for seamless user experience during network operations (login, add, delete, fetch).

## 🛠️ Technologies Used

* **Backend:** Google Apps Script (GAS)
* **Database:** Cloud Server
* **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)

## 🔑 Usage and Credentials

The application uses hardcoded credentials for demonstration purposes (checked in the JavaScript file, not the backend).

### Using the Panel:

1.  **Login:** Enter the credentials above.
2.  **Add Notice:** Click the **`Add New Notice`** button to open the modal. Fill in all fields (Teacher, Subject, Division, Year, etc.).
3.  **Submit:** The data is sent to the Google Sheet. A success message appears, and the list of current notices refreshes automatically.
4.  **Delete:** Use the **`Delete`** button next to any notice to remove it permanently from the Google Sheet.
<br><br>
<center>
<small><b>
 &copy;2025 NCKBCS | All Rights Reserved</small>
 </b></center>
