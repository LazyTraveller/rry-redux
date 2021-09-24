//index.js
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Provider } from './react-redux'
import { createStore } from './store'
import { reducer } from './reducer'
import { logger, logger2, thunk, applyMiddleware  } from '../redux-middleware/index'
let store = createStore(reducer)

applyMiddleware(store, [ logger, thunk, logger2 ])

ReactDOM.render(   
    <Provider store={createStore(reducer)}>        
        <App />    
    </Provider>,     
    document.getElementById('root')
);