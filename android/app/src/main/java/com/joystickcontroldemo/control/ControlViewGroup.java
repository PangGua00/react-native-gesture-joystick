package com.joystickcontroldemo.control;

import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.view.ReactViewGroup;

/**
 * Author  :  panggua
 * Date    :  2018/4/24
 * <p>
 * 桥接原生ViewGroup，将其Touch响应事件及参数发送到rn端
 */
public class ControlViewGroup extends ViewGroupManager<ReactViewGroup> implements ITouchEvent {

    public static final String TAG = ControlViewGroup.class.getSimpleName();
    private static final String REACT_CONTROL_VIEW = "RCTControlView";

    private static final String EVENT_CONTROL_START = "event_control_start";
    private static final String EVENT_CONTROL_MOVE = "event_control_move";
    private static final String EVENT_CONTROL_END = "event_control_end";
    private static final String EVENT_CONTROL_CANCEL = "event_control_cancel";

    private static final String TOUCH_EVENT_UID = "uniqueId";
    private static final String TOUCH_EVENT_RAW_X = "rawX";
    private static final String TOUCH_EVENT_RAW_Y = "rawY";

    private ThemedReactContext mContext;

    @Override
    public String getName() {
        return REACT_CONTROL_VIEW;
    }

    @Override
    protected ReactViewGroup createViewInstance(ThemedReactContext reactContext) {
        mContext = reactContext;
        return new TouchView(reactContext, ControlViewGroup.this);
    }

    /**
     * Prop for RN
     *
     * @param uniqueId 当屏幕上有多个摇杆控制时，以此参数来区分
     */
    @ReactProp(name = "uniqueId")
    public void setUniqueId(TouchView touchView, String uniqueId) {
        touchView.setUniqueId(uniqueId);
    }

    @Override
    public void cOnTouchDown(String uniqueId, float rawX, float rawY) {
        WritableNativeMap map = new WritableNativeMap();
        map.putString(TOUCH_EVENT_UID, uniqueId);
        map.putDouble(TOUCH_EVENT_RAW_X, rawX);
        map.putDouble(TOUCH_EVENT_RAW_Y, rawY);

        doTouchEmitter(EVENT_CONTROL_START, map);
    }

    @Override
    public void cOnTouchMove(String uniqueId, float rawX, float rawY) {
        WritableNativeMap map = new WritableNativeMap();
        map.putString(TOUCH_EVENT_UID, uniqueId);
        map.putDouble(TOUCH_EVENT_RAW_X, rawX);
        map.putDouble(TOUCH_EVENT_RAW_Y, rawY);

        doTouchEmitter(EVENT_CONTROL_MOVE, map);
    }

    @Override
    public void cOnTouchUp(String uniqueId, float rawX, float rawY) {
        WritableNativeMap map = new WritableNativeMap();
        map.putString(TOUCH_EVENT_UID, uniqueId);
        map.putDouble(TOUCH_EVENT_RAW_X, rawX);
        map.putDouble(TOUCH_EVENT_RAW_Y, rawY);

        doTouchEmitter(EVENT_CONTROL_END, map);
    }

    @Override
    public void cOnTouchCancel(String uniqueId, float rawX, float rawY) {
        WritableNativeMap map = new WritableNativeMap();
        map.putString(TOUCH_EVENT_UID, uniqueId);
        map.putDouble(TOUCH_EVENT_RAW_X, rawX);
        map.putDouble(TOUCH_EVENT_RAW_Y, rawY);

        doTouchEmitter(EVENT_CONTROL_CANCEL, map);
    }

    /**
     * Touch事件通过Emitter发送到rn端
     */
    private void doTouchEmitter(String event, WritableNativeMap map) {
        mContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).
                emit(event, map);
    }
}

