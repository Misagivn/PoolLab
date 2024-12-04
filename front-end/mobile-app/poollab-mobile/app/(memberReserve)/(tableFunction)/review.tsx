import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/constants/theme";
import StarRating from "react-native-star-rating-widget";
import InputCustom from "@/components/inputCustom";
import { store_rating } from "@/api/store_api";
import Button from "@/components/roundButton";
import { getStoredTableDataReserve } from "@/api/tokenDecode";
import { router } from "expo-router";
import { getAccountId } from "@/data/userData";
const review = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [userMessage, setUserMessage] = useState("");
  const [gaveReview, setGaveReview] = useState(false);
  const [userId, setUserId] = useState("");
  const [storeId, setStoreId] = useState("");
  const onSubmit = () => {
    console.log(rating);
    const data = {
      storeId: storeId,
      rated: rating,
      message: userMessage,
      customerId: userId,
    };
    store_rating(data).then((response) => {
      if (response.data.status === 200) {
        console.log("Review submitted successfully!");
        setGaveReview(true);
      } else {
        console.log("Error submitting review:", response.data.message);
      }
    });
  };
  useEffect(() => {
    const loadStat = async () => {
      try {
        const storedTableData = await getStoredTableDataReserve();
        if (storedTableData) {
          const strId = storedTableData.data.bidaTable.storeId;
          setStoreId(strId);
        }
      } catch (error) {
        console.error("Error loading stored table data:", error);
      }
      try {
        const accountId = await getAccountId();
        if (accountId) {
          setUserId(accountId);
        }
      } catch (error) {
        console.error("Error loading stored user:", error);
      }
    };
    loadStat();
  }, []);
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.flowBox}>
          <Text style={styles.title}>Cảm ơn bạn vì đã sử dụng dịch vụ.</Text>
          <Text style={styles.subTitle}>
            xin vui lòng đánh giá về trải nghiệm của bạn.
          </Text>
          <View style={styles.ratingBox}>
            <StarRating
              rating={rating}
              onChange={setRating}
              enableHalfStar={false}
              maxStars={5}
              starSize={40}
              color={theme.colors.primary}
              emptyColor={theme.colors.lightPrimary}
              enableSwiping={true}
              onRatingEnd={(rating) => {
                setRating(rating);
              }}
            />
          </View>
          <InputCustom
            containerStyles={{
              paddingHorizontal: 16,
            }}
            placeholder="Thêm lời bình luận"
            multiline
            numberOfLines={4}
            maxLength={100}
            onChangeText={(text) => {
              setUserMessage(text);
            }}
            value={userMessage}
          />
          <Button
            title="ĐÁNH GIÁ DỊCH VỤ"
            buttonStyles={styles.updateButton}
            textStyles={styles.updateButtonText}
            onPress={() => {
              onSubmit();
            }}
            loading={isLoading}
            disabled={rating === 0}
          />
          <Button
            title="HỦY"
            buttonStyles={styles.cancelButton}
            textStyles={styles.updateButtonText}
            onPress={() => {
              router.replace("../../(home)");
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default review;

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  flowBox: {
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
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.primary,
  },

  subTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "black",
  },
  ratingBox: {
    alignItems: "center",
    justifyContent: "center",
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
  cancelButton: {
    marginTop: 10,
    backgroundColor: theme.colors.hightLight,
    borderRadius: 10,
    color: theme.colors.hightLight,
  },
});
