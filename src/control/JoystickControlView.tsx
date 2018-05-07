import {Component} from 'react'
import * as React from 'react'
import {
    DeviceEventEmitter, EmitterSubscription, Image, Platform, StyleSheet, View,
    ViewStyle
} from 'react-native'
import {RCTControlView} from './RCTControlView'
import {ControlViewSlider} from './ControlViewSlider'

interface OwnProps {
    uniqueId: string
    style?: ViewStyle
}

interface Callback {
    onFingerMove: (dx: number, dy: number) => void
}

type Props = OwnProps & Callback

interface State {
    pressed: boolean
    offsetX: number
    offsetY: number
}

// 回调事件名称，用于Emitter
const MOTION_EVENT = {
    START: 'event_control_start',
    MOVE: 'event_control_move',
    END: 'event_control_end',
    CANCEL: 'event_control_cancel'
}

// 大圆和小圆点的两种状态下的图片资源
const ImgPanNormal = require('../../res/img/control/camera_control_joystick_default.png')
const ImgPanPress = require('../../res/img/control/camera_control_joystick_pressed.png')
const ImgMidNormal = require('../../res/img/control/camera_control_mid_common_default.png')
const ImgMidPress = require('../../res/img/control/camera_control_mid_common_pressed.png')

// 大圆的直径、小圆点的初始偏移量、小圆点的直径，可根据需求自行配置
const DiameterPan = 176
export const InitialOffset = DiameterPan / 2
const DiameterMid = 80

/**
 * Author  :  panggua
 * Date    :  2018/4/24
 * <p>
 * 单个摇杆操控View及偏移量计算
 */
export default class JoystickControlView extends Component<Props, State> {

    private mEmitterStart: EmitterSubscription
    private mEmitterMove: EmitterSubscription
    private mEmitterEnd: EmitterSubscription
    private mEmitterCancel: EmitterSubscription

    private startX = 0
    private startY = 0
    private moveDx = 0
    private moveDy = 0
    private diffDx = 0
    private diffDy = 0
    private distance = 0

    constructor(props: Props) {
        super(props)
        this.state = {
            pressed: false,
            offsetX: InitialOffset,
            offsetY: InitialOffset
        }

        // emitter just for Android

        this.mEmitterStart = DeviceEventEmitter.addListener(MOTION_EVENT.START,
            (slider: ControlViewSlider) => {
                if (slider.uniqueId == this.props.uniqueId)
                    this.touchStart(slider.rawX, slider.rawY)
            })
        this.mEmitterMove = DeviceEventEmitter.addListener(MOTION_EVENT.MOVE,
            (slider: ControlViewSlider) => {
                if (slider.uniqueId == this.props.uniqueId)
                    this.touchMove(slider.rawX, slider.rawY)
            })
        this.mEmitterEnd = DeviceEventEmitter.addListener(MOTION_EVENT.END,
            (slider: ControlViewSlider) => {
                if (slider.uniqueId == this.props.uniqueId)
                    this.touchEnd()
            })
        this.mEmitterCancel = DeviceEventEmitter.addListener(MOTION_EVENT.CANCEL,
            (slider: ControlViewSlider) => {
                if (slider.uniqueId == this.props.uniqueId)
                    this.touchEnd()
            })
    }

    componentWillUnmount() {
        this.mEmitterStart.remove()
        this.mEmitterMove.remove()
        this.mEmitterEnd.remove()
        this.mEmitterCancel.remove()
    }

    private touchStart(rawX: number, rawY: number) {
        this.startX = rawX
        this.startY = rawY
        this.setState({pressed: true})
    }

