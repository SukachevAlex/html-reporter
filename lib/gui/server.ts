import path from 'path';
import express from 'express';
const onExit = require('signal-exit');
import Promise from 'bluebird';
import bodyParser from 'body-parser';
import { TestAdapterType } from 'typings/test-adapter';
const App = require('./app');
const {MAX_REQUEST_SIZE} = require('./constants/server');
const {logger} = require('../server-utils');

interface IStartParams {
    paths: string;
    tool: TestAdapterType;
    guiApi: any;
    configs: any;
}

exports.start = ({paths, tool, guiApi, configs}: IStartParams) => {
    const {options, pluginConfig} = configs;
    const app = App.create(paths, tool, configs);
    const server = express();

    server.use(bodyParser.json({limit: MAX_REQUEST_SIZE}));

    guiApi.initServer(server);

    server.use(express.static(path.join(__dirname, '../static'), {index: 'gui.html'}));
    server.use(express.static(process.cwd()));
    server.use('/images', express.static(path.join(process.cwd(), pluginConfig.path, 'images')));

    server.get('/', (req, res) => res.sendFile(path.join(__dirname, '../static', 'gui.html')));

    server.post('/clear-retries', (req, res) => {
        app.clearRetries();
        res.json(app.data);
    });

    server.get('/events', (req, res) => {
        res.writeHead(200, {'Content-Type': 'text/event-stream'});

        app.addClient(res);
    });

    server.get('/init', (req, res) => {
        res.json(app.data);
    });

    server.post('/run', (req, res) => {
        app.run(req.body)
            .catch((e: Error) => {
                console.error('Error while trying to run tests', e);
            });

        res.sendStatus(200);
    });

    server.post('/update-reference', (req, res) => {
        app.updateReferenceImage(req.body)
            .then((updatedTests: (...args: any) => any) => res.json(updatedTests))
            .catch(({message}: {message: string}) => res.status(500).send({error: message}));
    });

    onExit(() => {
        app.finalize();
        logger.log('server shutting down');
    });

    return app.initialize()
        .then(() => {
            return Promise.fromCallback((callback) => {
                server.listen(options.port, options.hostname, callback);
            });
        })
        .then(() => ({url: `http://${options.hostname}:${options.port}`}));
};
