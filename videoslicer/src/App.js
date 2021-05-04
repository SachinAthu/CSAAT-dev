import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";

import classes from "./App.module.css";
import Navbar from "./components/layout/navbar/Navbar";
import Header from "./components/layout/header/Header";
import Homepage from "./components/homepage/Homepage";
import TypicalVideos from './components/typicalVideos/TypicalVideos'

import store from "./store";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className={classes.app}>
          <Navbar />

          <Header />

          <main className={classes.main}>
            <Switch>
              <Route exact path="/t_videos" component={TypicalVideos} />
              <Route exact path="/" component={Homepage} />
            </Switch>
          </main>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
