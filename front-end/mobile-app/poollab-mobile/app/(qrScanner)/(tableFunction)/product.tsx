import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  get_all_product_type,
  get_all_product,
  get_all_product_group,
  add_product_to_order,
} from "@/api/product_api";
import BackButton from "@/components/backButton";
import { theme } from "@/constants/theme";
import CustomDropdown from "@/components/customDropdown";
import Icon from "@/assets/icons/icons";
import Button from "@/components/roundButton";
import QuantitySelector from "@/components/quantityCount";
import CustomHeader from "@/components/customHeader";
import { getStoredTableData } from "@/api/tokenDecode";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
const product = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [productType, setProductType] = useState([]);
  const [productTypeId, setProductTypeId] = useState("");
  const [productGroup, setProductGroup] = useState([]);
  const [productGroupId, setProductGroupId] = useState("");
  const [product, setProduct] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [productOrder, setProductOrder] = useState([]);
  const [tableId, setTableId] = useState("");
  const getTableId = async () => {
    try {
      const response = await getStoredTableData();
      if (response) {
        const tableId = response.data.bidaTable.id;
        setTableId(tableId);
      }
    } catch (error) {
      console.error("Error loading stored table data:", error);
    }
  };

  const fetchData = async () => {
    try {
      const getProductData = {
        ProductTypeId: "",
        ProductGroupId: "",
        Status: "Còn Hàng",
      };
      const response = await get_all_product(getProductData);
      console.log("response: ", response.data);
      if (response.status === 200) {
        setProduct(response.data.data.items);
        setIsLoading(false);
      } else if (response.data.status === 400) {
        Alert.alert("Error", response.data.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const load_type_data = async () => {
    try {
      const response = await get_all_product_type();
      if (response.status === 200) {
        const rawdata = response.data.data;
        const transformData = rawdata.map(
          (item: { name: any; id: any; descript: any }) => ({
            label: "Loại mặt hàng: " + item.name,
            value: item.id,
            address: "Mô tả: " + item.descript,
          })
        );
        setProductType(transformData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const load_group_data = async () => {
    try {
      const response = await get_all_product_group();
      if (response.status === 200) {
        const rawdata = response.data.data;
        const transformData = rawdata.map(
          (item: { name: any; id: any; descript: any }) => ({
            label: "Nhóm mặt hàng: " + item.name,
            value: item.id,
            address: "Mô tả: " + item.descript,
          })
        );
        setProductGroup(transformData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleSearch = () => {
    setIsLoading(true);
    searchFunction();
  };
  const searchFunction = async () => {
    const getProductData = {
      ProductTypeId: productTypeId,
      ProductGroupId: productGroupId,
      Status: "Còn Hàng",
    };
    try {
      const response = await get_all_product(getProductData);
      if (response.data.status === 200) {
        setProduct(response.data.data.items);
        setIsLoading(false);
      } else if (response.data.status === 404) {
        Alert.alert("Error", response.data.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    getTableId();
    load_type_data();
    load_group_data();
    fetchData();
  }, []);

  const addItemToOrder = (item) => {
    console.log("item: ", item);
    if (
      !item ||
      !item.productId ||
      !item.productName ||
      !item.quantity ||
      !item.price
    ) {
      console.error(
        "Invalid item. Ensure item has 'id', 'name', and 'quantity'."
      );
      return;
    }

    setProductOrder((prevOrder) => {
      const existingItemIndex = prevOrder.findIndex(
        (product) => product.productId === item.productId
      );

      if (existingItemIndex !== -1) {
        // Cập nhật số lượng nếu sản phẩm đã tồn tại
        const updatedOrder = [...prevOrder];
        updatedOrder[existingItemIndex].quantity += item.quantity;
        return updatedOrder;
      }
      // Thêm sản phẩm mới nếu chưa tồn tại
      return [...prevOrder, item];
    });
  };
  const removeItemFromOrder = (itemId) => {
    setProductOrder((prevOrder) =>
      prevOrder.filter((item) => item.productId !== itemId)
    );
  };
  const completeOrder = async () => {
    console.log("complete order: ", productOrder, ". ", tableId);
    try {
      const response = await add_product_to_order(tableId, productOrder);
      if (response.status === 200) {
        console.log("success add product to order: ", productOrder);
        AsyncStorage.setItem("userProducts", JSON.stringify(productOrder));
        router.back();
      } else {
        console.log("error add product to order: ", response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <ScrollView>
          <BackButton />
          <CustomHeader />
          <View style={styles.titleBox}>
            <Text style={styles.title}>Tìm kiếm và mua bán</Text>
            <Text style={styles.subTitle}>dịch vụ</Text>
            <CustomDropdown
              icon={
                <Icon
                  name="locationIcon"
                  size={25}
                  strokeWidth={1.5}
                  color="#54DEFD"
                />
              }
              placeholder="Chọn loại mặt hàng"
              data={productType}
              onSelect={async (item) => {
                setProductTypeId(item.value);
              }}
              containerStyles={{ marginVertical: 5 }}
            />
            <CustomDropdown
              icon={
                <Icon
                  name="locationIcon"
                  size={25}
                  strokeWidth={1.5}
                  color="#54DEFD"
                />
              }
              placeholder="Chọn nhóm mặt hàng"
              data={productGroup}
              onSelect={async (item) => {
                setProductGroupId(item.value);
              }}
              containerStyles={{ marginVertical: 5 }}
            />
            <Button
              title="TÌM KIẾM MẶT HÀNG"
              buttonStyles={styles.updateButton}
              textStyles={styles.updateButtonText}
              onPress={() => {
                handleSearch();
              }}
              loading={isLoading}
            />
          </View>
          <View style={styles.titleBox}>
            <Text style={styles.title}>Giỏ hàng</Text>
            {productOrder.length > 0 ? (
              productOrder.map((item) => (
                <View key={item.id} style={styles.dataBox}>
                  <View style={styles.innerBox}>
                    <View style={styles.infoBox2}>
                      <Text style={styles.infoBoxTitle}>Tên mặt hàng:</Text>
                      <Text style={styles.infoBoxText}>{item.productName}</Text>
                    </View>
                    <View style={styles.infoBox2}>
                      <Text style={styles.infoBoxTitle}>Số lượng:</Text>
                      <Text style={styles.infoBoxText}>{item.quantity}</Text>
                    </View>
                    <View style={styles.infoBox2}>
                      <Text style={styles.infoBoxTitle}>Giá mặt hàng:</Text>
                      <Text style={styles.infoBoxText}>
                        {item.price.toLocaleString("en-US")}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.buttonBox}>
                    <Pressable
                      onPress={() => removeItemFromOrder(item.productId)}
                    >
                      <Icon name="trashIcon" size={24} color="red" />
                    </Pressable>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.infoBoxText}>Giỏ hàng rỗng.</Text>
            )}
            {/* Total Price View */}
            <View style={styles.totalPriceContainer}>
              <Text style={styles.totalPriceTitle}>Tổng cộng:</Text>
              <Text style={styles.totalPriceText}>
                {productOrder
                  .reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                  )
                  .toLocaleString("en-US")}{" "}
                đ
              </Text>
            </View>
            <Button
              title="ĐẶT DỊCH VỤ"
              buttonStyles={styles.updateButton}
              textStyles={styles.updateButtonText}
              onPress={() => {
                completeOrder();
              }}
              loading={isLoading}
            />
          </View>
          {product.map((item) => (
            <View
              key={item.id}
              style={[
                styles.dataBox,
                item.status === "Còn Hàng"
                  ? styles.confirmedBox
                  : styles.pendingBox,
              ]}
            >
              <View style={styles.innerBox}>
                <View style={styles.imageBox}>
                  <Image
                    style={styles.image}
                    source={{ uri: item.productImg.toString() }}
                  />
                </View>
                <View style={styles.infoBox2}>
                  <Text style={styles.infoBoxTitle}>Tên mặt hàng:</Text>
                  <Text style={styles.infoBoxText}>{item.name}</Text>
                </View>
                <View style={styles.infoBox2}>
                  <Text style={styles.infoBoxTitle}>Tên loại mặt hàng:</Text>
                  <Text style={styles.infoBoxText}>{item.productTypeName}</Text>
                </View>
                <View style={styles.infoBox2}>
                  <Text style={styles.infoBoxTitle}>Tên nhóm mặt hàng:</Text>
                  <Text style={styles.infoBoxText}>{item.groupName}</Text>
                </View>
                <View style={styles.infoBox2}>
                  <Text style={styles.infoBoxTitle}>Giá mặt hàng:</Text>
                  <Text style={styles.infoBoxText}>
                    {item.price.toLocaleString("en-US")}
                  </Text>
                </View>
                {/* <View style={styles.infoBox2}>
                    <View style={styles.imageBox}>
                      <Image
                        style={styles.image}
                        source={{ uri: item.productImg.toString() }}
                      />
                    </View>
                  </View> */}
                <View style={styles.QuantitySelectorContainer}>
                  <QuantitySelector
                    initialQuantity={quantity}
                    maxQuantity={item.quantity}
                    onQuantityChange={(newQuantity) => {
                      console.log("newQuantity: ", newQuantity);
                      setQuantity(newQuantity);
                    }}
                    containerStyle={undefined}
                    buttonStyle={undefined}
                    buttonTextStyle={undefined}
                    quantityTextStyle={undefined}
                  />
                </View>
                <Button
                  title="THÊM VÀO GIỎ"
                  buttonStyles={styles.updateButton}
                  textStyles={styles.updateButtonText}
                  onPress={() => {
                    addItemToOrder({
                      productId: item.id,
                      productName: item.name,
                      price: item.price,
                      quantity: quantity,
                    });
                  }}
                />
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default product;

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  titleBox: {
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    marginHorizontal: 5,
    marginVertical: 5,
    padding: 15,
    shadowColor: "black",
    shadowOffset: {
      width: 5,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
    borderRadius: 20,
    borderCurve: "continuous",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: theme.colors.primary,
  },

  subTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "black",
  },
  updateButton: {
    marginTop: 10,
    backgroundColor: theme.colors.secondary,
    borderRadius: 10,
  },
  updateButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  dataBox: {
    backgroundColor: theme.colors.background,
    marginVertical: 5,
    marginHorizontal: 5,
    padding: 10,
    shadowColor: "black",
    shadowOffset: {
      width: 5,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
    borderRadius: 20,
    borderCurve: "continuous",
  },
  confirmedBox: {
    backgroundColor: theme.colors.secondary,
    marginVertical: 5,
    marginHorizontal: 5,
    padding: 10,
    shadowColor: "black",
    shadowOffset: {
      width: 5,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
    borderRadius: 20,
    borderCurve: "continuous",
  },
  pendingBox: {
    backgroundColor: theme.colors.hightLight,
    marginVertical: 5,
    marginHorizontal: 5,
    padding: 10,
    shadowColor: "black",
    shadowOffset: {
      width: 5,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
    borderRadius: 20,
    borderCurve: "continuous",
  },
  innerBox: {
    backgroundColor: theme.colors.background,
    padding: 15,
    borderRadius: 10,
    borderCurve: "continuous",
  },
  infoBoxTitle: {
    fontSize: 15,
    fontWeight: "bold",
  },
  infoBox2: {
    flexDirection: "row",
    gap: 10,
  },
  infoBoxText: {
    fontSize: 15,
  },
  imageBox: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    position: "relative",
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 20,
    borderWidth: 1,
  },
  QuantitySelectorContainer: {
    alignSelf: "flex-end",
    width: 100,
  },
  buttonBox: {
    alignSelf: "flex-end",
  },
  totalPriceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    marginTop: 10,
  },
  totalPriceTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  totalPriceText: {
    fontSize: 16,
    color: "red",
    fontWeight: "bold",
  },
});
