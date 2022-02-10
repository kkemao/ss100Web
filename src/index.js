import React from "react";
import ReactDOM from "react-dom";
import { UserProvider } from "./UserContext";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import "./index.css";
import "antd/dist/antd.css";
import Home from "./pageHome";
import Login from "./pageLogin";
import * as serviceWorker from "./serviceWorker";
import ScrollToTop from "./ScrollToTop";
ReactDOM.render(
  <UserProvider>
    <Router>
        <Route path="/login" exact component={Login}></Route>
      <ScrollToTop>
        <Route path="/home" component={Home}></Route>
        <Route
          path="/"
          exact
          render={() => <Redirect to="/login" push />}
        ></Route>
      </ScrollToTop>
    </Router>
  </UserProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
