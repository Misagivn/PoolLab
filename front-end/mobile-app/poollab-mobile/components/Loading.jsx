import { StyleSheet, View, Animated, Easing } from 'react-native'
import React, { useEffect, useRef } from 'react'

const Loading = ({ 
  size = 40, 
  color = "#00BD9D",
  style,
  duration = 1000,
}) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startSpinning();
  }, []);

  const startSpinning = () => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1000,
        duration: duration,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start();
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <View style={[styles.container, style]}>
      <Animated.View 
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderWidth: size / 8,
            borderRadius: size / 2,
            borderColor: color,
            transform: [{ rotate: spin }]
          }
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  circle: {
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
  }
})

export default Loading