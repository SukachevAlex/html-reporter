# newton-reporter

Plugin for [gemini](https://github.com/gemini-testing/gemini) and [hermione](https://github.com/gemini-testing/hermione) which is intended to aggregate the results of tests running into html report.

You can read more about gemini plugins [here](https://github.com/gemini-testing/gemini/blob/master/doc/plugins.md) and about hermione plugins [here](https://github.com/gemini-testing/hermione#plugins).

## Installation

```bash
npm install newton-reporter
```

## Usage

Plugin has following configuration:

* **enabled** (optional) `Boolean` – enable/disable the plugin; by default plugin is enabled
* **path** (optional) `String` - path to directory for saving html report file; by
default html report will be saved into `gemini-report/index.html` inside current work
directory.
* **defaultView** (optional) `String` - default view mode. Available values are:
  * `all` - show all tests. Default value.
  * `failed` - show only failed tests.
* **baseHost** (optional) - `String` - it changes original host for view in the browser; by default original host does not change
* **scaleImages** (optional) – `Boolean` – fit images into page width; `false` by default
* **lazyLoadOffset** (optional) - `Number` - allows you to specify how far above and below the viewport you want to begin loading images. Lazy loading would be disabled if you specify 0. `800` by default.

## Yml scripts
Where you place your test, you can create same .yml file.

### Example:

* test.hermione.js
```js
const {assert} = require('chai');

it('should replace url', function() {
    return this.browser
        url('/')
        .click('a')
        .getUrl()
        .then((url) => {
            assert.equal(url, '/exmaple-url', 'click on link isn\'t correct')
        });
});
```

* test.hermione.yml
```yml
should replace url:
    do:
        - got to 127.0.0.1/
        - check the url - it must be equal '127.0.0.1/example-url'
    assert:
        - click on link isn't correct
```

Also there is ability to override plugin parameters by CLI options or environment variables
(see [configparser](https://github.com/gemini-testing/configparser)).
Use `newton_reporter_` prefix for the environment variables and `--newton-reporter-` for the cli options.

For example you can override `path` option like so:
```bash
$ newton_reporter_path=custom/dir gemini test
$ gemini test --newton-reporter-path custom/dir
```

Also, you can use option in get request.
### Example:
```sh
https://localhost:8000/?expand=all
```
That example open all tests.

Options:
* **expand** 'all' | 'errors', expands tests
* **showOnlyDiff** true | none, set mode for image
* **autoRun** true | none, auto run on in
* **filter** string - browsername for filter
* **showSkipped** true | none, shows skipped tests
* **baseHost** string - host for tests

### Gemini Usage

Add plugin to your `gemini` config file:

```js
module.exports = {
    // ...
    system: {
        plugins: {
            'newton-reporter/gemini-entry': {
                enabled: true,
                path: 'my/gemini-reports',
                defaultView: 'all',
                baseHost: 'test.com'
            }
        }
    },
    //...
}
```

### Hermione Usage

Add plugin to your `hermione` config file:

```js
module.exports = {
    // ...
    plugins: {
        'newton-reporter/hermione-entry': {
            enabled: true,
            path: 'my/hermione-reports',
            defaultView: 'all',
            baseHost: 'test.com'
        }
    },
    //...
}
```

## Migrate from html-reporter to newton-reporter

### Hermione
* Rename plugins['html-reporter/hermione'] to plugins['newton-reporter/hermione-entry']

### Gemini
* Rename system.plugins['html-reporter/gemini'] to system.plugins['newton-reporter/gemini-entry']

## Additional commands

Additional commands that are added to the tool for which this plugin is connected.

### gui

Command that adds ability to effective work with screenshots.

Example of usage:
```
npx hermione gui
```

### merge-reports

Command that adds ability to merge reports which are created after running the tests.

Example of usage:
```
npx hermione merge-reports src-report-1 src-report-2 -d dest-report
```


## Testing

Run [mocha](http://mochajs.org) tests:
```bash
npm run test-unit
```

Run [tslint](https://palantir.github.io/tslint/) codestyle verification
```bash
npm run lint
```
