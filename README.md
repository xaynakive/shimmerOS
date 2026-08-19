# ✿ ShimmerOS

A themed desktop OS that lives in a browser, built in plain HTML, CSS, and JavaScript. 

> Technology should feel like something. ShimmerOS imagines a desktop that feels personal, soft and lived-in rather than cold and generic.

ShimmerOS began as a frontend university project and gradually grew into a connected collection of small applications. It combines desktop-inspired navigation, shared themes, fictional user data and quiet world-building inside a browser-based interface.

No framework. No build step. Just HTML, CSS, JavaScript, JSON and an unreasonable number of cats.

---

## ✿ Highlights

- Seven colour families: **Lavender, Rose, Blush, Pearl, Sky, Sage and Void**
- Light and dark variants for every theme
- Theme-aware wallpapers, photographs, vinyl icons and interface colours
- Lock screen, login screen, desktop, dock, widgets and settings window
- Live clock, calendar and weather display
- Persistent theme and app data through `localStorage`
- Responsive styling for smaller screens
- A collection of interconnected apps using shared fictional JSON data
- Rain, polaroids, cats and tiny pieces of digital lore

## ✿ What's inside

ShimmerOS boots to a lockscreen, then drops you onto a desktop with a menu bar, a dock, widgets, and apps you can actually open. Plus a live clock, a working calendar, and a weather widget wired to a real API.

## ✿ Applications

### Breeze — mood, felt

A contextual wellness companion designed to integrate with Botpress. Breeze draws on the project's sample diary, activity, social and academic data to create the illusion of an assistant that understands the world around it.

### Cat's Perspective — a cats-eye view of things

A daily-life logger that displays mood, energy, sleep, meals, activities, symptoms and notes from sample JSON data.

### Calculator — scientific, and unbothered

A themed scientific calculator with basic, trigonometric, memory and advanced operations.

### Echoura — a little world with its own login + dashboard

A fictional student portal from the Echoura Institute, *where every cat's aura echoes in the sunbeam*. It includes authentication, courses, assignments, grades, schedules and dashboard statistics.

### Lemonure — a soft social feed

A fictional social feed focused on slow posting, digital wellbeing and the particular chaos of building things at 3 AM.

### Mailbox — messages from the universe

A private letter-writing space where letters can be drafted, sealed and saved locally in the browser.

### Memoir — for cataloguing the days

A diary archive for browsing entries, moods, tags and fragments of personal-looking fictional history.

### Scrapbook — a tiny paint app with a brush, shapes, fill, and emoji stickers 

A playful canvas for drawing, arranging notes, and stamping small visual memories.

## ✿ Demo Credentials

These credentials exist only to demonstrate client-side interactions. They are visible in the source code and must not be treated as real authentication.

| Screen | Credential |
| --- | --- |
| Desktop login (after lock screen) | Password: `hazeycat` |
| Echoura portal | Student ID: `AR-08-26-42069` |
| Echoura portal | Password: `catcatcat` |

The lock screen has no password, click it or press Enter to reach the desktop login.

## ✿ Project Structure

```text
shimmerOS/
├── index.html                 # lock screen
├── login/                     # desktop login
├── home/                      # main desktop and settings
├── apps/
│   ├── breeze/
│   ├── calculator/
│   ├── cats-perspective/
│   ├── echoura/
│   ├── lemonure/
│   ├── mailbox/
│   ├── memoir/
│   └── scrapbook/
└── assets/
    ├── css/                   # shared and app-specific styles
    ├── data/                  # fictional/sample JSON data
    ├── imgs/                  # wallpapers, icons and app imagery
    └── js/                    # themes, navigation and app logic
```

## ✿ Themes

Seven palettes, **Lavender · Rose · Blush · Pearl · Sky · Sage · Void**, each with a light and dark mode. Every app, icon, vinyl, and photo re-skins itself when you switch. Your pick is remembered between visits.

## ✿ Built with

- Vanilla **HTML / CSS / JavaScript**, no frameworks, no build step
- CSS custom properties driving the whole theme system
- A pinch of Canvas for the paint app and the rain
- Theme state and app data shared through `localStorage`
- Application content loaded from local JSON files
- Authentication is purely presentational and client-side, this is a browser-based desktop simulation, not an operating system

## ✿ Run it locally

```bash
git clone https://github.com/xaynakive/shimmerOS.git
cd shimmerOS
```

Then open `index.html` in your browser — or serve the folder with any static server (e.g. VS Code Live Server) and visit the lockscreen.

## ✿ Live

→ **https://xaynakive.github.io/shimmerOS/**

---

## ✿ Data and Privacy

The diary entries, health details, social posts, assignments, user profiles and activity logs included in this repository are **fictionalised sample data created for the demonstration**. ShimmerOS is not a health, academic or authentication system.

Mailbox content and interface preferences are stored locally in the visitor's browser through `localStorage`. They are not sent to a ShimmerOS backend.

## ✿ External Services

- **Open-Meteo** supplies the desktop weather data.
- **Botpress** powers the embedded Breeze chat experience.

These features require an internet connection and may be unavailable if their external services are offline or blocked.

## ✿ Acknowledgements

The rain animation is based on the **Rainy Afternoon Effect** by mf2fm web-design, credited in `assets/js/rain.js`. Third-party images and services remain the property of their respective creators and providers.

## ✿ Creator

*Made with too many late nights and at least four cats, by [xaynakive](https://github.com/xaynakive).* 

Part frontend project, part digital diary, part tiny universe.

*Every app is a room. Every theme is a different weather system.*
