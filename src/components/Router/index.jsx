import React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import App from '../App';
import Admin from '../Admin';

const Routing = (
  <Router>
    <div>
      <Route exact path="/" component={App} />
      <Route path="/Admin" component={Admin} />
      <Route path="/App" component={App} />
    </div>
  </Router>
);

export default Routing;
