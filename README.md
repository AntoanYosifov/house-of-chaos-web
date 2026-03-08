# House of Chaos

A modern e-commerce platform for antiques and collectibles. Clean design, smooth interactions, and a focus on user experience.

<img width="1920" height="1080" alt="House of Chaos - Home Page" src="https://github.com/user-attachments/assets/6feaf1c5-1745-4f48-8512-8a47d3e9cf55" />

## What's This?

This is the frontend for an antiques marketplace I built to practice modern Angular patterns. It connects to a Spring Boot backend that handles auth, orders, and products. The whole thing uses JWT tokens (access + refresh) to keep sessions secure without storing sensitive data client-side.

## Tech Stack

Built with **Angular 20** and fully standalone components—no modules, just clean, composable pieces. TypeScript throughout, reactive forms, and RxJS for handling async flows. The routing includes lazy loading and guards for protected routes.

**Key dependencies:**
- Angular 20.3.x
- TypeScript 5.9
- RxJS 7.8

## Features Worth Mentioning

**Authentication & Guards**  
Login and registration with JWT tokens. Access tokens expire quickly, refresh tokens keep you logged in. Protected routes redirect unauthorized users to a 404 instead of exposing what's behind them.

**Shopping Experience**  
Browse products by category, check out new arrivals and top deals. Add items to your cart with real-time quantity validation. Each product has a details page with image galleries and user reviews.

**Orders & Profile**  
Place orders with saved addresses (or add new ones). Track your orders with status cards—new, confirmed, or cancelled. Complete your profile with shipping details so checkout is instant next time.

**Reviews System**  
Write reviews for products you're interested in. Only your own reviews show a delete button. The review panel slides up from the bottom without obscuring the product itself.

**Admin Panel**  
Manage products, categories, and users. Create and edit products with image uploads handled by the backend (Cloudinary). Admins get a dedicated dashboard with quick access to management tools.

**Error Handling**  
Custom 404 page for invalid routes. Generic 500 error page for unexpected server issues (without leaking backend details). HTTP interceptors catch and redirect errors globally.

## Image Uploads

Product images are uploaded via the backend: the frontend sends the image file with the create-product request, and the backend stores it using **Cloudinary**. Image URLs returned by the API are served through Cloudinary’s CDN.

## Running Locally

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm start
```

The app runs on `http://localhost:4200` by default. Make sure the backend API is running on `http://localhost:8080` (or update the service URLs if it's elsewhere).

## What I Learned

This project helped me get comfortable with Angular's standalone API and signals. I practiced composition patterns (breaking UI into small, reusable components), reactive forms with custom validators, and HTTP interceptors for auth and error handling. The routing setup taught me how to handle guards, lazy loading, and wildcard routes properly.

---

Built as a learning project. The backend is a separate Spring Boot app with a microservices architecture for reviews.
