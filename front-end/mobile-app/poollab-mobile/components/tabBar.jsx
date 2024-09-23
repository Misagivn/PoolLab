import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import {theme} from '@/constants/theme'
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
const TabBar = ({ state, descriptors, navigation }) => {
    const icon = {
        index: (props) => <Feather name="home" size={26} color="#222" {...props} />,
        reserveScreen: (props) => <Feather name="calendar" size={26} color="#222" {...props} />,
        qrScanner: (props) => <AntDesign name="qrcode" size={26} color="#222" {...props} />,
        courseScreen: (props) => <Ionicons name="school-outline" size={26} color="#222" {...props} />,
        profileScreen: (props) => <AntDesign name="profile" size={26} color="#222" {...props} />,
    }

  return (
    <View style={styles.tabbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;


        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.name}
            type={styles.tabbarItem}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1 , alignItems: 'center', justifyContent: 'center'}}
          >
            {
                icon[route.name]({
                    color: isFocused ? theme.colors.primary : '#222'
                })
            }
            <Text style={{ color: isFocused ? theme.colors.primary : '#222', fontSize: 14}}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  )
}

export default TabBar

const styles = StyleSheet.create({
    tabbar:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        alignItems: 'center',
        bottom: 20,
        backgroundColor: "white",
        marginHorizontal: 15,
        paddingVertical: 8,
        borderCurve: "continuous",
        borderRadius: 20,
        shadowColor: "black",
        shadowOffset: {
            width: 5,
            height: 10,
        },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 6,
    },
    tabbarItem:{
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4
    },
})
