import React, {Component, Fragment} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {pick, values} from 'lodash';
import * as actions from '../../modules/actions';
import RunButton from './run-button';
import {Menu} from 'semantic-ui-react';

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
        const {actions, autoRun} = this.props;

        return (
            <Fragment>
                <RunButton autoRun={autoRun} handler={actions.runAllTests}  />

                <Menu.Item label='Retry failed' onClick={this._runFailedTests}>
                    Retry failed
                </Menu.Item>

                <Menu.Item label='Accept all' onClick={this._acceptAll} >
                    Accept all
                </Menu.Item>

                <Menu.Item label='Clear retries' onClick={actions.clearRetries} >
                    Clear retries
                </Menu.Item>
            </Fragment>
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
