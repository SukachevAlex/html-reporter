import React from 'react';
import _ from 'lodash';
import configureStore from 'redux-mock-store';
import {Provider} from 'react-redux';
import defaultState from '../../../../lib/static/modules/default-state';

export const mkStore = (state: any) => {
    const initialState = _.defaults(state, defaultState);
    const mockStore = configureStore();

    return mockStore(initialState);
};

export const mkConnectedComponent = (Component: any, {initialState}: any = {}) => {
    const store = exports.mkStore(initialState);
    // @ts-ignore
    return mount(<Provider store={store}>{Component}</Provider>);
};

export const mkTestResult_ = (result?: any) => {
    return _.defaults(result, {
        suiteUrl: '',
        metaInfo: {},
        imagesInfo: [],
        expectedPath: ''
    });
};
