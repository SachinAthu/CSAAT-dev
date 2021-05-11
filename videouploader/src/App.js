import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";

import classes from "./App.module.css";
import Navbar from "./components/layouts/navbar/Navbar";
import Header from "./components/layouts/header/Header";
import Homepage from "./components/homepage/Homepage";
import TypicalChildren from "./components/children/typicalChildren/TypicalChildren";
import ATypicalChildren from "./components/children/aTypicalChildren/ATypicalChildren";
import ChildPage from "./components/childPage/ChildPage";
import AddSession from "./components/sessionPage/SessionPage";
import Cameras from './components/cameras/Cameras'
import CameraAngles from './components/cameraAngles/CameraAngles'
import ErrorBoundry from './components/ErrorBoundry'

import store from "./store";

const App = (props) => {
  return (
    <Provider store={store}>
      <Router>
        <div className={classes.app}>
          <Navbar />

          <Header />

          <main className={classes.main}>

            <Switch>
              <Route path="/t_children/:child_id/:session_id" render={(props) => <ErrorBoundry><AddSession {...props} /></ErrorBoundry>} />
              <Route path="/at_children/:child_id/:session_id" render={(props) => <ErrorBoundry><AddSession {...props} /></ErrorBoundry>} />
              
              <Route path="/t_children/:child_id" render={(props) => <ErrorBoundry><ChildPage {...props} /></ErrorBoundry>} />
              <Route path="/at_children/:child_id" render={(props) => <ErrorBoundry><ChildPage {...props} /></ErrorBoundry>} /> 
              
              <Route exact path="/t_children" render={(props) => <ErrorBoundry><TypicalChildren {...props} /></ErrorBoundry>} />
              <Route exact path="/at_children" render={(props) => <ErrorBoundry><ATypicalChildren {...props} /></ErrorBoundry>} />

              <Route exact path="/cameras" render={(props) => <ErrorBoundry><Cameras {...props} /></ErrorBoundry>} />
              <Route exact path="/camera_angles" render={(props) => <ErrorBoundry><CameraAngles {...props} /></ErrorBoundry>} />

              <Route exact path="/" render={(props) => <ErrorBoundry><Homepage {...props} /></ErrorBoundry>} />
            </Switch>
          </main>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
