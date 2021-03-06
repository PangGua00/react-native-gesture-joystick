"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const React = __importStar(require("react"));
const react_native_1 = require("react-native");
const RCTControlView_1 = require("./RCTControlView");
// 回调事件名称，用于Emitter
const MOTION_EVENT = {
    START: 'event_control_start',
    MOVE: 'event_control_move',
    END: 'event_control_end',
    CANCEL: 'event_control_cancel'
};
// 大圆和小圆点的两种状态下的图片资源
const ImgPanNormal = require('../../res/img/control/camera_control_joystick_default.png');
const ImgPanPress = require('../../res/img/control/camera_control_joystick_pressed.png');
const ImgMidNormal = require('../../res/img/control/camera_control_mid_common_default.png');
const ImgMidPress = require('../../res/img/control/camera_control_mid_common_pressed.png');
// 大圆的直径、小圆点的初始偏移量、小圆点的直径，可根据需求自行配置
const DiameterPan = 176;
exports.InitialOffset = DiameterPan / 2;
const DiameterMid = 80;
/**
 * Author  :  panggua
 * Date    :  2018/4/24
 * <p>
 * 单个摇杆操控View及偏移量计算
 */
class JoystickControlView extends react_1.Component {
    constructor(props) {
        super(props);
        this.startX = 0;
        this.startY = 0;
        this.moveDx = 0;
        this.moveDy = 0;
        this.diffDx = 0;
        this.diffDy = 0;
        this.distance = 0;
        this.state = {
            pressed: false,
            offsetX: exports.InitialOffset,
            offsetY: exports.InitialOffset
        };
        // emitter just for Android
        this.mEmitterStart = react_native_1.DeviceEventEmitter.addListener(MOTION_EVENT.START, (slider) => {
            if (slider.uniqueId == this.props.uniqueId)
                this.touchStart(slider.rawX, slider.rawY);
        });
        this.mEmitterMove = react_native_1.DeviceEventEmitter.addListener(MOTION_EVENT.MOVE, (slider) => {
            if (slider.uniqueId == this.props.uniqueId)
                this.touchMove(slider.rawX, slider.rawY);
        });
        this.mEmitterEnd = react_native_1.DeviceEventEmitter.addListener(MOTION_EVENT.END, (slider) => {
            if (slider.uniqueId == this.props.uniqueId)
                this.touchEnd();
        });
        this.mEmitterCancel = react_native_1.DeviceEventEmitter.addListener(MOTION_EVENT.CANCEL, (slider) => {
            if (slider.uniqueId == this.props.uniqueId)
                this.touchEnd();
        });
    }
    componentWillUnmount() {
        this.mEmitterStart.remove();
        this.mEmitterMove.remove();
        this.mEmitterEnd.remove();
        this.mEmitterCancel.remove();
    }
    touchStart(rawX, rawY) {
        this.startX = rawX;
        this.startY = rawY;
        this.setState({ pressed: true });
    }
    touchMove(rawX, rawY) {
        if (this.state.pressed) { // 该判断为了解决Android同时响应多指触控的问题
            this.moveDx = rawX - this.startX;
            this.moveDy = rawY - this.startY;
            if (this.moveDx < 0)
                this.diffDx = Math.max(0, exports.InitialOffset + this.moveDx);
            else
                this.diffDx = Math.min(DiameterPan, exports.InitialOffset + this.moveDx);
            if (this.moveDy < 0)
                this.diffDy = Math.max(0, exports.InitialOffset + this.moveDy);
            else
                this.diffDy = Math.min(DiameterPan, exports.InitialOffset + this.moveDy);
            this.updatePoint(this.diffDx, this.diffDy);
        }
        else {
            if (this.state.offsetX != exports.InitialOffset || this.state.offsetY != exports.InitialOffset) {
                this.setState({
                    offsetX: exports.InitialOffset,
                    offsetY: exports.InitialOffset
                });
                this.updateFingerMove();
            }
        }
    }
    touchEnd() {
        this.setState({
            pressed: false,
            offsetX: exports.InitialOffset,
            offsetY: exports.InitialOffset
        });
        this.updateFingerMove();
    }
    /**
     * 此时的offsetX和offsetY范围是[0,DiameterPan]，是一个边长为大圆直径的正方形，下面的处理将它规范在一个圆内.
     */
    updatePoint(offsetX, offsetY) {
        this.distance = Math.sqrt(Math.pow(offsetX - exports.InitialOffset, 2) + Math.pow(offsetY - exports.InitialOffset, 2));
        // 如果该点到圆心的距离大于半径，则取值为该点到圆心的连线与圆相交点的坐标
        if (this.distance > DiameterPan / 2) {
            offsetX = exports.InitialOffset + (offsetX - exports.InitialOffset) * exports.InitialOffset / this.distance;
            offsetY = exports.InitialOffset + (offsetY - exports.InitialOffset) * exports.InitialOffset / this.distance;
        }
        this.setState({
            offsetX: offsetX,
            offsetY: offsetY
        });
        this.updateFingerMove();
    }
    /**
     * 将此时的偏移量回调到ControlContainer中，以做后续业务处理
     */
    updateFingerMove() {
        this.props.onFingerMove(this.state.offsetX - exports.InitialOffset, this.state.offsetY - exports.InitialOffset);
    }
    render() {
        return (React.createElement(react_native_1.View, { style: styles.container }, this.renderView()));
    }
    renderView() {
        /**
         * Android 无法实现多指操控多个摇杆的回调，暂桥接NativeView以代替，iOS直接使用RN-View即可完成.
         */
        if (react_native_1.Platform.OS == 'android') {
            return (React.createElement(react_native_1.View, { style: [styles.container, this.props.style] },
                React.createElement(RCTControlView_1.RCTControlView, { uniqueId: this.props.uniqueId, style: styles.imgBg },
                    React.createElement(react_native_1.Image, { source: this.state.pressed ? ImgPanPress : ImgPanNormal, style: styles.imgBg })),
                React.createElement(react_native_1.Image, { source: this.state.pressed ? ImgMidPress : ImgMidNormal, style: [styles.imgMid, {
                            left: this.state.offsetX,
                            top: this.state.offsetY
                        }] })));
        }
        else if (react_native_1.Platform.OS == 'ios') {
            return (React.createElement(react_native_1.View, { style: [styles.container, this.props.style] },
                React.createElement(react_native_1.View, { style: styles.imgBg, onTouchStart: (evt) => {
                        this.touchStart(evt.nativeEvent.pageX, evt.nativeEvent.pageY);
                    }, onTouchMove: (evt) => {
                        this.touchMove(evt.nativeEvent.pageX, evt.nativeEvent.pageY);
                    }, onTouchEnd: () => {
                        this.touchEnd();
                    }, onTouchCancel: () => {
                        this.touchEnd();
                    } },
                    React.createElement(react_native_1.Image, { source: this.state.pressed ? ImgPanPress : ImgPanNormal, style: styles.imgBg }),
                    React.createElement(react_native_1.Image, { source: this.state.pressed ? ImgMidPress : ImgMidNormal, style: [styles.imgMid, {
                                left: this.state.offsetX - DiameterMid / 2,
                                top: this.state.offsetY - DiameterMid / 2
                            }] }))));
        }
    }
}
exports.default = JoystickControlView;
const styles = react_native_1.StyleSheet.create({
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
});
//# sourceMappingURL=JoystickControlView.js.map