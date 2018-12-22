"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var lodash_1 = require("lodash");
var redux_mock_store_1 = require("redux-mock-store");
var react_redux_1 = require("react-redux");
var default_state_1 = require("../../../../lib/static/modules/default-state");
exports.mkStore = function (state) {
    var initialState = lodash_1.default.defaults(state, default_state_1.default);
    var mockStore = redux_mock_store_1.default();
    return mockStore(initialState);
};
exports.mkConnectedComponent = function (Component, _a) {
    var initialState = (_a === void 0 ? {} : _a).initialState;
    var store = exports.mkStore(initialState);
    // @ts-ignore
    return mount(<react_redux_1.Provider store={store}>{Component}</react_redux_1.Provider>);
};
exports.mkTestResult_ = function (result) {
    return lodash_1.default.defaults(result, {
        suiteUrl: '',
        metaInfo: {},
        imagesInfo: [],
        expectedPath: ''
    });
};
