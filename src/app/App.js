/**
 * Created by thoma on 11/20/2015.
 */
import React from 'react';
import { Link } from 'react-router';

import {Menu} from './Menu';

export class App extends React.Component {
    render(){
        return (
            <div>
                <Menu/>
                { this.props.children}
            </div>
        )
    }
}


