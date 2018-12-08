import React, {Component} from 'react';
import {connect} from 'react-redux';
import {initial} from '../modules/actions';
import MenuControls from './controls/gui-menu-controls';
import SkippedList from './skipped-list';
import Suites from './suites';

interface IGuiProps extends React.Props<any> {
    gui?: any;
    initial?: any;
}

class Gui extends Component<IGuiProps> {
    componentDidMount() {
        this.props.gui && this.props.initial();
    }

    render() {
        return <>
            <MenuControls/>
            <div className='Container'>
                <SkippedList/>
                <Suites/>
            </div>
        </>;
    }
}

export default connect(({gui}: any) => ({gui}), {initial})(Gui);
