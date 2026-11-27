import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/bird-logo.jpeg')} style={styles.logo} />
      <Text variant="headlineLarge" style={styles.title}>BookNest</Text>
      <Text style={styles.sub}>Your pocket library</Text>
      <ActivityIndicator color="#D9B66F" style={{ marginTop: 24 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#101A30',
    alignItems: 'center', justifyContent: 'center',
  },
  logo: { width: 140, height: 140, borderRadius: 28 },
  title: { color: '#D9B66F', marginTop: 16, fontWeight: 'bold' },
  sub: { color: '#F5F0E5', marginTop: 4 },
});