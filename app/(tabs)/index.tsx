import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerImage={<></>}
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}>
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.title}>¡Bienvenido al Trabajo Práctico RN0!</ThemedText>
        <ThemedText style={styles.description}>
          En esta aplicación encontrarás:
        </ThemedText>
        <ThemedView style={styles.featureContainer}>
          <ThemedText type="subtitle">1. Lista de Tareas (Todo List)</ThemedText>
          <ThemedText>
            Organiza tus actividades diarias de manera eficiente.
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.featureContainer}>
          <ThemedText type="subtitle">2. Sudoku</ThemedText>
          <ThemedText>
            Desafía tu mente con este clásico juego de lógica.
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  featureContainer: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
});
