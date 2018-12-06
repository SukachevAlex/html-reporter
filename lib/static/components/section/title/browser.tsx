'use strict';

import url from 'url';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import { cn, classnames } from '@bem-react/classname';

const cnSect = cn('Section');
const cnButton = cn('button');

interface ISectionBrowserTitleChildProps extends React.Props<any>{
    name: string;
    result: any;
    handler: () => any;
    parsedHost: string;
}

class SectionBrowserTitle extends Component<ISectionBrowserTitleChildProps> {
    render() {
        const {name, result, handler, parsedHost} = this.props;

        return (
            <div className={cnSect('Title')} onClick={handler}>
                {name}
                <a
                    className={classnames(cnButton(), cnSect('Icon', {'view-local': true}))}
                    href={this._buildUrl(result.suiteUrl, parsedHost)}
                    onClick={(e) => {
                        return e.stopPropagation();
                    }}
                    title='view in browser'
                    target='_blank'>
                </a>
            </div>
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
