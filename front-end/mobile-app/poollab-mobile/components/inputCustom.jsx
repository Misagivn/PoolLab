import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import {theme} from '@/constants/theme'
const InputCustom = (props) => {
  return (
    <View style={[styles.input, props.containerStyles && props.containerStyles]}>{
        props.icon && props.icon
    }
        <TextInput {...props} style={{flex: 1}} placeholderTextColor={"black"} ref={props.inputRef && props.inputRef}/>
    </View>
  )
}

export default InputCustom

const styles = StyleSheet.create({
    input:{
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        borderColor: "black",
        borderCurve: 30,
        borderWidth: 1.3,
        gap: 15,
        paddingHorizontal: 15,
    }
})