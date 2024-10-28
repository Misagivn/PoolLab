import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Icon from '@/assets/icons/icons'
const arrowRight = () => {
  return (
    <Pressable>
        <Icon styles={styles.button} name='arrowRight' size={20} strokeWidth={3} size={size} />
    </Pressable>
  )
}

export default arrowRight

const styles = StyleSheet.create({
    button:{
        justifyContent: 'center',
        alignSelf: "flex-start",
        borderCurve: "continuous",
        borderRadius: 10,
    }
})
