import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { theme } from '@/constants/theme'
import Loading from './Loading'
const Button = ({title, buttonStyles, onPress=()=>{}, textStyles, hasShadow=true, loading=false}) => {
  const shadowStyle = {
    shadowColor: "dark",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  }
  if(loading){
    return (
      <View style={[styles.button, buttonStyles, {backgroundColor:"white"}]}>  
        <Loading/>
      </View>
    )
  }
  return (
    <Pressable style={[styles.button, buttonStyles, hasShadow && shadowStyle]} onPress={onPress}>  
      <Text style={[styles.text, textStyles]}>{title}</Text>
    </Pressable>
  )
}

export default Button

const styles = StyleSheet.create({
  button:{
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    height: 60,
    borderCurve: theme.border.heavyCurve,
    borderRadius: 20,
  },
  text:{
    color: 'black',
    fontSize: 20,
    fontStyle: 'normal',
    hasShadow: true,
    fontWeight: 'bold',
  }
})
