"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const react_1 = require("react");
const react_native_1 = require("react-native");
const JoystickControlView_1 = __importDefault(require("./JoystickControlView"));
// uniqueId 用于在 emitter 接收时区分不同的摇杆控件
const UNIQUE_ID_1 = 'joystick_left';
const UNIQUE_ID_2 = 'joystick_right';
/**
 * Author  :  panggua
 * Date    :  2018/4/24
 * <p>
 * 摇杆操控Container，没有加入强制横屏代码，所以需要手动横屏以观看效果。
 * 此处暂时只存放了两个摇杆控制区域，如果需要可放入多个，自定义Style传入，只需保证 uniqueId 唯一即可。
 */
class JoystickControlContainer extends react_1.Component {
    render() {
        return (React.createElement(react_native_1.View, { style: styles.container },
            React.createElement(JoystickControlView_1.default, { uniqueId: UNIQUE_ID_1, onFingerMove: (dx, dy) => {
                    console.log('joystick-left', 'vx', dx);
                    console.log('joystick-left', 'vy', dy);
                } }),
            React.createElement(JoystickControlView_1.default, { uniqueId: UNIQUE_ID_2, onFingerMove: (dx, dy) => {
                    console.log('joystick-right', 'vx', dx);
                    console.log('joystick-right', 'vy', dy);
                } })));
    }
}
exports.JoystickControlContainer = JoystickControlContainer;
const styles = react_native_1.StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    }
});
//# sourceMappingURL=JoystickControlContainer.js.map