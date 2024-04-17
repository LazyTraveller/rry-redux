/**
 * 基本的原理，是发布-订阅，改变状态，用到的地方通知
 */
let state = {
  count: 1
}

let listeners = []

function subscribe(listener) {
  listeners.push(listener)
}

function changeCount(count) {
  state.count = count
  // 订阅的原理，其实就是改变状态的时候，通知给订阅者告知一下变化
  for(let i = 0; i < listeners.length; i++) {
    listeners[i]() // 遍历执行
  }
}

// test
subscribe(() => console.log(state))

changeCount(2)

// 让改变state的值变得更加通用起来
const createStore = function(initState) {
  let state = initState
  let listeners = []

  /** 订阅 */
  function subscribe(listener) {
    listeners.push(listener)
  }

  function changeState(newState) {
    state = newState
    /** 通知 */
    for (let i = 0; i < listeners.length; i++) {
      listeners[i]() // 执行
    }
  }

  function getState() {
    return state
  }

  return {
    subscribe,
    changeState,
    getState
  }
}

// test
const initState = {
  counter: {
    count: 0
  },
  info: {
    name: '',
    description: ''
  }
}

let store = createStore(initState)
store.subscribe(() => {
  let state = store.getState()
  console.log(`${state.info.name}: ${state.info.description}`)
})
store.subscribe(() => {
  let state = store.getState()
  console.log(state.counter.count)
})

store.changeState({
  ...state.getState(),
  info: {
    name: 'redux',
    description: 'this is Store Manger tool'
  }
})

// 有计划的状态管理器
let initState1 = {
  count: 0
}

let store1 = createStore(initState1)
store1.subscribe(() => {
  let state = store1.getState()
  console.log(state.count)
})
/** 自增 */
store1.changeState({
  count: store.getState().count + 1
})
/** 自减 */
store1.changeState({
  count: store.getState().count - 1
})

/** i want to change by custom */
store1.changeState({
  count: 'change count by custom'
})

/** 设置一个plan函数，接收现在的state和action，返回经过改变后的新的state */

/**
 * 注意action = { type: '', other: '' }
 * @param {*} state 
 * @param {*} action 
 */
function plan(state, action) {
  switch(action.type) {
    case 'INCREMENT':
      return {
        ...state,
        count: state.count + 1
      }
    case 'DECREMENT':
      return {
        ...state,
        count: state.count - 1
      }
    default:
      return state
  }
}

/** 添加一个plan参数 */
const createStore2 = function(plan, initState) {
  let state = initState
  let listeners = []

  /** 订阅 */
  function subscribe(listener) {
    listeners.push(listener)
  }

  function changeState(newState) {
    state = plan(state, newState)
    /** 通知 */
    for (let i = 0; i < listeners.length; i++) {
      listeners[i]() // 执行
    }
  }

  function getState() {
    return state
  }

  return {
    subscribe,
    changeState,
    getState
  }
}

/** 尝试新的变化 */
let initState2 = {
  count: 0
}

let store2 = createStore2(plan, initState)
store2.subscribe(() => {
  let state = store2.getState()
  console.log(state.count)
})

store2.changeState({
  type: 'INCREMENT'
})
store2.changeState({
  type: 'DECREMENT'
})

/** 我想随便改，计划外的修改是无效的 */
state.changeCount({
  count: 'abc'
})

// 目前为止已经实现了一个有计划的状态管理器
// 然后把plan和changeState 换一下名字，plan改为reducer, changeState 改为dispatch

// 多文件协作，reducer的拆分和合并
// 思路：按照组件的维度拆解，再通过函数的合并起来

function counterReducer(state, action) {
  switch(action.type) {
    case 'INCREMENT':
      return {
        ...state,
        count: state.count + 1
      }
    case 'DECREMENT':
      return {
        ...state,
        count: state.count - 1
      }
    default:
      return state
  }
}

function InfoReducer(state, action) {
  switch(action.type) {
    case 'SET_NAME':
      return {
        ...state,
        name: action.name
      }
    case 'SET_DESCRIPTION':
      return {
        ...state,
        description: action.description
      }
    default:
      return state
  }
}

const reducer = combineReducers({
  counter: counterReducer,
  info: InfoReducer
})

function combineReducers(reducers) {
  const reducerKeys = Object.keys(reducers)
  return function combination(state = {}, action) {
    const nextState = {}
    for (let i = 0; i < reducerKeys.length; i++) {
      const key = reducerKeys[i]
      const reducer = reducers[key]
      /** 之前的key的State */
      const previousStateForKey = state[key]
      /** 执行分 reducer 获得新的state */
      const nextStateForKey = reducer(previousStateForKey, action)
      nextState[key] = nextStateForKey
    }
    return nextState
  }
}
// 我们来尝试下 combineReducers 的威力
const reducer3 = combineReducers({
  counter: counterReducer,
  info: InfoReducer
});

let initState3 = {
  counter: {
    count: 0
  },
  info: {
    name: '前端九部',
    description: '我们都是前端爱好者！'
  }
}

let store3 = createStore(reducer3, initState);

store3.subscribe(() => {
  let state = store.getState();
  console.log(state.counter.count, state.info.name, state.info.description);
});
/*自增*/
store3.dispatch({
  type: 'INCREMENT'
});

/*修改 name*/
store3.dispatch({
  type: 'SET_NAME',
  name: '前端九部2号'
});

const createStore4 = function (reducer, initState) {
  let state = initState;
  let listeners = [];

  function subscribe(listener) {
    listeners.push(listener);
  }

  function dispatch(action) {
    state = reducer(state, action);
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener();
    }
  }

  function getState() {
    return state;
  }
  /* 注意！！！只修改了这里，用一个不匹配任何计划的 type，来获取初始值 */
  dispatch({ type: Symbol() })

  return {
    subscribe,
    dispatch,
    getState
  }
}

// 我们思考下这行可以带来什么效果？

// createStore 的时候，用一个不匹配任何 type 的 action，来触发 state = reducer(state, action)
// 因为 action.type 不匹配，每个子 reducer 都会进到 default 项，返回自己初始化的 state，这样就获得了初始化的 state 树了。
// 你可以试试

/*这里没有传 initState 哦 */
const store5 = createStore(reducer);
/*这里看看初始化的 state 是什么*/
console.dir(store.getState());

// 到这里为止，我们已经实现了一个七七八八的 redux 啦！

// 大神非常通俗易懂的教程：https://github.com/brickspert/blog/issues/22