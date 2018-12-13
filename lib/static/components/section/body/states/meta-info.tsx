import url from 'url';
import React, {Component} from 'react';
import _ from 'lodash';

import {IMetaInfo} from 'typings/test-adapter';

function mkLinkToUrl(url: string, text = url) {
    return <a data-suite-view-link={url} className='section__icon_view-local' target='_blank' href={url}>{text}</a>;
}

function isUrl(str: any): boolean{
    if (typeof str !== 'string') {
        return false;
    }

    const parsedUrl = url.parse(str);

    return !(!parsedUrl.host || !parsedUrl.protocol);
}

const metaToElements = (metaInfo: IMetaInfo | {url: JSX.Element}) => {
    return _.map(metaInfo, (value, key) => {
        const element = isUrl(value) ? mkLinkToUrl(value as string) : value;

        return <div key={key} className='toggle-open__item'><span className='toggle-open__item-key'>{key}</span>: {element}</div>;
    });
};

export interface IMetaInfoChildProps extends React.Props<any> {
    metaInfo: IMetaInfo;
    suiteUrl: string;
}

export default class MetaInfo extends Component<IMetaInfoChildProps> {
    render() {
        const {metaInfo, suiteUrl} = this.props;
        const formattedMetaInfo = {...metaInfo, url: mkLinkToUrl(suiteUrl, metaInfo.url)};
        const metaElements = metaToElements(formattedMetaInfo);

        return (
            <div className='MetaInfo'>
                {metaElements}
            </div>
        );
    }
}
