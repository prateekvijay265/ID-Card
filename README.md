# HH GOA 2026 ID Card Generator

A React web application for generating dynamic, personalized ID cards for the Hacker House Goa 2026 event. This app takes a user's details and layers them perfectly onto a master event badge template, complete with a QR code and barcode.

## Features

- **Clean Master Template**: Uses a perfectly cleaned background image (`hhgoa-2026-clean-template.png`) where original placeholder text has been meticulously removed while preserving paper texture and design elements.
- **Dynamic Overlays**: Positions user data (Name, Stack/Role, Builder Title, and Description) perfectly aligned with the template's designated areas using absolute CSS coordinates.
- **QR Code & Barcode Generation**: Automatically generates a QR Code and Barcode mapped to the user's custom link and event ID, placing them neatly into their respective template boxes.
- **Profile Photo Support**: Renders the user's uploaded profile picture seamlessly *behind* the template's transparent circular frame for a clean, integrated look.

## Technologies Used

- **React 19**
- **Vite 8**
- **TypeScript**
- **Framer Motion** (for transitions)
- **html-to-image** (for rendering the final composited card)
- **react-qr-code** & **react-barcode** (for dynamic generation)
- **heic2any** (for Apple HEIC photo support)

## Getting Started

### Prerequisites
Make sure you have Node.js and npm installed.

### Installation

1. Clone this repository or download the source code.
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Development Server

To start the Vite development server, run:
```bash
npm run dev
```
Open your browser and navigate to the localhost URL provided in the terminal (typically `http://localhost:5173`).

### Building for Production

To create a production build, run:
```bash
npm run build
```
This will run TypeScript type-checking and then package your app into the `dist` folder. You can preview the production build locally using `npm run preview`.

## Architecture Details

- **`IdCard.tsx`**: The core component that handles the visual assembly of the badge. It uses absolute positioning and a predefined 682x1024 coordinate system to ensure text and barcodes align perfectly over the background asset.
- **Clean Template (`/public/assets/hhgoa-2026-clean-template.png`)**: A high-resolution background asset cleaned of any hard-coded participant data, designed to serve as the immutable background layer.
- **Generator logic**: Provides state management for dynamic fields, falling back to a test participant (`PRATEEK VIJAY`) to ensure the rendering remains accurate during development.

## License
Private property for HH GOA 2026. All rights reserved.
