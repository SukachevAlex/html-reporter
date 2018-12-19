import React, {Component} from 'react';
import {Menu} from 'semantic-ui-react';

interface IRunButton {
    autoRun: any;
    label?: string;
    handler: () => any;
    isActive?: boolean;
    isAction?: boolean;
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
        const { handler, label = 'Run' } = this.props;
        return (
            <Menu.Item label={label} onClick={handler}>
                Run
            </Menu.Item>
        );
    }
}
