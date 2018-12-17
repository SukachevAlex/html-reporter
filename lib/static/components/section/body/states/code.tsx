import React, {Component} from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
// @ts-ignore
import {agate as syntaxStyle} from 'react-syntax-highlighter/dist/styles/hljs';

interface ICodeProps {
    code?: string;
    file: string;
}

export class Code extends Component<ICodeProps> {
    render() {
        let {code} = this.props;
        const {file} = this.props;

        fetch(file)
            .then((e) => e.text())
            .then((e) => { code = e; })
            .catch(console.error.bind(console));

        return code ? <SyntaxHighlighter style={syntaxStyle} language='javascript'>{code.normalize()}</SyntaxHighlighter> : null;
    }
}
