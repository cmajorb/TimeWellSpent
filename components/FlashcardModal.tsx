import React from 'react';
import { StyleSheet, View, Text, TextInput, Button, Dimensions, useColorScheme } from 'react-native';
import Modal from 'react-native-modal';

interface FlashcardModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSave: () => void;
    editedFront: string;
    editedBack: string;
    setEditedFront: (text: string) => void;
    setEditedBack: (text: string) => void;
}

export const FlashcardModal: React.FC<FlashcardModalProps> = ({
    isVisible,
    onClose,
    onSave,
    editedFront,
    editedBack,
    setEditedFront,
    setEditedBack
}) => {
    const colorScheme = useColorScheme(); // Detect current theme

    // Dynamic styles based on theme
    const modalBackgroundColor = colorScheme === 'dark' ? '#1e1e1e' : '#ffffff'; // Dark vs Light
    const modalTextColor = colorScheme === 'dark' ? '#dcdcdc' : '#000000'; // Dark vs Light
    const inputBackgroundColor = colorScheme === 'dark' ? '#2c2c2c' : '#f5f5f5'; // Dark vs Light input
    const borderColor = colorScheme === 'dark' ? '#555' : '#ddd'; // Dark vs Light border

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose} // Close the modal when tapping outside
            animationIn="slideInUp"
            animationOut="slideOutDown"
            backdropColor="rgba(0, 0, 0, 0.5)" // Transparent grey background
            backdropOpacity={1}
            style={styles.modal}
        >
            <View style={[styles.modalContent, { backgroundColor: modalBackgroundColor }]}>
                <Text style={[styles.modalTitle, { color: modalTextColor }]}>Edit Flashcard</Text>
                <Text style={[styles.inputLabel, { color: modalTextColor }]}>Front</Text>

                <TextInput
                    style={[styles.input, styles.textArea, { backgroundColor: inputBackgroundColor, borderColor: borderColor }]}
                    placeholder="Enter the front of the card"
                    value={editedFront}
                    onChangeText={setEditedFront}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top" // Ensures text starts at the top for multi-line
                />
                <Text style={[styles.inputLabel, { color: modalTextColor }]}>Back</Text>

                <TextInput
                    style={[styles.input, styles.textArea, { backgroundColor: inputBackgroundColor, borderColor: borderColor }]}
                    placeholder="Enter the back of the card"
                    value={editedBack}
                    onChangeText={setEditedBack}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                />
                <View style={styles.buttonContainer}>
                    <Button title="Save" onPress={onSave} />
                    <Button title="Cancel" color="red" onPress={onClose} />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modal: {
        margin: 0,
        justifyContent: 'flex-end',
    },
    modalContent: {
        height: '90%',
        backgroundColor: '#1e1e1e', // Dark background
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5, // Adds shadow effect for Android
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: 'white', // Light text color for contrast
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
        color: '#dcdcdc', // Slightly muted light color
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#555', // Subtle border color for dark theme
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
        backgroundColor: '#2c2c2c', // Dark input background
        color: 'white', // Light text color
    },
    textArea: {
        height: 100, // Makes the input box bigger for multi-line
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
});