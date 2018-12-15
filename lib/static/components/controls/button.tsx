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
}

export default class ControlButton extends Component<IControlButton> {

    render() {
        const {label, handler, isDisabled = false} = this.props;

        return (<Button onClick={handler} name={label} disabled={isDisabled}>{label}</Button>);
    }
}
