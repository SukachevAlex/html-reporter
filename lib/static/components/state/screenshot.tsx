import React, {Component} from 'react';
import {connect} from 'react-redux';
import LazyLoad from 'react-lazyload';
import { cn } from '@bem-react/classname';
const cnImageBox = cn('ImageBox');
import CanvasComponent from './canvas'

interface IScreenshot{
    noCache?: boolean;
    imagePath: string;
    lazyLoadOffset?: number;
    circleDiff?: boolean;
}

class Screenshot extends Component<IScreenshot> {
    static defaultProps = {
        noCache: false
    };

    render() {
        const {noCache, imagePath, lazyLoadOffset, circleDiff} = this.props;

        const url = noCache
            ? addTimestamp(encodeUri(imagePath))
            : encodeUri(imagePath);

        // const elem = <img src={url}  className={cnImageBox('Screenshot')} />;
        const elem  = circleDiff ? 
            <div className={cnImageBox('Screenshot')}><CanvasComponent url={url} /></div> :
            <img src={url}  className={cnImageBox('Screenshot')} />;
        return lazyLoadOffset ? <LazyLoad offset={lazyLoadOffset}>{elem}</LazyLoad> : elem;

    }
}

export default connect(({view: {lazyLoadOffset}}: {view: IScreenshot}) => ({lazyLoadOffset}))(Screenshot);

function encodeUri(imagePath: string) {
    return imagePath
        .split('/')
        .map((item) => encodeURIComponent(item))
        .join('/');
}

// for prevent image caching
function addTimestamp(imagePath: string) {
    return `${imagePath}?t=${Date.now()}`;
}
