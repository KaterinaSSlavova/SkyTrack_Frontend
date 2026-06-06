# ✈️ SkyTrack

A flight booking and tracking web application that allows passengers to search for flights, book seats, manage their trips and receive real-time notifications - all on a single platform.

> **Live demo:** https://skytrackapp.duckdns.org
> 

---

## Problem Statement

Travellers today must juggle multiple platforms to search for flights, complete bookings, select seats and track their trip status. There is no unified experience that covers the full journey from discovery to post-booking management. This fragmentation leads to missed updates, poor user experience and a lack of transparency around booking details.

## Proposed Solution

SkyTrack addresses this by providing a single platform where passengers can search for real flights, select seats, manage passenger details, pay securely and receive live booking updates. The application is built on a layered architecture, follows clean code principles and is validated through unit, integration and end-to-end tests deployed to a live environment.

**Main research question:** *How can a flight booking and tracking system be designed to help passengers manage and track their trips effectively on a single platform?*

---

## Key Features

- **Flight search** - real flight data via the Duffel API
- **Interactive seat map** - visual seat selection with extra legroom and window seat pricing
- **Stripe payment integration** - secure checkout with itemized booking summary
- **Real-time notifications** - WebSocket/STOMP-based alerts for booking updates
- **JWT authentication** - access and refresh tokens
- **Rate limiting** - Bucket4j login protection
- **Caffeine caching** - in-memory caching for external API responses
- **Profile anonymisation** - GDPR-friendly account deactivation

**Actors:**

| Actor | Role |
| --- | --- |
| Passenger | Search flights, book tickets, select seats, cancel bookings, receive notifications |
| Manager (Admin) | Create and manage flights and airports |

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Backend | Java 25, Spring Boot, Gradle |
| Frontend | React, Vite, pnpm |
| Database | PostgreSQL (Supabase) |
| Auth | JWT (HttpOnly cookies, refresh tokens) |
| Payments | Stripe |
| Real-time | WebSocket / STOMP |
| Reverse proxy | Nginx |
| Containers | Docker, Docker Compose |
| CI/CD | GitLab CI/CD (shell executor) |
| Registry | Docker Hub |
| Code quality | SonarQube |
| Security and Performance | OWASP ZAP, Lighthouse |

---

## Repositories

The project is split across three GitLab repositories:

- Backend - skytrack-be
- Frontend - skytrack-fe
- Docker Compose and deployment scripts - skytrack-infra

On the virtual machine (VM), the repositories are cloned under:

/projects/skytrack-fe/

/project/skytrack-be/

/projects/skytrack-infra/

---

## CI/CD Pipeline

Each repository has its own pipeline. When a push is made to main on skytrack-be or skytrack-fe, their pipeline runs its own stages and at the end triggers the skytrack-infra pipeline. The infra pipeline is the one that actually deploys - it pulls the latest images from Docker Hub and restarts the containers on the VM.

![CI/CD Pipeline](https://git.fhict.nl/I547761/skytrack-infra/-/raw/main/assets/pipeline.svg)

---

## Research

This project was developed as an individual semester project at **Fontys University of Applied Sciences**, following the **Development Oriented Triangulation research framework**.

| Sub-question | DOT Strategy | Methods |
| --- | --- | --- |
| Current situation & proposed solution | Library, Field, Workshop | Literature study, Available product analysis, Problem analysis, IT architecture sketching |
| External API integration | Library, Lab, Workshop | Literature study, Design pattern research, Component test, Unit test, System test |
| Real-time updates | Library, Lab, Workshop | Literature study, Design pattern research, System test, Component test, Unit test |
| Effectiveness | Lab, Showroom | Usability testing, Product review |

---

## Scope

**Included:**

- User authentication
- Flight search and booking
- Interactive seat map (Airbus A320)
- Real-time flight notifications
- Flight history
- Payment integration (Stripe)
- Boarding pass generation with QR code

**Not included:**

- Baggage tracking
- Airline staff operational tools
- Loyalty and reward programs
- Multi-aircraft seat maps
- Multi-airline integration
- Connecting flights

---