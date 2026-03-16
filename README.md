## PORTFOLIO
A full-stack developer portfolio application that showcases projects, professional experience, and technology stack.

The portfolio includes a dynamic **admin dashboard** that allows managing projects, experiences, technologies, and social links without modifying code.

This project is built using **React / Next.js for the frontend**, **Node.js & Express for the backend**, and **PostgreSQL for the database**.

---

## Live Demo

https://your-portfolio-url.com

---

# Features

* Dynamic portfolio website
* Admin dashboard for managing portfolio content
* Add / Edit / Delete projects
* Manage tech stack for each project
* Experience section with multiple bullet points
* Social links management
* Featured projects support
* RESTful API backend
* PostgreSQL relational database
* Clean modular backend architecture

---

# Tech Stack

## Frontend

* React / Next.js
* Tailwind CSS
* Axios

## Backend

* Node.js
* Express.js
* REST API

## Database

* PostgreSQL

## Authentication

* JWT (JSON Web Tokens)

---

# Installation

## 1. Clone Repository

```
git clone https://github.com/yourusername/guru-saini-portfolio.git
cd guru-saini-portfolio
```

---

# Backend Setup

Navigate to backend folder

```
cd backend
```

Install dependencies

```
npm install
```

Create environment file

```
.env
```

Add the following variables

```
PORT=YourPort
DATABASE_URL=urlofdatabasse
JWT_SECRET=your_secret_key
```

Start backend server

```
npm run dev
```

### Create Admin User

Use Thunder Client / Postman

```
POST http://hosturl:port/admin/createAdmin
```

Request Body

```
{
  "email": "SainiMakul",
  "password": "123456",
  "name": "Makul Saini"
}
```

---

# Frontend Setup

Navigate to frontend folder

```
cd frontend
```

Install dependencies

```
npm install
```

Create environment file

```
.env.local
```

Add API URL

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Run frontend

```
npm run dev
```

Application will run on

```
http://localhost:3000
```
```
http://localhost:3000/admin
```

---

# Database Setup

Create PostgreSQL database

```
portfolio_db
```

Example tables used in the project

* admin
* projects
* project_technologies
* experiences
* experience_points
* social_links

You can create tables by running the qrey file provided.

**Makul Saini**
Full Stack Developer

GitHub
https://github.com/Sainimakul

Email
[makulsaini9222@@gmail.com](mailto:makulsaini9222@gmail.com)
