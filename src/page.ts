import { pathToRegexp } from 'path-to-regexp';

interface Static {
    create(options?: Partial<Options>): Static;
    /**
     * Expose Route
     */
    Route: Route;
    /**
     * Export Context
     */
    Context: Context;
    /**
     *  Defines a route mapping path to the given callback(s).
     *
     *      page('/', user.list)
     *      page('/user/:id', user.load, user.show)
     *      page('/user/:id/edit', user.load, user.edit)
     *      page('*', notfound)
     *
     *  Links that are not of the same origin are disregarded and will not be dispatched.
     */
    (path: string, ...callbacks: Callback[]): void;
    /**
     *  Defines a route mapping path to the given callback(s).
     *
     *      page('/', user.list)
     *      page('/user/:id', user.load, user.show)
     *      page('/user/:id/edit', user.load, user.edit)
     *      page('*', notfound)
     *
     *  Links that are not of the same origin are disregarded and will not be dispatched.
     */
    (path: RegExp, ...callbacks: Callback[]): void;
    /**
     * This is equivalent to page('*', callback) for generic "middleware".
     */
    (callback: Callback): void;
    /**
     *  Navigate to the given path.
     *
     *      $('.view').click(function(e){
     *        page('/user/12')
     *        e.preventDefault()
     *      })
     */
    (path: string): void;
    /**
     * Setup redirect form one path to other.
     */
    (fromPath: string, toPath: string): void;
    /**
     * Register page's popstate / click bindings. If you're doing selective binding you'll like want to pass { click: false } to specify this yourself. The following options are available:
     *
     *     - click bind to click events [true]
     *     - popstate bind to popstate[true]
     *     - dispatch perform initial dispatch[true]
     *     - hashbang add #!before urls[false]
     *
     * If you wish to load serve initial content from the server you likely will want to set dispatch to false.
     */
    (options: Partial<Options>): void;
    /**
     * Register page's popstate / click bindings. If you're doing selective binding you'll like want to pass { click: false } to specify this yourself. The following options are available:
     *
     *     - click bind to click events [true]
     *     - popstate bind to popstate[true]
     *     - dispatch perform initial dispatch[true]
     *     - hashbang add #!before urls[false]
     *
     * If you wish to load serve initial content from the server you likely will want to set dispatch to false.
     */
    (): void;

    /**
     * Identical to page(fromPath, toPath)
     */
    redirect(fromPath: string, toPath: string): void;
    /**
     * Calling page.redirect with only a string as the first parameter redirects to another route.
     * Waits for the current route to push state and after replaces it with the new one leaving the browser history clean.
     *
     *      page('/default', function(){
     *        // some logic to decide which route to redirect to
     *        if(admin) {
     *          page.redirect('/admin');
     *        } else {
     *          page.redirect('/guest');
     *        }
     *      });
     *
     *      page('/default');
     */
    redirect(page: string): void;
    /**
     * Replace `path` with optional `state` object.
     */
    replace(path: string, state?: any, init?: boolean, dispatch?: boolean): Context;
    /**
     *  Navigate to the given path.
     *
     *      $('.view').click(function(e){
     *        page('/user/12')
     *        e.preventDefault()
     *      })
     *
     * Identical to page(path).
     */
    show(path: string): void;
    /**
     * Get or set the strict path matching mode to enable.
     * If enabled /blog will not match "/blog/" and /blog/ will not match "/blog".
     */
    strict(enable: boolean): void;
    strict(): boolean;
    /**
     * Register page's popstate / click bindings. If you're doing selective binding you'll like want to pass { click: false } to specify this yourself. The following options are available:
     *
     *     - click bind to click events [true]
     *     - popstate bind to popstate[true]
     *     - dispatch perform initial dispatch[true]
     *     - hashbang add #!before urls[false]
     *
     * If you wish to load serve initial content from the server you likely will want to set dispatch to false.
     *
     * Identical to page([options]).
     */
    start(options: Partial<Options>): void;
    /**
     * Register page's popstate / click bindings. If you're doing selective binding you'll like want to pass { click: false } to specify this yourself. The following options are available:
     *
     *     - click bind to click events [true]
     *     - popstate bind to popstate[true]
     *     - dispatch perform initial dispatch[true]
     *     - hashbang add #!before urls[false]
     *
     * If you wish to load serve initial content from the server you likely will want to set dispatch to false.
     */
    start(): void;
    /**
     * Unbind both the popstate and click handlers.
     */
    stop(): void;
    /**
     * Get or set the base path. For example if page.js is operating within /blog/* set the base path to "/blog".
     */
    base(path?: string): void;
    /**
     * Defines an exit route mapping path to the given callback(s).
     *
     * Exit routes are called when a page changes, using the context from the previous change. For example:
     *
     *     page('/sidebar', function(ctx, next) {
     *       sidebar.open = true
     *       next()
     *     })
     *
     *     page.exit('/sidebar', function(next) {
     *       sidebar.open = false
     *       next()
     *     })
     */
    exit(path: string, callback: Callback, moreCallbacks?: Callback[]): void;
    /**
     * Equivalent to page.exit('*', callback).
     */
    exit(callback: Callback): void;

