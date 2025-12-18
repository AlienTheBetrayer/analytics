
# Analytics

A **full-stack analytics platform** built from scratch using **Next.js, React, TypeScript, SQL, and a custom SDK**.  
Designed as a **secure, production-grade, view-only analytics dashboard** with a private admin-level backend.

This project collects analytics data from multiple external services and websites into a single centralized dashboard, using a **self-authored npm SDK** and a **custom authentication system with token rotation**.

![Showcase image with meteors, dashboard and authentication](https://raw.githubusercontent.com/AlienTheBetrayer/analytics/refs/heads/main/readme/images/front.png)

----------

## 🚀 Tech Stack

**Frontend**

-   Next.js (App Router)
-   React
-   TypeScript
    
-   Tailwind CSS
    
-   Context API & Providers
    
-   Custom hooks & reusable UI components
    

**Backend**

-   Next.js API routes (server-only logic)
    
-   SQL (via Supabase / Postgres)
    
-   Custom authentication system
    
-   Secure cookie-based sessions
    
-   Token rotation (access + refresh tokens)
    

**SDK**

-   Custom npm packages:
    
    -   `@alienthebetrayer/analytics-sdk-core`
        
    -   `@alienthebetrayer/analytics-sdk-react`
        
-   Typed API client
    
-   React Provider abstraction
    
-   Event-based analytics API
    

----------

## 📚 Libraries / Additional

-   Axios (HTTP client, SDK + server communication)
    
-   Supabase (database & server client)
    
-   Tailwind CSS (design system)
    
-   TypeScript strict mode
    
-   npm workspaces (monorepo setup)
    
-   Custom CORS handling
    
-   Custom middleware
    

----------

## 🧠 Engineering Principles

This project intentionally follows **real-world engineering practices**, not tutorial shortcuts.

-   **Security-first**
    
    -   HttpOnly cookies
        
    -   Access & refresh token rotation
        
    -   Server-side session validation
        
    -   Protected routes & middleware
        
    -   CORS-aware API design
        
-   **Scalability**
    
    -   Analytics ingestion separated from dashboard UI
        
    -   SDK-based event collection
        
    -   Clear separation of concerns (core vs react SDK)
        
    -   Database normalization & aggregation tables
        
-   **Maintainability**
    
    -   Strong TypeScript typing across frontend, backend, and SDK
        
    -   Reusable components and hooks
        
    -   Clear folder structure
        
    -   Self-documented code with JSDoc
        
-   **Ownership**
    
    -   No auth libraries
        
    -   No analytics libraries
        
    -   No SDK boilerplates  
        Everything critical is implemented manually and understood end-to-end.
        

----------

## 📸 Project Overview

### 1. Dashboard

-   View-only analytics dashboard
    
-   Project-level and event-level insights
    
-   Aggregated metrics (e.g. page views)
    
-   Fast server-side data fetching
    
-   Clean, minimal UI with Tailwind
![Dashboard with projects and events](https://raw.githubusercontent.com/AlienTheBetrayer/analytics/refs/heads/main/readme/images/dashboard.png)

### 2. Authentication

-   Fully custom authentication system
    
-   Access tokens + refresh tokens
    
-   Automatic token refresh
    
-   Server-side rotation & invalidation
    
-   Secure logout & session handling
![Secure authentication with server-side token refreshing](https://raw.githubusercontent.com/AlienTheBetrayer/analytics/refs/heads/main/readme/images/login.png)

> Only authorized users can view analytics.  
> Admin-level operations (delete projects, events, etc.) are intentionally restricted to internal tooling.

----------

## ✅ Final Notes

This project was **designed, implemented, and iterated rapidly**, focusing on **depth of understanding rather than reliance on libraries**.

In a short timeframe, this evolved from:

-   basic API routes  
    → to a **secure auth system**  
    → to a **custom analytics backend**  
    → to a **published npm SDK**  
    → to a **production-style full-stack application**
   
 