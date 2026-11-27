const BASE = 'https://openlibrary.org';

export const coverUrl = (id, size = 'M') =>
  id ? `https://covers.openlibrary.org/b/id/${id}-${size}.jpg` : null;

const formatBook = (b) => ({
  id: b.key.replace('/works/', ''),
  title: b.title,
  author: b.author_name?.[0] || b.authors?.[0]?.name || 'Unknown author',
  coverId: b.cover_i || b.cover_id || null,
  year: b.first_publish_year || null,
});

export async function searchBooks(query) {
  const res = await fetch(
    `${BASE}/search.json?q=${encodeURIComponent(query)}&limit=20&fields=key,title,author_name,cover_i,first_publish_year`
  );
  if (!res.ok) throw new Error('Search failed');
  return (await res.json()).docs.map(formatBook);
}

export async function getSubject(subject) {
  const res = await fetch(`${BASE}/subjects/${encodeURIComponent(subject)}.json?limit=12`);
  if (!res.ok) throw new Error('Could not load books');
  return (await res.json()).works.map(formatBook);
}

export async function getWork(id) {
  const res = await fetch(`${BASE}/works/${id}.json`);
  if (!res.ok) throw new Error('Could not load details');
  const d = (await res.json()).description;
  return (typeof d === 'object' ? d?.value : d) || 'No description available.';
}

export async function getRecommendations(book, excludeIds = []) {
  const res = await fetch(`${BASE}/works/${book.id}.json`);
  if (!res.ok) throw new Error('Could not load recommendations');

  const data = await res.json();
  const subjects = (data.subjects || []).slice(0, 3);
  const results = await Promise.all(
    subjects.map((s) => getSubject(s.toLowerCase().replace(/[^a-z0-9]+/g, '_')))
  );

  return [...new Map(
    results.flat()
      .filter((b) => b.id !== book.id && !excludeIds.includes(b.id))
      .map((b) => [b.id, b])
  ).values()].slice(0, 10);
}