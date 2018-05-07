"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Author  :  panggua
 * Date    :  2018/4/24
 * <p>
 * 封装原生Touch事件发送的参数体
 */
class ControlViewSlider {
    constructor(uniqueId, rawX, rawY) {
        this._uniqueId = uniqueId;
        this._rawX = rawX;
        this._rawY = rawY;
    }
    get uniqueId() {
        return this._uniqueId;
    }
    get rawX() {
        return this._rawX;
    }
    get rawY() {
        return this._rawY;
    }
}
exports.ControlViewSlider = ControlViewSlider;
//# sourceMappingURL=ControlViewSlider.js.map