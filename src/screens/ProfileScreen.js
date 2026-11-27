import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card, ProgressBar, IconButton, Avatar } from 'react-native-paper';
import { signOut } from 'firebase/auth';
import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function ProfileScreen() {
  const user = auth.currentUser;
  const [books, setBooks] = useState([]);
  const [goal, setGoal] = useState(12);

  useEffect(() => {
    const u1 = onSnapshot(collection(db, 'users', user.uid, 'books'),
      s => setBooks(s.docs.map(d => d.data())));
    const u2 = onSnapshot(doc(db, 'users', user.uid),
      s => s.exists() && s.data().goal && setGoal(s.data().goal));
    return () => { u1(); u2(); };
  }, []);

  const finished = books.filter(b => b.status === 'finished').length;
  const reading = books.filter(b => b.status === 'reading').length;

  const changeGoal = delta => {
    const g = Math.max(1, goal + delta);
    setGoal(g);
    setDoc(doc(db, 'users', user.uid), { goal: g }, { merge: true });
  };

  return (
    <View style={styles.container}>
      <Avatar.Text size={72}
        label={(user.displayName || 'R')[0].toUpperCase()}
        style={styles.avatar}
        color="#101A30"
      />

      <Text variant="headlineSmall" style={styles.name}>
        {user.displayName || 'Reader'}
      </Text>
      <Text style={styles.text}>{user.email}</Text>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.text}>Reading goal</Text>
          <View style={styles.goal}>
            <IconButton icon="minus" iconColor="#D9B66F"
              onPress={() => changeGoal(-1)} />
            <Text variant="headlineSmall" style={styles.text}>
              {finished} / {goal} books
            </Text>
            <IconButton icon="plus" iconColor="#D9B66F"
              onPress={() => changeGoal(1)} />
          </View>
          <ProgressBar
            progress={Math.min(finished / goal, 1)}
            color="#D9B66F"
            style={styles.progress}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.text}>Total saved: {books.length}</Text>
          <Text style={styles.text}>Currently reading: {reading}</Text>
          <Text style={styles.text}>Finished: {finished}</Text>
        </Card.Content>
      </Card>

      <Button mode="outlined" textColor="#D9B66F"
        icon="logout" onPress={() => signOut(auth)}
        style={styles.logout}>
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, alignItems: 'center', padding: 24,
    backgroundColor: '#101A30',
  },
  avatar: { backgroundColor: '#D9B66F' },
  name: { marginTop: 12, fontWeight: 'bold', color: '#D9B66F' },
  text: { color: '#F5F0E5' },
  card: {
    width: '100%', marginTop: 16,
    backgroundColor: '#1B2942', borderColor: '#30405A',
  },
  goal: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
  },
  progress: { backgroundColor: '#30405A', height: 7 },
  logout: { marginTop: 24, borderColor: '#D9B66F' },
});