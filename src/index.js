import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import IssueEdit from './issueEdit';
import  { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';

const RoutedApp = () => (
    <Router>
        <Switch>
            <Route exact path="/" component={App} />
            <Redirect from="/issueslist" to="/" component={withRouter(App)} />
            <Route path="/issues/:id" component={IssueEdit} />
            <Route path="*" component={NoMatch} />
        </Switch>
    </Router>
);

const NoMatch = () => {
    return (<p>Page Not Found</p>);
}

ReactDOM.render(<RoutedApp />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
