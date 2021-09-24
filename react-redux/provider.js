/**
 * redux 需要进行四步操作：import引入store、getState获取状态、dispatch修改状态、subscribe订阅更新，代码相对冗余
 * react-redux就提供了一种合并操作的方案：react-redux提供Provider和connect两个API，Provider将store放进this.context里，
 * 省去了import这一步，connect将getState、dispatch合并进了this.props，并自动订阅更新
 */

import React from 'react'
import PropTypes from 'prop-types'

export class Provider extends React.Component {
  static childContextTypes = {
    store: PropTypes.object
  }

  // 返回context对象
  getChildContext() {
    return { store: this.store }
  }

  constructor(props, context) {
    super(props, context)
    this.store = props.store
  }

  render() {
    return this.props.children
  }
}