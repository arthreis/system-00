import React from 'react'

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Home, User, ListUsers } from "./pages";
import { Menu } from './components/Menu';

export const Routes = () => {
  return (
    <>
      <Router>
        <Menu />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/edit/:id" component={User} />
          <Route path="/user" component={User} />
          <Route path="/users" component={ListUsers} />
        </Switch>
      </Router>
    </>
  )
}
