# Pjax
Pjax enables fast and easy AJAX navigation on any website using `pushState` and `XHR`. No more full page reloads, no more multipul HTTP request. Written entirely in TypeScript, transpiled into vanilla JavaScript.

## Installation
Add Pjax as a dependency to your `package.json` with `"pjax": "github:Pageworks/fuel-pjax#x.x.x"`

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

### Getting Started

To begin using Pjax add `"pjax": "github:Pageworks/fuel-pjax#x.x.x"` to your projects `package.json` and run `npm install` or include `pjax-x.x.x.js` in your project.

Start by setting up a base layout for your website.
```
<!doctype <!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Index | Pjax Testing</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" media="screen" href="main.css" />
</head>
<body>
    <a href="index">Home</a>
    <main class="js-pjax-wrapper">
        <article class="js-pjax">
            <h1>Index Page</h1>
            <ul>
                <li><a href="index">Index</a></li>
                <li><a href="page-1">Page 1</a></li>
            </ul>
        </article>
    </main>
    <script src="main.js"></script>
</body>
</html>
```

If you're using the compiled version add `include pjax from 'pjax'` into your main application file. If you're using the compiled and browserified version of Pjax add `<script src="pjax-x.x.x.js"></script>` to your document.

In the main/application script for your project you can being using Pjax with the following:
```
const pjax = new Pjax({
    debug: true
});
```

### Pjax Options

You can define custom Pjax options using the following:

| Option        | Type                      | Default              |
| ------------- |:------------------------- |:-------------------- |
| elements      | string                    | `a[href]`            |
| selectors     | string[]                  | `.js-pjax`           |
| switches      | StringKeyedObject<Switch> | `{}`                 |
| history       | boolean                   | `true`               |
| scrollTo      | number                    | `0`                  |
| cacheBust     | boolean                   | `false`              |
| debug         | boolean                   | `false`              |
| timeout       | number                    | `0`                  |
| attrState     | string                    | `data-pjax-state`    |
| titleSwitch   | boolean                   | `true`               |

`elements` is the base element users should click on to trigger a page transition.

`selectors` is an array of containers that Pjax should swap.

`switches` is custom switch types.

When `history` is true Pjax will use `window.history.pushState` to manipulate the browsers history.

`scrollTo` is the default position the DOM should scroll to when a page loads.

`cacheBust` will add a `GET` param to all request forcing the browser to perform the request instead of using a cached version of the page.

`debug` will tell Pjax to display all debug information.

`timeout` is the about of time allowed before Pjax time's out an `XMLHttpRequest`

`attrState` is the custom element attribute used to track transition types (ie: `prefetch` or `click` or `reload`)

`titleSwitch` when true will swap out the documents title during page transitions.