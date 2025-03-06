## page-two
Tiny Express-inspired client-side router. Forked from [page](https://github.com/carlosmintfan/page-two).

```js
page('/', index)
page('/user/:user', show)
page('/user/:user/edit', edit)
page('/user/:user/album', album)
page('/user/:user/album/sort', sort)
page('*', notfound)
page()
```

## Installation

You can install `page-two` by npm:

```bash
$ npm install page
```

Or use with jsDelivr CDN.

Using with global script tags:

```html
<script src="https://cdn.jsdelivr.net/npm/page-two/page.min.js"></script>
<script>
  page('/about', function(){
    // Do stuff
  });
</script>
```

Or with modules, in modern browsers or bundlers:

```html
<script type="module">
  // in bundlers:
  import page from "page-two";
  // in browsers:
  import page from "//cdn.jsdelivr.net/npm/page-two/page.mjs";

  page('/home', () => { ... });
</script>
```

## Running examples

To run examples do the following to install dev dependencies and run the example server:

  $ git clone git://github.com/carlosmintfan/page-two
  $ cd page-two
  $ npm install
  $ node examples
  $ open http://localhost:4000

Currently we have examples for:

  - `basic` minimal application showing basic routing
  - `notfound` similar to `basic` with single-page 404 support
  - `album` showing pagination and external links
  - `profile` simple user profiles
  - `query-string` shows how you can integrate plugins using the router
  - `state` illustrates how the history state may be used to cache data
  - `server` illustrates how to use the dispatch option to server initial content
  - `chrome` Google Chrome style administration interface
  - `transitions` Shows off a simple technique for adding transitions between "pages"
  - `partials` using hogan.js to render mustache partials client side

__NOTE__: keep in mind these examples do not use jQuery or similar, so
portions of the examples may be relatively verbose, though they're not
directly related to page-two in any way.

## API

### page(path, callback[, callback ...])

Defines a route mapping `path` to the given `callback(s)`.
Each callback is invoked with two arguments, [context](#context) and `next`. Much like Express invoking next will call the next registered callback with the given path.

```js
page('/', user.list)
page('/user/:id', user.load, user.show)
page('/user/:id/edit', user.load, user.edit)
page('*', notfound)
```

Under certain conditions, links will be disregarded
and will not be dispatched, such as:

- Links that are not of the same origin
- Links with the `download` attribute
- Links with the `target` attribute
- Links with the `rel="external"` attribute

### page(callback)

This is equivalent to `page('*', callback)` for generic "middleware".

### page(path)

Navigate to the given `path`.

```js
$('.view').click(function(e){
page('/user/12')
e.preventDefault()
})
```

### page(fromPath, toPath)

Setup redirect from one path to another.

### page.redirect(fromPath, toPath)

Identical to `page(fromPath, toPath)`

### page.redirect(path)
Calling page.redirect with only a string as the first parameter
redirects to another route.
Waits for the current route to push state and after replaces it
with the new one leaving the browser history clean.

```js
page('/default', function(){
// some logic to decide which route to redirect to
if(admin) {
  page.redirect('/admin');
} else {
  page.redirect('/guest');
}
});

page('/default');
```

### page.show(path)

Identical to `page(path)` above.

### page([options])

Register page's `popstate` / `click` bindings. If you're
doing selective binding you'll like want to pass `{ click: false }`
to specify this yourself. The following options are available:

- `click` bind to click events [__true__]
- `popstate` bind to popstate [__true__]
- `dispatch` perform initial dispatch [__true__]
- `hashbang` add `#!` before urls [__false__]
- `decodeURLComponents` remove URL encoding from path components (query string, pathname, hash) [__true__]
- `window` provide a window to control (by default it will control the main window)

If you wish to load serve initial content
from the server you likely will want to
set `dispatch` to __false__.

### page.start([options])

Identical to `page([options])` above.

### page.stop()

Unbind both the `popstate` and `click` handlers.

### page.base([path])

Get or set the base `path`. For example if page-two
is operating within `/blog/*` set the base path to "/blog".

### page.strict([enable])

Get or set the strict path matching mode to `enable`. If enabled
`/blog` will not match "/blog/" and `/blog/` will not match "/blog".

### page.exit(path, callback[, callback ...])

Defines an exit route mapping `path` to the given `callback(s)`.

Exit routes are called when a page changes, using the context
from the previous change. For example:

```js
page('/sidebar', function(ctx, next) {
sidebar.open = true
next()
})

page.exit('/sidebar', function(ctx, next) {
sidebar.open = false
next()
})
```

### page.exit(callback)

Equivalent to `page.exit('*', callback)`.

### page.create([options])

Create a new page instance with the given options. Options provided
are the same as provided in `page([options])` above. Use this if you need
to control multiple windows (like iframes or popups) in addition
to the main window.

```js
var otherPage = page.create({ window: iframe.contentWindow });
otherPage('/', main);
```

### page.clickHandler

This is the click handler used by page to handle routing when a user clicks an anchor like `<a href="/user/profile">`. This is exported for those who want to disable the click handling behavior with `page.start({ click: false })`, but still might want to dispatch based on the click handler's logic in some scenarios.

### Context

Routes are passed `Context` objects, these may
be used to share state, for example `ctx.user =`,
as well as the history "state" `ctx.state` that
the `pushState` API provides.

#### Context#save()

Saves the context using `replaceState()`. For example
this is useful for caching HTML or other resources
that were loaded for when a user presses "back".

#### Context#handled

If `true`, marks the context as handled to prevent [default 404 behaviour][404].
For example this is useful for the routes with interminate quantity of the
callbacks.

[404]: https://github.com/carlosmintfan/page-two#default-404-behaviour

#### Context#canonicalPath

Pathname including the "base" (if any) and query string "/admin/login?foo=bar".

#### Context#path

Pathname and query string "/login?foo=bar".

#### Context#querystring

Query string void of leading `?` such as "foo=bar", defaults to "".

#### Context#pathname

The pathname void of query string "/login".

#### Context#state

The `pushState` state object.

#### Context#title

The `pushState` title.

## Routing

The router uses the same string-to-regexp conversion
that Express does, so things like ":id", ":id?", and "*" work
as you might expect.

Another aspect that is much like Express is the ability to
pass multiple callbacks. You can use this to your advantage
to flatten nested callbacks, or simply to abstract components.

### Separating concerns

For example suppose you have a route to _edit_ users, and a
route to _view_ users. In both cases you need to load the user.
One way to achieve this is with several callbacks as shown here:

```js
page('/user/:user', load, show)
page('/user/:user/edit', load, edit)
```

Using the `*` character we can alter this to match all
routes prefixed with "/user" to achieve the same result:

```js
page('/user/*', load)
page('/user/:user', show)
page('/user/:user/edit', edit)
```

Likewise `*` can be used as catch-alls after all routes
acting as a 404 handler, before all routes, in-between and
so on. For example:

```js
page('/user/:user', load, show)
page('*', function(){
$('body').text('Not found!')
})
```

### Default 404 behaviour

By default when a route is not matched,
page-two invokes `page.stop()` to unbind
itself, and proceed with redirecting to the
location requested. This means you may use
page-two with a multi-page application _without_
explicitly binding to certain links.

### Working with parameters and contexts

Much like `request` and `response` objects are
passed around in Express, page-two has a single
"Context" object. Using the previous examples
of `load` and `show` for a user, we can assign
arbitrary properties to `ctx` to maintain state
between callbacks.

To build a `load` function that will load
the user for subsequent routes you'll need to
access the ":id" passed. You can do this with
`ctx.params.NAME` much like Express:

```js
function load(ctx, next){
var id = ctx.params.id
}
```

Then perform some kind of action against the server,
assigning the user to `ctx.user` for other routes to
utilize. `next()` is then invoked to pass control to
the following matching route in sequence, if any.

```js
function load(ctx, next){
var id = ctx.params.id
$.getJSON('/user/' + id + '.json', function(user){
  ctx.user = user
  next()
})
}
```

The "show" function might look something like this,
however you may render templates or do anything you
want. Note that here `next()` is _not_ invoked, because
this is considered the "end point", and no routes
will be matched until another link is clicked or
`page(path)` is called.

```js
function show(ctx){
$('body')
  .empty()
  .append('<h1>' + ctx.user.name + '<h1>');
}
```

Finally using them like so:

```js
page('/user/:id', load, show)
```

**NOTE:** The value of `ctx.params.NAME` is decoded via `decodeURIComponent(sliceOfUrl)`. One exception though is the use of the plus sign (+) in the url, e.g. `/user/john+doe`, which is decoded to a space: `ctx.params.id == 'john doe'`. Also an encoded plus sign (`%2B`) is decoded to a space.

### Working with state

When working with the `pushState` API,
and page-two you may optionally provide
state objects available when the user navigates
the history.

For example if you had a photo application
and you performed a relatively extensive
search to populate a list of images,
normally when a user clicks "back" in
the browser the route would be invoked
and the query would be made yet-again.

An example implementation might look as follows:

```js
function show(ctx){
$.getJSON('/photos', function(images){
  displayImages(images)
})
}
```

  You may utilize the history's state
  object to cache this result, or any
  other values you wish. This makes it
  possible to completely omit the query
  when a user presses back, providing
  a much nicer experience.

```js
function show(ctx){
if (ctx.state.images) {
  displayImages(ctx.state.images)
} else {
  $.getJSON('/photos', function(images){
    ctx.state.images = images
    ctx.save()
    displayImages(images)
  })
}
}
```

__NOTE__: `ctx.save()` must be used
if the state changes _after_ the first
tick (xhr, setTimeout, etc), otherwise
it is optional and the state will be
saved after dispatching.

### Matching paths

Here are some examples of what's possible
with the string to `RegExp` conversion.

Match an explicit path:

```js
page('/about', callback)
```

Match with required parameter accessed via `ctx.params.name`:

```js
page('/user/:name', callback)
```

Match with several params, for example `/user/tj/edit` or
`/user/tj/view`.

```js
page('/user/:name/:operation', callback)
```

Match with one optional and one required, now `/user/tj`
will match the same route as `/user/tj/show` etc:

```js
page('/user/:name/:operation?', callback)
```

Use the wildcard char `*` to match across segments,
available via `ctx.params[N]` where __N__ is the
index of `*` since you may use several. For example
the following will match `/user/12/edit`, `/user/12/albums/2/admin`
and so on.

```js
page('/user/*', loadUser)
```

Named wildcard accessed, for example `/file/javascripts/jquery.js`
would provide "/javascripts/jquery.js" as `ctx.params.file`:

```js
page('/file/:file(.*)', loadUser)
```

And of course `RegExp` literals, where the capture
groups are available via `ctx.params[N]` where __N__
is the index of the capture group.

```js
page(/^\/commits\/(\d+)\.\.(\d+)/, loadUser)
```

## Plugins

An example plugin _examples/query-string/query.js_
demonstrates how to make plugins. It will provide a parsed `ctx.query` object
derived from [node-querystring](https://github.com/visionmedia/node-querystring).

Usage by using "*" to match any path
in order to parse the query-string:

```js
page('*', parse)
page('/', show)
page()

function parse(ctx, next) {
ctx.query = qs.parse(location.search.slice(1));
next();
}

function show(ctx) {
if (Object.keys(ctx.query).length) {
  document
    .querySelector('pre')
    .textContent = JSON.stringify(ctx.query, null, 2);
}
}
```

### Available plugins

- [querystring](https://github.com/carlosmintfan/page-two/blob/master/examples/query-string/query.js): provides a parsed `ctx.query` object derived from [node-querystring](https://github.com/visionmedia/node-querystring).

Please submit pull requests to add more to this list.

### Running tests

In the console:

```
$ npm install
$ npm test
```

In the browser:

```
$ npm install
$ npm run serve
$ open http://localhost:3000/
```

### Support in IE8+

If you want the router to work in older version of Internet Explorer that don't support pushState, you can use the [HTML5-History-API](https://github.com/devote/HTML5-History-API) polyfill:
```bash
npm install html5-history-api
```

##### How to use a Polyfill together with router (OPTIONAL):
If your web app is located within a nested basepath, you will need to specify the `basepath` for the HTML5-History-API polyfill.
Before calling `page.base()` use: `history.redirect([prefixType], [basepath])` - Translation link if required.
* `prefixType`: `[string|null]` - Substitute the string after the anchor (#) by default "/".
* `basepath`: `[string|null]` - Set the base path. See `page.base()` by default "/". (Note: Slash after `pathname` required)

### Pull Requests

* Break commits into a single objective.
* An objective should be a chunk of code that is related but requires explanation.
* Commits should be in the form of what-it-is: how-it-does-it and or why-it's-needed or what-it-is for trivial changes
* Pull requests and commits should be a guide to the code.

## Server configuration

In order to load and update any URL managed by page-two, you need to configure your environment to point to your project's main file (index.html, for example) for each non-existent URL. Below you will find examples for most common server scenarios.

### Nginx

If using Nginx, add this to the .conf file related to your project (inside the "server" part), and **reload** your Nginx server:

```nginx
location / {
  try_files $uri $uri/ /index.html?$args;
}
```

### Apache

If using Apache, create (or add to) the `.htaccess` file in the root of your public folder, with the code:

```apache
Options +FollowSymLinks
RewriteEngine On

RewriteCond %{SCRIPT_FILENAME} !-d
RewriteCond %{SCRIPT_FILENAME} !-f

RewriteRule ^.*$ ./index.html
```

### Node.js - Express

For development and/or production, using **Express**, you need to use `express-history-api-fallback` package. An example:

```js
import { join } from 'path';
import express from 'express';
import history from 'express-history-api-fallback';

const app = express();
const root = join(__dirname, '../public');

app.use(express.static(root));
app.use(history('index.html', { root }));

const server = app.listen(process.env.PORT || 3000);

export default server;
```

### Node.js - Browsersync

For development using **Browsersync**, you need to use `history-api-fallback` package. An example:

```js
var browserSync = require("browser-sync").create();
var historyApiFallback = require('connect-history-api-fallback');

browserSync.init({
files: ["*.html", "css/*.css", "js/*.js"],
server: {
  baseDir: ".",
  middleware: [ historyApiFallback() ]
},
port: 3030
});
```

## Integrations

## License

The MIT license. See [LICENSE.txt](LICENSE.txt) for details.
