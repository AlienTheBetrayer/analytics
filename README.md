
# Analytics

A **production-grade analytics platform** implemented using **Next.js, React, TypeScript, SQL, and a custom-built SDK**.

The system aggregates analytics events from multiple external services into a centralized, **view-only dashboard**, leveraging a **self-authored npm SDK** and a **custom authentication architecture with server-side token rotation**.

![Analytics Dashboard Showcase](https://raw.githubusercontent.com/AlienTheBetrayer/analytics/refs/heads/main/readme/images/front.png)

----------

## 🚀 Tech Stack

**Frontend**

-   Next.js (App Router)
    
-   React
    
-   TypeScript
    
-   Tailwind CSS
    
-   Context API, Providers, and custom hooks
    

**Backend**

-   Next.js API routes
    
-   SQL (Supabase / PostgreSQL)
    
-   Custom authentication layer
    
-   HttpOnly cookie-based sessions
    
-   Access and refresh token rotation
    

**SDK**

-   `@alienthebetrayer/analytics-sdk-core`
    
-   `@alienthebetrayer/analytics-sdk-react`
    
-   Strongly typed API client
    
-   React Provider abstraction
    

----------

## 📚 Libraries / Tooling

-   Axios
    
-   Supabase
    
-   Tailwind CSS
    
-   TypeScript (strict mode)
    
-   npm workspaces (monorepo architecture)
    
-   Custom middleware and CORS handling
    

----------

## 🧠 Engineering Principles

-   **Security-oriented design**  
    Server-side session validation, token rotation, protected routes, and CORS-aware API boundaries
    
-   **Scalable system architecture**  
    SDK-driven ingestion, separation of core and framework-specific layers, and aggregation-based data modeling
    
-   **Maintainability and clarity**  
    End-to-end static typing, reusable abstractions, consistent project structure, and JSDoc-driven documentation
    
-   **Full technical ownership**  
    No third-party authentication, analytics, or SDK frameworks; all critical infrastructure implemented explicitly
    

----------

## 📸 Project Overview

**Dashboard**

-   Read-only analytics interface
    
-   Project-level and event-level insights
    
-   Pre-aggregated metrics
    
-   Server-side data fetching for performance and consistency
    

![Analytics Dashboard](https://raw.githubusercontent.com/AlienTheBetrayer/analytics/refs/heads/main/readme/images/dashboard.png)

**Authentication**

-   Fully custom-built authentication flow
    
-   Access and refresh token lifecycle management
    
-   Server-side rotation and invalidation
    
-   Explicit session termination and invalidation semantics
    

![Authentication Flow](https://raw.githubusercontent.com/AlienTheBetrayer/analytics/refs/heads/main/readme/images/login.png)

----------

## ✅ Final Notes

This project demonstrates **end-to-end system ownership**, spanning frontend engineering, backend API design, authentication infrastructure, SDK development, and relational data modeling, with an emphasis on production-oriented trade-offs and long-term maintainability.
# Analytics

A **production-grade analytics platform** implemented using **Next.js, React, TypeScript, SQL, and a custom-built SDK**.

The system aggregates analytics events from multiple external services into a centralized, **view-only dashboard**, leveraging a **self-authored npm SDK** and a **custom authentication architecture with server-side token rotation**.

![Analytics Dashboard Showcase](https://raw.githubusercontent.com/AlienTheBetrayer/analytics/refs/heads/main/readme/images/front.png)

----------

## 🚀 Tech Stack

**Frontend**

-   Next.js (App Router)
    
-   React
    
-   TypeScript
    
-   Tailwind CSS
    
-   Context API, Providers, and custom hooks
    

**Backend**

-   Next.js API routes
    
-   SQL (Supabase / PostgreSQL)
    
-   Custom authentication layer
    
-   HttpOnly cookie-based sessions
    
-   Access and refresh token rotation
    

**SDK**

-   `@alienthebetrayer/analytics-sdk-core`
    
-   `@alienthebetrayer/analytics-sdk-react`
    
-   Strongly typed API client
    
-   React Provider abstraction
    

----------

## 📚 Libraries / Tooling

-   Axios
    
-   Supabase
    
-   Tailwind CSS
    
-   TypeScript (strict mode)
    
-   npm workspaces (monorepo architecture)
    
-   Custom middleware and CORS handling
    

----------

## 🧠 Engineering Principles

-   **Security-oriented design**  
    Server-side session validation, token rotation, protected routes, and CORS-aware API boundaries
    
-   **Scalable system architecture**  
    SDK-driven ingestion, separation of core and framework-specific layers, and aggregation-based data modeling
    
-   **Maintainability and clarity**  
    End-to-end static typing, reusable abstractions, consistent project structure, and JSDoc-driven documentation
    
-   **Full technical ownership**  
    No third-party authentication, analytics, or SDK frameworks; all critical infrastructure implemented explicitly
    

----------

## 📸 Project Overview

**Dashboard**

-   Read-only analytics interface
    
-   Project-level and event-level insights
    
-   Pre-aggregated metrics
    
-   Server-side data fetching for performance and consistency
    

![Analytics Dashboard](https://raw.githubusercontent.com/AlienTheBetrayer/analytics/refs/heads/main/readme/images/dashboard.png)

**Authentication**

-   Fully custom-built authentication flow
    
-   Access and refresh token lifecycle management
    
-   Server-side rotation and invalidation
    
-   Explicit session termination and invalidation semantics
    

![Authentication Flow](https://raw.githubusercontent.com/AlienTheBetrayer/analytics/refs/heads/main/readme/images/login.png)

----------

## ✅ Final Notes

This project demonstrates **end-to-end system ownership**, spanning frontend engineering, backend API design, authentication infrastructure, SDK development, and relational data modeling, with an emphasis on production-oriented trade-offs and long-term maintainability.