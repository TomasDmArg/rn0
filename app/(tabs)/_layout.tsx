import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

/**
 * Props for the TabBarIconWrapper component
 */
type TabBarIconWrapperProps = {
  color: string;
  focused: boolean;
  name: string;
  size?: number;
};

/**
 * Wrapper component for TabBarIcon to avoid defining it inside the parent component
 * @param props - The props for the TabBarIconWrapper
 * @returns A TabBarIcon component
 */
const TabBarIconWrapper: React.FC<TabBarIconWrapperProps> = ({ color, focused, name, size }) => (
  <TabBarIcon
    name={(focused ? name : `${name}-outline`) as any}
    color={color}
    size={size}
  />
);

/**
 * Props for the TabBarIcon component
 */
type TabBarIconProps = {
  color: string;
  focused: boolean;
  size?: number;
};

/**
 * Home tab icon component
 */
const HomeTabIcon: React.FC<TabBarIconProps> = ({ color, focused, size }) => (
  <TabBarIconWrapper color={color} focused={focused} name="home" size={size} />
);

/**
 * To-do tab icon component
 */
const TodoTabIcon: React.FC<TabBarIconProps> = ({ color, focused, size }) => (
  <TabBarIconWrapper color={color} focused={focused} name="list" size={size ?? 30} />
);

/**
 * Sudoku tab icon component
 */
const SudokuTabIcon: React.FC<TabBarIconProps> = ({ color, focused, size }) => (
  <TabBarIconWrapper color={color} focused={focused} name="grid" size={size ?? 30} />
);

/**
 * TabLayout component for setting up the tab navigation
 * @returns A Tabs component with configured screens
 */
export default function TabLayout(): JSX.Element {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: HomeTabIcon,
        }}
      />
      <Tabs.Screen
        name="todo"
        options={{
          title: 'Todo',
          tabBarIcon: TodoTabIcon,
        }}
      />
      <Tabs.Screen
        name="sudoku"
        options={{
          title: 'Sudoku',
          tabBarIcon: SudokuTabIcon,
        }}
      />
    </Tabs>
  );
}