    private touchMove(rawX: number, rawY: number) {

        if (this.state.pressed) { // 该判断为了解决Android同时响应多指触控的问题
            this.moveDx = rawX - this.startX
            this.moveDy = rawY - this.startY

            if (this.moveDx < 0)
                this.diffDx = Math.max(0, InitialOffset + this.moveDx)
            else
                this.diffDx = Math.min(DiameterPan, InitialOffset + this.moveDx)

            if (this.moveDy < 0)
                this.diffDy = Math.max(0, InitialOffset + this.moveDy)
            else
                this.diffDy = Math.min(DiameterPan, InitialOffset + this.moveDy)

            this.updatePoint(this.diffDx, this.diffDy)
        } else {
            if (this.state.offsetX != InitialOffset || this.state.offsetY != InitialOffset) {
                this.setState({
                    offsetX: InitialOffset,
                    offsetY: InitialOffset
                })
                this.updateFingerMove()
            }
        }
    }

    private touchEnd() {
        this.setState({
            pressed: false,
            offsetX: InitialOffset,
            offsetY: InitialOffset
        })
        this.updateFingerMove()
    }

    /**
     * 此时的offsetX和offsetY范围是[0,DiameterPan]，是一个边长为大圆直径的正方形，下面的处理将它规范在一个圆内.
     */
    private updatePoint(offsetX: number, offsetY: number) {

        this.distance = Math.sqrt(Math.pow(offsetX - InitialOffset, 2) + Math.pow(offsetY - InitialOffset, 2))

        // 如果该点到圆心的距离大于半径，则取值为该点到圆心的连线与圆相交点的坐标
        if (this.distance > DiameterPan / 2) {
            offsetX = InitialOffset + (offsetX - InitialOffset) * InitialOffset / this.distance
            offsetY = InitialOffset + (offsetY - InitialOffset) * InitialOffset / this.distance
        }

        this.setState({
            offsetX: offsetX,
            offsetY: offsetY
        })

        this.updateFingerMove()
    }

    /**
     * 将此时的偏移量回调到ControlContainer中，以做后续业务处理
     */
    private updateFingerMove() {
        this.props.onFingerMove(this.state.offsetX - InitialOffset, this.state.offsetY - InitialOffset)
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderView()}
            </View>
        )
    }

    renderView() {

        /**
         * Android 无法实现多指操控多个摇杆的回调，暂桥接NativeView以代替，iOS直接使用RN-View即可完成.
         */
        if (Platform.OS == 'android') {

            return (<View style={[styles.container, this.props.style]}>
                <RCTControlView uniqueId={this.props.uniqueId} style={styles.imgBg}>
                    <Image source={this.state.pressed ? ImgPanPress : ImgPanNormal}
                           style={styles.imgBg}/>
                </RCTControlView>
                <Image
                    source={this.state.pressed ? ImgMidPress : ImgMidNormal}
                    style={[styles.imgMid, {
                        left: this.state.offsetX,
                        top: this.state.offsetY
                    }]}/>
            </View>)

        } else if (Platform.OS == 'ios') {

            return (<View style={[styles.container, this.props.style]}>
                <View style={styles.imgBg}
                      onTouchStart={(evt) => {
                          this.touchStart(evt.nativeEvent.pageX, evt.nativeEvent.pageY)
                      }}
                      onTouchMove={(evt) => {
                          this.touchMove(evt.nativeEvent.pageX, evt.nativeEvent.pageY)
                      }}
                      onTouchEnd={() => {
                          this.touchEnd()
                      }}
                      onTouchCancel={() => {
                          this.touchEnd()
                      }}>
                    <Image source={this.state.pressed ? ImgPanPress : ImgPanNormal}
                           style={styles.imgBg}/>
                    <Image
                        source={this.state.pressed ? ImgMidPress : ImgMidNormal}
                        style={[styles.imgMid, {
                            left: this.state.offsetX - DiameterMid / 2,
                            top: this.state.offsetY - DiameterMid / 2
                        }]}/>
                </View>
            </View>)
        }
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        width: DiameterPan + DiameterMid,
        height: DiameterPan + DiameterMid,
        justifyContent: 'center',
        alignItems: 'center'
    },
    imgBg: {
        width: DiameterPan,
        height: DiameterPan
    },
    imgMid: {
        position: 'absolute',
        width: DiameterMid,
        height: DiameterMid
    }
})