"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
/**
 * Author  :  panggua
 * Date    :  2018/4/24
 * <p>
 * 声明桥接原生ViewGroup
 */
class RCTControlViewComponent extends react_1.Component {
}
RCTControlViewComponent.propTypes = {
    uniqueId: '',
    style: {}
};
exports.RCTControlView = react_native_1.requireNativeComponent('RCTControlView', RCTControlViewComponent, {
    nativeOnly: {
        'uniqueId': true,
        'nativeID': true,
        'accessibilityComponentType': true,
        'onLayout': true,
        'testID': true,
        'importantForAccessibility': true,
        'accessibilityLiveRegion': true,
        'accessibilityLabel': true,
        'renderToHardwareTextureAndroid': true
    }
});
//# sourceMappingURL=RCTControlView.js.map