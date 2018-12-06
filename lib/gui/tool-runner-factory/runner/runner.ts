module.exports = class Runner  {
    protected _collection: { [key: string]: any };

    constructor(collection: { [key: string]: any }) {
        this._collection = collection;
    }

    run(runHandler: any) {
        return runHandler(this._collection);
    }
};
