import {Component} from 'react'
import * as React from 'react'
import {requireNativeComponent, ViewStyle} from 'react-native'

interface Props {
    uniqueId: string
    style: ViewStyle
}

/**
 * Author  :  panggua
 * Date    :  2018/4/24
 * <p>
 * 声明桥接原生ViewGroup
 */
class RCTControlViewComponent extends Component<Props, {}> {
    static propTypes: Props = {
        uniqueId: '',
        style: {}
    }
}

export const RCTControlView = requireNativeComponent('RCTControlView',
    RCTControlViewComponent,
    {
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
    }
)
