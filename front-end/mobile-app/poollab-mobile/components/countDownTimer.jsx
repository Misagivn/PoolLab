import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { theme } from '@/constants/theme';

const CountdownTimer = forwardRef(({ initialTime, onComplete, onStop }, ref) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsActive(false);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, onComplete]);

  useEffect(() => {
    if (initialTime) {
      const [hours, minutes] = initialTime.split(':').map(Number);
      setTimeLeft((hours * 3600) + (minutes * 60));
      setIsActive(true);
    }
  }, [initialTime]);

  const formatTimeHHMMSS = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimeHHMM = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const stopTimer = () => {
    if (isActive) {  // Only stop if timer is active
      setIsActive(false);
      const remainingTime = formatTimeHHMM(timeLeft);
      onStop?.(remainingTime);
    }
  };

  // Expose stopTimer to parent through ref
  useImperativeHandle(ref, () => ({
    stopTimer,
    getRemainingTime: () => formatTimeHHMM(timeLeft)
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{formatTimeHHMMSS(timeLeft)}</Text>
      {isActive && (
        <TouchableOpacity onPress={stopTimer} style={styles.stopButton}>
          <Text style={styles.stopButtonText}>Stop</Text>
        </TouchableOpacity>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1.3,
    paddingHorizontal: 15,
  },
  timerText: {
    fontSize: 16,
    flex: 1,
  },
  stopButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
  stopButtonText: {
    color: 'white',
    fontSize: 12,
  }
});

export default CountdownTimer;