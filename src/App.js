//App.js
import React from 'react'
import { connect } from './react-redux'

/**
 * 一个计时器的demo应用
 */
const addCountAction = {  
    type: 'plus'
}

const mapStateToProps = state => {  
    return {      
        count: state.count  
    }
}

const mapDispatchToProps = dispatch => {  
    return {      
        addCount: () => {          
            dispatch(addCountAction)      
        }  
    }
}

class App extends React.Component {  
    render() {    
        return (      
            <div className="App">        
                { this.props.count }        
                <button onClick={ () => this.props.addCount() }>增加</button>      
            </div>    
        );  
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)