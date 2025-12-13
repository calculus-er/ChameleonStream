# Chameleon Stream Landing Page

A modern, premium landing page for Chameleon Stream - an AI-powered localization platform.

## Features

- **Animated Chameleon Mascot**: 
  - Smooth color-shifting animations (neutral greens, soft blues, muted purples)
  - Eye-tracking that follows mouse cursor
  - Subtle idle animations (breathing, tail wiggle)
  - Scroll-based repositioning with sticky effect

- **Modern Design**:
  - Minimal, clean, tech-focused aesthetic
  - Neutral-to-light color palette
  - Premium typography (Inter font)
  - Fully responsive layout

- **Smooth Animations**:
  - Framer Motion for scroll and interaction animations
  - Hover effects on feature cards
  - Staggered entrance animations

## Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **TailwindCSS**
- **Framer Motion**

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout with font configuration
│   ├── page.tsx            # Main landing page
│   └── globals.css         # Global styles and Tailwind imports
├── components/
│   ├── Chameleon.tsx       # Animated chameleon component
│   ├── Hero.tsx            # Hero section with chameleon
│   ├── Features.tsx        # Features section
│   └── FeatureCard.tsx    # Individual feature card component
├── tailwind.config.ts      # Tailwind configuration with custom colors
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

## Customization

### Replacing the Chameleon Illustration

The chameleon is currently implemented as an SVG in `components/Chameleon.tsx`. To replace it with a custom 3D illustration:

1. Replace the SVG content in the `Chameleon` component
2. Ensure the new illustration maintains the same dimensions (400x400 viewBox)
3. Apply the same animation props and styles for consistency

### Color Palette

Colors can be customized in `tailwind.config.ts`:
- Background: `#F5F7FA`
- Foreground: `#1B1B1B`
- Accent Teal: `#6AB8A5`
- Accent Blue: `#A8B6C8`

## Build for Production

```bash
npm run build
npm start
```

## License

MIT

