import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Keyboard } from 'react-native';
import { Searchbar, Text, ActivityIndicator } from 'react-native-paper';
import { searchBooks } from '../api';
import BookCard from '../components/BookCard';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const search = async () => {
    if (!query.trim()) return;
    Keyboard.dismiss();
    setLoading(true);
    setError('');
    try {
      setResults(await searchBooks(query.trim()));
      setSearched(true);
    } catch {
      setError('Search failed. Check your internet and try again.');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search books or authors"
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={search}
        onIconPress={search}
        style={styles.bar}
        inputStyle={{ color: '#F5F0E5' }}
        placeholderTextColor="#B8B4A8"
        iconColor="#D9B66F"
      />

      {loading && <ActivityIndicator color="#D9B66F" style={{ margin: 32 }} />}
      {!!error && <Text style={styles.msg}>{error}</Text>}
      {!loading && searched && !results.length && (
        <Text style={styles.msg}>No books found.</Text>
      )}

      <FlatList
        data={results}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <BookCard book={item} onPress={() =>
            navigation.navigate('BookDetails', { book: item })
          } />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#101A30' },
  bar: { margin: 12, backgroundColor: '#1B2942' },
  msg: { textAlign: 'center', marginTop: 24, color: '#F5F0E5' },
});