# ClickCart - Online Marketplace

A modern, full-featured online marketplace built with Next.js 14, React, and TypeScript. ClickCart provides a seamless shopping experience with a universal cart system that allows users to browse products from multiple sellers and checkout in one transaction.

## Features

### For Buyers
- **Product Browsing**: Browse products by categories or search functionality
- **Product Details**: View detailed product information with multiple images
- **Universal Cart**: Add items from different sellers to a single cart
- **Responsive Design**: Optimized for desktop and mobile devices
- **Modern UI**: Clean, intuitive interface with smooth animations

### For Sellers
- **Product Management**: Add, edit, and delete product listings
- **Order Management**: View and manage incoming orders
- **Dashboard**: Analytics and sales overview
- **Inventory Tracking**: Monitor stock levels and product performance

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Context API
- **Image Optimization**: Next.js Image component

## Getting Started

### Prerequisites
- Node.js 18.0 or later
- npm or yarn package manager

### Installation

1. Clone the repository or navigate to the project directory:
   ```bash
   cd click-cart
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
click-cart/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Homepage
│   ├── cart/
│   │   └── page.tsx         # Shopping cart page
│   ├── product/
│   │   └── [id]/
│   │       └── page.tsx     # Product details page
│   └── seller/
│       └── page.tsx         # Seller dashboard
├── components/
│   ├── Navigation.tsx       # Navigation header
│   ├── ProductCard.tsx      # Product card component
│   └── CategoryCard.tsx     # Category card component
├── contexts/
│   └── CartContext.tsx      # Shopping cart context
├── data/
│   └── mockData.ts          # Mock data for products
├── types/
│   └── index.ts             # TypeScript type definitions
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## Key Features Implementation

### Universal Shopping Cart
The cart system uses React Context to manage state across the entire application. Users can add products from different sellers to the same cart and checkout in one transaction.

### Product Management
Sellers can manage their inventory through a dedicated dashboard with features for:
- Adding new products with images and descriptions
- Editing existing product information
- Monitoring stock levels and sales performance
- Viewing order history

### Responsive Design
The application is fully responsive and works seamlessly across devices:
- Desktop: Full-featured layout with sidebar navigation
- Tablet: Adapted grid layouts for optimal viewing
- Mobile: Streamlined interface with touch-friendly interactions

## Customization

### Styling
The application uses Tailwind CSS for styling. You can customize the design by:
- Modifying colors in `tailwind.config.js`
- Updating global styles in `app/globals.css`
- Adding custom components in the `@layer components` section

### Mock Data
Currently, the application uses mock data located in `data/mockData.ts`. To integrate with a real backend:
1. Replace mock data with API calls
2. Implement proper authentication for sellers
3. Add real payment processing
4. Set up image upload functionality

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Future Enhancements

- User authentication and profiles
- Payment integration (Stripe, PayPal)
- Order tracking and notifications
- Product reviews and ratings
- Advanced search and filtering
- Real-time inventory updates
- Email notifications
- Admin panel for platform management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For support or questions, please open an issue in the repository or contact the development team.

---

Built with ❤️ using Next.js and React 