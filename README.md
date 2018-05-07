# react-native-multi-joystick
A react native demo for multi joystick control which both support Android and iOS.


* 需求：在ReactNative中实现多个摇杆操控，即多个滑块同时响应不同手指的触控。


* 调研准备阶段：[个人博客](https://blog.csdn.net/pang_gua/article/details/80233417)里有详细描述。

  (包含GestureResponderHandlers/PanResponder/Touchable实现方式及结果对比)。


* 最终方案:

  ```
  1. iOS使用RN提供的Touchable接口实现。
  2. Android桥接原生View，监听onTouchEvent并回传event属性值。
  ```
