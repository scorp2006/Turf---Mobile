/**
 * Booking Context
 * Manages global booking state with AsyncStorage persistence
 */

import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage key for AsyncStorage
const STORAGE_KEY = '@turf_bookings';

// Create Context
const BookingContext = createContext();

/**
 * Booking Provider Component
 * Wraps the app to provide booking state to all components
 */
export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load bookings from AsyncStorage on mount
  useEffect(() => {
    loadBookings();
  }, []);

  // Save bookings to AsyncStorage whenever they change
  useEffect(() => {
    if (!loading) {
      saveBookings();
    }
  }, [bookings, loading]);

  /**
   * Load bookings from AsyncStorage
   */
  const loadBookings = async () => {
    try {
      const savedBookings = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedBookings) {
        const parsedBookings = JSON.parse(savedBookings);
        setBookings(parsedBookings);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Save bookings to AsyncStorage
   */
  const saveBookings = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch (error) {
      console.error('Error saving bookings:', error);
    }
  };

  /**
   * Add a new booking
   * @param {Object} booking - Booking details
   */
  const addBooking = (booking) => {
    const newBooking = {
      ...booking,
      id: `booking_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setBookings((prevBookings) => [newBooking, ...prevBookings]);
    return newBooking;
  };

  /**
   * Remove a booking by ID
   * @param {string} bookingId - ID of booking to remove
   */
  const removeBooking = (bookingId) => {
    setBookings((prevBookings) =>
      prevBookings.filter((booking) => booking.id !== bookingId)
    );
  };

  /**
   * Get a specific booking by ID
   * @param {string} bookingId - ID of booking
   * @returns {Object|null} Booking object or null
   */
  const getBooking = (bookingId) => {
    return bookings.find((booking) => booking.id === bookingId) || null;
  };

  /**
   * Clear all bookings
   */
  const clearAllBookings = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setBookings([]);
    } catch (error) {
      console.error('Error clearing bookings:', error);
    }
  };

  /**
   * Get bookings count
   * @returns {number} Total number of bookings
   */
  const getBookingsCount = () => {
    return bookings.length;
  };

  // Context value
  const value = {
    bookings,
    loading,
    addBooking,
    removeBooking,
    getBooking,
    clearAllBookings,
    getBookingsCount,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

/**
 * Custom hook to use Booking Context
 * @returns {Object} Booking context value
 * @throws {Error} If used outside BookingProvider
 */
export const useBookings = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};

export default BookingContext;
