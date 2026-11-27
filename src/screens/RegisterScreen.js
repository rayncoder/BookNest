import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import showAlert from '../alert';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const inputProps = {
    mode: 'outlined',
    style: styles.input,
    textColor: '#F5F0E5',
    outlineColor: '#30405A',
    activeOutlineColor: '#D9B66F',
    placeholderTextColor: '#B8B4A8',
    theme: { colors: { onSurfaceVariant: '#D9B66F' } },
  };

  const register = async () => {
    if (!name.trim() || !email.trim() || password.length < 6)
      return showAlert('Check your details', 'Fill all fields. Password needs at least 6 characters.');

    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(user, { displayName: name.trim() });
      await setDoc(doc(db, 'users', user.uid), {
        name: name.trim(), email: email.trim(), goal: 12,
      });
    } catch (e) {
      showAlert('Registration failed', e.message);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Create account</Text>

      <TextInput {...inputProps} label="Name" value={name}
        onChangeText={setName} />
      <TextInput {...inputProps} label="Email" value={email}
        onChangeText={setEmail} autoCapitalize="none"
        keyboardType="email-address" />
      <TextInput {...inputProps} label="Password" value={password}
        onChangeText={setPassword} secureTextEntry />

      <Button mode="contained" buttonColor="#D9B66F" textColor="#101A30"
        onPress={register} loading={loading} disabled={loading} style={styles.btn}>
        Register
      </Button>

      <Button textColor="#D9B66F" onPress={() => navigation.goBack()}>
        Already have an account? Login
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center',
    padding: 24, backgroundColor: '#101A30',
  },
  title: {
    textAlign: 'center', marginBottom: 24,
    fontWeight: 'bold', color: '#D9B66F',
  },
  input: { marginBottom: 12, backgroundColor: '#1B2942' },
  btn: { marginVertical: 8, paddingVertical: 4 },
});