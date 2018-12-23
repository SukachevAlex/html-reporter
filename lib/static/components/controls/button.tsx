import React, {Component} from 'react';
import {Button, Icon} from 'semantic-ui-react';

interface IControlButton {
    label: string;
    handler: () => any;
    isActive?: boolean;
    isAction?: boolean;
    isDisabled?: boolean;
    isSuiteControl?: boolean;
    isControlGroup?: boolean;
    isChecked?: boolean;
    className?: string;
    color?: string;
    inverted?: boolean;
    basic?: boolean;
    icon?: any;
}

export default class ControlButton extends Component<IControlButton> {
    render() {

        const {label, inverted, handler, basic, className, icon , isChecked = false, isDisabled = false} = this.props;
        const borderStyle = isChecked ? { border: '1px solid #fc0' } : {};

        return (
            <Button onClick={handler} style={borderStyle} name={label} inverted={inverted} className={className} disabled={isDisabled} basic={basic}>
                {icon && <Icon name={icon} />}
                {label}
            </Button>
            );
    }
}
