"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const react_1 = require("react");
const react_native_1 = require("react-native");
const JoystickControlContainer_1 = require("./control/JoystickControlContainer");
class App extends react_1.Component {
    render() {
        return (React.createElement(react_native_1.View, { style: styles.container },
            React.createElement(JoystickControlContainer_1.JoystickControlContainer, null)));
    }
}
exports.default = App;
const styles = react_native_1.StyleSheet.create({
    container: {
        backgroundColor: '#5180aa',
        width: '100%',
        height: '100%'
    }
});
//# sourceMappingURL=App.js.map