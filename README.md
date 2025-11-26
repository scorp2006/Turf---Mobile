# Turf Booking App

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npx expo start
   ```

3. **Run the app:**
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Scan QR code with Expo Go app on your phone

## What is this Application?

A React Native mobile app for booking sports turf facilities, built as part of the KIXAR internship assignment.

### Features
- **Turf Details Screen**: View turf information, facilities, reviews, and pricing
- **Booking Screen**: Select date, time slots (with multi-hour support), court, and player count
- **My Bookings**: View and manage all bookings with offline storage

### Tech Stack
- React Native with Expo
- React Navigation (Stack Navigator)
- Context API (state management)
- AsyncStorage (local persistence)

## Assumptions

1. **Static Data**: Using a JSON file for turf data instead of a backend API
2. **Single Turf**: The app focuses on one turf's booking flow (can be extended to multiple turfs)
3. **Time Slots**: Generated hourly time slots for each period (Morning, Noon, Evening, Night)
4. **No Authentication**: Direct booking without user login or authentication system
5. **Local Storage**: All bookings are stored locally using AsyncStorage (no backend integration)
6. **Third Screen Navigation**: The "My Bookings" screen is accessible only after completing a booking via the "Next" button on the Booking Screen

## Time Spent

**Total: 4.5 hours**

## Known Issues

1. **CSS & Spacing Issues**: There are inconsistent spacing and alignment issues throughout the application that need refinement

2. **Time Selector Component**: The time slot selector on the Booking Screen has implementation issues that may affect user experience

3. **Navigation Flow**: The third screen (My Bookings) is not immediately obvious to users as it only appears after completing a booking via the "Next" button on the Booking Screen. A better navigation pattern (like a tab bar or menu) would improve discoverability

4. **Static Images**: Currently using placeholder image URLs that may not load properly in production

5. **Date Validation**: No restriction on selecting past dates

## Pending Improvements

### High Priority
- Fix CSS spacing and alignment issues across all screens
- Implement proper time slot selector functionality
- Add a bottom tab navigator or menu for better navigation to My Bookings screen
- Add form validation and error messages
- Replace placeholder images with proper assets

### Medium Priority
- Backend API integration for real-time turf data
- User authentication system
- Multiple turf listings screen
- Search and filter functionality
- Booking modification/cancellation flow

### Low Priority
- Push notifications for booking confirmations
- Payment gateway integration
- Dark mode support
- Social sharing features
- User profile and booking history management
