import chalk from 'chalk';
import opener from 'opener';
const server = require('./server');
const {logger, logError} = require('../server-utils');

module.exports = (args: any) => {
    server.start(args)
        .then(({url}: {url: string}) => {
            logger.log(`GUI is running at ${chalk.cyan(url)}`);
            args.configs.options.open && opener(url);
        })
        .catch((err: Error) => {
            logError(err);
            process.exit(1);
        });
};
