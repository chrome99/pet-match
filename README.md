<div align="center">
  <img src="https://github.com/user-attachments/assets/de90a6f8-f43c-4e8f-bbb3-0caea89f266e" alt="Pet Match Logo" width="500" />
  <h1>Pet Match Web App</h1>
  
  [![Netlify Status](https://api.netlify.com/api/v1/badges/4bb04b6d-881a-4666-9dfc-f4a08562babe/deploy-status)](https://pet-match-app.netlify.app/)
  [![Docker Hub](https://img.shields.io/docker/image-size/chrome99/pet-match/frontend?label=Docker%20Hub&color=green)](https://hub.docker.com/repository/docker/chrome99/pet-match/general)

</div>

This project is a full-stack web application developed as the final project for the Israel Tech Challenge < itc > bootcamp. It showcases my abilities in Frontend and Backend development, and incorporates various technologies and features. The Pet Match application is designed to help pet lovers find their perfect companions. Whether you're looking to adopt, foster, or return a pet, the website provides an intuitive platform to connect with adorable pets in need of a loving home. The project is built using React, TypeScript, Node.js, and MongoDB. It utilizes additional libraries and services such as OpenAI for chatbot functionality, Socket.IO for real-time chat, Formik and Yup for form validation, Bootstrap for styling, and deployment on Netlify for the frontend and Heroku for the backend.

A live version of the Pet Match Website is available [here.](https://pet-match-app.netlify.app/)

https://github.com/user-attachments/assets/ca0e14c1-fed3-404b-9513-50adc2bd34bb

## Features

- **Homepage**: The homepage greets users with a modern and visually appealing interface. It features a responsive carousel that showcases the most recently added pets.

- **Search Page**: Explore various search criteria to refine your search and discover pets that match your preferences. The search results are presented in a paginated format, ensuring easy navigation and access to all available pets.

- **Contact Page with Virtual Assistant**: The Contact page provides a convenient chat interface where you can interact with a virtual assistant. Powered by the Open-AI GPT-3.5 model, the virtual assistant is capable of answering a wide range of questions, such as how to navigate the site, details about the adoption process, and more. In case you require further assistance, the chat can be seamlessly transferred to a human admin who will be happy to help.

- **Pet Profiles**: Clicking on a pet from the search results will take you to its detailed profile page. Get to know each pet personally through additional information, including breed, age, adoption status, etc. From the pet profile, you can take action by choosing to adopt, foster, or return a pet.

- **My Pets Page**: Keep track of your adopted or fostered pets through the "My Pets" page. This personalized section allows you to view the pets you have welcomed into your home. Additionally, you can maintain a Wishlist of pets you're interested in, making it easier to find them later.

- **Profile Page**: The profile page enables you to edit and manage your personal information. Update your details and ensure that your profile accurately reflects your personal information and contact information.

- **Dashboard for Admins**: Admins have access to a dashboard that allows them to monitor user and pet activity on the site. From the dashboard, admins can view all registered users, manage their administrative privileges, and oversee the entire pet collection. Admins have the authority to edit pet details, add also add new pets.

## Technologies Used

- **Frontend**: React, TypeScript, Socket.IO, Formik, Yup, Bootstrap.

- **Backend**: Node.js, MongoDB (with Mongoose), OpenAI, Socket.IO, Cloudinary, Multer, Jsonwebtoken, Bcrypt.

## Installation and Setup

Clone the repository:

```sh
git clone https://github.com/chrome99/pet-match.git
cd pet-match
```

### Run with Docker Compose

```sh
docker compose up -d
```

### Run Locally

```sh
echo "URI=mongodb://mongodb:27017/petAdoption" >> backend/.env
docker compose up -d mongodb
cd frontend && npm install && npm start &
cd ../backend && npm install && yarn dev
```

### Default credentials (Local only)

- **Admin:**
  - **Username:** a@a.com
  - **Password:** 123123Az

- **Client:**
  - **Username:** b@b.com
  - **Password:** 123123Az




