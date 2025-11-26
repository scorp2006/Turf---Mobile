/**
 * App Navigator
 * Navigation configuration for the app
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TurfDetailsScreen from '../screens/TurfDetailsScreen';
import BookingScreen from '../screens/BookingScreen';
import MyBookingsScreen from '../screens/MyBookingsScreen';

import { COLORS } from '../constants/colors';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="TurfDetails"
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.white,
          },
          headerTintColor: COLORS.textPrimary,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerShadowVisible: true,
        }}
      >
        <Stack.Screen
          name="TurfDetails"
          component={TurfDetailsScreen}
          options={{
            title: 'Turf Details',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Booking"
          component={BookingScreen}
          options={{
            title: '',
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="MyBookings"
          component={MyBookingsScreen}
          options={{
            title: 'My Bookings',
            headerBackTitleVisible: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
