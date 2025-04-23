# Train Station Time Table System

A comprehensive Taiwan Railway train schedule inquiry system using simulated data, providing complete train information with an intuitive query interface.

**Demo:** [Live Demo](https://trainstation-time-table-gr925.vercel.app)

## Features

- Query train schedules for specific dates
- Search for specific trains by train number
- Query trains by departure and arrival stations
- View ticket and reservation information
- User order management system
- Member center and personal data management
- Comprehensive FAQ and help center
- User authentication and authorization
- Fixed sidebar navigation for enhanced user experience
- Fully responsive design supporting various devices
- Using simulated data, no external API connection required

## Tech Stack

- React 18.3
- TypeScript 5.0
- Vite 6.0
- Redux Toolkit - State management
- Ant Design 5.24 - UI component library
- Axios - Request handling
- React Router v7 - Routing management
- Tailwind CSS - Styling
- DayJS - Date and time handling

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Development & Build

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview build result
npm run preview
```

## Project Structure

```
src/
├── api/                # API services and mock data processing
├── assets/             # Static resources
├── components/         # Reusable components
├── pages/              # Application pages
├── routes/             # Route configuration
├── store/              # Redux state management
└── utils/              # Utility functions
```

## Mock Data Mechanism

This project uses a complete mock data mechanism without the need to connect to external APIs:

- Mock API interfaces that simulate network request delays
- Provides mock data for stations, train schedules, and other basic data
- Generates detailed train operation information including schedules and stations
- Handles simulated requests without actual API connections
- Provides simulated user authentication mechanisms

### Features

- Completely offline operation, independent of external services
- Simulates network delays for realistic user experience
- Provides rich mock data covering actual application scenarios
- Unified error handling and simulated API responses

### Usage Example

```typescript
// Import API functions
import { getAllStations, getTrainByNumber } from "../api/train";
import { loginApi } from "../api/auth";

// Use API (actually using mock data)
const stations = await getAllStations();
const trainDetails = await getTrainByNumber("123", "2023-04-01");
```

## UI Features

- **Fixed Sidebar**: Sidebar remains fixed during page scrolling, enhancing navigation experience
- **Responsive Design**: Adapts to different screen sizes, from mobile to desktop devices
- **Modern Interface**: Uses Ant Design and Tailwind CSS to provide a clear and attractive interface
- **Intuitive Operation**: Concise forms and data display methods that enhance user-friendliness

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Author

Gorman
