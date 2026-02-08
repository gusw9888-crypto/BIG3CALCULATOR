# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BIG3 Calculator (삼대운동 1RM 계산기) - A web-based one-rep max (1RM) calculator for the "Big 3" powerlifting exercises: bench press, deadlift, and squat. The application is a client-side web app with a simple Node.js static file server.

## Development Commands

### Running the Server
```bash
node server.js
```
Server runs on port 8080 and serves static files (index.html, style.css, script.js).

### No Build Process
This is a vanilla HTML/CSS/JavaScript application with no build step, bundlers, or package managers.

## Architecture

### Core Components

**Client-Side Application** (no backend logic):
- `index.html` - Main page with Korean UI for exercise selection and input
- `script.js` - Client-side calculator logic with three 1RM formulas
- `style.css` - Dark theme styling with orange/red accent colors

**Server**:
- `server.js` - Basic Node.js HTTP server for serving static files (no API endpoints)

### 1RM Calculation Formulas

The application uses different formulas for each exercise (defined in `script.js`):

1. **Bench Press** - Epley formula
   - `1RM = weight × (1 + reps/30)`

2. **Deadlift** - Brzycki formula
   - `1RM = weight × (36/(37-reps))`

3. **Squat** - Lander formula
   - `1RM = (100×weight)/(101.3-2.67123×reps)`

Each formula object in the `formulas` object has:
- `calculate1RM(weight, reps)` - Calculate 1RM from weight and reps
- `calculateWeight(oneRM, reps)` - Reverse calculation to get weight for given 1RM and reps

### UI Flow

1. User selects exercise type (dropdown)
2. User inputs weight (kg) and reps performed
3. Click "계산하기" (Calculate) button or press Enter
4. Results display:
   - Calculated 1RM in large display
   - Table showing estimated weights for 10-1 reps (descending order)
   - Input row highlighted in table

### Development Environment

This project uses Firebase Studio with Nix configuration (`.idx/dev.nix`). The environment is currently minimal with no packages installed. See `.idx/airules.md` for detailed Nix configuration guidelines if environment setup is needed.

## Language

The UI is entirely in Korean. When making changes to user-facing text, maintain Korean language consistency.
