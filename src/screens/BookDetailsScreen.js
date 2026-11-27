import React, { useEffect, useState } from 'react';
import { ScrollView, View, Image, StyleSheet } from 'react-native';
import { Text, Button, SegmentedButtons, TextInput, IconButton, ActivityIndicator } from 'react-native-paper';
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { getWork, coverUrl } from '../api';
import showAlert from '../alert';

export default function BookDetailsScreen({ route, navigation }) {
  const { book } = route.params;
  const ref = doc(db, 'users', auth.currentUser.uid, 'books', book.id);

  const [desc, setDesc] = useState('');
  const [status, setStatus] = useState('want');
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setDesc(await getWork(book.id));
      } catch {
        setDesc('Description unavailable.');
      }

      try {
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const d = snap.data();
          setStatus(d.status || 'want');
          setRating(d.rating || 0);
          setNotes(d.notes || '');
          setSaved(true);
        }
      } catch {}

      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setBusy(true);
    try {
      await setDoc(ref, {
        title: book.title,
        author: book.author,
        coverId: book.coverId || null,
        year: book.year || null,
        status, rating, notes,
        ...(!saved && { addedAt: serverTimestamp() }),
      }, { merge: true });
      setSaved(true);
      showAlert('Saved', 'Book saved to your library.');
    } catch (e) {
      showAlert('Error', e.message);
    }
    setBusy(false);
  };

  const remove = async () => {
    try {
      await deleteDoc(ref);
      navigation.goBack();
    } catch (e) {
      showAlert('Error', e.message);
    }
  };

  const uri = coverUrl(book.coverId, 'L');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {uri ? <Image source={{ uri }} style={styles.cover} /> : <Text style={{ fontSize: 64 }}>📘</Text>}

      <Text variant="headlineSmall" style={styles.title}>{book.title}</Text>
      <Text variant="titleMedium" style={styles.text}>{book.author}</Text>

      {loading ? <ActivityIndicator style={{ margin: 24 }} color="#D9B66F" /> : (
        <>
          <Text style={styles.desc}>{desc}</Text>

          <Text variant="titleMedium" style={styles.label}>Shelf</Text>
          <SegmentedButtons
            value={status}
            onValueChange={setStatus}
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

          <Text variant="titleMedium" style={styles.label}>Your rating</Text>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map(n => (
              <IconButton
                key={n}
                icon={n <= rating ? 'star' : 'star-outline'}
                iconColor="#D9B66F"
                size={32}
                onPress={() => setRating(n === rating ? 0 : n)}
              />
            ))}
          </View>

          <TextInput
            label="Your notes"
            mode="outlined"
            multiline
            numberOfLines={3}
            value={notes}
            onChangeText={setNotes}
            textColor="#F5F0E5"
            placeholderTextColor="#B8B4A8"
            outlineColor="#30405A"
            activeOutlineColor="#D9B66F"
            style={styles.input}
          />

          <Button
            mode="contained"
            buttonColor="#D9B66F"
            textColor="#101A30"
            onPress={save}
            loading={busy}
            disabled={busy}
            style={styles.btn}
          >
            {saved ? 'Update library' : 'Add to library'}
          </Button>

          {saved && (
            <Button textColor="#D9B66F" onPress={remove}>
              Remove from library
            </Button>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#101A30',
  },
  cover: { width: 180, height: 260, borderRadius: 10, marginBottom: 12 },
  title: { textAlign: 'center', fontWeight: 'bold', marginBottom: 4, color: '#F5F0E5' },
  text: { color: '#F5F0E5' },
  desc: { marginVertical: 16, color: '#F5F0E5' },
  label: { alignSelf: 'flex-start', marginTop: 16, marginBottom: 8, color: '#D9B66F' },
  stars: { flexDirection: 'row' },
  input: { width: '100%', backgroundColor: '#1B2942' },
  btn: { marginTop: 16, width: '100%', paddingVertical: 4 },
});