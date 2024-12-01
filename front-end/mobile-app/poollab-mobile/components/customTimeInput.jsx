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

const DemoCustomTimeInput = memo((props) => {
  const {
    onSelect,
    placeholder = "Select a time",
    containerStyles,
    modalStyles,
    buttonStyles,
    textStyles,
    initialHour = 0,
    initialMinute = 0,
    is24Hour = true,
    minTime = null,
    maxTime = null,
  } = props;

  const [visible, setVisible] = useState(false);
  const [hour, setHour] = useState(initialHour);
  const [minute, setMinute] = useState(initialMinute);
  const [error, setError] = useState("");

  const toggleDropdown = () => {
    setVisible(!visible);
  };

  const onHourIncrement = () => {
    setHour((prevHour) => {
      let newHour = (prevHour + 1) % (is24Hour ? 24 : 12);

      // Validate against minTime and maxTime
      if (minTime || maxTime) {
        const [minHour, minMinute] = minTime
          ? minTime.split(":").map(Number)
          : [0, 0];
        const [maxHour, maxMinute] = maxTime
          ? maxTime.split(":").map(Number)
          : [23, 59];

        if (newHour < minHour || newHour > maxHour) {
          return prevHour;
        }

        if (newHour === minHour && minute < minMinute) {
          return minHour;
        }

        if (newHour === maxHour && minute > maxMinute) {
          return maxHour;
        }
      }

      return newHour;
    });
  };

  const onHourDecrement = () => {
    setHour((prevHour) => {
      let newHour =
        (prevHour - 1 + (is24Hour ? 24 : 12)) % (is24Hour ? 24 : 12);

      // Validate against minTime and maxTime
      if (minTime || maxTime) {
        const [minHour, minMinute] = minTime
          ? minTime.split(":").map(Number)
          : [0, 0];
        const [maxHour, maxMinute] = maxTime
          ? maxTime.split(":").map(Number)
          : [23, 59];

        if (newHour < minHour || newHour > maxHour) {
          return prevHour;
        }

        if (newHour === minHour && minute < minMinute) {
          return minHour;
        }

        if (newHour === maxHour && minute > maxMinute) {
          return maxHour;
        }
      }

      return newHour;
    });
  };

  const onMinuteIncrement = () => {
    setMinute((prevMinute) => {
      let newMinute = (prevMinute + 30) % 60;

      // Validate against minTime and maxTime
      if (minTime || maxTime) {
        const [minHour, minMinute] = minTime
          ? minTime.split(":").map(Number)
          : [0, 0];
        const [maxHour, maxMinute] = maxTime
          ? maxTime.split(":").map(Number)
          : [23, 59];

        if (hour < minHour || hour > maxHour) {
          return prevMinute;
        }

        if (hour === minHour && newMinute < minMinute) {
          return minMinute;
        }

        if (hour === maxHour && newMinute > maxMinute) {
          return maxMinute;
        }
      }

      return newMinute;
    });
  };

  const onMinuteDecrement = () => {
    setMinute((prevMinute) => {
      let newMinute = (prevMinute - 30 + 60) % 60;

      // Validate against minTime and maxTime
      if (minTime || maxTime) {
        const [minHour, minMinute] = minTime
          ? minTime.split(":").map(Number)
          : [0, 0];
        const [maxHour, maxMinute] = maxTime
          ? maxTime.split(":").map(Number)
          : [23, 59];

        if (hour < minHour || hour > maxHour) {
          return prevMinute;
        }

        if (hour === minHour && newMinute < minMinute) {
          return minMinute;
        }

        if (hour === maxHour && newMinute > maxMinute) {
          return maxMinute;
        }
      }

      return newMinute;
    });
  };

  const onTimeConfirm = () => {
    const formattedTime = `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;

    // Comprehensive time validation
    if (minTime || maxTime) {
      const [minHour, minMinute] = minTime
        ? minTime.split(":").map(Number)
        : [0, 0];
      const [maxHour, maxMinute] = maxTime
        ? maxTime.split(":").map(Number)
        : [23, 59];

      const isValidTime =
        (hour > minHour || (hour === minHour && minute >= minMinute)) &&
        (hour < maxHour || (hour === maxHour && minute <= maxMinute));

      if (!isValidTime) {
        setError("Selected time is outside the allowed range");
        return;
      }
    }

    onSelect?.(formattedTime);
    setVisible(false);
    setError("");
  };

  return (
    <View>
      <TouchableOpacity
        style={[styles.dropdown, containerStyles]}
        onPress={toggleDropdown}
      >
        <Text style={[styles.dropdownText, textStyles]}>
          {`${hour.toString().padStart(2, "0")}:${minute
            .toString()
            .padStart(2, "0")} ${is24Hour ? "" : hour >= 12 ? "PM" : "AM"}`}
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
              <View style={styles.timePickerContainer}>
                <Pressable
                  style={[styles.timePickerButton, buttonStyles]}
                  onPress={onHourIncrement}
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
                    {hour.toString().padStart(2, "0")}
                  </Text>
                </View>
                <Pressable
                  style={[styles.timePickerButton, buttonStyles]}
                  onPress={onHourDecrement}
                >
                  <Icon
                    name="arrowDownIcon"
                    size={30}
                    strokeWidth={2}
                    color="black"
                  />
                </Pressable>
              </View>
              <Text style={styles.separator}>:</Text>
              <View style={styles.timePickerContainer}>
                <Pressable
                  style={[styles.timePickerButton, buttonStyles]}
                  onPress={onMinuteIncrement}
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
                    {minute.toString().padStart(2, "0")}
                  </Text>
                </View>
                <Pressable
                  style={[styles.timePickerButton, buttonStyles]}
                  onPress={onMinuteDecrement}
                >
                  <Icon
                    name="arrowDownIcon"
                    size={30}
                    strokeWidth={2}
                    color="black"
                  />
                </Pressable>
              </View>
              {!is24Hour && (
                <View style={styles.timePickerContainer}>
                  <Text style={[styles.timePickerText, textStyles]}>
                    {hour >= 12 ? "PM" : "AM"}
                  </Text>
                </View>
              )}
            </View>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text style={styles.errorWarning}>
                Quán chỉ hoạt động từ 8:00 đến 22:00 hàng ngày.
              </Text>
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
                onPress={onTimeConfirm}
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

export default DemoCustomTimeInput;

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
    fontSize: 30,
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
