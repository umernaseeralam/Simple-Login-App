import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Animated, Dimensions, Text } from 'react-native';

const { width, height } = Dimensions.get('window');
const ICON_SIZE = Math.min(width, height) * 0.4;

const SplashScreen = () => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.3);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 2,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.iconContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Image
            source={require('../../assets/splash_icon.png')}
            style={[styles.icon, { width: ICON_SIZE, height: ICON_SIZE }]}
            resizeMode="contain"
          />
        </Animated.View>
      </View>
      <Animated.Text
        style={[
          styles.appText,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        Brickell Watches
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#059669',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  appText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    paddingBottom: 40,
  },
});

export default SplashScreen; 