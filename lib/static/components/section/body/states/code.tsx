import React, {Component} from 'react';
import MetaInfo, {IMetaInfo} from './meta-info';
import SyntaxHighlighter from 'react-syntax-highlighter';
import {agate as syntaxStyle} from 'react-syntax-highlighter/styles/hljs';

interface ICodeProps {
    metaInfo: IMetaInfo;
    className?: string;
    suiteUrl: string;
    code?: string;
}

export class Code extends Component<ICodeProps> {
    render() {
        const {metaInfo, suiteUrl, code} = this.props;

        return <>
            <MetaInfo suiteUrl={suiteUrl} metaInfo={metaInfo} />
            {code && <SyntaxHighlighter style={syntaxStyle} language='javascript'>{code}</SyntaxHighlighter>}
        </>;
    }
}
