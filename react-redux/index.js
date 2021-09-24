import React from 'react'
import { connect } from './connect'


//普通connect使用
class App extends React.Component{
  render(){
      return <div>hello</div>
  }
}
function mapStateToProps(state){
  return state.main
}
function mapDispatchToProps(dispatch){
  return bindActionCreators(action,dispatch)
}
export default connect(mapStateToProps,mapDispatchToProps)(App)

//使用装饰器简化
@connect(
  state=>state.main,
  dispatch=>bindActionCreators(action,dispatch)
)
class App2 extends React.Component{
    render(){
        return <div>hello</div>
    }
}