import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');


export function Flashcard() {
  const [currentCard, setCurrentCard] = useState(0);

  const [isFlipped, setIsFlipped] = useState(false);
  const rotate = useSharedValue(0);

  const cards = [
    { front: 'Front of Card 1', back: 'Back of Card 1' },
    { front: 'Front of Card 2', back: 'Back of Card 2' },
    { front: 'Front of Card 3', back: 'Back of Card 3' },
  ];

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
    rotate.value = withTiming(isFlipped ? 0 : 180, { duration: 500 });
  };

  const handleSwipeUp = () => {
    if (currentCard < cards.length - 1) {
      setCurrentCard((prev) => prev + 1);
      setIsFlipped(false);
      rotate.value = 0; // Reset flip
    }
  };

  const handleSwipeDown = () => {
    if (currentCard > 0) {
      setCurrentCard((prev) => prev - 1);
      setIsFlipped(false);
      rotate.value = 0; // Reset flip
    }
  };

  const swipeGesture = Gesture.Pan()
  .onEnd((e) => {
    if (e.translationY < -50) handleSwipeUp(); // Swipe up
    if (e.translationY > 50) handleSwipeDown(); // Swipe down
  });

  const frontStyle = useAnimatedStyle(() => ({
    transform: [
      { rotateY: `${rotate.value}deg` },
    ],
    opacity: rotate.value > 90 ? 0 : 1,
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [
      { rotateY: `${rotate.value + 180}deg` },
    ],
    opacity: rotate.value > 90 ? 1 : 0,
  }));

  return (
    <GestureDetector gesture={swipeGesture}>
      <View style={styles.container}>
        <Animated.View style={[styles.card, styles.front, frontStyle]}>
          <Text style={styles.text}>{cards[currentCard].front}</Text>
        </Animated.View>
        <Animated.View style={[styles.card, styles.back, backStyle]}>
          <Text style={styles.text}>{cards[currentCard].back}</Text>
        </Animated.View>
        <Text style={styles.counter}>
          Card {currentCard + 1} of {cards.length}
        </Text>
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
    container: {
      width: width * 0.9, // 90% of the screen width
      height: height * 0.7, // 70% of the screen height
      perspective: '1000', // Required for 3D flipping
    },
    card: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backfaceVisibility: 'hidden',
        borderRadius: 10,
      },
      front: {
        backgroundColor: '#3498db',
      },
      back: {
        backgroundColor: '#2ecc71',
        transform: [{ rotateY: '180deg' }],
      },
      text: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
      },
      counter: {
        position: 'absolute',
        bottom: 10,
        fontSize: 16,
        color: '#000',
      },
    });
