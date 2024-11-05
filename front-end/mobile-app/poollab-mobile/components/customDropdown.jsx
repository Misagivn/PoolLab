import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, FlatList } from 'react-native';

const CustomDropdown = (props) => {
  const {
    data,
    onSelect,
    placeholder = 'Select an option',
    icon,
    containerStyles,
    dropdownStyles,
    textStyles,
    modalStyles,
    itemStyles,
    subLabelStyles,
  } = props;

  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const toggleDropdown = () => {
    setVisible(!visible);
  };

  const onItemSelect = (item) => {
    setSelectedItem(item);
    setVisible(false);
    if (onSelect) {
      onSelect(item);
    }
  };

  return (
    <View>
      <TouchableOpacity 
        style={[styles.dropdown, containerStyles]} 
        onPress={toggleDropdown}
      >
        {icon && icon}
        <Text style={[styles.dropdownText, textStyles]}>
          {selectedItem ? selectedItem.label : placeholder}
        </Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={visible}
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPressOut={() => setVisible(false)}
        >
          <View style={[styles.modalContent, modalStyles]}>
            <FlatList
              data={data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[styles.dropdownItem, itemStyles]}
                  onPress={() => onItemSelect(item)}
                >
                  <Text>{item.label}</Text>
                  <Text>{item.address}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 1.3,
    gap: 15,
    paddingHorizontal: 15,
  },
  dropdownText: {
    flex: 1,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    maxHeight: '50%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  }
});

export default CustomDropdown;