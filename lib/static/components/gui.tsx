import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {initial} from '../modules/actions';
import MenuControls from './controls/gui-menu-controls';
import SkippedList from './skipped-list';
import Suites from './suites';
import {cn, classnames} from '@bem-react/classname';

const cnLogo = cn('Logo');
const cnContainer = cn('Container');

interface IGuiProps extends React.Props<any> {
    gui?: any;
    initial?: any;
}

class Gui extends Component<IGuiProps> {
    componentDidMount() {
        this.props.gui && this.props.initial();
    }

    render() {
        return (
            <Fragment>
                <MenuControls/>
                <div className='Container'>
                <img className={classnames(cnLogo(), cnContainer('Logo'))} src='logo.png' />
                    <SkippedList/>
                    <Suites/>
                </div>
            </Fragment>
        );
    }
}

export default connect(({gui}: any) => ({gui}), {initial})(Gui);
