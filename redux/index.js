import { reducer }  from './reducer'
/**
 * redux简单的设计思路：
 * 1.状态
 * 2.通过行为修改状态
 * 3.状态改变广播通知组件
 */

// 增加一个辅助方法applyMiddleware，用于添加中间件
function applyMiddleware(store, middleWares) {
  middleware = [...middleWares] // //浅拷贝数组, 避免下面reserve()影响原数组
  middleware.reverse()               //由于循环替换dispatch时,前面的中间件在最里层,因此需要翻转数组才能保证中间件的调用顺序
  // 循环替换dispatch   
  middleware.forEach(middleware =>      
    store.dispatch = middleware(store)    
)
}

export const createStore = (reducer) => {
  let currentState = {} // 公共状态
  let observers = [] // 观察者队列

  // getter
  function getState() {
    return currentState // 返回状态即可
  } 

   // setter
  function dispatch(action) { // action 为一个对象
    currentState = reducer(currentState, action) 

    // 每次执行dispatch都广播
    observers.forEach(fn => fn())

  }
 
  // 发布订阅
  function subscribe(fn) {
    observers.push(fn) 
  } 

  dispatch({ type: '@@redux_init' }) // 初始化store数据

  return { getState, dispatch, subscribe }
} 

const store = createStore(reducer)       //创建store
store.subscribe(() => { console.log('组件1收到store的通知') })
store.subscribe(() => { console.log('组件2收到store的通知') })
store.dispatch({ type: 'plus' })         //执行dispatch，触发store的通知
