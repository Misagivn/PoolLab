import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useState } from "react";
import React from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { theme } from "@/constants/theme";
const ExpoDatePicker = (props) => {
  const {
    placeholder = "Select a date",
    minimumDate,
    maximumDate,
    dateValue,
  } = props;
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateOfBirth, setDateOfBirth] = useState("");
  const togglePicker = () => {
    setShowPicker(!showPicker);
  };
  const onChange = ({ type }, selectedDate) => {
    if (type === "set") {
      const currentDate = selectedDate;
      setSelectedDate(currentDate);
      if (Platform.OS === "android") {
        togglePicker();
        setDateOfBirth(currentDate.toLocaleDateString("en-US"));
        const formatValue = formatDate(currentDate);
        dateValue(formatValue);
      }
    } else {
      togglePicker();
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={togglePicker}>
        <View style={styles.datePickerBox}>
          <Text style={styles.text}>
            {selectedDate
              ? selectedDate.toLocaleDateString("en-US")
              : placeholder}
          </Text>
          {showPicker ? (
            <DateTimePicker
              mode="date"
              display="calendar"
              value={selectedDate}
              onChange={onChange}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
              positiveButton={{ label: "Đồng ý", textColor: theme.colors.primary }}
              negativeButton={{ label: "Hủy", textColor: "red" }}
            />
          ) : null}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ExpoDatePicker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  datePickerBox: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 1.3,
    gap: 15,
    paddingHorizontal: 15,
  },
  text: {
    fontSize: 16,
    color: "black",
  },
});
