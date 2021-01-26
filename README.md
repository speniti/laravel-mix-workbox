# Laravel Mix Workbox

This extension provides instant Workbox support to your Mix (v4.0 and up) builds.

## Usage

First, install the extension.

```
npm install laravel-mix-workbox --save-dev
```

Then, require it within your `webpack.mix.js` file, like so:

```js
// webpack.mix.js

let mix = require('laravel-mix');

require('laravel-mix-workbox');

mix
    .js('resources/js/app.js', 'public/js')
    .less('resources/less/app.less', 'public/css')
    .generateSW();
```

And you're done! Compile everything down with `npm run dev`.

By default the service worker file will be generated in the `public/` folder ad will be set up to precache all the files in your webpack build.

In your web page, you can register this service worker by adding:

```html
<script>
// Check that service workers are supported
if ('serviceWorker' in navigator) {
  // Use the window load event to keep the page load performant
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js');
  });
}
</script>
```

or using [workbox-window](https://developers.google.com/web/tools/workbox/modules/workbox-window) module:

```js
// e.g. app.js

import {Workbox} from 'workbox-window';

if ('serviceWorker' in navigator) {
  const wb = new Workbox('/service-worker.js');

  wb.register();
}
```

You can pass in additional configuration like so:

```js
// webpack.mix.js

let mix = require('laravel-mix');

require('laravel-mix-workbox');

mix
    .js('resources/js/app.js', 'public/js')
    .less('resources/less/app.less', 'public/css')
    .generateSW({
        // Do not precache images
        exclude: [/\.(?:png|jpg|jpeg|svg)$/],

        // Define runtime caching rules.
        runtimeCaching: [{
            // Match any request that ends with .png, .jpg, .jpeg or .svg.
            urlPattern: /\.(?:png|jpg|jpeg|svg)$/,

            // Apply a cache-first strategy.
            handler: 'CacheFirst',

            options: {
                // Use a custom cache name.
                cacheName: 'images',

                // Only cache 10 images.
                expiration: {
                    maxEntries: 10,
                },
            },
        }],

        skipWaiting: true
    });
```

The full set of available options can be found on the [Workbox Webpack module page](https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin).

## InjectManifest

You can also use the `InjectManifest` plugin like so:

```js
// resources/js/service-worker.js

import { precacheAndRoute } from 'workbox-precaching';

precacheAndRoute(self.__WB_MANIFEST || []);
```


```js
// webpack.mix.js

let mix = require('laravel-mix');

require('laravel-mix-workbox');

mix
    .js('resources/js/app.js', 'public/js')
    .less('resources/less/app.less', 'public/css')
    .injectManifest({
      swSrc: './resources/js/service-worker.js'
    });
```

This will create a precache manifest (a list of webpack assets) and inject it into your service worker file via `importScripts()`.

You can pass the appropriate configuration as properties of an `Object`.

A full set of configuration options can be found on this [reference page](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-webpack-plugin.InjectManifest#InjectManifest).