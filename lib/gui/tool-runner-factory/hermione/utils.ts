import crypto from 'crypto';

exports.formatId = (hash: string, browserId: string) => `${hash}/${browserId}`;

exports.getShortMD5 = (str: string) => {
    return crypto.createHash('md5').update(str, 'ascii').digest('hex').substr(0, 7);
};

interface IFullTitle {
    suite: {path: string[]};
    state: {name: string};
}

exports.mkFullTitle = ({suite, state}: IFullTitle) => {
    // https://github.com/mochajs/mocha/blob/v2.4.5/lib/runnable.js#L165
    return `${suite.path.join(' ')} ${state.name}`;
};
