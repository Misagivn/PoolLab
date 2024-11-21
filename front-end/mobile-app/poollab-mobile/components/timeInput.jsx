import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, Modal, FlatList, Dimensions } from 'react-native'
import {theme} from '@/constants/theme'

interface TimePickerProps {
  maxHours?: number;
  onTimeSelect: (time: string) => void;
  initialTime?: string;
}

const generateTimeOptions = (maxHours: number = 24): string[] => {
  const times: string[] = []
  for (let hour = 0; hour < maxHours; hour++) {
    times.push(`${hour.toString().padStart(2, '0')}:00`)
    times.push(`${hour.toString().padStart(2, '0')}:30`)
  }
  return times
}

const TimePicker: React.FC<TimePickerProps> = ({ 
  maxHours = 24, 
  onTimeSelect, 
  initialTime 
}) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedTime, setSelectedTime] = useState(initialTime || '00:00')
  const timeOptions = generateTimeOptions(maxHours)

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    onTimeSelect(time)
    setModalVisible(false)
  }

  return (
    <View>
      <TouchableOpacity 
        onPress={() => setModalVisible(true)}
        style={styles.timeInput}
      >
        <Text>{selectedTime}</Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={timeOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.timeOption}
                  onPress={() => handleTimeSelect(item)}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
            <TouchableOpacity 
              onPress={() => setModalVisible(false)}
              style={styles.cancelButton}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  timeInput: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 1.3,
    paddingHorizontal: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: Dimensions.get('window').width * 0.8,
    maxHeight: Dimensions.get('window').height * 0.6,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  timeOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  cancelButton: {
    padding: 15,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  }
})

export default TimePicker