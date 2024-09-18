import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Icon from '../assets/icons'
import { router } from 'expo-router'
import { theme } from '@/constants/theme'

const BackButton = ({size=26}) => {
  return (
    <Pressable onPress={() => router.back()} style={styles.button}>
      <Icon name="back" color={"white"} size={size} strokeWidth={2.3} />
    </Pressable>
  )
}

export default BackButton

const styles = StyleSheet.create({
    button: {
        alignSelf: 'flex-start',
        padding: 10,
        borderRadius: theme.radius.sm,
        backgroundColor: theme.colors.primary,
    },
})