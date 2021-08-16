(function() {
var exports = {};
exports.id = 888;
exports.ids = [888];
exports.modules = {

/***/ 7355:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "hi": function() { return /* binding */ api; },
  "v": function() { return /* binding */ author; },
  "yN": function() { return /* binding */ defaultPageCover; },
  "Wx": function() { return /* binding */ defaultPageCoverPosition; },
  "SH": function() { return /* binding */ defaultPageIcon; },
  "WL": function() { return /* binding */ description; },
  "nw": function() { return /* binding */ domain; },
  "GH": function() { return /* binding */ fathomConfig; },
  "gr": function() { return /* binding */ fathomId; },
  "D8": function() { return /* binding */ firebaseCollectionImages; },
  "bW": function() { return /* binding */ github; },
  "M1": function() { return /* binding */ googleApplicationCredentials; },
  "tk": function() { return /* binding */ googleProjectId; },
  "EN": function() { return /* binding */ imageCDNHost; },
  "IT": function() { return /* binding */ includeNotionIdInUrls; },
  "JN": function() { return /* binding */ inversePageUrlOverrides; },
  "r8": function() { return /* binding */ isDev; },
  "K6": function() { return /* binding */ isPreviewImageSupportEnabled; },
  "sk": function() { return /* binding */ isServer; },
  "kG": function() { return /* binding */ linkedin; },
  "u2": function() { return /* binding */ config_name; },
  "mH": function() { return /* binding */ pageUrlAdditions; },
  "_w": function() { return /* binding */ pageUrlOverrides; },
  "AM": function() { return /* binding */ rootNotionPageId; },
  "bY": function() { return /* binding */ rootNotionSpaceId; },
  "km": function() { return /* binding */ twitter; },
  "hV": function() { return /* binding */ utterancesGitHubRepo; }
});

// UNUSED EXPORTS: apiBaseUrl, host, port, socialImageSubtitle, socialImageTitle

// EXTERNAL MODULE: external "notion-utils"
var external_notion_utils_ = __webpack_require__(1235);
// EXTERNAL MODULE: ./site.config.js
var site_config = __webpack_require__(8075);
var site_config_default = /*#__PURE__*/__webpack_require__.n(site_config);
;// CONCATENATED MODULE: ./lib/get-config-value.ts
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



if (!(site_config_default())) {
  throw new Error(`Config error: invalid site.config.js`);
} // TODO: allow environment variables to override site.config.js


let siteConfigOverrides;

try {
  if (process.env.NEXT_PUBLIC_SITE_CONFIG) {
    siteConfigOverrides = JSON.parse(process.env.NEXT_PUBLIC_SITE_CONFIG);
  }
} catch (err) {
  console.error('Invalid config "NEXT_PUBLIC_SITE_CONFIG" failed to parse');
  throw err;
}

const siteConfig = _objectSpread(_objectSpread({}, (site_config_default())), siteConfigOverrides);

function getSiteConfig(key, defaultValue) {
  const value = siteConfig[key];

  if (value !== undefined) {
    return value;
  }

  if (defaultValue !== undefined) {
    return defaultValue;
  }

  throw new Error(`Config error: missing required site config value "${key}"`);
}
function getEnv(key, defaultValue, env = process.env) {
  const value = env[key];

  if (value !== undefined) {
    return value;
  }

  if (defaultValue !== undefined) {
    return defaultValue;
  }

  throw new Error(`Config error: missing required env variable "${key}"`);
}
;// CONCATENATED MODULE: ./lib/config.ts
function config_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function config_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { config_ownKeys(Object(source), true).forEach(function (key) { config_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { config_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function config_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Site-wide app configuration.
 *
 * This file pulls from the root "site.config.js" as well as environment variables
 * for optional depenencies.
 */


const rootNotionPageId = (0,external_notion_utils_.parsePageId)(getSiteConfig('rootNotionPageId'), {
  uuid: false
});

if (!rootNotionPageId) {
  throw new Error('Config error invalid "rootNotionPageId"');
} // if you want to restrict pages to a single notion workspace (optional)


const rootNotionSpaceId = (0,external_notion_utils_.parsePageId)(getSiteConfig('rootNotionSpaceId', null), {
  uuid: true
});
const pageUrlOverrides = cleanPageUrlMap(getSiteConfig('pageUrlOverrides', {}) || {}, 'pageUrlOverrides');
const inversePageUrlOverrides = invertPageUrlOverrides(pageUrlOverrides);
const pageUrlAdditions = cleanPageUrlMap(getSiteConfig('pageUrlAdditions', {}) || {}, 'pageUrlAdditions'); // general site config

const config_name = getSiteConfig('name');
const author = getSiteConfig('author');
const domain = getSiteConfig('domain');
const description = getSiteConfig('description', 'Notion Blog'); // social accounts

const twitter = getSiteConfig('twitter', null);
const github = getSiteConfig('github', null);
const linkedin = getSiteConfig('linkedin', null);
const socialImageTitle = getSiteConfig('socialImageTitle', null);
const socialImageSubtitle = getSiteConfig('socialImageSubtitle', null); // default notion values for site-wide consistency (optional; may be overridden on a per-page basis)

const defaultPageIcon = getSiteConfig('defaultPageIcon', null);
const defaultPageCover = getSiteConfig('defaultPageCover', null);
const defaultPageCoverPosition = getSiteConfig('defaultPageCoverPosition', 0.5); // Optional utteranc.es comments via GitHub issue comments

const utterancesGitHubRepo = getSiteConfig('utterancesGitHubRepo', null); // Optional image CDN host to proxy all image requests through

const imageCDNHost = getSiteConfig('imageCDNHost', null); // Optional whether or not to enable support for LQIP preview images
// (requires a Google Firebase collection)

const isPreviewImageSupportEnabled = getSiteConfig('isPreviewImageSupportEnabled', false);
const isDev =  false || !"production"; // where it all starts -- the site's root Notion page

const includeNotionIdInUrls = getSiteConfig('includeNotionIdInUrls', !!isDev); // ----------------------------------------------------------------------------

const isServer = true;
const port = getEnv('PORT', '3000');
const host = isDev ? `http://localhost:${port}` : `https://${domain}`;
const apiBaseUrl = `${host}/api`;
const api = {
  createPreviewImage: `${apiBaseUrl}/create-preview-image`,
  searchNotion: `${apiBaseUrl}/search-notion`
}; // ----------------------------------------------------------------------------

const fathomId = isDev ? null : process.env.NEXT_PUBLIC_FATHOM_ID;
const fathomConfig = fathomId ? {
  excludedDomains: ['localhost', 'localhost:3000']
} : undefined;
const defaultEnvValueForPreviewImageSupport = isPreviewImageSupportEnabled && isServer ? undefined : null;
const googleProjectId = getEnv('GCLOUD_PROJECT', defaultEnvValueForPreviewImageSupport);
const googleApplicationCredentials = getGoogleApplicationCredentials();
const firebaseCollectionImages = getEnv('FIREBASE_COLLECTION_IMAGES', defaultEnvValueForPreviewImageSupport); // this hack is necessary because vercel doesn't support secret files so we need to encode our google
// credentials a base64-encoded string of the JSON-ified content

function getGoogleApplicationCredentials() {
  if (!isPreviewImageSupportEnabled || !isServer) {
    return null;
  }

  try {
    const googleApplicationCredentialsBase64 = getEnv('GOOGLE_APPLICATION_CREDENTIALS', defaultEnvValueForPreviewImageSupport);
    return JSON.parse(Buffer.from(googleApplicationCredentialsBase64, 'base64').toString());
  } catch (err) {
    console.error('Firebase config error: invalid "GOOGLE_APPLICATION_CREDENTIALS" should be base64-encoded JSON\n');
    throw err;
  }
}

function cleanPageUrlMap(pageUrlMap, label) {
  return Object.keys(pageUrlMap).reduce((acc, uri) => {
    const pageId = pageUrlMap[uri];
    const uuid = (0,external_notion_utils_.parsePageId)(pageId, {
      uuid: false
    });

    if (!uuid) {
      throw new Error(`Invalid ${label} page id "${pageId}"`);
    }

    if (!uri) {
      throw new Error(`Missing ${label} value for page "${pageId}"`);
    }

    if (!uri.startsWith('/')) {
      throw new Error(`Invalid ${label} value for page "${pageId}": value "${uri}" should be a relative URI that starts with "/"`);
    }

    const path = uri.slice(1);
    return config_objectSpread(config_objectSpread({}, acc), {}, {
      [path]: uuid
    });
  }, {});
}

function invertPageUrlOverrides(pageUrlOverrides) {
  return Object.keys(pageUrlOverrides).reduce((acc, uri) => {
    const pageId = pageUrlOverrides[uri];
    return config_objectSpread(config_objectSpread({}, acc), {}, {
      [pageId]: uri
    });
  }, {});
}

/***/ }),

/***/ 7913:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ App; }
});

// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(5282);
;// CONCATENATED MODULE: external "prismjs"
var external_prismjs_namespaceObject = require("prismjs");;
;// CONCATENATED MODULE: external "prismjs/components/prism-markup"
var prism_markup_namespaceObject = require("prismjs/components/prism-markup");;
;// CONCATENATED MODULE: external "prismjs/components/prism-javascript"
var prism_javascript_namespaceObject = require("prismjs/components/prism-javascript");;
;// CONCATENATED MODULE: external "prismjs/components/prism-typescript"
var prism_typescript_namespaceObject = require("prismjs/components/prism-typescript");;
;// CONCATENATED MODULE: external "prismjs/components/prism-bash"
var prism_bash_namespaceObject = require("prismjs/components/prism-bash");;
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(9297);
var external_react_default = /*#__PURE__*/__webpack_require__.n(external_react_);
// EXTERNAL MODULE: external "next/router"
var router_ = __webpack_require__(6731);
// EXTERNAL MODULE: ./lib/config.ts + 1 modules
var config = __webpack_require__(7355);
;// CONCATENATED MODULE: external "fathom-client"
var external_fathom_client_namespaceObject = require("fathom-client");;
;// CONCATENATED MODULE: ./pages/_app.tsx


function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// global styles shared across the entire site
 // core styles shared by all of react-notion-x (required)

 // used for code syntax highlighting (optional)

 // this might be better for dark mode
