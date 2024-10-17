import { View, Text, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { theme } from '@/constants/theme'
import { hp } from '@/helpers/common'
import Loading from './Loading'
const Button=({
  buttonStyles,
  textStyles,
  title,
  onPress=() => {},
  loading=false,
  hasShadow=true,
}) => {
  const shadowStyle = {
    shadowColor: theme.colors.dark,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  }
  if (loading) {
    return (
      <View style={[styles.button, buttonStyles, {backgroundColor: "white"}]}>
        <Loading/>
      </View>
    )
  }

  return (
    <Pressable onPress={onPress} style={[styles.button, buttonStyles, hasShadow && shadowStyle]}>
      <Text style={[styles.text, textStyles]}>{title}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    height: hp(13),
    justifyContent: 'center',
    alignItems: 'center',
    borderCurve: "continuous",
    borderRadius: theme.radius.xl,
  },
  text: {
    color: 'white',
    fontSize: hp(7),
    fontWeight: theme.fonts.bold,
  },
})

export default Button