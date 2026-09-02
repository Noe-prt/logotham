# Logotham

**Logotham** is a modern, interactive logo generator application built with Next.js and React. It allows users to design and customize logos using the extensive Lucide icon library and curated Flaticon glyphs.

## Project Overview

The application provides a real-time preview of the logo as you customize various parameters such as:

- **Icon Selection:** Choose from a massive collection including Lucide, Flaticon, Feather, Iconoir, Boxicons, and Heroicons.
- **Typography:** Add custom text with Google Fonts support, gradient fills, and precise positioning.
- **Styling:** Adjust icon size, color, stroke width, and rotation.
- **Container:** Customize the container size, border radius, and border width/color.
- **Background:** Choose between solid colors or customizable gradients (angle, start/end colors).
- **Shadows:** Add and configure drop shadows (color, blur, opacity, offset).
- **History & Persistence:** Robust Undo/Redo capabilities, plus automatic local storage saving and URL-based configuration sharing.
- **Export:** Download your created logo as high-quality PNG or SVG files, or capture an entire brand kit (.zip) with multiple sizes plus a README.

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Package Manager:** [bun](https://bun.sh/)
- **UI Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/), Flaticon, Feather, Iconoir, Boxicons, Heroicons
- **Image Generation:** [html-to-image](https://github.com/bubkoo/html-to-image)
- **State Management:** Custom hooks (useLogoHistory) with LocalStorage persistence
- **Components:** Built on top of Radix UI primitives and specialized UI components.

## Key Features

- **Real-time Preview:** Instant visual feedback on all changes.
- **History Management:** Robust Undo/Redo capabilities.
- **Presets:** (In code structure) Pre-defined styles for quick starting points.
- **Responsive Design:** optimized for both desktop and mobile views.
- **Dark Mode:** (Implied by `mode-toggle.tsx` and `theme-provider.tsx`) support.
- **Brand Kits:** One-click bundle that exports PNG/SVG variations plus a README for designers/startups.

## Project Structure

- `app/`: Next.js app router pages and layouts.
- `components/`: Reusable UI components and feature-specific components (`logo/`).
- `hooks/`: Custom React hooks (`use-logo-history`, `use-mobile`).
- `lib/`: Utility functions and type definitions.
- `public/`: Static assets.

**Note:** Files must be kept under 300 lines of code. Split larger modules into smaller, focused files.

## Usage

1.  Select an icon from the picker.
2.  Adjust the sliders and inputs to customize the look.
3.  Use the "Download" button to save your creation.

## About the Project

I first used a tool called [logofa.st](https://logofa.st) to make quick logos, but it only supported an older Lucide icon set, offered very limited styling controls, and was cluttered with ads. To solve that, I built Logotham with support for Lucide, Lucide Lab, and Flaticon icons, plus all the controls I needed—and I’m releasing it for free so other builders can iterate faster.  
If you want to chat or have ideas, reach out to me on Twitter: [@mathaegon](https://twitter.com/mathaegon).
