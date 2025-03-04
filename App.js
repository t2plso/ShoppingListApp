import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, TouchableOpacity } from 'react-native';
import { db } from './firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  const [item, setItem] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "shoppingList"), (snapshot) => {
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe(); 
  }, []);

  const addItem = async () => {
    if (item.trim()) {
      await addDoc(collection(db, "shoppingList"), { item: item.trim() });
      setItem('');
    }
  };

  const deleteItem = async (id) => {
    await deleteDoc(doc(db, "shoppingList", id));
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 20 }}>Shopping List</Text>

      <TextInput
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 10,
          paddingLeft: 10,
        }}
        placeholder="Enter item"
        value={item}
        onChangeText={setItem}
      />
      <Button title="Add Item" onPress={addItem} />

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 10,
              marginVertical: 5,
              backgroundColor: '#f0f0f0',
              borderRadius: 5,
            }}
          >
            <Text>{item.item}</Text>
            <TouchableOpacity onPress={() => deleteItem(item.id)}>
              <Ionicons name="trash" size={24} color="black" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
