# Papertrail Fuel: Pjax
Pjax enables fast and easy AJAX navigation on any website using `pushState` and `XHR`. No more full page reloads, no more multipul HTTP request. Written entirely in TypeScript, transpiled into vanilla JavaScript.

## Installation
Add Pjax as a dependency to your `package.json` with `"pjax": "github:Pageworks/fuel-pjax"`

## How Pjax Works
Pjax loads pages using AJAX and updates the browser's current URL using `pushState()` without reloading the page's layout or any resources (JavaScript, CSS, etc). Pjax listens for the `onmouseenter` event for links and prefetches the pages HTML. Dpending on what the user does determines Pjax's response. If the user triggers an `onmouseleave` event the `XHR` request is canceled. If the user clicks the link before the server responds Pjax will notice that the user wants the page and will switch out the content as soon as the server responds. Finally, if the user remains hovered and the server has already responded Pjax will cache the new pages HTML content and will wait until the user clicks the link or triggers the `onmouseleave` event causing Pjax to clear the cached HTML. When combining prefetching and the ability to swap out content without causing a full page reload results in very fast page load responses.

Under the hood Pjax is **one HTTP request** with a `pushState()` call.

Obviously not all browers support `history.pushState()` so in cases where Pjax is unsupported Pjax will gracefully degrade and does nothing at all.

### What Pjax's All About
- Multiple container support
- Fully supports browser history (window popstates)
- Automagically falls back to standard navigation for external pages
- Automagically falls back to standard navigation for internal pages that do not have an appropriate DOM tree
- Allows for modern CSS page transitions (animation) easily
- Is very lightweight

### Under the Hood
- Pjax attempts to prefetch internal links for the fastest possible load time
- Pjax renders new pages without reloading resources such as images, CSS, JavaScript, etc...
- Checks that all defined parts can be replaced:
    - If the page doesn't meet the requirements Pjax will do nothing and standard navigation is used
    - If the page meets requirements Pjax swaps the DOM elements
- Pjax updates the browser's current URL using `pushState()`

## Documentation

__Coming soon(ish)__