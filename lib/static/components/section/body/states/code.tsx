import React, {Component, Fragment} from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
// @ts-ignore
import {agate as syntaxStyle} from 'react-syntax-highlighter/dist/styles/hljs';

interface ICodeProps {
    code?: string;
}

export class Code extends Component<ICodeProps> {
    render() {
        const {code} = this.props;

        return (
            <Fragment>
                {code && <SyntaxHighlighter style={syntaxStyle} language='javascript'>{code.normalize()}</SyntaxHighlighter>}
            </Fragment>
        );
    }
}
