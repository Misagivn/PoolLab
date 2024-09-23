import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import {theme} from '@/constants/theme'
import Icon from '@/assets/icons/icons'
const CustomHeader = () => {
  const number = 12345;
  const formattedNumber = number.toLocaleString();
  return (
    <View style={{paddingTop: 10, justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.background}}>
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <Text style={{fontSize: 17, fontWeight: 'condensedBold'}}>Lương Minh Nhật</Text>
      </View>
      <View style={styles.quickInfo}>
        <View style={styles.walletCount}>
          <Pressable onPress={()=>{console.log("add money")}}>
            <Icon name='addIcon' size={20} strokeWidth={1.5} color="black" />
          </Pressable>
          <TextInput editable={false} placeholder="12345678" value={formattedNumber}  />
        </View>
        <Icon name='notiIcon' size={25} strokeWidth={2} color="black" />
      </View>
    </View>
    </View>
  )
}

export default CustomHeader

const styles = StyleSheet.create({
    container:{
        flex1: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: "white",
        height: 70,
        paddingHorizontal: 25,
        borderCurve: "continuous",
        borderRadius: 20,
        shadowColor: "black",
        shadowOffset: {
            width: 5,
            height: 10,
        },
        shadowOpacity: 0.2,
        shadowRadius: 30,
        elevation: 6,
    },
    userInfo:{

      paddingRight: 5,
      paddingHorizontal: 5,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: 10,
    },
    quickInfo:{
      flexDirection: 'row',
      paddingLeft: 25,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 12,
    },
    walletCount:{
        backgroundColor: theme.colors.background,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 5,
        gap: 10,
        borderColor: theme.colors.primary,
        borderCurve: "continuous",
        borderColor: theme.colors.primary,
        borderWidth: 1.5,
    }
})