    /**
     * This is the click handler used by page to handle routing when a user clicks an anchor like `<a href="/user/profile">`
     */
    clickHandler(e: MouseEvent): void;

    /**
     * Length of the history stack
     */
    len: number;

    /**
     * Current path
     */
    current: string;
}

interface Route {
    /**
     * Initialize `Route` with the given HTTP `path` & `options`
     * @param {string}  path    path
     * @param {Options} options Options
     */
    new(path: string, options?: RouteOptions): Route;
    /**
     * Return route middleware with the given callback `fn()`.
     */
    middleware(fn: Callback): Callback;
    /**
     * Check if this route matches `path`, if so populate `params`.
     * @param  {string}  path   path
     * @param  {{}}    params params
     * @return {boolean}       true if matched, false otherwise
     */
    match(path: string, params?: {}): boolean;
}

interface RouteOptions {
    /**
     * enable case-sensitive routes
     */
    sensitive?: boolean | undefined;
    /**
     * enable strict matching for trailing slashes
     */
    strict?: boolean | undefined;
}

interface Options {
    /**
     * bind to click events (default = true)
     */
    click: boolean;
    /**
     * bind to popstate (default = true)
     */
    popstate: boolean;
    /**
     * perform initial dispatch (default = true)
     */
    dispatch: boolean;
    /**
     * add #!before urls (default = false)
     */
    hashbang: boolean;
    /**
     * remove URL encoding from path components
     */
    decodeURLComponents: boolean;
    /**
     * provide a window to control (by default it will control the main window)
     */
    window: Window;
}

interface Callback {
    (ctx: Context, next: () => any): any;
}

/**
 * Routes are passed Context objects, these may be used to share state, for example ctx.user =, as well as the history "state" ctx.state that the pushState API provides.
 */
interface Context {
    /**
     * Initialize a new "request" `Context` with the given `path` and optional initial `state`.
     * @param {string} path  path
     * @param {any}    state state
     */
    new(path: string, state?: any): Context;
    [idx: string]: any;
    /**
     * Saves the context using replaceState(). For example this is useful for caching HTML or other resources that were loaded for when a user presses "back".
     */
    save: () => void;
    /**
     * Push state
     */
    pushState: () => void;
    /**
     *  If true, marks the context as handled to prevent default 404 behaviour. For example this is useful for the routes with interminate quantity of the callbacks.
     */
    handled: boolean;
    /**
     *  Pathname including the "base" (if any) and query string "/admin/login?foo=bar#zee".
     */
    canonicalPath: string;
    /**
     *  Pathname and query string "/login?foo=bar#zee".
     */
    path: string;
    /**
     *  Query string void of leading ? such as "foo=bar", defaults to "".
     */
    querystring: string;
    /**
     *  Hash void of leading # such as "zee", defaults to "".
     */
    hash: string;
    /**
     *  The pathname void of query string "/login".
     */
    pathname: string;
    /**
     *  The pushState state object.
     */
    state: any;
    /**
     * The pushState title.
     */
    title: string;
    /**
     * The parameters from the url, e.g. /user/:id => Context.params.id
     */
    params: any;
}

