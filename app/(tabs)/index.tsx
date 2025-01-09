import { Flashcard } from '@/components/Flashcard'; // Adjust the path if the Flashcard component is in a different folder
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Modal, Pressable, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlashcardType } from '@/components/types/FlashcardType'; 
import { FlashcardModal } from '@/components/FlashcardModal';



const STORAGE_KEY = '@flashcards';

export default function HomeScreen() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');

  const newCard: FlashcardType = {
    front: 'alcantarilla',
    back: 'Sewer',
    image: require('@/assets/images/flowers.jpg'), // Ensure you have a default image in assets
  };
  const [cards, setCards] = useState([] as FlashcardType[]);

  const handleEdit = (index: number, updatedCard: FlashcardType) => {
    const updatedCards = [...cards];
    updatedCards[index] = { ...updatedCards[index], ...updatedCard };
    setCards(updatedCards);
    console.log("edit called");
  };

  useEffect(() => {
    const loadCards = async () => {
      try {
        // await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([]));
        const storedCards = await AsyncStorage.getItem(STORAGE_KEY);
        console.log('storedCards:', storedCards);
        if (storedCards !== null) {
          setCards(JSON.parse(storedCards));
        }
      } catch (error) {
        console.error('Failed to load flashcards from storage:', error);
      }
    };
    loadCards();
  }, []);

  useEffect(() => {
    const saveCards = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
        console.log("saved cards: ", cards);
      } catch (error) {
        console.error('Failed to save flashcards to storage:', error);
      }
    };
    saveCards();
  }, [cards]);


  const addNewCard = () => {
    if (newFront.trim() && newBack.trim()) {
      const newCard: FlashcardType = {
        front: newFront.trim(),
        back: newBack.trim(),
        image: require('@/assets/images/flowers.jpg'), // Ensure you have a default image in assets
      };
      setCards([...cards, newCard]);
      setNewFront('');
      setNewBack('');
      setModalVisible(false);
    }
  };

  return (
    <>
      <Flashcard cards={cards} handleEdit={handleEdit} />
      <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+</Text>
      </Pressable>

      <FlashcardModal
                isVisible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onSave={addNewCard}
                editedFront={newFront}
                editedBack={newBack}
                title={"New Flashcard"}
                setEditedFront={setNewFront}
                setEditedBack={setNewBack}
            />
    </>
  );
}

const styles = StyleSheet.create({

  addButton: {
    position: 'absolute',
    bottom: 120,
    right: 30,
    backgroundColor: '#4caf50',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 999
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});