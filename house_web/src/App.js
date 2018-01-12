import React, { Component } from 'react';
import {HashRouter as Router ,Link,Route} from 'react-router-dom'
import logo from './logo.svg';
import './App.css';

import myFetchConf from './common/myFetch'
import Map from './component/Map/map';
import Login from './component/login/login'


myFetchConf.init()


class App extends Component {
  render() {
    return (
        <Router>
      <div className="App">
        {/*<header className="App-header">*/}
          {/*<img src={logo} className="App-logo" alt="logo" />*/}
          {/*<h1 className="App-title">Welcome to React</h1>*/}
        {/*</header>*/}
          <Route exact path = '/' render={()=>window.location.hash = '/map'} />
          <Route  path = '/login' component={Login}/>
          <Route  path = '/map' component={Map} />


      </div>
        </Router>
    )
  }
}

export default App;
