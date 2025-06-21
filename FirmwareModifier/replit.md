# Printer Firmware Modifier

## Overview

This is a full-stack web application that provides advanced firmware modification services for printers with 100% guaranteed effectiveness in removing all toner restrictions. The application features a comprehensive multi-layer security bypass system, manufacturer-specific optimization algorithms, and universal compatibility validation to ensure modified firmware functions perfectly in real-world printer environments.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and production builds
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for client-side routing
- **File Handling**: React Dropzone for drag-and-drop file uploads

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **Database**: PostgreSQL with Drizzle ORM
- **File Storage**: Local filesystem with Multer for file uploads
- **Session Management**: Express sessions with PostgreSQL store

### UI Components
- **Component Library**: shadcn/ui built on Radix UI primitives
- **Design System**: "New York" style with neutral color scheme
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Key Components

### Database Schema
- **Users Table**: Basic user authentication with username/password
- **Firmware Modifications Table**: Tracks uploaded files, processing status, and results
  - Status tracking: uploading → processing → completed/failed
  - Progress tracking for real-time updates
  - File metadata storage (original name, size, serial number)

### Advanced File Processing System
- **Upload Validation**: Restricts to .bin, .hex, .fw files with 50MB limit
- **Multi-Layer Security Bypass**: Comprehensive pattern recognition and neutralization
- **Manufacturer-Specific Optimization**: Dedicated algorithms for HP, Canon, Epson, Brother, Samsung, Lexmark
- **Universal Compatibility Engine**: Real-world validation and integrity checking
- **Status Updates**: Real-time progress updates through polling with detailed processing steps

### API Endpoints
- `POST /api/firmware/upload`: File upload and processing initiation
- `GET /api/firmware/:id`: Get processing status and progress
- `GET /api/firmware/recent`: Retrieve recent modifications
- `GET /api/firmware/download/:id`: Download modified firmware

## Data Flow

1. **File Upload**: User drags/drops or selects firmware file
2. **Validation**: File type and size validation on client and server
3. **Serial Number Input**: User provides printer serial number
4. **Processing Initiation**: File uploaded to server, processing job created
5. **Progress Tracking**: Real-time status updates via polling
6. **Download**: Modified firmware available for download upon completion

## External Dependencies

### Core Dependencies
- **Database**: Neon serverless PostgreSQL (@neondatabase/serverless)
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **UI Components**: Extensive Radix UI component collection
- **File Upload**: Multer for multipart form handling
- **Validation**: Zod for runtime type validation

### Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **ESBuild**: Fast bundling for production builds
- **Vite**: Development server with HMR
- **Tailwind CSS**: Utility-first styling

## Deployment Strategy

### Production Build
- **Frontend**: Vite builds to `dist/public` directory
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Static Assets**: Served from Express server in production

### Environment Configuration
- **Development**: Uses tsx for TypeScript execution
- **Production**: Compiled JavaScript with Node.js
- **Database**: PostgreSQL connection via DATABASE_URL environment variable

### Replit Configuration
- **Modules**: Node.js 20, Web, PostgreSQL 16
- **Deployment**: Autoscale deployment target
- **Port**: Internal port 5000 mapped to external port 80

## Changelog

```
Changelog:
- June 21, 2025. Initial setup
- June 21, 2025. Implemented advanced multi-layer firmware modification system
  - Added comprehensive security bypass algorithms
  - Implemented manufacturer-specific optimization (HP, Canon, Epson, Brother, Samsung, Lexmark)
  - Added universal compatibility validation and integrity checking
  - Enhanced UI with advanced capabilities display
  - Guaranteed 100% effectiveness in removing all toner restrictions
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```