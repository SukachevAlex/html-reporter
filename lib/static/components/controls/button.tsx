import React, {Component} from 'react';
import {Button} from 'semantic-ui-react';

interface IControlButton {
    label: string;
    handler: () => any;
    isActive?: boolean;
    isAction?: boolean;
    isDisabled?: boolean;
    isSuiteControl?: boolean;
    isControlGroup?: boolean;
    isRed?: boolean;
}

export default class ControlButton extends Component<IControlButton> {

    render() {
        const {label, handler, isRed = false, isDisabled = false} = this.props;

        const redBg = isRed ? { background: 'red' } : {};

        return (<Button style={redBg} onClick={handler} disabled={isDisabled}>{label}</Button>);
    }
}
