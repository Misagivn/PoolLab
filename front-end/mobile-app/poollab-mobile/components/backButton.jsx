import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Pressable } from 'react-native'
import Icon from '@/assets/icons/icons'
import {theme} from '@/constants/theme'
import { router } from 'expo-router'
const BackButton = (
    {
        onPress,
        buttonStyles,
        size=35
    }
) => {
  return (
    <Pressable style={styles.button} onPress={()=>router.back()}>
        <Icon name='backIcon' size={20} strokeWidth={3} size={size} />
    </Pressable>
  )
}

export default BackButton

const styles = StyleSheet.create({
  button:{
    backgroundColor: theme.colors.darkSecondary,
    justifyContent: 'center',
    alignSelf: "flex-start",
    borderCurve: "continuous",
    borderRadius: 10,
  }
})