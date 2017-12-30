import React, { Component } from 'react';
import {BrowserRouter as Router ,Link,Route} from 'react-router-dom'
import logo from './logo.svg';
import './App.css';


import Map from './component/Map/map';
import Login from './component/login/login'

class App extends Component {
  render() {
    return (
        <Router>
      <div className="App">
        {/*<header className="App-header">*/}
          {/*<img src={logo} className="App-logo" alt="logo" />*/}
          {/*<h1 className="App-title">Welcome to React</h1>*/}
        {/*</header>*/}
          {/*<Route exact path = '/' render={()=>(<div><div> welCome </div> <Link to={`map`}>导向map</Link></div>)} />*/}
          <Route path = '/' component={Login}/>
          <Route  path = '/map' component={Map} />


      </div>
        </Router>
    )
  }
}

export default App;
