import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";

import classes from "./App.module.css";
import Navbar from "./components/layout/navbar/Navbar";
import Header from "./components/layout/header/Header";
import Homepage from "./components/homepage/Homepage";
import TypicalVideos from "./components/typicalVideos/TypicalVideos";
import ATypicalVideos from "./components/atypicalVideos/AtypicalVideos";
import ErrorBoundry from "./ErrorBoundry";
import EditPage from "./components/editPage/EditPage";

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
              <Route
                path="/t_videos/:video_id"
                render={(props) => (
                  <ErrorBoundry>
                    <EditPage {...props} />
                  </ErrorBoundry>
                )}
              />

              <Route
                path="/at_videos/:video_id"
                render={(props) => (
                  <ErrorBoundry>
                    <EditPage {...props} />
                  </ErrorBoundry>
                )}
              />

              <Route
                exact
                path="/t_videos"
                render={(props) => (
                  <ErrorBoundry>
                    <TypicalVideos {...props} />
                  </ErrorBoundry>
                )}
              />

              <Route
                exact
                path="/at_videos"
                render={(props) => (
                  <ErrorBoundry>
                    <ATypicalVideos {...props} />
                  </ErrorBoundry>
                )}
              />

              <Route exact path="/" component={Homepage} />
            </Switch>
          </main>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
