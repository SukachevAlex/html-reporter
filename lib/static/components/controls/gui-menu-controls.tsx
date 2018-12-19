import React, {Component} from 'react';
import {Menu} from 'semantic-ui-react';
import {connect} from 'react-redux';
import CommonControlButtons from './common-controls';
import ControlButtons from './gui-controls';

class MenuControls extends Component {
    render() {
        return (
            <Menu fixed='top' size='large' compact inverted>
                <ControlButtons/>
                <CommonControlButtons/>
            </Menu>
        );
    }
}

export default connect(
    (state: any) => ({view: state.view})
)(MenuControls);
