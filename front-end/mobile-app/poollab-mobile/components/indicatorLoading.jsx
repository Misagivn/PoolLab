import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React from 'react'
import theme from '@/constants/theme'
const IndicatorLoading = ({size = "large", color = theme.colors.primary}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  )
}

export default IndicatorLoading

const styles = StyleSheet.create({
    container:{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    }
})