import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {pick, values} from 'lodash';
import * as actions from '../../modules/actions';
import RunButton from './run-button';
import { Menu } from 'semantic-ui-react';

interface IControllButtonsProps {
    suiteIds?: any;
    running?: boolean;
    autoRun?: any;
    failed?: any;
    actions?: any;
    label?: string;
}

class ControlButtons extends Component<IControllButtonsProps> {
    _runFailedTests = () => {
        const {actions, failed} = this.props;

        return actions.runFailedTests(failed);
    }

    _acceptAll = () => {
        const {actions, failed} = this.props;

        return actions.acceptAll(failed);
    }

    render() {
        const {actions, suiteIds, failed, running, autoRun} = this.props;

        return (
            <>
                <RunButton
                    autoRun={autoRun}
                    isDisabled={!suiteIds.all.length || running}
                    handler={actions.runAllTests}
                />
                <Menu.Item
                    inverted={true}
                    label='Retry failed'
                    isDisabled={running || !failed.length}
                    onClick={this._runFailedTests}
                    >Retry failed</Menu.Item>
                <Menu.Item
                    inverted={true}
                    label='Accept all'
                    isDisabled={running || !failed.length}
                    onClick={this._acceptAll}
                    >Accept all</Menu.Item>

                <Menu.Item
                    inverted={true}
                    label='Clear retries'
                    isDisabled={!!running}
                    onClick={actions.clearRetries}
                    isAction={true}
                >Clear retries</Menu.Item>
            </>
        );
    }
}

export default connect<{}, {}, IControllButtonsProps>(
    (state: any) => ({
        suiteIds: state.suiteIds,
        running: state.running,
        autoRun: state.autoRun,
        failed: values(pick(state.suites, state.suiteIds.failed))
    }),
    (dispatch) => ({actions: bindActionCreators(actions, dispatch)})
)(ControlButtons);
