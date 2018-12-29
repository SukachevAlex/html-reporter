import _ from 'lodash';
const configParser = require('gemini-configparser');

const root = configParser.root;
const section = configParser.section;
const option = configParser.option;

const ENV_PREFIX = 'newton_reporter_';
const CLI_PREFIX = '--newton-reporter-';

const {config: configDefaults} = require('./constants/defaults');

const assertType = (name: string, validationFn: (v: any) => any, type: string) => {
    return (v: any) => {
        if (!validationFn(v)) {
            throw new Error(`"${name}" option must be ${type}, but got ${typeof v}`);
        }
    };
};
const assertString = (name: any) => assertType(name, _.isString, 'string');
const assertBoolean = (name: any) => assertType(name, _.isBoolean, 'boolean');
const assertNumber = (name: any) => assertType(name, _.isNumber, 'number');

const getParser = () => {
    return root(section({
        enabled: option({
            defaultValue: true,
            parseEnv: JSON.parse,
            parseCli: JSON.parse,
            validate: assertBoolean('enabled')
        }),
        path: option({
            defaultValue: 'newton-report',
            validate: assertString('path')
        }),
        defaultView: option({
            defaultValue: configDefaults.defaultView,
            validate: assertString('defaultView')
        }),
        baseHost: option({
            defaultValue: configDefaults.baseHost,
            validate: assertString('baseHost')
        }),
        scaleImages: option({
            defaultValue: configDefaults.scaleImages,
            parseEnv: JSON.parse,
            parseCli: JSON.parse,
            validate: assertBoolean('scaleImages')
        }),
        lazyLoadOffset: option({
            defaultValue: configDefaults.lazyLoadOffset,
            parseEnv: JSON.parse,
            validate: assertNumber('lazyLoadOffset')
        })
    }), {envPrefix: ENV_PREFIX, cliPrefix: CLI_PREFIX});
};

module.exports = (options: any) => {
    const env = process.env;
    const argv = process.argv;

    return getParser()({options, env, argv});
};
