import React, {Component, Fragment} from 'react';
import Summary from './summary/index';
import SkippedList from './skipped-list';
import Suites from './suites';
import MenuControls from './controls/menu-controls';
import { cn } from '@bem-react/classname';
const cnLogo = cn('Logo');

export default class Report extends Component {
    render() {
        return (
            <Fragment>
                <MenuControls/>
                <div className='Container'>
                    <Summary/>
                    <img className={cnLogo()} src='./logo.png' />
                    <SkippedList/>
                    <Suites/>
                </div>
            </Fragment>
        );
    }
}
