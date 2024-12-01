import React, { useState, useEffect } from 'react';
import { 
  TouchableOpacity, 
  Animated, 
  StyleSheet, 
  View 
} from 'react-native';
import Icon from '@/assets/icons/icons'; // Adjust import to your icon library

const BackToTop = ({ 
  scrollY, 
  scrollViewRef, 
  visibilityThreshold = 300,
  containerStyle,
  iconSize = 24,
  iconColor = '#000000'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    const listenToScroll = scrollY.addListener(({ value }) => {
      const shouldBeVisible = value > visibilityThreshold;
      
      if (shouldBeVisible !== isVisible) {
        setIsVisible(shouldBeVisible);
        
        Animated.timing(fadeAnim, {
          toValue: shouldBeVisible ? 1 : 0,
          duration: 300,
          useNativeDriver: true
        }).start();
      }
    });

    return () => {
      scrollY.removeListener(listenToScroll);
    };
  }, [isVisible]);

  const scrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  if (!isVisible) return null;

  return (
    <Animated.View 
      style={[
        styles.container, 
        containerStyle,
        { 
          opacity: fadeAnim,
          transform: [
            {
              scale: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1]
              })
            }
          ]
        }
      ]}
    >
      <TouchableOpacity 
        onPress={scrollToTop} 
        style={styles.button}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Icon 
          name="arrowUpIcon"  // Adjust to match your icon library
          size={20} 
          strokeWidth={2.5}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  button: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default BackToTop;