// import 'prismjs/themes/prism-okaidia.css'
// used for collection views selector (optional)
// TODO: re-add if we enable collection view dropdowns
// import 'rc-dropdown/assets/index.css'
// used for rendering equations (optional)

 // core styles for static tweet renderer (optional)

 // global style overrides for notion

 // global style overrides for prism theme (optional)

 // here we're bringing in any languages we want to support for
// syntax highlighting via Notion's Code block












if (false) {}

function App({
  Component,
  pageProps
}) {
  const router = (0,router_.useRouter)();
  external_react_default().useEffect(() => {
    if (config/* fathomId */.gr) {
      external_fathom_client_namespaceObject.load(config/* fathomId */.gr, config/* fathomConfig */.GH);

      function onRouteChangeComplete() {
        external_fathom_client_namespaceObject.trackPageview();
      }

      router.events.on('routeChangeComplete', onRouteChangeComplete);
      return () => {
        router.events.off('routeChangeComplete', onRouteChangeComplete);
      };
    }
  }, []);
  return /*#__PURE__*/jsx_runtime_.jsx(Component, _objectSpread({}, pageProps));
}

/***/ }),

/***/ 8075:
/***/ (function(module) {

module.exports = {
  // where it all starts -- the site's root Notion page (required)
  rootNotionPageId: 'f76197a2521241d99dc6de8dfd6b6b4c',
  // if you want to restrict pages to a single notion workspace (optional)
  // (this should be a Notion ID; see the docs for how to extract this)
  rootNotionSpaceId: null,
  // basic site info (required)
  name: 'ounols',
  domain: 'ounols.github.io/nextjs-ounols-page',
  author: 'ounols',
  // open graph metadata (optional)
  description: 'ounol\'s portfolio site',
  socialImageTitle: 'Ounols',
  socialImageSubtitle: 'Hello World! 👋',
  // social usernames (optional)
  // github: 'ounols',
  // default notion icon and cover images for site-wide consistency (optional)
  // page-specific values will override these site-wide defaults
  defaultPageIcon: null,
  defaultPageCover: null,
  defaultPageCoverPosition: 0.5,
  // image CDN host to proxy all image requests through (optional)
  // NOTE: this requires you to set up an external image proxy
  imageCDNHost: null,
  // Utteranc.es comments via GitHub issue comments (optional)
  utterancesGitHubRepo: null,
  // whether or not to enable support for LQIP preview images (optional)
  // NOTE: this requires you to set up Google Firebase and add the environment
  // variables specified in .env.example
  isPreviewImageSupportEnabled: false,
  // map of notion page IDs to URL paths (optional)
  // any pages defined here will override their default URL paths
  // example:
  //
  // pageUrlOverrides: {
  //   '/foo': '067dd719a912471ea9a3ac10710e7fdf',
  //   '/bar': '0be6efce9daf42688f65c76b89f8eb27'
  // }
  pageUrlOverrides: null
};

/***/ }),

/***/ 6731:
/***/ (function(module) {

"use strict";
module.exports = require("next/router");;

/***/ }),

/***/ 1235:
/***/ (function(module) {

"use strict";
module.exports = require("notion-utils");;

/***/ }),

/***/ 9297:
/***/ (function(module) {

"use strict";
module.exports = require("react");;

/***/ }),

/***/ 5282:
/***/ (function(module) {

"use strict";
module.exports = require("react/jsx-runtime");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
var __webpack_exports__ = (__webpack_exec__(7913));
module.exports = __webpack_exports__;

})();