const hasProcess = typeof process !== 'undefined';

/**
 * Detect click event
 */
const clickEvent = document.ontouchstart ? 'touchstart' : 'click';

/**
 * The page instance
 * @api private
 */
function Page() {
  // public things
  this.callbacks = [];
  this.exits = [];
  this.current = '';
  this.len = 0;

  // private things
  this._decodeURLComponents = true;
  this._base = '';
  this._strict = false;
  this._running = false;
  this._hashbang = false;

  // bound functions
  this.clickHandler = this.clickHandler.bind(this);
  this._onpopstate = this._onpopstate.bind(this);
}

/**
 * Configure the instance of page. This can be called multiple times.
 *
 * @api public
 */

Page.prototype.configure = function(options: Options) {
  var opts = options || {} as Options;

  this._window = opts.window || window;
  this._decodeURLComponents = opts.decodeURLComponents !== false;
  this._popstate = opts.popstate !== false;
  this._click = opts.click !== false;
  this._hashbang = !!opts.hashbang;

  var _window = this._window;
  if(this._popstate) {
    _window.addEventListener('popstate', this._onpopstate, false);
  } else {
    _window.removeEventListener('popstate', this._onpopstate, false);
  }

  if (this._click) {
    _window.document.addEventListener(clickEvent, this.clickHandler, false);
  } else {
    _window.document.removeEventListener(clickEvent, this.clickHandler, false);
  }

  _window.removeEventListener('hashchange', this._onpopstate, false);
};

/**
 * Get or set basepath to `path`.
 *
 * @param {string} path
 * @api public
 */

Page.prototype.base = function(path: string) {
  if (0 === arguments.length) return this._base;
  this._base = path;
};

/**
 * Gets the `base`, which depends on whether we are using History or
 * hashbang routing.

  * @api private
  */
Page.prototype._getBase = function() {
  var base = this._base;
  if(!!base) return base;
  var loc = this._window && this._window.location;

  if(this._hashbang && loc && loc.protocol === 'file:') {
    base = loc.pathname;
  }

  return base;
};

/**
 * Get or set strict path matching to `enable`
 *
 * @param {boolean} enable
 * @api public
 */

Page.prototype.strict = function(enable: boolean) {
  if (0 === arguments.length) return this._strict;
  this._strict = enable;
};


/**
 * Bind with the given `options`.
 *
 * Options:
 *
 *    - `click` bind to click events [true]
 *    - `popstate` bind to popstate [true]
 *    - `dispatch` perform initial dispatch [true]
 *
 * @api public
 */

Page.prototype.start = function(options: Options) {
  var opts = options || {} as Options;
  this.configure(opts);

  if (false === opts.dispatch) return;
  this._running = true;

  var url;

  var window = this._window;
  var loc = window.location;

  if(this._hashbang && ~loc.hash.indexOf('#!')) {
    url = loc.hash.substr(2) + loc.search;
  } else if (this._hashbang) {
    url = loc.search + loc.hash;
  } else {
    url = loc.pathname + loc.search + loc.hash;
  }

  this.replace(url, null, true, opts.dispatch);
};

/**
 * Unbind click and popstate event handlers.
 *
 * @api public
 */

Page.prototype.stop = function() {
  if (!this._running) return;
  this.current = '';
  this.len = 0;
  this._running = false;

  var window = this._window;
  this._click && window.document.removeEventListener(clickEvent, this.clickHandler, false);
  window.removeEventListener('popstate', this._onpopstate, false);
  window.removeEventListener('hashchange', this._onpopstate, false);
};

/**
 * Show `path` with optional `state` object.
 *
 * @api public
 */

Page.prototype.show = function(path: string, state: object | undefined, dispatch: boolean | undefined, push: boolean | undefined): Context {
  var ctx = new Context(path, state, this),
    prev = this.prevContext;
  this.prevContext = ctx;
  this.current = ctx.path;
  if (false !== dispatch) this.dispatch(ctx, prev);
  if (false !== ctx.handled && false !== push) ctx.pushState();
  return ctx;
};

/**
 * Goes back in the history
 * Back should always let the current route push state and then go back.
 *
 * @param {string} path - fallback path to go back if no more history exists, if undefined defaults to page.base
 * @param {Object=} state
 * @api public
 */

