
import React from 'react';
import Router from 'react-router';
import { DefaultRoute, Link, Route, RouteHandler, IndexRoute } from 'react-router';

import general from './sass/general.scss';

import { App } from 'app/App';
import { Home } from 'app/components/Home'

React.render(
    <Router>
        <Route path="/" component={App}>
            <IndexRoute component={Home} />
        </Route>
    </Router>
, document.getElementById('content'))