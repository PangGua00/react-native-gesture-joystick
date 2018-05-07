import * as React from 'react'
import {Component} from 'react'
import {View, StyleSheet} from 'react-native'
import JoystickControlView from './JoystickControlView'

// uniqueId 用于在 emitter 接收时区分不同的摇杆控件
const UNIQUE_ID_1 = 'joystick_left'
const UNIQUE_ID_2 = 'joystick_right'

/**
 * Author  :  panggua
 * Date    :  2018/4/24
 * <p>
 * 摇杆操控Container，没有加入强制横屏代码，所以需要手动横屏以观看效果。
 * 此处暂时只存放了两个摇杆控制区域，如果需要可放入多个，自定义Style传入，只需保证 uniqueId 唯一即可。
 */
export class JoystickControlContainer extends Component<{}, {}> {

    render() {

        return (
            <View style={styles.container}>

                <JoystickControlView uniqueId={UNIQUE_ID_1}
                                     onFingerMove={(dx: number, dy: number) => {
                                         console.log('joystick-left', 'vx', dx)
                                         console.log('joystick-left', 'vy', dy)
                                     }}
                />

                <JoystickControlView uniqueId={UNIQUE_ID_2}
                                     onFingerMove={(dx: number, dy: number) => {
                                         console.log('joystick-right', 'vx', dx)
                                         console.log('joystick-right', 'vy', dy)
                                     }}/>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    }
})