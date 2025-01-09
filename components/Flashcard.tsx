import React, { useState } from 'react';
import { StyleSheet, View, Text, Dimensions, Pressable, ImageBackground, Modal, TextInput, Button } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from 'react-native-reanimated';
import { FlashcardType } from '@/components/types/FlashcardType';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { FlashcardModal } from '@/components/FlashcardModal';

const { height } = Dimensions.get('window');


export function Flashcard({ cards, handleEdit }: { cards: FlashcardType[], handleEdit: (index: number, updatedCard: FlashcardType) => void }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    return (
        <View style={styles.container}>
            {cards && cards.length > 0 && (
                <Swiper
                    cards={cards}
                    renderCard={(card, index) => <FlipCard card={card} index={index} onEdit={handleEdit} isTopCard={index === currentIndex} />}
                    onSwiped={(cardIndex) => setCurrentIndex((cardIndex + 1) % cards.length)}
                    onSwipedAll={() => console.log('onSwipedAll')}
                    // goBackToPreviousCardOnSwipeBottom={true}
                    // disableBottomSwipe={true}
                    horizontalSwipe={false}
                    infinite={true}
                    cardIndex={0}
                    backgroundColor={'#000'}
                    stackSeparation={15}
                    stackSize={2}
                />)}
        </View>
    );
}

const FlipCard = ({ card, index, onEdit, isTopCard }: {
    card: FlashcardType;
    index: number;
    onEdit: (index: number, updatedCard: FlashcardType) => void
    isTopCard: boolean;
}) => {
    const [flipped, setFlipped] = useState(false);
    const rotation = useSharedValue(0);
    const buttonOpacity = useSharedValue(100);
    const [isModalVisible, setModalVisible] = useState(false);
    const [editedFront, setEditedFront] = useState(card.front);
    const [editedBack, setEditedBack] = useState(card.back);

    const handlePress = () => {
        console.log("flipping");
        setFlipped(!flipped);
        rotation.value = withTiming(flipped ? 0 : 180, { duration: 500 }, () => {
            // Fade in the button after the flip animation
            buttonOpacity.value = withDelay(100, withTiming(1, { duration: 300 }));
        });
        // Immediately hide the button when flipping starts
        buttonOpacity.value = 0;
    };

    const handleSave = () => {
        const editedCard: FlashcardType = {
            front: editedFront,
            back: editedBack,
            image: require('@/assets/images/music.jpg'),
        };
        onEdit(index, editedCard);
        setModalVisible(false);
    };

    const frontAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            { rotateY: `${rotation.value}deg` },
        ],
        backfaceVisibility: 'hidden',
    }));

    const backAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            { rotateY: `${rotation.value + 180}deg` },
        ],
        backfaceVisibility: 'hidden',
    }));

    const buttonAnimatedStyle = useAnimatedStyle(() => ({
        opacity: buttonOpacity.value,
    }));

    return (
        <>
            <Pressable style={styles.card} onPress={handlePress}>
                <Animated.View style={[styles.cardContent, styles.cardFront, frontAnimatedStyle]}>
                    <ImageBackground
                        source={require('@/assets/images/music.jpg')}
                        style={styles.cardBack}
                    >
                        <View style={styles.overlay}>
                            <Text style={styles.text}>{card.front}</Text>
                        </View>
                    </ImageBackground>
                </Animated.View>
                <Animated.View style={[styles.cardContent, styles.cardBack, backAnimatedStyle]}>
                    <ImageBackground
                        source={require('@/assets/images/music2.jpg')}
                        style={styles.cardBack}
                    >
                        <View style={styles.overlay}>
                            <Text style={styles.text}>{card.back}</Text>
                        </View>
                    </ImageBackground>
                </Animated.View>
                {isTopCard && (
                    <Animated.View style={[styles.editButton, buttonAnimatedStyle]}>
                        <Pressable onPress={() => setModalVisible(true)}>
                            <Icon name="edit" size={24} color="#FFF" />
                        </Pressable>
                    </Animated.View>
                )}
            </Pressable>

            <FlashcardModal
                isVisible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onSave={handleSave}
                editedFront={editedFront}
                editedBack={editedBack}
                title={"Edit Flashcard"}
                setEditedFront={setEditedFront}
                setEditedBack={setEditedBack}
            />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000',
    },
    card: {
        height: height * 0.6,
        position: 'relative',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        overflow: 'hidden',
    },
    cardContent: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backfaceVisibility: 'hidden',
    },
    cardFront: {
        backgroundColor: '#ADD8E6',
        flex: 1, // Take up the full size of the card
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    cardBack: {
        backgroundColor: '#4caf50',
        flex: 1, // Take up the full size of the card
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    overlay: {
        flex: 1, // Cover the entire card
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.3)', // Transparent white
        width: '100%',
        height: '100%',
    },
    imageBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    text: {
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 'bold',
        color: '#000',
        margin: 5,
    },
    editButton: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        backgroundColor: '#00000080',
        width: 60, // Circle diameter
        height: 60, // Circle diameter
        borderRadius: 30, // Make it circular
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5, // Shadow on Android
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