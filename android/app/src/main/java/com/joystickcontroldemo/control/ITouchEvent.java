package com.joystickcontroldemo.control;

/**
 * Author  :  panggua
 * Date    :  2018/4/24
 *
 * Touch事件的接口
 */
public interface ITouchEvent {

    void cOnTouchDown(String uniqueId, float rawX, float rawY);

    void cOnTouchMove(String uniqueId, float rawX, float rawY);

    void cOnTouchUp(String uniqueId, float rawX, float rawY);

    void cOnTouchCancel(String uniqueId, float rawX, float rawY);
}