Page.prototype.back = function(path: string, state: object | undefined) {
  var page = this;
  if (this.len > 0) {
    var window = this._window;
    // TODO: this may need more testing to see if all browsers
    // wait for the next tick to go back in history
    window.history.back();
    this.len--;
  } else if (path) {
    setTimeout(function() {
      page.show(path, state);
    });
  } else {
    setTimeout(function() {
      page.show(page._getBase(), state);
    });
  }
};

/**
 * Register route to redirect from one path to other
 * or just redirect to another route
 *
 * @param {string} from - if param 'to' is undefined redirects to 'from'
 * @param {string=} to
 * @api public
 */
Page.prototype.redirect = function(from: string, to: string | undefined) {
  var inst = this;

  // Define route from a path to another
  if ('string' === typeof from && 'string' === typeof to) {
    page.call(this, from, function(e) {
      setTimeout(function() {
        inst.replace(/** @type {!string} */ (to));
      }, 0);
    });
  }

  // Wait for the push state and replace it with another
  if ('string' === typeof from && 'undefined' === typeof to) {
    setTimeout(function() {
      inst.replace(from);
    }, 0);
  }
};

/**
 * Replace `path` with optional `state` object.
 *
 * @param {string} path
 * @param {Object=} state
 * @param {boolean=} init
 * @param {boolean=} dispatch
 * @return {!Context}
 * @api public
 */


Page.prototype.replace = function(path: string, state: object | undefined, init: boolean | undefined, dispatch: boolean | undefined): Context {
  var ctx = new Context(path, state, this),
    prev = this.prevContext;
  this.prevContext = ctx;
  this.current = ctx.path;
  ctx.init = init;
  ctx.save(); // save before dispatching, which may redirect
  if (false !== dispatch) this.dispatch(ctx, prev);
  return ctx;
};

/**
 * Dispatch the given `ctx`.
 *
 * @param {Context} ctx
 * @api private
 */

Page.prototype.dispatch = function(ctx: Context, prev) {
  var i = 0, j = 0, page = this;

  function nextExit() {
    var fn = page.exits[j++];
    if (!fn) return nextEnter();
    fn(prev, nextExit);
  }

  function nextEnter() {
    var fn = page.callbacks[i++];

    if (ctx.path !== page.current) {
      ctx.handled = false;
      return;
    }
    if (!fn) return unhandled.call(page, ctx);
    fn(ctx, nextEnter);
  }

  if (prev) {
    nextExit();
  } else {
    nextEnter();
  }
};

/**
 * Register an exit route on `path` with
 * callback `fn()`, which will be called
 * on the previous context when a new
 * page is visited.
 */
Page.prototype.exit = function(path, fn) {
  if (typeof path === 'function') {
    return this.exit('*', path);
  }

  var route = new Route(path, undefined, this);
  for (var i = 1; i < arguments.length; ++i) {
    this.exits.push(route.middleware(arguments[i]));
  }
};

/**
 * Handle "click" events.
 */

