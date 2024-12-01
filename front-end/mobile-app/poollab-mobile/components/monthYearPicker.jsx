import React, { useState, memo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { theme } from "@/constants/theme";
import Icon from "@/assets/icons/icons";

const DemoCustomMonthYearPicker = memo((props) => {
  const {
    onSelect,
    placeholder = "Select Month/Year",
    containerStyles,
    modalStyles,
    buttonStyles,
    textStyles,
    initialMonth = new Date().getMonth(),
    initialYear = new Date().getFullYear(),
  } = props;

  const [visible, setVisible] = useState(false);
  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);
  const [error, setError] = useState("");

  const toggleDropdown = () => {
    setVisible(!visible);
  };

  const onMonthIncrement = () => {
    setMonth((prevMonth) => {
      let newMonth = (prevMonth + 1) % 12;
      let newYear = year;

      // Limit to 1 year ahead
      if (newMonth === 0 && year === new Date().getFullYear() + 1) {
        return prevMonth;
      }

      if (newMonth === 0) {
        newYear += 1;
      }

      return newMonth;
    });

    // Update year if necessary
    if (month === 11) {
      setYear((prevYear) => prevYear + 1);
    }
  };

  const onMonthDecrement = () => {
    setMonth((prevMonth) => {
      let newMonth = (prevMonth - 1 + 12) % 12;
      
      // Prevent going below current month and year
      const currentDate = new Date();
      if (year === currentDate.getFullYear() && 
          newMonth < currentDate.getMonth()) {
        return prevMonth;
      }

      return newMonth;
    });

    // Update year if necessary
    if (month === 0) {
      setYear((prevYear) => prevYear - 1);
    }
  };

  const onYearIncrement = () => {
    setYear((prevYear) => {
      const currentYear = new Date().getFullYear();
      // Limit to 1 year ahead
      return prevYear < currentYear + 1 ? prevYear + 1 : prevYear;
    });
  };

  const onYearDecrement = () => {
    setYear((prevYear) => {
      const currentYear = new Date().getFullYear();
      // Prevent going below current year
      return prevYear > currentYear ? prevYear - 1 : prevYear;
    });
  };

  const onMonthYearConfirm = () => {
    // Format month with leading zero
    const formattedMonth = (month + 1).toString().padStart(2, "0");
    const formattedMonthYear = `${formattedMonth}/${year}`;

    // Validate against current date
    const currentDate = new Date();
    const selectedDate = new Date(year, month);
    const maxAllowedDate = new Date(currentDate.getFullYear() + 1, currentDate.getMonth());

    if (selectedDate > maxAllowedDate) {
      setError("Selected month/year is outside the allowed range");
      return;
    }

    onSelect?.(formattedMonthYear);
    setVisible(false);
    setError("");
  };

  // Array of month names for display
  const monthNames = [
    "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", 
    "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", 
    "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
  ];

  return (
    <View>
      <TouchableOpacity
        style={[styles.dropdown, containerStyles]}
        onPress={toggleDropdown}
      >
        <Text style={[styles.dropdownText, textStyles]}>
          {`${(month + 1).toString().padStart(2, "0")}/${year}`}
        </Text>
      </TouchableOpacity>
      <Modal
        transparent={true}
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setVisible(false)}
        >
          <View style={[styles.modalContent, modalStyles]}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              {/* Month Picker */}
              <View style={styles.timePickerContainer}>
                <Pressable
                  style={[styles.timePickerButton, buttonStyles]}
                  onPress={onMonthIncrement}
                >
                  <Icon
                    name="arrowUpIcon"
                    size={30}
                    strokeWidth={2}
                    color="black"
                  />
                </Pressable>
                <View
                  style={{
                    backgroundColor: theme.colors.secondary,
                    borderRadius: theme.border.lightCurve,
                    borderCurve: "circular",
                    padding: 10,
                  }}
                >
                  <Text style={[styles.timePickerText]}>
                    {monthNames[month]}
                  </Text>
                </View>
                <Pressable
                  style={[styles.timePickerButton, buttonStyles]}
                  onPress={onMonthDecrement}
                >
                  <Icon
                    name="arrowDownIcon"
                    size={30}
                    strokeWidth={2}
                    color="black"
                  />
                </Pressable>
              </View>

              <Text style={styles.separator}>/</Text>

              {/* Year Picker */}
              <View style={styles.timePickerContainer}>
                <Pressable
                  style={[styles.timePickerButton, buttonStyles]}
                  onPress={onYearIncrement}
                >
                  <Icon
                    name="arrowUpIcon"
                    size={30}
                    strokeWidth={2}
                    color="black"
                  />
                </Pressable>
                <View
                  style={{
                    backgroundColor: theme.colors.secondary,
                    borderRadius: theme.border.lightCurve,
                    borderCurve: "circular",
                    padding: 10,
                  }}
                >
                  <Text style={[styles.timePickerText]}>
                    {year}
                  </Text>
                </View>
                <Pressable
                  style={[styles.timePickerButton, buttonStyles]}
                  onPress={onYearDecrement}
                >
                  <Icon
                    name="arrowDownIcon"
                    size={30}
                    strokeWidth={2}
                    color="black"
                  />
                </Pressable>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 100,
                marginTop: 10,
              }}
            >
              <Pressable
                style={[styles.confirmButton, buttonStyles]}
                onPress={() => setVisible(false)}
              >
                <Text style={styles.cancelButtonText}>HỦY</Text>
              </Pressable>
              <Pressable
                style={[styles.confirmButton, buttonStyles]}
                onPress={onMonthYearConfirm}
              >
                <Text style={styles.confirmButtonText}>ĐỒNG Ý</Text>
              </Pressable>
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
});

// Styles remain the same as in the original component
// (You can keep the existing styles from the previous component)

export default DemoCustomMonthYearPicker;

const styles = StyleSheet.create({
    dropdown: {
      flex: 1,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
      borderColor: "black",
      borderWidth: 1.3,
      gap: 15,
      paddingHorizontal: 15,
    },
    dropdownText: {
      fontSize: 16,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
      width: "80%",
      maxHeight: "50%",
      backgroundColor: "white",
      borderRadius: 0,
      padding: 10,
      alignItems: "center",
    },
    timePickerContainer: {
      alignItems: "center",
      gap: 5,
    },
    timePickerButton: {
      padding: 5,
    },
    timePickerText: {
      fontSize: 20,
      color: "#fff"
    },
    separator: {
      fontSize: 30,
      marginHorizontal: 5,
    },
    confirmButton: {
      marginTop: 10,
      paddingVertical: 10,
      paddingHorizontal: 15,
    },
    confirmButtonText: {
      color: theme.colors.primary,
      fontSize: 16,
    },
    cancelButtonText: {
      color: "red",
      fontSize: 16,
    },
    errorContainer: {
      marginTop: 16,
      backgroundColor: "#FFE6E6",
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
    },
    errorText: {
      color: "#FF0000",
      fontSize: 14,
    },
    errorWarning: {
      textAlign: "center",
      color: "red",
      fontSize: 11,
    },
  });