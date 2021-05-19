import './App.css';
import Main from "./components/main/main";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

function App() {
  return (
    <div className="App">
        <Router>
            {/*<Switch>*/}
            {/*    <Route exact path="/">*/}
                    <Main/>
            {/*    </Route>*/}
            {/*</Switch>*/}
        </Router>
    </div>
  );
}

export default App;
