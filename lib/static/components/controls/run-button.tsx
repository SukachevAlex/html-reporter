import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';

interface IRunButton {
    autoRun: any;
    label?: string;
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

export default class RunButton extends Component<IRunButton> {

    componentWillReceiveProps({ autoRun }: any) {
        if (this.props.autoRun !== autoRun && autoRun) {
            this.props.handler();
        }
    }

    render() {
        const { handler, isDisabled, label = 'Run' } = this.props;
        return (<Menu.Item
                    inverted={true}
                    label={label}
                    isAction={true}
                    onClick={handler}
                    isDisabled={isDisabled}
                >
                    Run
                 </Menu.Item>);
    }
}
