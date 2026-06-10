# Architecture Overview

## Purpose

This project is structured as a monorepo so the frontend, backend, database configuration, and documentation evolve together with clear boundaries.

## Frontend

The frontend uses Next.js App Router and TypeScript. It is organized into route entrypoints, reusable UI primitives, and feature-scoped modules so future roadmap, quiz, and paper workflows can grow without turning the `components` folder into a catch-all.

## Backend

The backend uses FastAPI with versioned routing, dependency injection, a repository-service split, SQLAlchemy session management, Alembic migration scaffolding, and Pydantic settings. It is ready for future roadmap generation, quiz delivery, progress tracking, and paper simplification services.

## Database

PostgreSQL is the source of truth for persistent application data. The current foundation wires connection management, migration support, and health verification without introducing business tables yet.
