import React, { useState } from 'react';
import { StyleSheet, View, Text, Dimensions, Pressable } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const { height } = Dimensions.get('window');

const words = [
    { front: 'alcantarilla', back: 'Sewer' },
    { front: 'avaro', back: 'Greedy' },
    { front: 'ileso', back: 'Unharmed' },
    { front: 'atinar', back: 'To hit the target' },
];

export function Flashcard() {
    return (
        <View style={styles.container}>
            <Swiper
                cards={words}
                renderCard={(card) => <FlipCard card={card} />}
                onSwiped={(cardIndex) => console.log(cardIndex)}
                onSwipedAll={() => console.log('onSwipedAll')}
                // goBackToPreviousCardOnSwipeBottom={true}
                // disableBottomSwipe={true}
                horizontalSwipe={false}
                infinite={true}
                cardIndex={0}
                backgroundColor={'#000'}
                stackSeparation={15}
                stackSize={3}
            />
        </View>
    );
}

const FlipCard = ({ card }: { card: { front: string; back: string } }) => {
    const [flipped, setFlipped] = useState(false);
    const rotation = useSharedValue(0);

    const handlePress = () => {
        setFlipped(!flipped);
        rotation.value = withTiming(flipped ? 0 : 180, { duration: 500 });
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

    return (
        <Pressable style={styles.card} onPress={handlePress}>
            <Animated.View style={[styles.cardContent, styles.cardFront, frontAnimatedStyle]}>
                <Text style={styles.text}>{card.front}</Text>
            </Animated.View>
            <Animated.View style={[styles.cardContent, styles.cardBack, backAnimatedStyle]}>
                <Text style={styles.text}>{card.back}</Text>
            </Animated.View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000',
    },
    card: {
        height: height * 0.6,
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
    },
    cardBack: {
        backgroundColor: '#4caf50',
    },
    text: {
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 'bold',
        color: '#FFF',
    },
});