import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';


export default function SearchBar({searchQuery , setSearchQuery , handleSearch}) {
 

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Rechercher..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <Ionicons name="search" size={20} color="#999" style={styles.icon} />

       
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ccc',
    borderRadius: 100,
    paddingHorizontal: 15,
    paddingVertical: 5,
    elevation: 3, // Ombre pour Android
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
  clearButton: {
    padding: 5,
  },
});
