import React, {Component} from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
// @ts-ignore
import {github as syntaxStyle} from 'react-syntax-highlighter/dist/styles/hljs';

interface ICodeProps {
    code?: string;
    lang?: string;
}

export class Code extends Component<ICodeProps> {
    render() {
        const {code, lang} = this.props;

        return code ? <SyntaxHighlighter style={syntaxStyle} className='CodeView' language={lang || 'javascript'}>{code}</SyntaxHighlighter> : null;
    }
}
