# Churrasco DIRSIS - Event Registration System

## Overview

This is a Flask-based web application for managing registrations for a company BBQ event (Churrasco DIRSIS). The system allows employees to register themselves and their family members/friends for the event, with email validation to ensure only company employees (@claro.com.br domain) can register. The application provides a registration form, displays a list of confirmed attendees, and generates QR codes for event location and attendance list access.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Technology Stack**: Vanilla JavaScript, HTML5, and CSS3
- **Design Pattern**: Server-side rendering with Flask templates (Jinja2)
- **UI Components**:
  - Dynamic form with add/remove functionality for family members
  - Gradient-based visual design with responsive layout
  - Real-time form validation on the client side
  - Message display system for user feedback

**Rationale**: Vanilla JavaScript was chosen for simplicity and to avoid framework overhead for a relatively simple event registration system. Server-side rendering provides better initial page load and SEO while maintaining simplicity.

### Backend Architecture
- **Framework**: Flask (Python)
- **Design Pattern**: RESTful API with JSON data persistence
- **Key Routes**:
  - `GET /` - Main registration page
  - `GET /api/inscricoes` - Retrieve all registrations
  - `POST /api/inscricao` - Submit new registration
  - QR code generation endpoints for maps and attendance list

**Rationale**: Flask provides a lightweight, flexible framework suitable for small to medium applications. The RESTful API pattern allows for potential future frontend flexibility.

### Data Storage
- **Solution**: File-based JSON storage (`inscricoes.json`)
- **Data Model**: Simple nested structure with email as unique identifier and array of family members
- **Validation**: Email domain validation (@claro.com.br), duplicate prevention

**Rationale**: File-based JSON storage was chosen for simplicity and rapid development. For a single-event application with expected limited scale, this approach eliminates database setup complexity. The system prevents duplicate registrations by checking existing emails before inserting.

**Alternatives Considered**: 
- SQLite or PostgreSQL database would provide better data integrity and query capabilities
- Pros of current approach: No database setup, easy to backup/restore, simple deployment
- Cons: Limited scalability, no ACID guarantees, potential concurrent write issues

### Authentication and Authorization
- **Current Implementation**: Email domain validation only
- **Access Control**: No authentication layer - open registration with email validation

**Rationale**: For an internal company event with limited scope, email domain validation provides sufficient access control. This keeps the user experience simple while ensuring only company employees can register.

### QR Code Integration
- **Library**: Python qrcode library
- **Purpose**: Generate QR codes for Google Maps location and attendance list access
- **Implementation**: Dynamic image generation served as endpoints

**Rationale**: QR codes provide quick mobile access to location and attendance information, enhancing the event experience for attendees.

## External Dependencies

### Python Libraries
- **Flask**: Web framework for routing, templating, and HTTP handling
- **qrcode**: QR code generation for location and list access
- **json**: Built-in library for data serialization/deserialization
- **io.BytesIO**: In-memory binary stream for serving QR code images

### Frontend Dependencies
- **No external libraries**: Pure vanilla JavaScript and CSS
- **Google Maps**: External link for location (via QR code)

### File System Dependencies
- **inscricoes.json**: Persistent storage file for registration data
- **static/**: Directory for CSS and JavaScript assets
- **templates/**: Directory for Jinja2 HTML templates

### Service Integrations
- **Email Domain Validation**: Hardcoded validation for @claro.com.br domain
- **Google Maps**: External service for location display (linked via QR code)

## Event Details

- **Event**: Churrasco DIRSIS - Confraternização Diretoria de Sistemas de Negócios
- **Date**: October 17, 2025 (Friday)
- **Time**: 18:00h
- **Location**: Salão de Festas - Prédio do Mineiro do Cruzeiro, Rua Doutor Barros Cruz, 104 - Vila Mariana, São Paulo
- **Type**: By adhesion with expense sharing among the DEV team
- **Note**: Limited capacity for safety and comfort

## Recent Changes (October 15, 2025)

- ✅ Complete Flask application implemented with all features
- ✅ Marketing banner/teaser design with gradient and modern layout
- ✅ Registration form with dynamic family member addition
- ✅ Email validation for @claro.com.br domain
- ✅ JSON file-based persistent storage
- ✅ Two QR codes: Google Maps location and attendance list
- ✅ Responsive design with mobile support
- ✅ Attendance list page with total count
- ✅ All JavaScript and CSS files completed and functional