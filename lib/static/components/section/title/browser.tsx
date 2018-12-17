import url from 'url';
import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';

interface ISectionBrowserTitleChildProps extends React.Props<any>{
    name: string;
    result: any;
    parsedHost: string;
}
class SectionBrowserTitle extends Component<ISectionBrowserTitleChildProps> {
    render() {
        const {name, result, parsedHost} = this.props;

        return (
            <Fragment>
                {name}
                <a
                    className='button section__icon section__icon_view-local'
                    href={this._buildUrl(result.suiteUrl, parsedHost)}
                    onClick={(e) => {
                        return e.stopPropagation();
                    }}
                    title='view in browser'
                    target='_blank'
                />
            </Fragment>
        );
    }

    private _buildUrl(href: string, host: string) {
        return !host ? href : url.format({...url.parse(href), host});
    }
}

export default connect(
    (state: any) => ({parsedHost: state.view.parsedHost}),
    null
)(SectionBrowserTitle);
