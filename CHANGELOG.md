# 1.2.1 - 2019-03-11

### Fixes

- Fixes: updates console logs for better debugging

# 1.2.0 - 2019-03-06

### Adds

- Adds: allows users to device an array of custom attributes to prevent Pjax event listeners from firing [#39](https://github.com/Pageworks/fuel-pjax/issues/39)

### Fixes

- Fixes: updates IE check to use `fuel-device-manager` package

# 1.1.4 - 2019-01-01

### Fixes

- Fixes: `switchSelectors` method now verifies that the temporary document isn't null, if it is Pjax will have the browser load the page

# 1.1.3 - 2019-02-25

### Fixes

- Fixes: prefetching 404 page caching bug [#36](https://github.com/Pageworks/fuel-pjax/issues/36)

# 1.1.2 - 2019-02-25

### Fixes

- Fixes: prefetching 302 redirect cache bug [#36](https://github.com/Pageworks/fuel-pjax/issues/36)

# 1.1.1 - 2019-02-24

### Fixes

- Fixes: updates `fuel-state-manager` to use the official npm package version
- Fixes: prefetching non-200 status links [#36](https://github.com/Pageworks/fuel-pjax/issues/36)

# 1.1.0 - 2019-02-23

### Adds

- Adds: new `StateManager` class manages the windows history

### Fixes

- Fixes: updates `global.d.ts`
- Fixes: cleans up if statements to adhere to coding standards
- Fixes: updates functions and methods to follow TypeScript guidelines

### Removed

- Removes: browserify
- Removes: all methods related to window history management

# 1.0.9 - 2019-01-19

### Adds

- Adds: When switching containers if a new page contians `<script>` elements the pjax will load the page using the native browser functionality [#31](https://github.com/Pageworks/fuel-pjax/issues/31)

### Fixes

- Fixes: Switched `prefent-defualt` attribute to `prevent-pjax` in order to make make preventing pjax less confusing
- Fixes: Switches the event for calling `clearPrefetched` to the correct mouse event type

# 1.0.8 - 2019-01-08

### Fixes

- Fixes: Fixes a bug where links with an empty `target` attribute would prevent default. Now we only prevent default if `target="_blank"` [#29](https://github.com/Pageworks/fuel-pjax/issues/29)
- Fixes: Fixes bug where pjax would break on IE 11 [#30](https://github.com/Pageworks/fuel-pjax/issues/30)

# 1.0.7 - 2018-12-24

- Fixes: Fixes `this.cache.status` bug for non-200 response status

# 1.0.6 - 2018-12-07

- Fixes: Sets `this.state.history` to `false` by default
- Fixes: Calls `this.handlePushState()` on `init` to replace the default browser history with our custom history [#28](https://github.com/Pageworks/fuel-pjax/issues/28)

# 1.0.5 - 2018-11-22

- Fixes: Switches `mouseover` and `mouseout` to `mouseenter` and `mouseleave` to fix the `GET` request spam bug [#27](https://github.com/Pageworks/fuel-pjax/issues/27)

# 1.0.4 - 2018-10-26

- Adds: Pjax can listen for `pjax:continue` so developers can use custom page transitions
- Adds: Pjax custom event documenation
- Adds: Pjax's `pjax:send` event is now a `CustomEvent` and `e.details` contains the event's triggering element in `e.details.el`
- Fixes: Updates the file structure
- Fixes: Bug where `pjax:send` wasn't always firing so front-end developers couldn't end their page transitions
- Fixes: Big where the `cacheBust` option was always adding a `?` to the request even when set to `false`

# 1.0.0 - 2018-10-16

- Adds: XMLHttpRequest page transitions
- Adds: Switches request to return a promise
- Adds: Handles non-200 status pages
- Adds: Better documentation
- Adds: Updated readme
- Adds: Prefetches links on `mouseover` event
- Adds: Better 'Prevent Default' checks
- Adds: Converted to Typescript
- Adds: New changelog
