import Icon from '@/assets/icons/icons';
import { theme } from '@/constants/theme';
import React, {useState} from 'react';
import { View, Dimensions, Text, TouchableOpacity, Pressable  } from 'react-native';

const { width, height } = Dimensions.get('window');
const scannerSize = Math.min(width, height) * 0.7;

const QRScannerOverlay = () => {
  const [isFlashlightOn, setIsFlashlightOn] = useState(true);
  const toggleFlashlight = () => {
    setIsFlashlightOn(!isFlashlightOn);
    if (isFlashlightOn === false) {
      console.log('flashlight off');
    } else if (isFlashlightOn === true) {
      console.log('flashlight on');
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.topOverlay} />
      <View style={styles.middleOverlay}>
        <View style={styles.leftOverlay} />
        <View style={styles.scannerFrame}>
          <View style={[styles.corner, styles.topLeftCorner]} />
          <View style={[styles.corner, styles.topRightCorner]} />
          <View style={[styles.corner, styles.bottomLeftCorner]} />
          <View style={[styles.corner, styles.bottomRightCorner]} />
        </View>
        <View style={styles.rightOverlay} />
      </View>
      <View style={styles.textOverlay}>
        {/* <Text style={styles.text}>PoolLab</Text> */}
        <Text style={styles.text2}>Quét QR để kích hoạt bàn.</Text>
      </View>
      <View style={styles.flashlightContainer}>
        <Pressable onPress={() => {toggleFlashlight()}}>
          <Icon name='flashIcon' size={40} strokeWidth={1.5} color={isFlashlightOn ? 'white' : "#54DEFD"} />
        </Pressable>
      </View>
      <View style={styles.bottomOverlay} />
    </View>
  );
};

const styles = {
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  topOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  middleOverlay: {
    flexDirection: 'row',
    height: scannerSize,
  },
  leftOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  scannerFrame: {
    width: scannerSize,
    height: scannerSize,
    position: 'relative',
  },
  rightOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: theme.colors.primary,
  },
  topLeftCorner: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  topRightCorner: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  bottomLeftCorner: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  bottomRightCorner: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  textOverlay: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  text: {
    color: theme.colors.primary,
    fontSize: 40,
    fontWeight: 'bold',
  },
  text2: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'normal',
    marginTop: 10,
    marginBottom: 10,
  },
  flashlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    paddingTop: 50,
    justifyContent: 'center',
  },
};

export default QRScannerOverlay;