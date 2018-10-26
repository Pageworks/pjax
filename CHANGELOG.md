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