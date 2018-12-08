import React, {Component} from 'react';
import Summary from './summary/index';
import SkippedList from './skipped-list';
import Suites from './suites';
import MenuControls from './controls/menu-controls';

export default class Report extends Component {
    render() {
        return <>
            <MenuControls/>
            <div className='Container'>
                <Summary/>
                <SkippedList/>
                <Suites/>
            </div>
        </>;
    }
}