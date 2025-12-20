# ParkFlex Frontend

React-based frontend application for the ParkFlex parking management system.

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **PrimeReact** - UI component library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Vitest** - Testing framework

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` to configure your API endpoint:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

### Build

Build for production:

```bash
npm run build
```

### Testing

Run tests:

```bash
npm run test
```

Run tests with UI:

```bash
npm run testUI
```

### Linting

Check code quality:

```bash
npm run lint
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   └── AdminHeaderAndSidebar.tsx  # Admin panel layout
├── pages/           # Page components
│   ├── App.tsx      # Home page
│   ├── Demo.tsx     # Demo page
│   ├── Admin.tsx    # Admin panel
│   └── NotFound.tsx # 404 page
├── hooks/           # Custom React hooks
│   └── useAxios.ts  # Axios instance hook
├── models/          # Data models
└── main.tsx         # Application entry point
```

## Admin Panel

The admin panel is available at `/admin` and includes:

- **Dashboard** - Overview and statistics
- **Miejsca parkingowe** (Parking Spots) - Manage parking locations
- **Rezerwacje** (Reservations) - View and manage reservations
- **Użytkownicy** (Users) - User management
- **Kary** (Penalties) - Penalty management
- **Ustawienia** (Settings) - System configuration

The admin interface is fully responsive and includes:
- Collapsible sidebar on desktop
- Mobile-friendly slide-out menu
- Active route highlighting
- Accessible navigation

## License

This project is part of the ParkFlex parking management system.
