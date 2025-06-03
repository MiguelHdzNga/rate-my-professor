# Rate My Professor ITESO

This project was developed as a final assignment for a university course. It was created in collaboration with classmates as part of our coursework. The application allows users to rate and review professors, and was built for educational purposes only.

A web application for rating and reviewing professors at ITESO. The project consists of a Node.js/Express backend and a vanilla JavaScript/HTML/CSS frontend.

## Project Structure

```
BACKEND/
  package.json
  server.mjs
FRONTEND/
  agregarProfesor.html
  home.html
  perfiles.html
  rateMyProfessor.html
  Font/
    SigmarOne-Regular.ttf
  images/
    1354.jpg
    22.png
    school.png
  lottie/
    student.json
  scripts/
    agregarProfe.js
    home.js
    modals.js
    perfiles.js
    review.js
  styles/
    estilos.css
    style.css
```

## Features

- Register and log in as a student
- Add new professors
- Search and filter professors by department
- View professor profiles with ratings, difficulty, and comments
- Submit reviews and ratings for professors

## Setup

### Backend

1. Go to the `BACKEND` directory:
    ```sh
    cd BACKEND
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Start the server:
    ```sh
    node server.mjs
    ```
   The backend will run on `http://localhost:3000`.

### Frontend

1. Open the `FRONTEND` directory.
2. Open `home.html` in your browser to start using the app.

> **Note:** The frontend expects the backend to be running locally on port 3000.

## Usage

- **Home Page:** Search for professors, filter by department, and view summary ratings.
- **Register/Login:** Use the modals to create an account or log in.
- **Add Professor:** Use the "Agregar Profesor" page to add new professors.
- **Rate Professor:** Go to a professor's profile and click "Calificar a este profesor" to submit a review.

## Technologies

- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Frontend:** HTML, CSS, JavaScript (vanilla), Bootstrap

## License

This project is for educational purposes.

---

Feel free to improve or expand this README as your project evolves!