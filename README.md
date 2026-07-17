<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:6EE7B7,100:F87171&height=180&section=header&text=Tic%20Tac%20Toe&fontSize=46&fontColor=0f0f13&fontAlignY=38&desc=Three%20in%20a%20row%20wins.&descAlignY=58&descSize=16&descColor=1a1a2e" width="100%" />

<br>

[![View Live Demo](https://img.shields.io/badge/VIEW_LIVE_DEMO-6EE7B7?style=for-the-badge&logo=netlify&logoColor=0f0f13)](https://tictactoe-oxgame.netlify.app/)

<br><br>

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![No Build Tools](https://img.shields.io/badge/Build_Tools-None-2EA043?style=flat-square)
![No Frameworks](https://img.shields.io/badge/Frameworks-None-2EA043?style=flat-square)

</div>

<br>

> A fully themed, two-player Tic Tac Toe game built with **pure HTML, CSS, and JavaScript**. Animated screens, sound effects, optional background music, and a cyberpunk-styled UI — no frameworks, no build tools, no backend.

<br>

## Contents

<table>
<tr>
<td valign="top" width="50%">

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture](#architecture)

</td>
<td valign="top" width="50%">

- [Getting Started](#getting-started)
- [Game Logic](#game-logic)
- [Deployment](#deployment)
- [Future Improvements](#future-improvements)
- [Author](#author)

</td>
</tr>
</table>

<br>

## Overview

Tic Tac Toe is a single-page, screen-based browser game for two local players. From a music selection popup to an animated landing screen, name entry, the live game board, and a result popup — every transition is handled entirely with vanilla JavaScript toggling CSS classes, with no page reloads and no routing library.

<br>

## Features

<table>
<tr>
<td width="50%">

**Setup &amp; Atmosphere**
- Music selection popup on first load
- Animated, glowing cyberpunk landing screen
- Player name entry with validation
- Floating background music toggle

</td>
<td width="50%">

**Gameplay**
- Interactive 3x3 board with pop animation
- Live turn indicator
- Win detection across all 8 possible lines
- Animated glow on winning cells
- Draw detection
- Distinct sound effects for every action

</td>
</tr>
<tr>
<td width="50%">

**Flow Control**
- Result popup on win or draw
- Restart — same players, fresh board
- New Game — return to name entry
- Keyboard shortcuts — `R` to restart, `Esc` to close the result popup

</td>
<td width="50%">

**Experience**
- Fully responsive across desktop, tablet, mobile, and landscape phones
- Retro-futuristic Orbitron title font with clean Oxanium body typography
- Smooth, consistent hover and press states

</td>
</tr>
</table>

<br>

## Tech Stack

<div align="center">

<img src="https://skillicons.dev/icons?i=html,css,js" />

</div>

<br>

<div align="center">

| Layer | Technology |
|:---:|:---:|
| Structure | HTML5 |
| Styling | CSS3 — custom properties, keyframe animations, fluid `clamp()` sizing |
| Fonts | Google Fonts — Orbitron, Oxanium |
| Logic | Vanilla JavaScript |
| Audio | HTML5 Audio API |
| Persistence | None — each session starts fresh (no `localStorage`/cookies) |

</div>

<br>

## Project Structure

```
tic-tac-toe/
├── index.html              All screens, popups, and the board markup
├── style.css                Theme variables, layout, and animations
├── script.js                 Game logic, screen control, and audio
└── sounds/
    ├── click.mp3              UI click sound
    ├── place.mp3                Mark placement sound
    ├── win.mp3                    Win celebration sound
    ├── draw.mp3                     Draw sound
    ├── restart.mp3                    Restart sound
    └── music.mp3                       Looping background music
```

<div align="center">

| File | Responsibility |
|:---:|:---|
| `index.html` | Every screen and popup, present in the DOM and toggled via a shared `hidden` class |
| `style.css` | Theming, layout, responsiveness, and all animations |
| `script.js` | Game state, screen switching, win/draw detection, and audio control |

</div>

<br>

## Architecture

```
Music Popup
     │
     ▼
Landing Screen ──▶ Setup Screen ──▶ Game Screen ──▶ Result Popup
                          ▲                │                │
                          │                │                │
                          └── New Game ────┘                │
                                           ◀── Restart ──────┘
```

The app is a single-page state machine. At any moment exactly one main screen is visible — JavaScript controls this by adding or removing one shared `hidden` class, never by navigating to a different page.

<br>

## Getting Started

**1. Clone the repository**

```bash
git clone https://github.com/SanaAslamDev/tic-tac-toe.git
cd tic-tac-toe
```

**2. Add your audio files**

Place the following files inside a `sounds/` folder in the project root:

```
sounds/click.mp3
sounds/place.mp3
sounds/win.mp3
sounds/draw.mp3
sounds/restart.mp3
sounds/music.mp3
```

**3. Open in your browser**

No build step is required — simply open `index.html` directly, or serve it locally:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

<br>

## Game Logic

- The board is a 9-element array, indexed 0–8, left to right, top to bottom
- Eight winning patterns are checked after every move — 3 rows, 3 columns, 2 diagonals
- A move is rejected if the game has ended or the target cell is already filled
- A win is detected the instant three matching marks line up on any pattern
- As soon as a win or draw is detected, the board locks immediately — the short win/draw sound and animation delay before the result popup appears can't be used to sneak in an extra move
- A draw is detected when the board is full with no winner
- Turn state alternates strictly between `X` and `O`

<br>

## Deployment

This project is a static site and deploys to Netlify with no configuration:

1. Drag the project folder onto [app.netlify.com/drop](https://app.netlify.com/drop), **or**
2. Connect the GitHub repository through **Add new site → Import an existing project**, with no build command and the publish directory set to the project root.

<br>

## Future Improvements

- Single-player mode against a computer opponent
- Persistent scoreboard across multiple rounds
- Dark / light theme switcher, saved across visits
- Full keyboard navigation for accessibility (tabbing through cells, arrow-key movement)
- Selectable background music tracks

<br>
<br>

<div align="center">

## Author

**Sana Aslam**

[![GitHub](https://img.shields.io/badge/GitHub-SanaAslamDev-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/SanaAslamDev)
[![Live Project](https://img.shields.io/badge/Live_Project-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://tictactoe-oxgame.netlify.app/)

<br>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:F87171,100:6EE7B7&height=100&section=footer" width="100%" />

</div>