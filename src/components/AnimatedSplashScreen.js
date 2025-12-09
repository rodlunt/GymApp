import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { fontSize } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const LOGO_SIZE = SCREEN_WIDTH * 0.4;
const TEAL = '#14B8A6';

export default function AnimatedSplashScreen({ onAnimationComplete }) {
  const scale = useRef(new Animated.Value(1)).current; // Start at full size to match native splash
  const rotation = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(20)).current;
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Start animation after a brief delay to ensure component is mounted
    const timer = setTimeout(() => {
      // Logo spin animation (no zoom since we start at full size to match native splash)
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }).start(() => {
        // After logo animation, fade in the text
        Animated.parallel([
          Animated.timing(textOpacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(textTranslateY, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Wait a moment then complete
          setTimeout(() => {
            onAnimationComplete?.();
          }, 1200);
        });
      });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.Image
          source={require('../../assets/splash-icon.png')}
          style={[
            styles.logo,
            {
              transform: [{ rotate: spin }],
            },
          ]}
          resizeMode="contain"
        />
        <Animated.Text
          style={[
            styles.appName,
            {
              opacity: textOpacity,
              transform: [{ translateY: textTranslateY }],
            },
          ]}
        >
          Clean Reps
        </Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TEAL,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
  appName: {
    marginTop: 24,
    fontSize: fontSize.xxxl || 32,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
});
