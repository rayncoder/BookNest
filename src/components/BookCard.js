import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { coverUrl } from '../api';

export default function BookCard({ book, onPress, compact = false, extra = null }) {
  const uri = coverUrl(book.coverId);
  const size = compact ? styles.small : styles.cover;

  return (
    <Card style={compact ? styles.compact : styles.card} onPress={onPress}>
      {compact ? (
        <Card.Content style={styles.compactContent}>
          {uri ? (
            <Image source={{ uri }} style={size} />
          ) : (
            <View style={[size, styles.noCover]}>
              <Text>📘</Text>
            </View>
          )}

          <View style={styles.content}>
            <Text variant="labelLarge" numberOfLines={2} style={styles.text}>
              {book.title}
            </Text>
            <Text variant="bodySmall" numberOfLines={1} style={styles.sub}>
              {book.author}
            </Text>
          </View>
        </Card.Content>
      ) : (
        <Card.Content style={styles.row}>
          {uri ? (
            <Image source={{ uri }} style={size} />
          ) : (
            <View style={[size, styles.noCover]}>
              <Text>📘</Text>
            </View>
          )}

          <View style={styles.info}>
            <Text variant="titleMedium" numberOfLines={2} style={styles.text}>
              {book.title}
            </Text>
            <Text style={styles.sub}>{book.author}</Text>
            {book.year ? (
              <Text style={styles.sub}>First published {book.year}</Text>
            ) : null}
            {extra}
          </View>
        </Card.Content>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 6,
    marginHorizontal: 12,
    backgroundColor: '#1B2942',
  },
  compact: {
    width: 140,
    marginRight: 12,
    paddingBottom: 8,
    backgroundColor: '#1B2942',
  },
  compactContent: {
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  row: { flexDirection: 'row' },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  cover: { width: 70, height: 100, borderRadius: 6 },
  small: {
    width: 140,
    height: 190,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  noCover: {
    backgroundColor: '#263650',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { paddingTop: 8 },
  text: { color: '#F5F0E5' },
  sub: { color: '#D9B66F' },
});