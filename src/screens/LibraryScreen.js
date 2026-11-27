import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { SegmentedButtons, Text } from 'react-native-paper';
import { collection, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';
import BookCard from '../components/BookCard';

export default function LibraryScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [shelf, setShelf] = useState('want');

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    return onSnapshot(
      collection(db, 'users', uid, 'books'),
      snap => setBooks(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    );
  }, []);

  const filtered = books.filter(b => b.status === shelf);

  return (
    <View style={styles.container}>
      <SegmentedButtons
        style={styles.tabs}
        value={shelf}
        onValueChange={setShelf}
        theme={{
          colors: {
            secondaryContainer: '#D9B66F',
            onSecondaryContainer: '#101A30',
            surface: '#1B2942',
            onSurface: '#F5F0E5',
            outline: '#30405A',
          },
        }}
        buttons={['want', 'reading', 'finished'].map(v => ({
          value: v,
          label: v[0].toUpperCase() + v.slice(1),
        }))}
      />

      {!filtered.length && (
        <Text style={styles.empty}>No books here yet. Search and add some!</Text>
      )}

      <FlatList
        data={filtered}
        keyExtractor={b => b.id}
        renderItem={({ item }) => (
          <BookCard
            book={item}
            onPress={() => navigation.navigate('BookDetails', { book: item })}
            extra={item.rating ? (
              <Text style={styles.rating}>{'⭐'.repeat(item.rating)}</Text>
            ) : null}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#101A30' },
  tabs: { margin: 12 },
  empty: { textAlign: 'center', marginTop: 40, color: '#F5F0E5' },
  rating: { color: '#D9B66F' },
});