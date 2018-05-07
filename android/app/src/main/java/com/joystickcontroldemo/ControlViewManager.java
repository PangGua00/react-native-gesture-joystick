package com.joystickcontroldemo;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.joystickcontroldemo.control.ControlViewGroup;

import java.util.Collections;
import java.util.List;

/**
 * Author  :  panggua
 * Date    :  2018/4/24
 */
public class ControlViewManager implements ReactPackage {

    /**
     * 加入原生库的Module
     */
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

    /**
     * 加入原生View的Manager
     */
    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.<ViewManager>singletonList(
                new ControlViewGroup()
        );
    }
}
