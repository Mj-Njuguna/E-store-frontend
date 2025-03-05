# E-Commerce Store Frontend

A modern e-commerce store built with Next.js 13, featuring a beautiful UI and seamless shopping experience.

## Features

- 🛍️ Modern E-commerce Interface
- 🎨 Dynamic Product Galleries
- 🛒 Shopping Cart Management
- 💳 Secure Checkout with Stripe
- 🔍 Advanced Product Search & Filtering
- 📱 Fully Responsive Design
- 🌙 Light/Dark Mode
- 🎯 Featured Products & Categories
- 📦 Order Tracking
- 🔐 Secure User Authentication

## Tech Stack

- **Framework**: Next.js 13 (App Router)
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **State Management**: Zustand
- **Payment Processing**: Stripe
- **UI Components**: Headless UI
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 16+
- npm/yarn
- Clerk account (for authentication)
- Stripe account (for payments)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Mj-Njuguna/E-store-frontend.git
   cd E-store-frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   - Copy `.env.example` to `.env`
   - Update the environment variables with your credentials

4. Run the development server:
   ```bash
   npm run dev
   ```

The store will be available at `http://localhost:3001`

## Project Structure

- `/app` - Next.js 13 app router pages and layouts
- `/components` - Reusable UI components
- `/hooks` - Custom React hooks
- `/lib` - Utility functions
- `/providers` - Context providers
- `/public` - Static assets
- `/types` - TypeScript type definitions

## Key Features Explained

### Product Browsing

- Dynamic product filtering
- Category-based navigation
- Advanced search functionality
- Responsive product galleries
- Quick view functionality

### Shopping Cart

- Real-time cart updates
- Persistent cart storage
- Quantity management
- Price calculations
- Tax and shipping estimates

### Checkout Process

- Secure payment processing
- Address management
- Order summary
- Email confirmations
- Guest checkout option

### User Account

- Order history
- Saved addresses
- Wishlist management
- Personal information management

## Environment Variables

Required environment variables:

\`\`\`env

# Authentication (Clerk)

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# API URL

NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Stripe

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
\`\`\`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email [your-email] or create an issue in the repository.
