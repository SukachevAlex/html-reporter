const defaults = require('../../constants/defaults');
const options: {
    expand?: string;
    autoRun?: boolean;
    filter?: string;
    showSkipped?: boolean;
    showOnlyDiff?: boolean;
    scaleImages?: boolean;
    baseHost?: string;
} = {};

if (location) {
    location.search
        .slice(1)
        .split('&')
        .forEach((query) => {
            const obj = query.split('=');
            options[obj[0]] = obj[1];
        });
}

export default Object.assign(defaults, {
    gui: true,
    running: false,
    autoRun: options.autoRun || false,
    skips: [],
    suites: {},
    browsers: [],
    suiteIds: {
        all: [],
        failed: []
    },
    stats: {
        total: 0,
        updated: 0,
        passed: 0,
        failed: 0,
        skipped: 0,
        retries: 0,
        warned: 0
    },
    view: {
        viewMode: 'all',
        filter: options.filter || 'all',
        expand: options.expand || 'errors',
        showSkipped: options.showSkipped || false,
        showOnlyDiff: options.showOnlyDiff || false,
        scaleImages: options.scaleImages || false,
        baseHost: options.baseHost || ''
    }
});
