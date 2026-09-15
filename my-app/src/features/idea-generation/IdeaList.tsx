// 담당: LLM — 생성된 아이디어 목록을 보여주는 UI

import React from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { Idea } from '../../shared/types/pipeline';

interface IdeaListProps {
  ideas: Idea[];
  isLoading: boolean;
  error: string | null;
}

export const IdeaList: React.FC<IdeaListProps> = ({ ideas, isLoading, error }) => {
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>LLM이 아이디어를 생성하는 중...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>오류 발생: {error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={ideas}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item }) => (
        <View style={styles.card}>
          {item.category && <Text style={styles.category}>{item.category}</Text>}
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      )}
      ListEmptyComponent={
        <Text style={styles.emptyText}>생성된 아이디어가 없습니다.</Text>
      }
    />
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  loadingText: { marginTop: 8, fontSize: 14, color: '#666' },
  errorText: { color: 'red', fontSize: 14 },
  listContainer: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  category: { fontSize: 12, color: '#007AFF', fontWeight: 'bold', marginBottom: 4 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 6, color: '#333' },
  description: { fontSize: 14, color: '#555', lineHeight: 20 },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 32 },
});