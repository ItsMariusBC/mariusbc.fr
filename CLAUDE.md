# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for Marius, built with Next.js + TypeScript. It features animated text effects, glassmorphism design, an interactive dock with social media links, and an admin system for content management.

## Development Commands

- **Start development server**: `npm run dev`
- **Build for production**: `npm run build`
- **Start production server**: `npm start`
- **Lint code**: `npm run lint`
- **Database operations**: `npx prisma generate`, `npx prisma db push`, `npx prisma studio`

## Tech Stack & Architecture

### Core Technologies
- **Next.js 14** with App Router and TypeScript
- **Prisma ORM** with PostgreSQL database
- **Better Auth** for authentication
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Radix UI** for accessible tooltips
- **Docker** for containerization

### Key Architecture Patterns

#### Next.js App Router Structure
- **Pages**: `app/` directory with route-based file structure
- **API Routes**: `app/api/` directory for server-side endpoints
- **Admin Panel**: `app/admin/` directory for authenticated management interface

#### Custom Component Library (Magic UI)
- **Dock Components** (`components/magicui/dock.tsx`): Animated dock with hover effects using React Context and Framer Motion
- **Text Animation Components**: 
  - `video-text.tsx`: Text with video/GIF backgrounds
  - `sparkles-text.tsx`: Text with sparkle animations
  - `hyper-text.tsx`: Typewriter-style text animations
  - `shiny-button.tsx`: Animated button with CSS custom properties

#### Database Schema
- **User Management**: Users, accounts, sessions (Better Auth integration)
- **Site Configuration**: Dynamic contact button URL management
- **Dock Icons**: Configurable social media links with ordering

#### Utility Functions
- **cn function** (`lib/utils.ts`): Combines clsx and tailwind-merge for conditional styling
- **Prisma Client** (`lib/prisma.ts`): Database connection and singleton pattern

### File Structure
- **App Router**: `app/` - Next.js pages, layouts, and API routes
- **Components**: `components/magicui/` - Custom animated UI components
- **Lib**: `lib/` - Utility functions and database client
- **Database**: `prisma/` - Schema and migrations
- **Docker**: `Dockerfile`, `docker-compose.yml` - Containerization setup

### Styling Approach
- Tailwind CSS with custom animations and keyframes
- Glassmorphism design (backdrop-blur, translucent backgrounds)
- CSS custom properties for dynamic component styling
- Path alias `@/` maps to project root directory
- Dark gradient backgrounds with radial overlays

### Animation Patterns
- Framer Motion for smooth interactions and hover effects
- Custom Tailwind keyframes for sparkle animations
- useMotionValue and useSpring for performant animations
- Context-based hover state management in dock component

### Admin System
- **Authentication**: Better Auth with PostgreSQL session storage
- **Admin Dashboard**: `/admin` route with login protection
- **Site Management**: Dynamic configuration of contact button and dock icons
- **Database Management**: Prisma Studio for direct database access

## Configuration Files
- **Next.js**: Modern React framework with App Router and API routes
- **ESLint**: TypeScript and React rules configuration
- **TypeScript**: Single config with proper Next.js and path aliases setup
- **Tailwind**: Custom sparkle animations and extended keyframes
- **Prisma**: PostgreSQL schema with Better Auth integration
- **Docker**: Multi-stage builds for development and production environments

## Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `BETTER_AUTH_SECRET`: Authentication secret key
- `BETTER_AUTH_URL`: Base URL for auth callbacks

## Development Workflow
1. **Database Setup**: Run `docker-compose up -d` to start PostgreSQL
2. **Database Migration**: Run `npx prisma db push` to sync schema
3. **Development Server**: Run `npm run dev` to start Next.js
4. **Admin Access**: Navigate to `/admin` for site management
5. **Database GUI**: Use `npx prisma studio` for database management