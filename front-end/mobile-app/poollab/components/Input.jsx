import { StyleSheet, TextInput, View } from 'react-native'
import React from 'react'
import { hp } from '@/helpers/common'
import { theme } from '@/constants/theme'

const Input = (props) => {
  return (
    <View style={[styles.container, props.containerStyle && props.containerStyle]}>
      {
        props.icon && props.icon
      }
      <TextInput {...props} style={{flex: 1}} placeholderTextColor={theme.colors.textLight} ref={props.inputRef && props.inputRef} />
    </View>
  )
}

export default Input

const styles = StyleSheet.create({
    container:{
        flexDirection: 'row',   
        height: hp(15),
        alignItems: 'center',
        justifyContent: "center",
        borderWidth: 0.5,
        borderColor: theme.colors.text,
        borderRadius: theme.radius.xl,
        borderCurve: 'continuous',
        paddingHorizontal: 15,
        gap: 10,
    }
})