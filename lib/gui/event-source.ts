import stringify from 'json-stringify-safe';

module.exports = class EventSource {
    protected _connections: any[];

    constructor() {
        this._connections = [];
    }

    addConnection(connection: any) {
        this._connections.push(connection);
    }

    emit(event: string, data: any) {
        this._connections.forEach((connection) => {
            connection.write('event: ' + event + '\n');
            connection.write('data: ' + stringify(data) + '\n');
            connection.write('\n\n');
        });
    }
};
