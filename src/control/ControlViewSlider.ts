/**
 * Author  :  panggua
 * Date    :  2018/4/24
 * <p>
 * 封装原生Touch事件发送的参数体
 */
export class ControlViewSlider {

    private _uniqueId: string
    private _rawX: number
    private _rawY: number

    constructor(uniqueId: string, rawX: number, rawY: number) {
        this._uniqueId = uniqueId
        this._rawX = rawX
        this._rawY = rawY
    }

    get uniqueId(): string {
        return this._uniqueId
    }

    get rawX(): number {
        return this._rawX
    }

    get rawY(): number {
        return this._rawY
    }
}
