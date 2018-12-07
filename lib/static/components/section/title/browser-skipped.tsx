'use strict';

import React, {Component} from 'react';
import { cn } from '@bem-react/classname';

const cnSection = cn('Section');
const Parser = require('html-react-parser');

interface ISectionBrowserTitleSkippedProp extends React.Props<any>{
    result: {
        name: string,
        reason?: string
    };
}

class SectionBrowserTitleSkipped extends Component<ISectionBrowserTitleSkippedProp> {
    render() {
        const {name, reason} = this.props.result;

        return (
            <div className={cnSection('Title', {skipped: true})}>
                [skipped] {name}
                {reason && ', reason: '}
                {reason && Parser(reason)}
            </div>
        );
    }
}

export default SectionBrowserTitleSkipped;
