import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, FlatList } from 'react-native';

const CustomDateInput = (props) => {
    const {
        onDateSelect,
        placeholder = 'Select date',
        containerStyles,
        dropdownStyles,
        textStyles,
        modalStyles,
        itemStyles,
        maxYear = new Date().getFullYear() + 10,
        initialDate,
        maxDate,
        required = false,
        dateFormat = 'DD MMM YYYY', // Set default format
        customValidation,
        onValidationError,
      } = props;

  const [visible, setVisible] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [currentDate] = useState(new Date());

  // Current date values for validation
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const months = [
    { label: 'Tháng 1', value: 1, days: 31 },
    { label: 'Tháng 2', value: 2, days: 28 }, // Updated dynamically for leap years
    { label: 'Tháng 3', value: 3, days: 31 },
    { label: 'Tháng 4', value: 4, days: 30 },
    { label: 'Tháng 5', value: 5, days: 31 },
    { label: 'Tháng 6', value: 6, days: 30 },
    { label: 'Tháng 7', value: 7, days: 31 },
    { label: 'Tháng 8', value: 8, days: 31 },
    { label: 'Tháng 9', value: 9, days: 30 },
    { label: 'Tháng 10', value: 10, days: 31 },
    { label: 'Tháng 11', value: 11, days: 30 },
    { label: 'Tháng 12', value: 12, days: 31 }
  ];

  useEffect(() => {
    // Reset day if it's invalid for the new month/year
    if (selectedMonth && selectedYear) {
      const maxDays = getDaysInMonth(selectedMonth.value, selectedYear.value);
      if (selectedDay && selectedDay.value > maxDays) {
        setSelectedDay(null);
      }
    }
  }, [selectedMonth, selectedYear]);

  const isLeapYear = (year) => {
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
  };

  const getDaysInMonth = (month, year) => {
    if (month === 2 && isLeapYear(year)) {
      return 29;
    }
    const selectedMonth = months.find(m => m.value === month);
    return selectedMonth ? selectedMonth.days : 31;
  };

  const generateDays = () => {
    if (!selectedMonth || !selectedYear) {
      return [];
    }

    const daysInMonth = getDaysInMonth(selectedMonth.value, selectedYear.value);
    let days = [];
    
    // For current month and year, start from current day
    const startDay = (selectedYear.value === currentYear && selectedMonth.value === currentMonth) 
      ? currentDay 
      : 1;

    for (let i = startDay; i <= daysInMonth; i++) {
      days.push({
        label: String(i).padStart(2, '0'),
        value: i
      });
    }

    return days;
  };

  const generateYears = () => {
    return Array.from(
      { length: maxYear - currentYear + 1 },
      (_, i) => ({
        label: String(currentYear + i),
        value: currentYear + i
      })
    );
  };

  const getAvailableMonths = () => {
    return months.map(month => ({
      ...month,
      disabled: selectedYear?.value === currentYear && month.value < currentMonth
    })).filter(month => !month.disabled);
  };

  const formatDate = (date) => {
    if (!date) return '';

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const monthShort = months[date.getMonth()].label.substring(6); // Remove "Tháng " prefix
    const year = date.getFullYear();

    switch (dateFormat) {
        case 'DD-MMM-YYYY':
        return `${day}-${month}-${year}`;
      case 'DD MMM YYYY':
        return `${day} ${monthShort} ${year}`;
      case 'MM/DD/YYYY':
        return `${month}/${day}/${year}`;
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      case 'DD.MM.YYYY':
        return `${day}.${month}.${year}`;
      default:
        return `${day} ${monthShort} ${year}`;
    }
  };

  const validateDate = (date) => {
    let error = '';

    if (required && !date) {
      error = 'Date is required';
    }
    
    if (date < currentDate) {
      error = 'Past dates are not allowed';
    }
    
    if (maxDate && date > maxDate) {
      error = `Date must be before ${formatDate(maxDate)}`;
    }
    
    if (customValidation && date) {
      const customError = customValidation(date);
      if (customError) {
        error = customError;
      }
    }

    setValidationError(error);
    if (error && onValidationError) {
      onValidationError(error);
    }
    
    return !error;
  };

  const toggleDropdown = (type) => {
    // Don't allow day selection until month and year are selected
    if (type === 'day' && (!selectedMonth || !selectedYear)) {
      setValidationError('Please select month and year first');
      return;
    }
    
    setSelectedType(type);
    setVisible(true);
    setValidationError('');
  };

  const onItemSelect = (item) => {
    switch (selectedType) {
      case 'year':
        setSelectedYear(item);
        if (selectedMonth && selectedMonth.value < currentMonth && item.value === currentYear) {
          setSelectedMonth(null);
          setSelectedDay(null);
        }
        break;
      case 'month':
        setSelectedMonth(item);
        const maxDays = getDaysInMonth(item.value, selectedYear.value);
        if (selectedDay && selectedDay.value > maxDays) {
          setSelectedDay(null);
        }
        break;
      case 'day':
        setSelectedDay(item);
        const newDate = new Date(
          selectedYear.value,
          selectedMonth.value - 1,
          item.value,
          12,
          0,
          0
        );
        
        if (validateDate(newDate) && onDateSelect) {
          // Format the date before sending it to parent
          const formattedDate = formatDate(newDate);
          onDateSelect(formattedDate);
        }
        break;
    }
    
    setVisible(false);
  };

  const getCurrentData = () => {
    switch (selectedType) {
      case 'day':
        return generateDays();
      case 'month':
        return getAvailableMonths();
      case 'year':
        return generateYears();
      default:
        return [];
    }
  };

  const getPlaceholder = (type) => {
    switch (type) {
      case 'day':
        return selectedMonth && selectedYear ? 'Ngày' : 'Ngày';
      case 'month':
        return 'Tháng';
      case 'year':
        return 'Năm';
      default:
        return '';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <TouchableOpacity 
          style={[
            styles.dropdown, 
            styles.yearDropdown, 
            dropdownStyles,
            validationError ? styles.errorBorder : null
          ]} 
          onPress={() => toggleDropdown('year')}
        >
          <Text style={[styles.dropdownText, textStyles]}>
            {selectedYear ? selectedYear.label : getPlaceholder('year')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.dropdown, 
            styles.monthDropdown, 
            dropdownStyles,
            validationError ? styles.errorBorder : null
          ]} 
          onPress={() => toggleDropdown('month')}
          disabled={!selectedYear}
        >
          <Text style={[
            styles.dropdownText, 
            textStyles,
            !selectedYear && styles.disabledText
          ]}>
            {selectedMonth ? selectedMonth.label.substring(0, 11) : getPlaceholder('month')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.dropdown, 
            styles.dayDropdown, 
            dropdownStyles,
            validationError ? styles.errorBorder : null
          ]} 
          onPress={() => toggleDropdown('day')}
          disabled={!selectedMonth || !selectedYear}
        >
          <Text style={[
            styles.dropdownText, 
            textStyles,
            (!selectedMonth || !selectedYear) && styles.disabledText
          ]}>
            {selectedDay ? selectedDay.label : getPlaceholder('day')}
          </Text>
        </TouchableOpacity>
      </View>

      {validationError ? (
        <Text style={styles.errorText}>{validationError}</Text>
      ) : null}

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
            <Text style={styles.modalTitle}>
              Select {selectedType?.charAt(0).toUpperCase() + selectedType?.slice(1)}
            </Text>
            <FlatList
              data={getCurrentData()}
              keyExtractor={(item) => item.value.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[styles.dropdownItem, itemStyles]}
                  onPress={() => onItemSelect(item)}
                >
                  <Text style={styles.itemText}>{item.label}</Text>
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
  container: {
    width: '100%',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    gap: 5,
  },
  dropdown: {
    height: 50,
    justifyContent: 'center',
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 1.3,
    paddingHorizontal: 15,
  },
  dayDropdown: {
    flex: 1,
  },
  monthDropdown: {
    flex: 2,
  },
  yearDropdown: {
    flex: 1.5,
  },
  dropdownText: {
    fontSize: 16,
    textAlign: 'center',
  },
  disabledText: {
    color: '#999',
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
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemText: {
    fontSize: 16,
    textAlign: 'center',
  },
  errorBorder: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  }
});

export default CustomDateInput;