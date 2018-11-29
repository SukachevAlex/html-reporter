'use strict';

import url from 'url';
import React, {Component, Fragment} from 'react';
import ToggleOpen from './toggle-open';
import _ from "lodash";

function mkLinkToUrl(url: string, text = url) {
    return <a data-suite-view-link={url} className="section__icon_view-local" target="_blank" href={url}>{text}</a>;
}
function isUrl(str: any): boolean{
    if (typeof str !== 'string') {
        return false;
    }

    const parsedUrl = url.parse(str);

    return !(!parsedUrl.host || !parsedUrl.protocol);
}

const metaToElements = (metaInfo: any) => {
    return _.map(metaInfo, (value, key) => {
        if (isUrl(value)) {
            value = mkLinkToUrl(value);
        }

        return <div key = {key} className="toggle-open__item"><span className="toggle-open__item-key">{key}</span>: {value}</div>;
    });
};

interface IMetaInfoChildProps extends React.Props<any>{
    metaInfo: any;
    suiteUrl: string;
}

export default class MetaInfo extends Component<IMetaInfoChildProps> {
    render() {
        const {metaInfo, suiteUrl} = this.props;
        const formattedMetaInfo = {...metaInfo,  url: mkLinkToUrl(suiteUrl, metaInfo.url)};
        const metaElements = metaToElements(formattedMetaInfo);

        return (
            <Fragment>
                <ToggleOpen title='Meta-info' content={metaElements}/>
            </Fragment>
        );
    }
}
