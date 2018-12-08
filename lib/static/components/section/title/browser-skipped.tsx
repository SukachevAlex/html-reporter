import React, {Component, Fragment} from 'react';

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
            <Fragment>
                [skipped] {name}
                {reason && ', reason: '}
                {reason && Parser(reason)}
            </Fragment>
        );
    }
}

export default SectionBrowserTitleSkipped;
