import { ISuite } from './suite-adapter';

// @ts-ignore
const TestAdapter = require('../lib/test-adapter/test-adapter');
// @ts-ignore
const HermioneTestAdapter = require('../lib/test-adapter/hermione-test-adapter');
// @ts-ignore
const GeminiTestAdapter = require('../lib/test-adapter/gemini-test-adapter');

// @ts-ignore
export type TestAdapterType = TestAdapter | HermioneTestAdapter | GeminiTestAdapter;

export interface ITestResult {
    assertViewResults?: any[];
    referencePath?: string;
    retriesLeft?: number;
    currentPath?: string;
    description?: string;
    screenshot?: string;
    sessionId?: string;
    browserId?: string;
    browsers?: string[];
    imagePath?: string;
    multipleTabs?: any;
    imagesInfo?: any[];
    attempt?: number;
    name?: string;
    path?: string[];
    equal?: boolean;
    image?: string;
    title?: string;
    suite?: ISuite;
    suitePath?: string;
    error?: string;
    status?: string;
    err?: Error;
    state?: {
        name: string[];
    };
    meta?: {
        url: string;
    };
    metaInfo?: IMetaInfo;
    async?: number;
    sync?: boolean;
    timedOut?: boolean;
    pending?: boolean;
    type?: string;
    body?: string;
    file?: string;
    parent?: any;
    ctx?: any;
    disabled?: boolean;
    silentSkip?: boolean;
    id?(): string;
    getImagePath?(): any;
    saveDiffTo?(...args: any[]): any;
    getImagesInfo?(status: string): any;
}

export interface ITestTool {
    [key: string]: any;
}

export interface IMetaInfo {
    url?: string;
    file?: string;
    sessionId?: string;
}