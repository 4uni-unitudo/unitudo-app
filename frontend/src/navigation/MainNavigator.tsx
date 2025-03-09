import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { MainTabParamList } from './types';
import HomeScreen from '../screens/main/HomeScreen';
import CalendarScreen from '../screens/main/CalendarScreen';
import RidesScreen from '../screens/main/RidesScreen';
import HousingScreen from '../screens/main/HousingScreen';
import EventsScreen from '../screens/main/EventsScreen';
import GroupsScreen from '../screens/main/GroupsScreen';
import { colors } from '../theme/colors';
import NearbyPlacesScreen from '../screens/main/NearbyPlacesScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === 'Início') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Agenda') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Caronas') {
            iconName = focused ? 'car' : 'car-outline';
          } else if (route.name === 'Moradias') {
            iconName = focused ? 'bed' : 'bed-outline';
          } else if (route.name === 'Eventos') {
            iconName = focused ? 'happy' : 'happy-outline';
          } else if (route.name === 'Grupos') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Estabelecimentos') {
            iconName = focused ? 'storefront' : 'storefront-outline';
          } else {
            iconName = 'help-circle';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.teal,
        tabBarInactiveTintColor: colors.gray.dark,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Início" component={HomeScreen} />
      <Tab.Screen name="Agenda" component={CalendarScreen} />
      <Tab.Screen name="Caronas" component={RidesScreen} />
      <Tab.Screen name="Moradias" component={HousingScreen} />
      <Tab.Screen name="Eventos" component={EventsScreen} />
      <Tab.Screen name="Grupos" component={GroupsScreen} />
      <Tab.Screen name="Estabelecimentos" component={NearbyPlacesScreen} />
    </Tab.Navigator>
  );
};

export default MainNavigator;
