import React from 'react'
import PropTypes from 'prop-types'

/**
 * 
 * connect接收mapStateToProps、mapDispatchToProps两个方法，然后返回一个高阶函数，
 * 这个高阶函数接收一个组件，返回一个高阶组件（其实就是给传入的组件增加一些属性和功能）
 * connect根据传入的map，将state和dispatch(action)挂载子组件的props上
 * @param {*} mapStateToProps 
 * @param {*} mapDispatchToProps 
 * @returns 
 */
export function connect(mapStateToProps, mapDispatchToProps) {
  return function(Component) {
    class Connect extends React.Component {
      componentDidMount() {
        // 从context获取store并订阅更新
        this.context.store.subscribe(this.handleStoreChange.bind(this))
      }

      handleStoreChange() {
        // 触发更新
        this.forceUpdate()
      }
      render () {
        return <Component 
                // 传入改组件的props，需要有connect这个高阶组件原样传回原组件
                {...this.props} 
                // 根据mapDispatchToProps把state挂到this.props上
                {...mapStateToProps(this.context.store.getState)}
                // 根据mapDispatchToProps把dispatch(action)挂到this.props上
                {...mapDispatchToProps(this.context.store.dispatch)}
              ></Component>
      }
    }

    Connect.contextType = {
      store: PropTypes.object
    }

    return Connect
  }
}

