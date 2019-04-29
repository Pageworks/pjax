# Pjax
Pjax enables fast and easy AJAX navigation on any website using `pushState` and `fetch`. No more full page reloads, no more multiple HTTP request, and written entirely in TypeScript.

## Installation

Download Pjax via NPM:

```
npm i --save @pageworks/pjax
```

Once the package is installed import the package:

```
import Pjax from '@pageworks/pjax';
```

Then it's as simple as starting a new instance:

```
new Pjax();
```

## How Pjax Works
Pjax loads pages using the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) and updates the browser's current URL using a `window.pushState()` all without reloading the page's layout or any resources (JavaScript, CSS, etc). Pjax listens for the `onmouseenter` event for links and prefetches the pages HTML. Dpending on what the user does determines Pjax's response. If the user clicks the link before the server responds Pjax will notice that the user wants the page and will switch out the content as soon as the server responds. Finally, if the user remains hovered and the server has already responded Pjax will cache the new pages HTML content and will wait until the user clicks the link or triggers the `onmouseleave` event causing Pjax to clear the cached HTML. When combining prefetching and the ability to swap out content without causing a full page reload results in very fast page load responses.

Under the hood Pjax is **one HTTP request** with a `window.pushState()`.

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

Start by setting up the basic `index.html` file for your website.
```
<!doctype <!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Index | Pjax Testing</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
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

In the main/application script for your project you can being using Pjax with the following:
```
import Pjax from '@pageworks/pjax';

const pjax = new Pjax({
    debug: true
});
```

### Pjax Options

You can define custom Pjax options using the following:

| Option                       | Type                      | Default              |
| ---------------------------- |:------------------------- |:-------------------- |
| elements                     | string                    | `a[href]`            |
| selectors                    | string[]                  | `.js-pjax`           |
| history                      | boolean                   | `true`               |
| cacheBust                    | boolean                   | `false`              |
| debug                        | boolean                   | `false`              |
| titleSwitch                  | boolean                   | `true`               |
| customTransitions            | boolean                   | `false`              |
| customPreventionAttributes   | string[]                  | `[]`                 |
| importScripts                | boolean                   | `true`               |
| importCSS                    | boolean                   | `true`               |

`elements` is the base element users should click on to trigger a page transition.

`selectors` is an array of containers that Pjax should swap.

When `history` is true Pjax will use `window.history.pushState()` to manipulate the browsers history.

`cacheBust` will add a `GET` param to all request forcing the browser to perform the request instead of using a cached version of the page.

`debug` will tell Pjax to display all debug information.

`titleSwitch` when true will swap out the documents title during page transitions.

`customTransitions` when true Pjax won't actually switch out the content until the developers application sends a custom `pjax:continue` event.

`customPreventionAttributes` is an array of custom element attributes that Pjax will look for when attaching event listeners. The default prevention attribute that is `prevent-pjax` however you can define additional attributes. For example, if you are using a custom lightcase modal libary you could tell Pjax **not** to hijack the events attached to any element that has a valid `href` attribute when the element also has a `lightcase` attribute.

When `importScripts` is `true` Pjax will dynamically fetch and append all `<script>` elements. Elements with a valid `src` will be appended once, elements that contain JavaScript will be re-appended every time.

When `importCSS` is `true` Pjax will dynamically fetch and append custom `<style>` elements to the documents `<head>`. Only `<link>` elements labeled as `rel="stylesheet"` with a valid `href` attribute will be appended. Custom styles will only be appended once.

### Pjax Events

Pjax fires a handful of events on the `document` that you can listen for.

```
document.addEventListener('pjax:error', ()=>{ console.log('Event: pjax:error'); });
document.addEventListener('pjax:send', (e)=>{ console.log('Event: pjax:send', e); });
document.addEventListener('pjax:prefetch', ()=>{ console.log('Event: pjax:prefetch'); });
document.addEventListener('pjax:cancel', ()=>{ console.log('Event: pjax:cancel'); });
document.addEventListener('pjax:complete', ()=>{ console.log('Event: pjax:complete'); });
document.addEventListener('pjax:scriptContentLoaded', ()=>{ console.log('Event: pjax:scriptContentLoaded'); });
```

Pjax listens for a `pjax:continue` event on the `document`. This is only used when the `customTransitions` option is set to `true`. Pjax will **NOT** swap content until it recieves this event.

The `pjax:scriptContentLoaded` will fire on the `document` when all the new scripts have been fetched and appended to the body.

### Status Classes
Pjax sets two custom status classes on the `document` element that you can use in your CSS to style your page transitions. In the example below we set all elements to use the `wait` cursor while the `dom-is-loading` class is set. Once the `pjax:complete` or `pjax:error` events fire the `dom-is-loading` class is removed and the `dom-is-loaded` class is applied.

```
HTML.dom-is-loading *{
    cursor: wait !important;
}
```

### Static Methods
Pjax allows developers to manually trigger a page load by using the public static method `Pjax.load(url)`