import React, {Component} from 'react';
import ToggleOpen from './toggle-open';
const ReactMarkdown = require('react-markdown');

interface IDescriptionChildProps extends React.Props<any> {
    content: string;
}

export default class Description extends Component<IDescriptionChildProps> {
    render() {
        const {content} = this.props;
        const mdContent = content ? <ReactMarkdown source={content}/> : null;

        return content ? <ToggleOpen title='Description' content={mdContent}/> : null;
    }
}
