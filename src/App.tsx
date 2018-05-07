import * as React from 'react'
import {Component} from 'react'
import {StyleSheet, View} from 'react-native'
import {JoystickControlContainer} from './control/JoystickControlContainer'

/**
 * Author  :  panggua
 * Date    :  2018/4/24
 * <p>
 * Multi-Joystick-Control
 */
export default class App extends Component<{}, {}> {
    render() {
        return (
            <View style={styles.container}>
                <JoystickControlContainer/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#5180aa',
        width: '100%',
        height: '100%'
    }
})
