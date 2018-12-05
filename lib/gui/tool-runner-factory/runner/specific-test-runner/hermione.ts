'use strict';

import {ISuite} from 'typings/suite-adapter';

const SpecificTestRunner = require('./');
const {mkFullTitle} = require('../../hermione/utils');

module.exports = class HermioneSpecificTestRunner extends SpecificTestRunner {
    _filter() {
        this._collection.disableAll();

        this._tests.forEach((test: ISuite) => {
            this._collection.enableTest(mkFullTitle(test), test.browserId);
        });
    }
};
