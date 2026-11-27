import React, { useEffect, useState } from 'react';
import { ScrollView, FlatList, View, StyleSheet } from 'react-native';
import { Text, ActivityIndicator, Button } from 'react-native-paper';
import { getSubject, getRecommendations } from '../api';
import { collection, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';
import BookCard from '../components/BookCard';

const SUBJECTS = [
  { key: 'fantasy', label: 'Fantasy' },
  { key: 'science_fiction', label: 'Science Fiction' },
  { key: 'self-help', label: 'Self Help' },
  { key: 'history', label: 'History' },
];

export default function HomeScreen({ navigation }) {
  const [data, setData] = useState({});
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const results = await Promise.all(SUBJECTS.map(s => getSubject(s.key)));
      setData(Object.fromEntries(SUBJECTS.map((s, i) => [s.key, results[i]])));
    } catch {
      setError('Could not load books. Check your internet connection.');
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    return onSnapshot(collection(db, 'users', uid, 'books'), async snap => {
      const books = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const finished = books.filter(b => b.status === 'finished');

      if (!finished.length) return setRecommended([]);

      try {
        const results = await Promise.all(
          finished.map(b => getRecommendations(b, books.map(x => x.id)))
        );
        setRecommended([...new Map(results.flat().map(b => [b.id, b])).values()]);
      } catch {
        setRecommended([]);
      }
    });
  }, []);

  const openBook = book => navigation.navigate('BookDetails', { book });

  const renderBooks = books => (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={books}
      keyExtractor={b => b.id}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      renderItem={({ item }) => (
        <BookCard compact book={item} onPress={() => openBook(item)} />
      )}
    />
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text variant="headlineSmall" style={styles.hello}>
        Hello, {auth.currentUser?.displayName || 'Reader'}
      </Text>
      <Text style={styles.sub}>Discover your next read</Text>

      {loading && <ActivityIndicator color="#D9B66F" style={{ marginTop: 40 }} />}

      {!!error && (
        <View style={styles.error}>
          <Text style={styles.text}>{error}</Text>
          <Button onPress={load} textColor="#D9B66F">Retry</Button>
        </View>
      )}

      {!loading && !error && (
        <>
          {!!recommended.length && (
            <View style={styles.section}>
              <Text variant="titleLarge" style={styles.heading}>Recommended for you</Text>
              {renderBooks(recommended)}
            </View>
          )}

          {SUBJECTS.map(s => (
            <View key={s.key} style={styles.section}>
              <Text variant="titleLarge" style={styles.heading}>{s.label}</Text>
              {renderBooks(data[s.key] || [])}
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#101A30' },
  content: { flexGrow: 1, backgroundColor: '#101A30' },
  hello: { margin: 16, marginBottom: 4, fontWeight: 'bold', color: '#F5F0E5' },
  sub: { marginHorizontal: 16, marginBottom: 12, color: '#D9B66F' },
  section: { marginBottom: 16 },
  heading: { margin: 16, marginBottom: 8, color: '#D9B66F' },
  text: { color: '#F5F0E5' },
  error: { alignItems: 'center', marginTop: 40 },
});