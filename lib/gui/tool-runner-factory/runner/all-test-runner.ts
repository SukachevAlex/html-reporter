const Runner = require('./runner');

module.exports = class AllRunner extends Runner {
    run(runHandler: any) {
        this._collection.enableAll();

        return super.run(runHandler);
    }
};
