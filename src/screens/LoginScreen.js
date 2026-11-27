import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import showAlert from '../alert';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!email.trim() || !password)
      return showAlert('Missing details', 'Enter your email and password.');

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (e) {
      showAlert('Login failed', e.message);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="displaySmall" style={styles.title}>BookNest</Text>
      <Text style={styles.sub}>Log in to open your library</Text>

      <TextInput
        label="Email"
        mode="outlined"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        textColor="#F5F0E5"
        outlineColor="#30405A"
        activeOutlineColor="#D9B66F"
        placeholderTextColor="#B8B4A8"
        theme={{ colors: { onSurfaceVariant: '#D9B66F' } }}
      />

      <TextInput
        label="Password"
        mode="outlined"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        textColor="#F5F0E5"
        outlineColor="#30405A"
        activeOutlineColor="#D9B66F"
        placeholderTextColor="#B8B4A8"
        theme={{ colors: { onSurfaceVariant: '#D9B66F' } }}
      />

      <Button
        mode="contained"
        buttonColor="#D9B66F"
        textColor="#101A30"
        onPress={login}
        loading={loading}
        disabled={loading}
        style={styles.btn}
      >
        Login
      </Button>

      <Button textColor="#D9B66F" onPress={() => navigation.navigate('Register')}>
        New here? Create account
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center',
    padding: 24, backgroundColor: '#101A30',
  },
  title: { textAlign: 'center', fontWeight: 'bold', color: '#D9B66F' },
  sub: { textAlign: 'center', marginVertical: 24, color: '#F5F0E5' },
  input: { marginBottom: 12, backgroundColor: '#1B2942' },
  btn: { marginVertical: 8, paddingVertical: 4 },
});