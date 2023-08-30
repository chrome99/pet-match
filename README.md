# Pet Match Website

This project is a full-stack web application developed as the final project for the Israel Tech Challenge < itc > bootcamp. It showcases my abilities in Frontend and Backend development, and incorporates various technologies and features. The Pet Match application is designed to help pet lovers find their perfect companions. Whether you're looking to adopt, foster, or return a pet, the website provides an intuitive platform to connect with adorable pets in need of a loving home. The project is built using React, TypeScript, Node.js, and MongoDB. It utilizes additional libraries and services such as OpenAI for chatbot functionality, Socket.IO for real-time chat, Formik and Yup for form validation, Bootstrap for styling, and deployment on Netlify for the frontend and Heroku for the backend.

A live version of the Pet Match Website is available [here.](https://pet-adoption-yhs3hgb6ly.netlify.app/)

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

To run the Pet Match Website locally, follow these steps:

1. Clone both the frontend repository and backend repository from GitHub.

For the frontend:

`git clone https://github.com/chrome99/pet-match-fe.git`

For the backend:

`git clone https://github.com/chrome99/pet-match-be.git`

2. Install the necessary dependencies for the frontend and backend, using the command: `npm install`
3. Start the frontend server using: `npm start`. If you are making any changes, you should also make sure to remind the typescript compiler to watch all files with: `tsc -w`. The server will run by default at port 3000.
4. Start the backend server using `yarn dev`. The server will run by default at port 8080.
5. Access the application in your web browser at http://localhost:3000.

## Want to try some _cool admin features?_

To get access to features that are only available for admins visiting the site (dashboard, giving technical support to customers), please open a new request at the contact page, click on the "Transfer to Human" Button, and I will attend to your request (and possibly make you an admin).

## Contribution Guidelines

If you wish to contribute to the Pet Match website, please follow these guidelines:

- Submit bug reports, feature requests, or pull requests through the appropriate channels.
- Ensure that your contributions align with the project's coding standards and best practices.
- Provide clear and detailed explanations of your changes or additions.

## Acknowledgements

I would like to express my heartfelt gratitude to ITC for providing me with the knowledge and opportunity to create this project. Special thanks to the instructors and mentors who guided me throughout the development process. Your patient guidance and incredible support has helped me overcome any challenge I encountered during the development process!

## Get in Touch

If you have any questions, feedback, or need support, please feel free to reach out. You can contact me at efeldman207@gmail.com.

Thank you for your interest in this project, and I hope you enjoy exploring the Pet Match Website!