/* jshint +W054 */
Page.prototype.clickHandler = function(e) {
  if (1 !== this._which(e)) return;

  if (e.metaKey || e.ctrlKey || e.shiftKey) return;
  if (e.defaultPrevented) return;

  // ensure link
  // use shadow dom when available if not, fall back to composedPath()
  // for browsers that only have shady
  var el = e.target;
  var eventPath = e.path || (e.composedPath ? e.composedPath() : null);

  if(eventPath) {
    for (var i = 0; i < eventPath.length; i++) {
      if (!eventPath[i].nodeName) continue;
      if (eventPath[i].nodeName.toUpperCase() !== 'A') continue;
      if (!eventPath[i].href) continue;

      el = eventPath[i];
      break;
    }
  }

  // continue ensure link
  // el.nodeName for svg links are 'a' instead of 'A'
  while (el && 'A' !== el.nodeName.toUpperCase()) el = el.parentNode;
  if (!el || 'A' !== el.nodeName.toUpperCase()) return;

  // check if link is inside an svg
  // in this case, both href and target are always inside an object
  var svg = (typeof el.href === 'object') && el.href.constructor.name === 'SVGAnimatedString';

  // Ignore if tag has
  // 1. "download" attribute
  // 2. rel="external" attribute
  if (el.hasAttribute('download') || el.getAttribute('rel') === 'external') return;

  // ensure non-hash for the same path
  var link = el.getAttribute('href');
  if(!this._hashbang && this._samePath(el) && (el.hash || '#' === link)) return;

  // Check for mailto: in the href
  if (link && link.indexOf('mailto:') > -1) return;

  // check target
  // svg target is an object and its desired value is in .baseVal property
  if (svg ? el.target.baseVal : el.target) return;

  // x-origin
  // note: svg links that are not relative don't call click events (and skip page.js)
  // consequently, all svg links tested inside page.js are relative and in the same origin
  if (!svg && !this.sameOrigin(el.href)) return;

  // rebuild path
  // There aren't .pathname and .search properties in svg links, so we use href
  // Also, svg href is an object and its desired value is in .baseVal property
  var path = svg ? el.href.baseVal : (el.pathname + el.search + (el.hash || ''));

  path = path[0] !== '/' ? '/' + path : path;

  // strip leading "/[drive letter]:" on NW.js on Windows
  if (hasProcess && path.match(/^\/[a-zA-Z]:\//)) {
    path = path.replace(/^\/[a-zA-Z]:\//, '/');
  }

  // same page
  var orig = path;
  var pageBase = this._getBase();

  if (path.indexOf(pageBase) === 0) {
    path = path.substr(pageBase.length);
  }

  if (this._hashbang) path = path.replace('#!', '');

  if (pageBase && orig === path && (this._window.location.protocol !== 'file:')) {
    return;
  }

  e.preventDefault();
  this.show(orig);
};

/**
 * Handle "populate" events.
 * @api private
 */

Page.prototype._onpopstate = (function () {
  var loaded = false;
  if (document.readyState === 'complete') {
    loaded = true;
  } else {
    window.addEventListener('load', function() {
      setTimeout(function() {
        loaded = true;
      }, 0);
    });
  }
  return function onpopstate(e) {
    if (!loaded) return;
    var page = this;
    if (e.state) {
      var path = e.state.path;
      page.replace(path, e.state);
    } else {
      var loc = page._window.location;
      page.show(loc.pathname + loc.search + loc.hash, undefined, undefined, false);
    }
  };
})();

/**
 * Event button.
 */
Page.prototype._which = function(e) {
  e = e || this._window.event;
  return null == e.which ? e.button : e.which;
};

/**
 * Convert to a URL object
 * @api private
 */
Page.prototype._toURL = function(href) {
  var window = this._window;
  if(typeof URL === 'function') {
    return new URL(href, window.location.toString());
  } else {
    var anc = window.document.createElement('a');
    anc.href = href;
    return anc;
  }
};

/**
 * Check if `href` is the same origin.
 * @param {string} href
 * @api public
 */
Page.prototype.sameOrigin = function(href: string) {
  if(!href) return false;

  var url = this._toURL(href);
  var window = this._window;

  var loc = window.location;

  /*
      When the port is the default http port 80 for http, or 443 for
      https, internet explorer 11 returns an empty string for loc.port,
      so we need to compare loc.port with an empty string if url.port
      is the default port 80 or 443.
      Also the comparition with `port` is changed from `===` to `==` because
      `port` can be a string sometimes. This only applies to ie11.
  */
  return loc.protocol === url.protocol &&
    loc.hostname === url.hostname &&
    (loc.port === url.port || loc.port === '' && (url.port == 80 || url.port == 443)); // jshint ignore:line
};

/**
 * @api private
 */
Page.prototype._samePath = function(url) {
  var window = this._window;
  var loc = window.location;
  return url.pathname === loc.pathname &&
    url.search === loc.search;
};

/**
 * Remove URL encoding from the given `str`.
 * Accommodates whitespace in both x-www-form-urlencoded
 * and regular percent-encoded form.
 *
 * @param {string} val - URL component to decode
 * @api private
 */
Page.prototype._decodeURLEncodedURIComponent = function(val: string) {
  if (typeof val !== 'string') { return val; }
  return this._decodeURLComponents ? decodeURIComponent(val.replace(/\+/g, ' ')) : val;
};

/**
 * Create a new `page` instance and function
 */
function createPage() {
  var pageInstance = new Page();

  function pageFn(/* args */) {
    return page.apply(pageInstance, arguments);
  }

  // Copy all of the things over. In 2.0 maybe we use setPrototypeOf
  pageFn.callbacks = pageInstance.callbacks;
  pageFn.exits = pageInstance.exits;
  pageFn.base = pageInstance.base.bind(pageInstance);
  pageFn.strict = pageInstance.strict.bind(pageInstance);
  pageFn.start = pageInstance.start.bind(pageInstance);
  pageFn.stop = pageInstance.stop.bind(pageInstance);
  pageFn.show = pageInstance.show.bind(pageInstance);
  pageFn.back = pageInstance.back.bind(pageInstance);
  pageFn.redirect = pageInstance.redirect.bind(pageInstance);
  pageFn.replace = pageInstance.replace.bind(pageInstance);
  pageFn.dispatch = pageInstance.dispatch.bind(pageInstance);
  pageFn.exit = pageInstance.exit.bind(pageInstance);
  pageFn.configure = pageInstance.configure.bind(pageInstance);
  pageFn.sameOrigin = pageInstance.sameOrigin.bind(pageInstance);
  pageFn.clickHandler = pageInstance.clickHandler.bind(pageInstance);

  pageFn.create = createPage;

  Object.defineProperty(pageFn, 'len', {
    get: function(){
      return pageInstance.len;
    },
    set: function(val) {
      pageInstance.len = val;
    }
  });

  Object.defineProperty(pageFn, 'current', {
    get: function(){
      return pageInstance.current;
    },
    set: function(val) {
      pageInstance.current = val;
    }
  });

  // In 2.0 these can be named exports
  pageFn.Context = Context;
  pageFn.Route = Route;

  // pageFn allows accessing len and current, but as Object.defineProperty
  // is used, TypeScript doesn't detect it, so we have to convert to unknown first
  // TODO: We should make it all more type-safe
  return pageFn as unknown as Static;
}

/**
 * Register `path` with callback `fn()`,
 * or route `path`, or redirection,
 * or `page.start()`.
 *
 *   page(fn);
 *   page('*', fn);
 *   page('/user/:id', load, user);
 *   page('/user/' + user.id, { some: 'thing' });
 *   page('/user/' + user.id);
 *   page('/from', '/to')
 *   page();
 *
 * @param {string|!Function|!Object} path
 * @param {Function=} fn
 * @api public
 */

function page(path: string | Function | object, fn: Function | undefined) {
  // <callback>
  if ('function' === typeof path) {
    return page.call(this, '*', path);
  }

  // route <path> to <callback ...>
  if ('function' === typeof fn) {
    if ('string' !== typeof path) {
      throw new Error('path must be a string if fn is set');
    }
    var route = new Route(path, undefined, this);
    for (var i = 1; i < arguments.length; ++i) {
      this.callbacks.push(route.middleware(arguments[i]));
    }
    // show <path> with [state]
  } else if ('string' === typeof path) {
    this['string' === typeof fn ? 'redirect' : 'show'](path, fn);
    // start [options]
  } else {
    this.start(path);
  }
}

/**
 * Unhandled `ctx`. When it's not the initial
 * popstate then redirect. If you wish to handle
 * 404s on your own use `page('*', callback)`.
 *
 * @param {Context} ctx
 * @api private
 */
function unhandled(ctx: Context) {
  if (ctx.handled) return;
  var current;
  var page = this;
  var window = page._window;

  if (page._hashbang) {
    current = this._getBase() + window.location.hash.replace('#!', '');
  } else {
    current = window.location.pathname + window.location.search;
  }

  if (current === ctx.canonicalPath) return;
  page.stop();
  ctx.handled = false;
  window.location.href = ctx.canonicalPath;
}

/**
 * Escapes RegExp characters in the given string.
 *
 * @param {string} s
 * @api private
 */
function escapeRegExp(s: string) {
  return s.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1');
}

class Context implements Context {
  page: any;
  title: string;
  state: any;
  canonicalPath: string;
  path: string;
  querystring: string;
  pathname: string;
  params: any;
  hash: string;

  /**
    * Initialize a new "request" `Context`
    * with the given `path` and optional initial `state`.
    *
    * @api public
    */
  constructor(path: string, state?: object, pageInstance?: any) { // TODO never anys mostly
    const _page = this.page = pageInstance || page;
    const window = _page._window;
    const hashbang = _page._hashbang;

    const pageBase = _page._getBase();
    if ('/' === path[0] && 0 !== path.indexOf(pageBase)) {
      path = pageBase + (hashbang ? '#!' : '') + path;
    }
    const i = path.indexOf('?');

    this.canonicalPath = path;
    const re = new RegExp('^' + escapeRegExp(pageBase));
    this.path = path.replace(re, '') || '/';
    if (hashbang) this.path = this.path.replace('#!', '') || '/';

    this.title = window.document.title;
    this.state = state || {};
    this.state.path = path;
    this.querystring = ~i ? _page._decodeURLEncodedURIComponent(path.slice(i + 1)) : '';
    this.pathname = _page._decodeURLEncodedURIComponent(~i ? path.slice(0, i) : path);
    this.params = {};

    // fragment
    this.hash = '';
    if (!hashbang) {
      if (!~this.path.indexOf('#')) return;
      const parts = this.path.split('#');
      this.path = this.pathname = parts[0];
      this.hash = _page._decodeURLEncodedURIComponent(parts[1]) || '';
      this.querystring = this.querystring.split('#')[0];
    }
  }
}

/**
 * Push state.
 *
 * @api private
 */

Context.prototype.pushState = function() {
  var page = this.page;
  var window = page._window;
  var hashbang = page._hashbang;

  page.len++;

  window.history.pushState(this.state, this.title,
    hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);

};

/**
 * Save the context state.
 *
 * @api public
 */

Context.prototype.save = function() {
  var page = this.page;

  page._window.history.replaceState(this.state, this.title,
    page._hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
};

/**
 * Initialize `Route` with the given HTTP `path`,
 * and an array of `callbacks` and `options`.
 *
 * Options:
 *
 *   - `sensitive`    enable case-sensitive routes
 *   - `strict`       enable strict matching for trailing slashes
 *
 * @constructor
 * @api private
 */

function Route(path: string, options?: RouteOptions, page?: any) { // TODO never any
  var _page = this.page = page || globalPage;
  var opts = options || {};
  opts.strict = opts.strict || _page._strict;
  this.path = (path === '*') ? '(.*)' : path;
  this.method = 'GET';
  const { regexp, keys } = pathToRegexp(this.path, opts);
  this.regexp = regexp;
  this.keys = keys;
}

/**
 * Return route middleware with
 * the given callback `fn()`.
 *
 * @param {Function} fn
 * @return {Function}
 * @api public
 */

Route.prototype.middleware = function(fn: Function): Function {
  var self = this;
  return function(ctx, next) {
    if (self.match(ctx.path, ctx.params)) {
      ctx.routePath = self.path;
      return fn(ctx, next);
    }
    next();
  };
};

/**
 * Check if this route matches `path`, if so
 * populate `params`.
 *
 * @param {string} path
 * @param {Object} params
 * @return {boolean}
 * @api private
 */

Route.prototype.match = function(path: string, params: object): boolean {
  var keys = this.keys,
    qsIndex = path.indexOf('?'),
    pathname = ~qsIndex ? path.slice(0, qsIndex) : path,
    m = this.regexp.exec(decodeURIComponent(pathname));

  if (!m) return false;

  delete params[0];

  for (var i = 1, len = m.length; i < len; ++i) {
    var key = keys[i - 1];
    var val = this.page._decodeURLEncodedURIComponent(m[i]);
    if (val !== undefined || !(Object.prototype.hasOwnProperty.call(params, key.name))) {
      params[key.name] = val;
    }
  }

  return true;
};


/**
 * Module exports.
 */

var globalPage: Static = createPage();
export type { Callback, Context, Options, Route, RouteOptions, Static };
export default globalPage;
