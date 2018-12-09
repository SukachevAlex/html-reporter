import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actions from '../../modules/actions';
import {Dropdown, DropdownItemProps} from 'semantic-ui-react';

interface IViewSelect {
    view: any;
    actions: any;
    options: DropdownItemProps[] | undefined;
}

class ViewSelect extends Component<IViewSelect> {

    constructor(props: any) {
        super(props);
        this._onChange = this._onChange.bind(this);
    }

    render() {
        const {view, options} = this.props;

        return (
            <Dropdown item compact={true} search selection options={options} value={view.viewMode} onChange={this._onChange}/>
        );
    }

    _onChange(event: any, {value}: any) {
        this.props.actions.changeViewMode(value);
    }
}

export default connect(
    (state: any) => ({view: state.view}),
    (dispatch) => ({actions: bindActionCreators(actions, dispatch)})
)(ViewSelect);
