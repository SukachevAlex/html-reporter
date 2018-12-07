import React, {Component, Fragment} from 'react';
import MetaInfo from './meta-info';
import SyntaxHighlighter from 'react-syntax-highlighter';
import {agate as syntaxStyle} from 'react-syntax-highlighter/styles/hljs';

import {IMetaInfo} from 'typings/test-adapter';

interface ICodeProps {
    metaInfo: IMetaInfo;
    className?: string;
    suiteUrl: string;
    code?: string;
}

export class Code extends Component<ICodeProps> {
    render() {
        const {metaInfo, suiteUrl, code} = this.props;

        return (
            <Fragment>
                <MetaInfo suiteUrl={suiteUrl} metaInfo={metaInfo} />
                {code && <SyntaxHighlighter style={syntaxStyle} language='javascript'>{code.normalize()}</SyntaxHighlighter>}
            </Fragment>
        );
    }
}
