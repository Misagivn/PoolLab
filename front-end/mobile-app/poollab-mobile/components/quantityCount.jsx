import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import Icon from "@/assets/icons/icons";

const QuantitySelector = ({
  initialQuantity,
  maxQuantity,
  onQuantityChange,
  containerStyle,
  buttonStyle,
  buttonTextStyle,
  quantityTextStyle,
}) => {
  // State để quản lý số lượng hiện tại
  const [quantity, setQuantity] = useState(initialQuantity);

  // Hàm để tăng số lượng
  const increaseQuantity = () => {
    if (quantity < maxQuantity) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      onQuantityChange(newQuantity);
    }
  };

  // Hàm để giảm số lượng
  const decreaseQuantity = () => {
    if (quantity > 0) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onQuantityChange(newQuantity);
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Decrease Icon */}
      {quantity > 1 && (
        <Pressable onPress={decreaseQuantity}>
          <Icon name="minusCircleIcon" size={24} color="black" />
        </Pressable>
      )}

      {/* Quantity Text */}
      <Text style={[styles.quantityText, quantityTextStyle]}>{quantity}</Text>

      {/* Increase Icon */}
      {quantity < maxQuantity && (
        <Pressable onPress={increaseQuantity}>
          <Icon name="addCircleIcon" size={24} color="black" />
        </Pressable>
      )}
    </View>
  );
};

export default QuantitySelector;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  quantityText: {
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 10,
  },
});
