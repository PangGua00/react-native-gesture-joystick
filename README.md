# react-native-multi-joystick
A react native demo for multi joystick control which both support Android and iOS.


#### 需求：  
在ReactNative中实现多个摇杆操控，即多个滑块同时响应不同手指的触控。


#### 调研准备阶段  
`GestureResponderHandlers & PanResponder & Touchable`

* 使用 GestureResponderHandlers
	* 伪代码

		```ts
		...
	
		componentWillMount() {

        	this._gesture = {
        	
        		// 在用户开始触摸的时候（手指刚刚接触屏幕的瞬间），是否愿意成为响应者？
            	onStartShouldSetResponder: (evt: GestureResponderEvent) => true,
            	// 如果View不是响应者，那么在每一个触摸点开始移动（没有停下也没有离开屏幕）时再询问一次：是否愿意响应触摸交互呢？
            	onMoveShouldSetResponder: (evt: GestureResponderEvent)=> true,
            
            	// 如果View返回true，并开始尝试成为响应者，那么会触发下列事件之一
            
            	// View现在要开始响应触摸事件了。这也是需要做高亮的时候，使用户知道他到底点到了哪里。
            	onResponderGrant: (evt: GestureResponderEvent)=>{},
            	// 用户正在屏幕上移动手指时（没有停下也没有离开屏幕）。
            	onResponderMove: (evt: GestureResponderEvent)=>{},
            	// 触摸操作结束时触发，比如"touchUp"（手指抬起离开屏幕）。
            	onResponderRelease: (evt: GestureResponderEvent)=>{}
        	};
    	}
    
    	...
    
    	render() {
        	return (
            	<View style={styles.container}
            	      {...this._gesture}>
                	...
            	</View>
        	)
    	}
		```
		
	* 结果分析
	
		```
		1. 只有一个滑块的时候，可以使用，坐标可以通过 evt.nativeEvent 结构里的属性得到。
		2. 当有多个滑块的时候，只能同时响应一个。即按下第一个手指后，再按下第二个手指，无法识别和区分。
		3. 由于无法同时作为手势响应者，故不满足需求，此方案排除。
		```
		
* 使用 PanResponder
	* 伪代码
	
		```ts
		...
		
		componentWillMount() {

        	this._panResponder = PanResponder.create({

            	// 要求成为响应者
            	onStartShouldSetPanResponder: (evt, gestureState) => true,
      			onMoveShouldSetPanResponder: (evt, gestureState) => true,
      			// 是否劫持触摸事件，使其他控件无法响应
      			onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      			onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      			
      			// 是否同意其他组件申请时释放当前响应者
      			onPanResponderTerminationRequest: () => false,
      			
            	// 开始手势操作
            	onPanResponderGrant: (evt, gestureState) => {
            		// gestureState.{x,y} 现在会被设置为0
            	},
				// 手势移动
            	onPanResponderMove: (evt, gestureState) => {
            		// 最近一次的移动距离为gestureState.move{X,Y}
            		// 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
            	},
				// 用户放开了所有的触摸点
            	onPanResponderRelease: (evt, gestureState) => {}
        	});
    	}
    
    	...
    
    	render() {
        	return (
            	<View style={styles.container} 
            		  {...this._panResponder.panHandlers}>
                	...
            	</View>
        	)
    	}
		```
		
	* 结果分析
	
		```
		1. 只有一个滑块的时候，可以使用，坐标和位移可以通过 gestureState 结构里的属性得到。
		2. 通过阅读源码可以发现，其实 PanResponder 实际是对 GestureResponderHandlers 的封装实现。
		   它内部对坐标和移动距离做了计算并赋值在了 gestureState 结构中，为开发者减轻了计算负担。
		3. 由于无法同时作为手势响应者，故不满足需求，此方案排除。
		```
	
* 使用Touchable接口
	* 伪代码
	
		```ts
		...
		render() {
        	return (
            	<View style={styles.container}
		              onTouchStart={(evt: GestureResponderEvent) => {}}
	                  onTouchMove={(evt: GestureResponderEvent) => {}}
	                  onTouchEnd={(evt: GestureResponderEvent) => {}}
	                  onTouchCancel={(evt: GestureResponderEvent) => {}}>
                	...
            	</View>
        	)
    	}
    	...
		
		```
		
	* 结果分析
	
		```
		1. 对于 iOS 设备，满足需求，可以实现多个滑块同时响应并能识别区分。
		   参数evt的类型同 GestureResponderHandlers 中的 evt，
		   所以坐标和位移可以通过 evt.nativeEvent 结构里的属性得到。
		2. 对于 Android 设备，仍然无法满足需求，对于多个滑块可同时响应，但无法识别区分。	
		3. 此方案可以用于 iOS，但对于 Android 需要寻找其他方案。
		```
		
#### 最终解决方案
* 对于 iOS 设备，在调研准备阶段中发现，使用RN提供的 Touchable 接口可以满足需求。

* 对于 Android 设备，由于没有合适的RN解决方案，暂定以原生桥接的方式实现。

* Android 桥接实现思路：
	* 桥接原生ViewGroup，重写onTouchEvent函数，实现对MotionEvent的监听。
	* 将onTouchEvent的 event 结构里的属性（坐标和位移）通过 DeviceEventEmitter 发送到RN层。
	* RN层声明桥接的ViewGroup，其引用形式同 RN-View。并监听 DeviceEventEmitter 的回传，在不同的onTouch事件中做出对应的计算和展示。
