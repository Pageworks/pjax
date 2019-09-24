## 2.3.1 - 2019-09-24

### Fixed

- Fixes: fails the document parse when the response doesn't have a `Content-Type` header

## 2.3.0 - 2019-08-26

### Added

- Adds: developers can enable the `requireCssBeforeComplete` flag to force Pjax to fetch and append all the CSS stylesheets before firing the `pjax:complete` event

## 2.2.1 - 2019-08-23

### Fixed

- Fixes: page transitions break on slow connections [#16](https://github.com/Pageworks/pjax/issues/16)

## 2.2.0 - 2019-08-22

### Added

- Adds: new `scriptImportLocation` option allowing developers to choose where the dynamically fetched scripts are appended, defaults to `document.head`

### Fixed

- Fixes: updates readme
- Fixes: inline script elements will be appended every time the page loads while scripts with a `src` attribute will only be fetched and appended once
- Fixes: updates script fetch response tracking functionality
- Fixes: cleaned up stylesheet fetch logic

## 2.1.3 - 2019-04-29

### Fixed

- Fixes: switches dependencies from `@codewithkyle` to `@pageworks`

## 2.1.3 - 2019-04-19

### Fixed

- Fixes: tracks the request ID and doesn't handle stale request
- Fixes: no longer default handling aborted request types (`this._request === null`)

## 2.1.2 - 2019-04-16

### Fixed

- Fixes: sends Fetch with `method: GET` and the following headers: `'X-Requested-With': 'XMLHttpRequest'` and `'X-Pjax': 'true'`

## 2.1.1 - 2019-04-16

### Fixed

- Fixes: script loading bug when the current `document` and the incoming `document` don't match

## 2.1.0 - 2019-04-15

### Adds:

- Adds: `pjax:scriptContentLoaded` event that fires on the `document` when all scripts have been fetched and appended to the body

## 2.0.1 - 2019-04-15

### Fixed

- Fixes: updates CSS regex href matching to handle cases where developers use a hash/timestamp for cache busting
- Fixes: updates script src regex matching to handle cases where developers use a hash/timestamp for cache busting

## 2.0.0 - 2019-04-07

### Adds

- Adds: swaps `XHR` request with `Fetch`
- Adds: new `importScripts` option to Pjax
- Adds: new `importCSS` option to Pjax
- Adds: when `importScripts` is set to `true` (default) any script elements will be fetched and appended to the `document.body`
- Adds: when `importCSS` is set to `true` (default) any CSS (in `HEAD` or via `<link>`) will be fetched and appended
- Adds: public static `load()` method to trigger a manual page load

### Removes

- Removes: no longer calls `lastChance()` when the new document contains `<script>` elements
- Removes: `timeout` option from Pjax since we can't abort fetch

## 1.3.0 - 2019-03-27

### Adds

- Adds: Pjax manages the `HTML` status classes that developers can use to manage page transitions/animations

### Fixed

- Fixes: switches dependencies to use the version provided by `@codewithkyle`

## 1.2.5 - 2019-03-24

### Fixed

- Fixes: updates `StateManager` to user the new static methods provided in the `1.0.1` update
- Fixes: updates readme

## 1.2.4 - 2019-03-16

### Fixed

- Fixes: updates version number for Pjax console log

## 1.2.3 - 2019-03-16

### Fixed

- Fixes: bug that occures when a page is cached but the user triggers a popstate via touch gestures

## 1.2.2 - 2019-03-11

### Adds

- Adds: `webpack` and `http-server`
- Adds: `/testing` directory
- Adds: new `npm run bundle` script for running webpack
- Adds: new `npm run test` script for compiling, bundling, and launching a static http server for testing features
- Adds: basic demo page and testing content

## 1.2.1 - 2019-03-11

### Fixed

- Fixes: updates console logs for better debugging

## 1.2.0 - 2019-03-06

### Adds

- Adds: allows users to device an array of custom attributes to prevent Pjax event listeners from firing [#39](https://github.com/Pageworks/fuel-pjax/issues/39)

### Fixed

- Fixes: updates IE check to use `fuel-device-manager` package

## 1.1.4 - 2019-01-01

### Fixed

- Fixes: `switchSelectors` method now verifies that the temporary document isn't null, if it is Pjax will have the browser load the page

## 1.1.3 - 2019-02-25

### Fixed

- Fixes: prefetching 404 page caching bug [#36](https://github.com/Pageworks/fuel-pjax/issues/36)

## 1.1.2 - 2019-02-25

### Fixed

- Fixes: prefetching 302 redirect cache bug [#36](https://github.com/Pageworks/fuel-pjax/issues/36)

## 1.1.1 - 2019-02-24

### Fixed

- Fixes: updates `fuel-state-manager` to use the official npm package version
- Fixes: prefetching non-200 status links [#36](https://github.com/Pageworks/fuel-pjax/issues/36)

## 1.1.0 - 2019-02-23

### Adds

- Adds: new `StateManager` class manages the windows history

### Fixed

- Fixes: updates `global.d.ts`
- Fixes: cleans up if statements to adhere to coding standards
- Fixes: updates functions and methods to follow TypeScript guidelines

### Removed

- Removes: browserify
- Removes: all methods related to window history management

## 1.0.9 - 2019-01-19

### Adds

- Adds: When switching containers if a new page contians `<script>` elements the pjax will load the page using the native browser functionality [#31](https://github.com/Pageworks/fuel-pjax/issues/31)

### Fixed

- Fixes: Switched `prefent-defualt` attribute to `prevent-pjax` in order to make make preventing pjax less confusing
- Fixes: Switches the event for calling `clearPrefetched` to the correct mouse event type

## 1.0.8 - 2019-01-08

### Fixed

- Fixes: Fixes a bug where links with an empty `target` attribute would prevent default. Now we only prevent default if `target="_blank"` [#29](https://github.com/Pageworks/fuel-pjax/issues/29)
- Fixes: Fixes bug where pjax would break on IE 11 [#30](https://github.com/Pageworks/fuel-pjax/issues/30)

## 1.0.7 - 2018-12-24

- Fixes: Fixes `this.cache.status` bug for non-200 response status

## 1.0.6 - 2018-12-07

- Fixes: Sets `this.state.history` to `false` by default
- Fixes: Calls `this.handlePushState()` on `init` to replace the default browser history with our custom history [#28](https://github.com/Pageworks/fuel-pjax/issues/28)

## 1.0.5 - 2018-11-22

- Fixes: Switches `mouseover` and `mouseout` to `mouseenter` and `mouseleave` to fix the `GET` request spam bug [#27](https://github.com/Pageworks/fuel-pjax/issues/27)

## 1.0.4 - 2018-10-26

- Adds: Pjax can listen for `pjax:continue` so developers can use custom page transitions
- Adds: Pjax custom event documenation
- Adds: Pjax's `pjax:send` event is now a `CustomEvent` and `e.details` contains the event's triggering element in `e.details.el`
- Fixes: Updates the file structure
- Fixes: Bug where `pjax:send` wasn't always firing so front-end developers couldn't end their page transitions
- Fixes: Big where the `cacheBust` option was always adding a `?` to the request even when set to `false`

## 1.0.0 - 2018-10-16

- Adds: XMLHttpRequest page transitions
- Adds: Switches request to return a promise
- Adds: Handles non-200 status pages
- Adds: Better documentation
- Adds: Updated readme
- Adds: Prefetches links on `mouseover` event
- Adds: Better 'Prevent Default' checks
- Adds: Converted to Typescript
- Adds: New changelog
