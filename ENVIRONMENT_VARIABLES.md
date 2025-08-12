# Environment Variables Configuration

This document describes the environment variables introduced to replace hardcoded localhost URLs for production deployment.

## Overview

The FlixShare application has been updated to use environment variables instead of hardcoded localhost URLs. This allows for easy deployment to different environments (development, staging, production) without code changes.

## Environment Variables

### Frontend (React/Vite)

The frontend uses Vite environment variables (prefixed with `VITE_`):

- `VITE_ROOM_BACKEND_URL`: URL for the room management backend service (default: `http://localhost:8080`)
- `VITE_AUTH_BACKEND_URL`: URL for the authentication backend service (default: `http://localhost:8000`)
- `VITE_WEBSITE_URL`: URL for the frontend website (default: `http://localhost:3000`)
- `VITE_SUPERTOKENS_URL`: URL for the SuperTokens core service (default: `http://localhost:3567`)

### Backend (Django/Python)

The backend services use standard environment variables:

- `ROOM_BACKEND_URL`: URL for the room management backend service 
- `AUTH_BACKEND_URL`: URL for the authentication backend service
- `WEBSITE_URL`: URL for the frontend website (used in CORS configuration)
- `SUPERTOKENS_URL`: URL for the SuperTokens core service

## Configuration Files

### Frontend
- `src/config.tsx`: Central configuration file with helper functions to get environment variables
- `.env.example`: Example environment variables file

### Backend
- `auth_services/auth_services/config.py`: SuperTokens configuration for auth service
- `room_management/room_management/config.py`: SuperTokens configuration for room management service
- `room_management/room/authentication.py`: JWT authentication that calls auth service
- `room_management/room/utils.py`: Utility functions that call auth service
- Both services' `settings.py`: Django settings including CORS configuration

## Usage

### Development
Copy the `.env.example` file to `.env` and adjust the URLs as needed for your local setup.

### Production
Set the environment variables in your deployment environment to point to the actual service URLs.

## Changes Made

1. **Frontend**: All hardcoded `http://localhost:8080` and `http://localhost:8000` URLs have been replaced with calls to configuration functions that read from environment variables.

2. **Backend**: All hardcoded localhost URLs in configuration files have been replaced with `os.getenv()` calls with appropriate defaults.

3. **Configuration**: Added centralized configuration management and example environment files.

## Backward Compatibility

All changes maintain backward compatibility by providing the original localhost URLs as default values when environment variables are not set.