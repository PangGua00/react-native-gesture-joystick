package com.joystickcontroldemo.control;

import android.annotation.SuppressLint;
import android.content.Context;
import android.view.MotionEvent;

import com.facebook.react.views.view.ReactViewGroup;

/**
 * Author  :  panggua
 * Date    :  2018/4/24
 *
 * 桥接ViewGroup
 */
@SuppressLint("ViewConstructor")
public class TouchView extends ReactViewGroup {

    private ITouchEvent mITouchEvent;
    private String mUID;
    private Context mContext;

    public TouchView(Context context, ITouchEvent iTouchEvent) {
        super(context);
        mContext = context;
        this.mITouchEvent = iTouchEvent;
    }

    public void setUniqueId(String uniqueId) {
        mUID = uniqueId;
    }

    @SuppressLint("ClickableViewAccessibility")
    @Override
    public boolean onTouchEvent(MotionEvent event) {

        switch (event.getAction()) {
            case MotionEvent.ACTION_DOWN:
                mITouchEvent.cOnTouchDown(mUID, px2dip(event.getRawX()), px2dip(event.getRawY()));
                break;
            case MotionEvent.ACTION_MOVE:
                mITouchEvent.cOnTouchMove(mUID, px2dip(event.getRawX()), px2dip(event.getRawY()));
                break;
            case MotionEvent.ACTION_UP:
            case MotionEvent.ACTION_POINTER_UP:
                mITouchEvent.cOnTouchUp(mUID, px2dip(event.getRawX()), px2dip(event.getRawY()));
                break;
            case MotionEvent.ACTION_CANCEL:
                mITouchEvent.cOnTouchCancel(mUID, px2dip(event.getRawX()), px2dip(event.getRawY()));
                break;
            default:
                break;
        }

        return true;
    }

    /**
     * rn识别的长度单位是dp，需要将像素转换成dp
     */
    private float px2dip(float pxValue) {
        final float scale = mContext.getResources().getDisplayMetrics().density;
        return (pxValue / scale + 0.5f);
    }
}
