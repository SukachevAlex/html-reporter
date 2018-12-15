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
    className?: string;
    color?: string;
    inverted?: boolean;
}

export default class ControlButton extends Component<IControlButton> {

    render() {
        const {label, inverted, handler, isDisabled = false, className} = this.props;

        return (<Button onClick={handler} name={label} inverted={inverted} className={className} disabled={isDisabled}>{label}</Button>);
    }
}
