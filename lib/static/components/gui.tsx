import React, {Component} from 'react';
import {connect} from 'react-redux';
import {initial} from '../modules/actions';
import ControlButtons from './controls/gui-controls';
import SkippedList from './skipped-list';
import Suites from './suites';
import Summary from './summary/index';

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
            <Summary/>
            <ControlButtons/>
            <SkippedList/>
            <Suites/>
        </>;
    }
}

export default connect(({gui}: any) => ({gui}), {initial})(Gui);
