import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Icon from '@/assets/icons/icons'
import { theme } from '@/constants/theme'
const IconButton = (
    {
        iconName,
        onPress,
        textStyles,
        buttonStyles,
        title,
    }
) => {
  return (
    <Pressable style={[styles.button, buttonStyles]} onPress={onPress}>
        <Icon name={iconName} size={20} strokeWidth={1.5} />
        <Text style={[styles.text, textStyles]}>{title}</Text>
    </Pressable>
  )
}

export default IconButton

const styles = StyleSheet.create({
    button:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.tertiary,
        height: 40,
        borderCurve: theme.border.heavyCurve,
        borderRadius: 20,
        gap: 20,
    }
})