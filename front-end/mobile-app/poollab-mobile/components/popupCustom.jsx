import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Animated,
} from 'react-native';

const CustomPopup = (props) => {
  const {
    visible = false,
    title = '',
    data = {},
    confirmText = 'OK',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    icon,
    containerStyles,
    titleStyles,
    dataStyles,
    buttonStyles,
    buttonTextStyles,
    modalStyles,
  } = props;

  const [animation] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    if (visible) {
      Animated.spring(animation, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1}
        onPress={onCancel}
      >
        <Animated.View
          style={[
            styles.modalContent,
            modalStyles,
            {
              transform: [{
                scale: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                })
              }],
              opacity: animation,
            }
          ]}
        >
          <View style={[styles.popupContainer, containerStyles]}>
            {icon && (
              <View style={styles.iconContainer}>
                {icon}
              </View>
            )}
            
            <Text style={[styles.title, titleStyles]}>
              {title}
            </Text>
            
            <View style={styles.dataContainer}>
              {Object.entries(data).map(([key, value]) => (
                <View key={key} style={styles.dataItem}>
                  <Text style={[styles.dataLabel, dataStyles]}>{key}:</Text>
                  <Text style={[styles.dataValue, dataStyles]}>{value}</Text>
                </View>
              ))}
            </View>

            <View style={styles.buttonContainer}>
              {cancelText && (
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton, buttonStyles]} 
                  onPress={onCancel}
                >
                  <Text style={[styles.buttonText, styles.cancelText, buttonTextStyles]}>
                    {cancelText}
                  </Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                style={[styles.button, styles.confirmButton, buttonStyles]} 
                onPress={onConfirm}
              >
                <Text style={[styles.buttonText, styles.confirmText, buttonTextStyles]}>
                  {confirmText}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  popupContainer: {
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  dataContainer: {
    marginVertical: 15,
    width: '100%',
  },
  dataItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  dataLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dataValue: {
    fontSize: 16,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1.3,
    borderColor: '#ddd',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cancelText: {
    color: '#666',
  },
  confirmText: {
    color: 'white',
  },
});

export default CustomPopup;