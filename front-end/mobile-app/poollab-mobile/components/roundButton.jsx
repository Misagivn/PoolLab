import React from "react";
import { 
  Pressable, 
  StyleSheet, 
  Text, 
  View 
} from "react-native";
import { theme } from "@/constants/theme";
import IndicatorLoading from "./indicatorLoading";

const Button = ({
  title,
  buttonStyles,
  onPress = () => {},
  textStyles,
  hasShadow = true,
  loading = false,
  disabled = false,
  loadingIndicatorSize = 50,
  loadingColor,
  ...pressableProps
}) => {
  const shadowStyle = {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  };

  // Create a lighter version of the primary color
  const disabledColor = disabled ? theme.colors.darkSecondary : theme.colors.secondary;

  if (loading) {
    return (
      <View
        style={[
          styles.button,
          buttonStyles,
        ]}
      >
        <IndicatorLoading 
          size={loadingIndicatorSize} 
          color={loadingColor || theme.colors.background} 
        />
      </View>
    );
  }

  return (
    <Pressable
      style={[
        styles.button, 
        buttonStyles, 
        hasShadow && shadowStyle,
        { 
          backgroundColor: disabled ? theme.colors.disable : theme.colors.secondary 
        }
      ]}
      onPress={onPress}
      disabled={disabled}
      {...pressableProps}
    >
      <Text 
        style={[
          styles.text, 
          textStyles,
          { 
            color: disabled ? 'white' : 'white' 
          }
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    height: 60,
    borderCurve: theme.border.heavyCurve,
    borderRadius: theme.border.heavyCurve,
  },
  text: {
    color: "white",
    fontSize: 20,
    fontStyle: "normal",
    fontWeight: "bold",
  },
});

export default Button;