(function() {
var exports = {};
exports.id = 405;
exports.ids = [405];
exports.modules = {

/***/ 5318:
/***/ (function(module) {

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault;

/***/ }),

/***/ 862:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var _typeof = __webpack_require__(8);

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function _getRequireWildcardCache() {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
    return {
      "default": obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj["default"] = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}

module.exports = _interopRequireWildcard;

/***/ }),

/***/ 8:
/***/ (function(module) {

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;

/***/ }),

/***/ 1185:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "mf": function() { return /* reexport */ ErrorPage; },
  "mK": function() { return /* reexport */ NotionPage; },
  "lN": function() { return /* reexport */ Page404; }
});

// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(5282);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(9297);
var external_react_default = /*#__PURE__*/__webpack_require__.n(external_react_);
;// CONCATENATED MODULE: external "next/head"
var head_namespaceObject = require("next/head");;
var head_default = /*#__PURE__*/__webpack_require__.n(head_namespaceObject);
// EXTERNAL MODULE: ./node_modules/next/link.js
var next_link = __webpack_require__(1664);
;// CONCATENATED MODULE: external "next/dynamic"
var dynamic_namespaceObject = require("next/dynamic");;
var dynamic_default = /*#__PURE__*/__webpack_require__.n(dynamic_namespaceObject);
;// CONCATENATED MODULE: external "classnames"
var external_classnames_namespaceObject = require("classnames");;
var external_classnames_default = /*#__PURE__*/__webpack_require__.n(external_classnames_namespaceObject);
// EXTERNAL MODULE: external "next/router"
var router_ = __webpack_require__(6731);
;// CONCATENATED MODULE: external "react-use"
var external_react_use_namespaceObject = require("react-use");;
;// CONCATENATED MODULE: external "react-body-classname"
var external_react_body_classname_namespaceObject = require("react-body-classname");;
var external_react_body_classname_default = /*#__PURE__*/__webpack_require__.n(external_react_body_classname_namespaceObject);
;// CONCATENATED MODULE: external "use-dark-mode"
var external_use_dark_mode_namespaceObject = require("use-dark-mode");;
var external_use_dark_mode_default = /*#__PURE__*/__webpack_require__.n(external_use_dark_mode_namespaceObject);
;// CONCATENATED MODULE: external "react-static-tweets"
var external_react_static_tweets_namespaceObject = require("react-static-tweets");;
// EXTERNAL MODULE: external "react-notion-x"
var external_react_notion_x_ = __webpack_require__(761);
// EXTERNAL MODULE: external "notion-utils"
var external_notion_utils_ = __webpack_require__(1235);
// EXTERNAL MODULE: ./lib/config.ts + 1 modules
var config = __webpack_require__(7355);
// EXTERNAL MODULE: ./lib/get-canonical-page-id.ts
var get_canonical_page_id = __webpack_require__(8738);
;// CONCATENATED MODULE: ./lib/map-page-url.ts


 // include UUIDs in page URLs during local development but not in production
// (they're nice for debugging and speed up local dev)

const uuid = !!config/* includeNotionIdInUrls */.IT;
const mapPageUrl = (site, recordMap, searchParams) => (pageId = '') => {
  if ((0,external_notion_utils_.uuidToId)(pageId) === site.rootNotionPageId) {
    return createUrl('/', searchParams);
  } else {
    return createUrl(`/${(0,get_canonical_page_id/* getCanonicalPageId */.S)(pageId, recordMap, {
      uuid
    })}`, searchParams);
  }
};
const getCanonicalPageUrl = (site, recordMap) => (pageId = '') => {
  const pageUuid = (0,external_notion_utils_.parsePageId)(pageId, {
    uuid: true
  });

  if ((0,external_notion_utils_.uuidToId)(pageId) === site.rootNotionPageId) {
    return `https://${site.domain}`;
  } else {
    return `https://${site.domain}/${(0,get_canonical_page_id/* getCanonicalPageId */.S)(pageUuid, recordMap, {
      uuid
    })}`;
  }
};

function createUrl(path, searchParams) {
  return [path, searchParams.toString()].filter(Boolean).join('?');
}
// EXTERNAL MODULE: ./lib/map-image-url.ts
var map_image_url = __webpack_require__(1163);
;// CONCATENATED MODULE: ./lib/get-page-description.ts

function getPageDescription(block, recordMap) {
  return (0,external_notion_utils_.getPageProperty)('Description', block, recordMap);
}
;// CONCATENATED MODULE: ./lib/get-page-tweet.ts

function getPageTweet(block, recordMap) {
  return (0,external_notion_utils_.getPageProperty)('Tweet', block, recordMap);
}
;// CONCATENATED MODULE: external "isomorphic-unfetch"
var external_isomorphic_unfetch_namespaceObject = require("isomorphic-unfetch");;
var external_isomorphic_unfetch_default = /*#__PURE__*/__webpack_require__.n(external_isomorphic_unfetch_namespaceObject);
// EXTERNAL MODULE: external "p-memoize"
var external_p_memoize_ = __webpack_require__(3303);
var external_p_memoize_default = /*#__PURE__*/__webpack_require__.n(external_p_memoize_);
;// CONCATENATED MODULE: ./lib/search-notion.ts
// import ky from 'ky'



const searchNotion = external_p_memoize_default()(searchNotionImpl, {
  maxAge: 10000
});

async function searchNotionImpl(params) {
  return external_isomorphic_unfetch_default()(config/* api.searchNotion */.hi.searchNotion, {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'content-type': 'application/json'
    }
  }).then(res => {
    console.log(res);

    if (res.ok) {
      return res;
    } // convert non-2xx HTTP responses into errors


    const error = new Error(res.statusText);
    error.response = res;
    return Promise.reject(error);
  }).then(res => res.json()); // return ky
  //   .post(api.searchNotion, {
  //     json: params
  //   })
  //   .json()
}
;// CONCATENATED MODULE: ./components/CustomFont.tsx





const CustomFont = ({
  site
}) => {
  if (!site.fontFamily) {
    return null;
  } // https://developers.google.com/fonts/docs/css2


  const fontFamilies = [site.fontFamily];
  const googleFontFamilies = fontFamilies.map(font => font.replace(/ /g, '+')).map(font => `family=${font}:ital,wght@0,200..700;1,200..700`).join('&');
  const googleFontsLink = `https://fonts.googleapis.com/css?${googleFontFamilies}&display=swap`;
  const cssFontFamilies = fontFamilies.map(font => `"${font}"`).join(', ');
  return /*#__PURE__*/jsx_runtime_.jsx(jsx_runtime_.Fragment, {
    children: /*#__PURE__*/(0,jsx_runtime_.jsxs)((head_default()), {
      children: [/*#__PURE__*/jsx_runtime_.jsx("link", {
        rel: "stylesheet",
        href: googleFontsLink
      }), /*#__PURE__*/jsx_runtime_.jsx("style", {
        children: `
          .notion.notion-app {
            font-family: ${cssFontFamilies}, -apple-system, BlinkMacSystemFont,
              'Song Myung', 'Segoe UI', Helvetica, 'Apple Color Emoji', Arial, sans-serif,
              'Segoe UI Emoji', 'Segoe UI Symbol';
          }
        `
      })]
    })
  });
};
// EXTERNAL MODULE: ./components/styles.module.css
var styles_module = __webpack_require__(1487);
var styles_module_default = /*#__PURE__*/__webpack_require__.n(styles_module);
;// CONCATENATED MODULE: ./components/LoadingIcon.tsx



function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }




const LoadingIcon = props => {
  const {
    className
  } = props,
        rest = _objectWithoutProperties(props, ["className"]);

  return /*#__PURE__*/(0,jsx_runtime_.jsxs)("svg", _objectSpread(_objectSpread({
    className: external_classnames_default()((styles_module_default()).loadingIcon, className)
  }, rest), {}, {
    viewBox: "0 0 24 24",
    children: [/*#__PURE__*/jsx_runtime_.jsx("defs", {
      children: /*#__PURE__*/(0,jsx_runtime_.jsxs)("linearGradient", {
        x1: "28.1542969%",
        y1: "63.7402344%",
        x2: "74.6289062%",
        y2: "17.7832031%",
        id: "linearGradient-1",
        children: [/*#__PURE__*/jsx_runtime_.jsx("stop", {
          stopColor: "rgba(164, 164, 164, 1)",
          offset: "0%"
        }), /*#__PURE__*/jsx_runtime_.jsx("stop", {
          stopColor: "rgba(164, 164, 164, 0)",
          stopOpacity: "0",
          offset: "100%"
        })]
      })
    }), /*#__PURE__*/jsx_runtime_.jsx("g", {
      id: "Page-1",
      stroke: "none",
      strokeWidth: "1",
      fill: "none",
      children: /*#__PURE__*/jsx_runtime_.jsx("g", {
        transform: "translate(-236.000000, -286.000000)",
        children: /*#__PURE__*/(0,jsx_runtime_.jsxs)("g", {
          transform: "translate(238.000000, 286.000000)",
          children: [/*#__PURE__*/jsx_runtime_.jsx("circle", {
            id: "Oval-2",
            stroke: "url(#linearGradient-1)",
            strokeWidth: "4",
            cx: "10",
            cy: "12",
            r: "10"
          }), /*#__PURE__*/jsx_runtime_.jsx("path", {
            d: "M10,2 C4.4771525,2 0,6.4771525 0,12",
            id: "Oval-2",
            stroke: "rgba(164, 164, 164, 1)",
            strokeWidth: "4"
          }), /*#__PURE__*/jsx_runtime_.jsx("rect", {
            id: "Rectangle-1",
            fill: "rgba(164, 164, 164, 1)",
            x: "8",
            y: "0",
            width: "4",
            height: "4",
            rx: "8"
          })]
        })
      })
    })]
  }));
};
;// CONCATENATED MODULE: ./components/Loading.tsx




const Loading = () => /*#__PURE__*/jsx_runtime_.jsx("div", {
  className: (styles_module_default()).container,
  children: /*#__PURE__*/jsx_runtime_.jsx(LoadingIcon, {})
});
;// CONCATENATED MODULE: ./components/PageHead.tsx





// TODO: remove duplication between PageHead and NotionPage Head
const PageHead = ({
  site
}) => {
  return /*#__PURE__*/(0,jsx_runtime_.jsxs)((head_default()), {
    children: [/*#__PURE__*/jsx_runtime_.jsx("meta", {
      charSet: "utf-8"
    }), /*#__PURE__*/jsx_runtime_.jsx("meta", {
      httpEquiv: "Content-Type",
      content: "text/html; charset=utf-8"
    }), /*#__PURE__*/jsx_runtime_.jsx("meta", {
      name: "viewport",
      content: "width=device-width, initial-scale=1, shrink-to-fit=no"
    }), (site === null || site === void 0 ? void 0 : site.description) && /*#__PURE__*/(0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
      children: [/*#__PURE__*/jsx_runtime_.jsx("meta", {
        name: "description",
        content: site.description
      }), /*#__PURE__*/jsx_runtime_.jsx("meta", {
        property: "og:description",
        content: site.description
      })]
    }), /*#__PURE__*/jsx_runtime_.jsx("meta", {
      name: "theme-color",
      content: "#EB625A"
    }), /*#__PURE__*/jsx_runtime_.jsx("meta", {
      property: "og:type",
      content: "website"
    })]
  });
};
;// CONCATENATED MODULE: ./components/Page404.tsx







const Page404 = ({
  site,
  pageId,
  error
}) => {
  const title = (site === null || site === void 0 ? void 0 : site.name) || 'Notion Page Not Found';
  return /*#__PURE__*/(0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
    children: [/*#__PURE__*/jsx_runtime_.jsx(PageHead, {
      site: site
    }), /*#__PURE__*/(0,jsx_runtime_.jsxs)((head_default()), {
      children: [/*#__PURE__*/jsx_runtime_.jsx("meta", {
        property: "og:site_name",
        content: title
      }), /*#__PURE__*/jsx_runtime_.jsx("meta", {
        property: "og:title",
        content: title
      }), /*#__PURE__*/jsx_runtime_.jsx("title", {
        children: title
      })]
    }), /*#__PURE__*/jsx_runtime_.jsx("div", {
      className: (styles_module_default()).container,
      children: /*#__PURE__*/(0,jsx_runtime_.jsxs)("main", {
        className: (styles_module_default()).main,
        children: [/*#__PURE__*/jsx_runtime_.jsx("h1", {
          children: "Notion Page Not Found"
        }), error ? /*#__PURE__*/jsx_runtime_.jsx("p", {
          children: error.message
        }) : pageId && /*#__PURE__*/(0,jsx_runtime_.jsxs)("p", {
          children: ["Make sure that Notion page \"", pageId, "\" is publicly accessible."]
        }), /*#__PURE__*/jsx_runtime_.jsx("img", {
          src: "/404.png",
          alt: "404 Not Found",
          className: (styles_module_default()).errorImage
        })]
      })
    })]
  });
};
;// CONCATENATED MODULE: external "react-icons/io5"
var io5_namespaceObject = require("react-icons/io5");;
;// CONCATENATED MODULE: external "react-icons/ai"
var ai_namespaceObject = require("react-icons/ai");;
;// CONCATENATED MODULE: ./components/PageActions.tsx






/**
 * @see https://developer.twitter.com/en/docs/twitter-for-websites/web-intents/overview
 */

const PageActions = ({
  tweet
}) => {
  return /*#__PURE__*/(0,jsx_runtime_.jsxs)("div", {
    className: (styles_module_default()).pageActions,
    children: [/*#__PURE__*/jsx_runtime_.jsx("a", {
      className: (styles_module_default()).likeTweet,
      href: `https://twitter.com/intent/like?tweet_id=${tweet}`,
      target: "_blank",
      rel: "noopener noreferrer",
      title: "Like this post on Twitter",
      children: /*#__PURE__*/jsx_runtime_.jsx(io5_namespaceObject.IoHeartOutline, {})
    }), /*#__PURE__*/jsx_runtime_.jsx("a", {
      className: (styles_module_default()).retweet,
      href: `https://twitter.com/intent/retweet?tweet_id=${tweet}`,
      target: "_blank",
      rel: "noopener noreferrer",
      title: "Retweet this post on Twitter",
      children: /*#__PURE__*/jsx_runtime_.jsx(ai_namespaceObject.AiOutlineRetweet, {})
    })]
  });
};
;// CONCATENATED MODULE: external "react-icons/fa"
var fa_namespaceObject = require("react-icons/fa");;
;// CONCATENATED MODULE: ./components/Footer.tsx






 // TODO: merge the data and icons from PageSocial with the social links in Footer

const Footer = ({
  isDarkMode,
  toggleDarkMode
}) => {
  const [hasMounted, setHasMounted] = external_react_.useState(false);
  const toggleDarkModeCb = external_react_.useCallback(e => {
    e.preventDefault();
    toggleDarkMode();
  }, [toggleDarkMode]);
  external_react_.useEffect(() => {
    setHasMounted(true);
  }, []);
  return /*#__PURE__*/(0,jsx_runtime_.jsxs)("footer", {
    className: (styles_module_default()).footer,
    children: [/*#__PURE__*/(0,jsx_runtime_.jsxs)("div", {
      className: (styles_module_default()).copyright,
      children: ["Copyright 2021 ", config/* author */.v]
    }), hasMounted ? /*#__PURE__*/jsx_runtime_.jsx("div", {
      className: (styles_module_default()).settings,
      children: /*#__PURE__*/jsx_runtime_.jsx("a", {
        className: (styles_module_default()).toggleDarkMode,
        onClick: toggleDarkModeCb,
        title: "Tottle dark mode",
        children: isDarkMode ? /*#__PURE__*/jsx_runtime_.jsx(io5_namespaceObject.IoMoonSharp, {}) : /*#__PURE__*/jsx_runtime_.jsx(io5_namespaceObject.IoSunnyOutline, {})
      })
    }) : null, /*#__PURE__*/(0,jsx_runtime_.jsxs)("div", {
      className: (styles_module_default()).social,
      children: [config/* twitter */.km && /*#__PURE__*/jsx_runtime_.jsx("a", {
        className: (styles_module_default()).twitter,
        href: `https://twitter.com/${config/* twitter */.km}`,
        title: `Twitter @${config/* twitter */.km}`,
        target: "_blank",
        rel: "noopener noreferrer",
        children: /*#__PURE__*/jsx_runtime_.jsx(fa_namespaceObject.FaTwitter, {})
      }), config/* github */.bW && /*#__PURE__*/jsx_runtime_.jsx("a", {
        className: (styles_module_default()).github,
        href: `https://github.com/${config/* github */.bW}`,
        title: `GitHub @${config/* github */.bW}`,
        target: "_blank",
        rel: "noopener noreferrer",
        children: /*#__PURE__*/jsx_runtime_.jsx(fa_namespaceObject.FaGithub, {})
      }), config/* linkedin */.kG && /*#__PURE__*/jsx_runtime_.jsx("a", {
        className: (styles_module_default()).linkedin,
        href: `https://www.linkedin.com/in/${config/* linkedin */.kG}`,
        title: `LinkedIn ${config/* author */.v}`,
        target: "_blank",
        rel: "noopener noreferrer",
        children: /*#__PURE__*/jsx_runtime_.jsx(fa_namespaceObject.FaLinkedin, {})
      })]
    })]
  });
};
// EXTERNAL MODULE: ./components/PageSocial.module.css
var PageSocial_module = __webpack_require__(2539);
var PageSocial_module_default = /*#__PURE__*/__webpack_require__.n(PageSocial_module);
;// CONCATENATED MODULE: ./components/PageSocial.tsx






const socialLinks = [config/* twitter */.km && {
  name: 'twitter',
  href: `https://twitter.com/${config/* twitter */.km}`,
  title: `Twitter @${config/* twitter */.km}`,
  icon: /*#__PURE__*/jsx_runtime_.jsx("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    children: /*#__PURE__*/jsx_runtime_.jsx("path", {
      d: "M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z"
    })
  })
}, config/* github */.bW && {
  name: 'github',
  href: `https://github.com/${config/* github */.bW}`,
  title: `GitHub @${config/* github */.bW}`,
  icon: /*#__PURE__*/jsx_runtime_.jsx("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    children: /*#__PURE__*/jsx_runtime_.jsx("path", {
      d: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
    })
  })
}, config/* linkedin */.kG && {
  name: 'linkedin',
  href: `https://www.linkedin.com/in/${config/* linkedin */.kG}`,
  title: `LinkedIn ${config/* author */.v}`,
  icon: /*#__PURE__*/jsx_runtime_.jsx("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    children: /*#__PURE__*/jsx_runtime_.jsx("path", {
      d: "M6.5 21.5h-5v-13h5v13zM4 6.5C2.5 6.5 1.5 5.3 1.5 4s1-2.4 2.5-2.4c1.6 0 2.5 1 2.6 2.5 0 1.4-1 2.5-2.6 2.5zm11.5 6c-1 0-2 1-2 2v7h-5v-13h5V10s1.6-1.5 4-1.5c3 0 5 2.2 5 6.3v6.7h-5v-7c0-1-1-2-2-2z"
    })
  })
}].filter(Boolean);
const PageSocial = () => {
  return /*#__PURE__*/jsx_runtime_.jsx("div", {
    className: (PageSocial_module_default()).pageSocial,
    children: socialLinks.map(action => /*#__PURE__*/(0,jsx_runtime_.jsxs)("a", {
      className: external_classnames_default()((PageSocial_module_default()).action, (PageSocial_module_default())[action.name]),
      href: action.href,
      title: action.title,
      target: "_blank",
      rel: "noopener noreferrer",
      children: [/*#__PURE__*/jsx_runtime_.jsx("div", {
        className: (PageSocial_module_default()).actionBg,
        children: /*#__PURE__*/jsx_runtime_.jsx("div", {
          className: (PageSocial_module_default()).actionBgPane
        })
      }), /*#__PURE__*/jsx_runtime_.jsx("div", {
        className: (PageSocial_module_default()).actionBg,
        children: action.icon
      })]
    }, action.name))
  });
};
;// CONCATENATED MODULE: ./components/ReactUtterances.tsx


function ReactUtterances_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class ReactUtterances extends (external_react_default()).Component {
  constructor(props) {
    super(props);

    ReactUtterances_defineProperty(this, "reference", void 0);

    ReactUtterances_defineProperty(this, "scriptElement", void 0);

    if (props.issueMap === 'issue-term' && props.issueTerm === undefined) {
      throw Error("Property 'issueTerm' must be provided with issueMap 'issue-term'");
    }

    if (props.issueMap === 'issue-number' && props.issueNumber === undefined) {
      throw Error("Property 'issueNumber' must be provided with issueMap 'issue-number'");
    }

    this.reference = /*#__PURE__*/external_react_default().createRef();
    this.state = {
      pending: true
    };
  }

  UNSAFE_componentWillReceiveProps(props) {
    // this.scriptElement.setAttribute('theme', props.theme)
    const iframe = document.querySelector('iframe.utterances-frame');

    if (iframe) {
      iframe.contentWindow.postMessage({
        type: 'set-theme',
        theme: props.theme
      }, 'https://utteranc.es/');
    }
  }

  componentDidMount() {
    const {
      repo,
      issueMap,
      issueTerm,
      issueNumber,
      label,
      theme
    } = this.props;
    const scriptElement = document.createElement('script');
    scriptElement.src = 'https://utteranc.es/client.js';
    scriptElement.async = true;
    scriptElement.defer = true;
    scriptElement.setAttribute('repo', repo);
    scriptElement.setAttribute('crossorigin', 'annonymous');
    scriptElement.setAttribute('theme', theme);

    scriptElement.onload = () => this.setState({
      pending: false
    });

    if (label) {
      scriptElement.setAttribute('label', label);
    }

    if (issueMap === 'issue-number') {
      scriptElement.setAttribute('issue-number', issueNumber.toString());
    } else if (issueMap === 'issue-term') {
      scriptElement.setAttribute('issue-term', issueTerm);
    } else {
      scriptElement.setAttribute('issue-term', issueMap);
    } // TODO: Check current availability


    this.scriptElement = scriptElement;
    this.reference.current.appendChild(scriptElement);
  }

  render() {
    return /*#__PURE__*/jsx_runtime_.jsx("div", {
      className: (styles_module_default()).comments,
      children: /*#__PURE__*/jsx_runtime_.jsx("div", {
        className: (styles_module_default()).utterances,
        ref: this.reference,
        children: this.state.pending && /*#__PURE__*/jsx_runtime_.jsx("p", {
          children: "Loading Comments..."
        })
      })
    });
  }

}
;// CONCATENATED MODULE: ./components/NotionPage.tsx




function NotionPage_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function NotionPage_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { NotionPage_ownKeys(Object(source), true).forEach(function (key) { NotionPage_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { NotionPage_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function NotionPage_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function NotionPage_objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = NotionPage_objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function NotionPage_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }










 // core notion renderer

 // utils







 // components







 // import { GitHubShareButton } from './GitHubShareButton'


 // const Code = dynamic(() =>
//   import('react-notion-x').then((notion) => notion.Code)
// )
//
// const Collection = dynamic(() =>
//   import('react-notion-x').then((notion) => notion.Collection)
// )
//
// const CollectionRow = dynamic(
//   () => import('react-notion-x').then((notion) => notion.CollectionRow),
//   {
//     ssr: false
//   }
// )

const Pdf = dynamic_default()(() => Promise.resolve(/* import() */).then(__webpack_require__.t.bind(__webpack_require__, 761, 23)).then(notion => notion.Pdf), {
  loadableGenerated: {
    webpack: () => [/*require.resolve*/(761)],
    modules: ["..\\components\\NotionPage.tsx -> " + 'react-notion-x']
  }
});
const Equation = dynamic_default()(() => Promise.resolve(/* import() */).then(__webpack_require__.t.bind(__webpack_require__, 761, 23)).then(notion => notion.Equation), {
  loadableGenerated: {
    webpack: () => [/*require.resolve*/(761)],
    modules: ["..\\components\\NotionPage.tsx -> " + 'react-notion-x']
  }
}); // we're now using a much lighter-weight tweet renderer react-static-tweets
// instead of the official iframe-based embed widget from twitter
// const Tweet = dynamic(() => import('react-tweet-embed'))

const Modal = dynamic_default()(() => Promise.resolve(/* import() */).then(__webpack_require__.t.bind(__webpack_require__, 761, 23)).then(notion => notion.Modal), {
  ssr: false,
  loadableGenerated: {
    webpack: () => [/*require.resolve*/(761)],
    modules: ["..\\components\\NotionPage.tsx -> " + 'react-notion-x']
  }
});
const NotionPage = ({
  site,
  recordMap,
  error,
  pageId
}) => {
  var _recordMap$block, _recordMap$block$keys, _format, _getPageDescription;

  const router = (0,router_.useRouter)();
  const lite = (0,external_react_use_namespaceObject.useSearchParam)('lite');
  const params = {};
  if (lite) params.lite = lite; // lite mode is for oembed

  const isLiteMode = lite === 'true';
  const searchParams = new URLSearchParams(params);
  const darkMode = external_use_dark_mode_default()(false, {
    classNameDark: 'dark-mode'
  });

  if (router.isFallback) {
    return /*#__PURE__*/jsx_runtime_.jsx(Loading, {});
  }

  const keys = Object.keys((recordMap === null || recordMap === void 0 ? void 0 : recordMap.block) || {});
  const block = recordMap === null || recordMap === void 0 ? void 0 : (_recordMap$block = recordMap.block) === null || _recordMap$block === void 0 ? void 0 : (_recordMap$block$keys = _recordMap$block[keys[0]]) === null || _recordMap$block$keys === void 0 ? void 0 : _recordMap$block$keys.value;

  if (error || !site || !keys.length || !block) {
    return /*#__PURE__*/jsx_runtime_.jsx(Page404, {
      site: site,
      pageId: pageId,
      error: error
    });
  }

  const title = (0,external_notion_utils_.getBlockTitle)(block, recordMap) || site.name;
  let head_html = "";

  let code = /*#__PURE__*/jsx_runtime_.jsx(external_react_notion_x_.NotionRenderer, {
    recordMap: recordMap,
    components: {
      code: external_react_notion_x_.Code
    }
  });

  Object.entries(code.props.recordMap.block).map(([id, value]) => {
    console.log(id, '=', value);
    let current_value = value.value;

    if (current_value.type === 'code' && current_value.properties.language[0][0] === 'BASIC') {
      console.log('converting...');
      console.log(current_value.properties.language);
      current_value.type = 'embed';
      const embed_size = current_value.properties.caption[0][0].split(',');
      Object.assign(current_value, {
        format: {
          block_width: Number(embed_size[0]),
          block_height: Number(embed_size[1])
        }
      });
      current_value.properties.title.unshift(['data:text/html;charset=utf-8,']);
      current_value.properties = {
        source: [[current_value.properties.title.join('')]]
      };
      console.log('(after)', id, '=', value);
    }

    if (current_value.type === 'code' && current_value.properties.language[0][0] === 'Visual Basic') {
      console.log('converting...');
      head_html += current_value.properties.title.join();
      current_value.type = 'untype';
    }

    if (current_value.type === 'embed' && current_value.properties !== undefined) {
      console.log('embed properties = ', current_value.properties);
    }
  }); // console.log('notion page', {
  //   isDev: config.isDev,
  //   title,
  //   pageId,
  //   rootNotionPageId: site.rootNotionPageId,
  //   isRootPage: pageId === site.rootNotionPageId,
  //   recordMap,
  //   code: (code.props.recordMap),
  // })

  if (!config/* isServer */.sk) {
    // add important objects to the window global for easy debugging
    const g = window;
    g.pageId = pageId;
    g.recordMap = recordMap;
    g.block = block;
  }

  const siteMapPageUrl = mapPageUrl(site, recordMap, searchParams);
  const canonicalPageUrl = !config/* isDev */.r8 && getCanonicalPageUrl(site, recordMap)(pageId);
  const isRootPage = pageId === site.rootNotionPageId;
  const isBlogPost = block.type === 'page' && block.parent_table === 'collection';
  const showTableOfContents = !!isBlogPost;
  const minTableOfContentsItems = 3;
  const socialImage = (0,map_image_url/* mapNotionImageUrl */.J)(((_format = block.format) === null || _format === void 0 ? void 0 : _format.page_cover) || config/* defaultPageCover */.yN, block);
  const socialDescription = (_getPageDescription = getPageDescription(block, recordMap)) !== null && _getPageDescription !== void 0 ? _getPageDescription : config/* description */.WL;
  let comments = null;
  let pageAside = null; // only display comments and page actions on blog post pages

  if (isBlogPost) {
    if (config/* utterancesGitHubRepo */.hV) {
      comments = /*#__PURE__*/jsx_runtime_.jsx(ReactUtterances, {
        repo: config/* utterancesGitHubRepo */.hV,
        issueMap: "issue-term",
        issueTerm: "title",
        theme: darkMode.value ? 'photon-dark' : 'github-light'
      });
    }

    const tweet = getPageTweet(block, recordMap);

    if (tweet) {
      pageAside = /*#__PURE__*/jsx_runtime_.jsx(PageActions, {
        tweet: tweet
      });
    }
  } else {
    pageAside = /*#__PURE__*/jsx_runtime_.jsx(PageSocial, {});
  }

  return /*#__PURE__*/(0,jsx_runtime_.jsxs)(external_react_static_tweets_namespaceObject.TwitterContextProvider, {
    value: {
      tweetAstMap: recordMap.tweetAstMap || {},
      swrOptions: {
        fetcher: id => fetch(`/api/get-tweet-ast/${id}`).then(r => r.json())
      }
    },
    children: [/*#__PURE__*/jsx_runtime_.jsx(PageHead, {
      site: site
    }), /*#__PURE__*/(0,jsx_runtime_.jsxs)((head_default()), {
      children: [/*#__PURE__*/jsx_runtime_.jsx("meta", {
        property: "og:title",
        content: title
      }), /*#__PURE__*/jsx_runtime_.jsx("meta", {
        property: "og:site_name",
        content: site.name
      }), /*#__PURE__*/jsx_runtime_.jsx("meta", {
        name: "twitter:title",
        content: title
      }), /*#__PURE__*/jsx_runtime_.jsx("meta", {
        property: "twitter:domain",
        content: site.domain
      }), isRootPage && /*#__PURE__*/jsx_runtime_.jsx("link", {
        rel: "stylesheet",
        href: "/main_background.css"
      }), config/* twitter */.km && /*#__PURE__*/jsx_runtime_.jsx("meta", {
        name: "twitter:creator",
        content: `@${config/* twitter */.km}`
      }), socialDescription && /*#__PURE__*/(0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
        children: [/*#__PURE__*/jsx_runtime_.jsx("meta", {
          name: "description",
          content: socialDescription
        }), /*#__PURE__*/jsx_runtime_.jsx("meta", {
          property: "og:description",
          content: socialDescription
        }), /*#__PURE__*/jsx_runtime_.jsx("meta", {
          name: "twitter:description",
          content: socialDescription
        })]
      }), socialImage ? /*#__PURE__*/(0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
        children: [/*#__PURE__*/jsx_runtime_.jsx("meta", {
          name: "twitter:card",
          content: "summary_large_image"
        }), /*#__PURE__*/jsx_runtime_.jsx("meta", {
          name: "twitter:image",
          content: socialImage
        }), /*#__PURE__*/jsx_runtime_.jsx("meta", {
          property: "og:image",
          content: socialImage
        })]
      }) : /*#__PURE__*/jsx_runtime_.jsx("meta", {
        name: "twitter:card",
        content: "summary"
      }), canonicalPageUrl && /*#__PURE__*/(0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
        children: [/*#__PURE__*/jsx_runtime_.jsx("link", {
          rel: "canonical",
          href: canonicalPageUrl
        }), /*#__PURE__*/jsx_runtime_.jsx("meta", {
          property: "og:url",
          content: canonicalPageUrl
        }), /*#__PURE__*/jsx_runtime_.jsx("meta", {
          property: "twitter:url",
          content: canonicalPageUrl
        })]
      }), /*#__PURE__*/jsx_runtime_.jsx("title", {
        children: title
      })]
    }), /*#__PURE__*/jsx_runtime_.jsx("div", {
      id: "head_html",
      dangerouslySetInnerHTML: {
        __html: head_html
      }
    }), /*#__PURE__*/jsx_runtime_.jsx(CustomFont, {
      site: site
    }), isLiteMode && /*#__PURE__*/jsx_runtime_.jsx((external_react_body_classname_default()), {
      className: "notion-lite"
    }), /*#__PURE__*/jsx_runtime_.jsx(external_react_notion_x_.NotionRenderer, {
      bodyClassName: external_classnames_default()((styles_module_default()).notion, pageId === site.rootNotionPageId && 'index-page'),
      components: {
        pageLink: (_ref) => {
          let {
            href,
            as,
            passHref,
            prefetch,
            replace,
            scroll,
            shallow,
            locale
          } = _ref,
              props = NotionPage_objectWithoutProperties(_ref, ["href", "as", "passHref", "prefetch", "replace", "scroll", "shallow", "locale"]);

          return /*#__PURE__*/jsx_runtime_.jsx(next_link.default, {
            href: href,
            as: as,
            passHref: passHref,
            prefetch: prefetch,
            replace: replace,
            scroll: scroll,
            shallow: shallow,
            locale: locale,
            children: /*#__PURE__*/jsx_runtime_.jsx("a", NotionPage_objectSpread({}, props))
          });
        },
        code: external_react_notion_x_.Code,
        collection: external_react_notion_x_.Collection,
        collectionRow: external_react_notion_x_.CollectionRow,
        tweet: external_react_static_tweets_namespaceObject.Tweet,
        modal: Modal,
        pdf: Pdf,
        equation: Equation
      },
      recordMap: recordMap,
      rootPageId: site.rootNotionPageId,
      fullPage: !isLiteMode,
      darkMode: darkMode.value,
      previewImages: site.previewImages !== false,
      showCollectionViewDropdown: false,
      showTableOfContents: showTableOfContents,
      minTableOfContentsItems: minTableOfContentsItems,
      defaultPageIcon: config/* defaultPageIcon */.SH,
      defaultPageCover: config/* defaultPageCover */.yN,
      defaultPageCoverPosition: config/* defaultPageCoverPosition */.Wx,
      mapPageUrl: siteMapPageUrl,
      mapImageUrl: map_image_url/* mapNotionImageUrl */.J,
      searchNotion: searchNotion,
      pageFooter: comments,
      pageAside: pageAside,
      footer: /*#__PURE__*/jsx_runtime_.jsx(Footer, {
        isDarkMode: darkMode.value,
        toggleDarkMode: darkMode.toggle
      })
    })]
  });
};
;// CONCATENATED MODULE: ./components/ErrorPage.tsx







const ErrorPage = ({
  statusCode
}) => {
  const title = 'Error';
  return /*#__PURE__*/(0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
    children: [/*#__PURE__*/jsx_runtime_.jsx(PageHead, {}), /*#__PURE__*/(0,jsx_runtime_.jsxs)((head_default()), {
      children: [/*#__PURE__*/jsx_runtime_.jsx("meta", {
        property: "og:site_name",
        content: title
      }), /*#__PURE__*/jsx_runtime_.jsx("meta", {
        property: "og:title",
        content: title
      }), /*#__PURE__*/jsx_runtime_.jsx("title", {
        children: title
      })]
    }), /*#__PURE__*/jsx_runtime_.jsx("div", {
      className: (styles_module_default()).container,
      children: /*#__PURE__*/(0,jsx_runtime_.jsxs)("main", {
        className: (styles_module_default()).main,
        children: [/*#__PURE__*/jsx_runtime_.jsx("h1", {
          children: "Error Loading Page"
        }), statusCode && /*#__PURE__*/(0,jsx_runtime_.jsxs)("p", {
          children: ["Error code: ", statusCode]
        }), /*#__PURE__*/jsx_runtime_.jsx("img", {
          src: "/error.png",
          alt: "Error",
          className: (styles_module_default()).errorImage
        })]
      })
    })]
  });
};
;// CONCATENATED MODULE: ./components/index.ts




/***/ }),

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

/***/ 8738:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "S": function() { return /* binding */ getCanonicalPageId; }
/* harmony export */ });
/* harmony import */ var notion_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1235);
/* harmony import */ var notion_utils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(notion_utils__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7355);


function getCanonicalPageId(pageId, recordMap, {
  uuid = true
} = {}) {
  const cleanPageId = (0,notion_utils__WEBPACK_IMPORTED_MODULE_0__.parsePageId)(pageId, {
    uuid: false
  });

  if (!cleanPageId) {
    return null;
  }

  const override = _config__WEBPACK_IMPORTED_MODULE_1__/* .inversePageUrlOverrides */ .JN[cleanPageId];

  if (override) {
    return override;
  } else {
    return (0,notion_utils__WEBPACK_IMPORTED_MODULE_0__.getCanonicalPageId)(pageId, recordMap, {
      uuid
    });
  }
}

/***/ }),

/***/ 8911:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Y": function() { return /* binding */ getSiteForDomain; }
/* harmony export */ });
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7355);

const getSiteForDomain = async (domain) => {
  return {
    domain,
    name: _config__WEBPACK_IMPORTED_MODULE_0__/* .name */ .u2,
    rootNotionPageId: _config__WEBPACK_IMPORTED_MODULE_0__/* .rootNotionPageId */ .AM,
    rootNotionSpaceId: _config__WEBPACK_IMPORTED_MODULE_0__/* .rootNotionSpaceId */ .bY,
    description: _config__WEBPACK_IMPORTED_MODULE_0__/* .description */ .WL
  };
};

/***/ }),

/***/ 5717:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "g": function() { return /* binding */ getSiteMaps; }
});

// EXTERNAL MODULE: external "p-map"
var external_p_map_ = __webpack_require__(8665);
var external_p_map_default = /*#__PURE__*/__webpack_require__.n(external_p_map_);
// EXTERNAL MODULE: external "p-memoize"
var external_p_memoize_ = __webpack_require__(3303);
var external_p_memoize_default = /*#__PURE__*/__webpack_require__.n(external_p_memoize_);
// EXTERNAL MODULE: external "notion-utils"
var external_notion_utils_ = __webpack_require__(1235);
// EXTERNAL MODULE: ./lib/config.ts + 1 modules
var config = __webpack_require__(7355);
// EXTERNAL MODULE: ./lib/notion.ts + 7 modules
var notion = __webpack_require__(6487);
// EXTERNAL MODULE: ./lib/get-canonical-page-id.ts
var get_canonical_page_id = __webpack_require__(8738);
;// CONCATENATED MODULE: ./lib/get-all-pages.ts
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }






const uuid = !!config/* includeNotionIdInUrls */.IT;
const getAllPages = external_p_memoize_default()(getAllPagesImpl, {
  maxAge: 60000 * 5
});
async function getAllPagesImpl(rootNotionPageId, rootNotionSpaceId) {
  const pageMap = await (0,external_notion_utils_.getAllPagesInSpace)(rootNotionPageId, rootNotionSpaceId, notion/* notion.getPage.bind */.R5.getPage.bind(notion/* notion */.R5));
  const canonicalPageMap = Object.keys(pageMap).reduce((map, pageId) => {
    const recordMap = pageMap[pageId];

    if (!recordMap) {
      throw new Error(`Error loading page "${pageId}"`);
    }

    const canonicalPageId = (0,get_canonical_page_id/* getCanonicalPageId */.S)(pageId, recordMap, {
      uuid
    });

    if (map[canonicalPageId]) {
      console.error('error duplicate canonical page id', canonicalPageId, pageId, map[canonicalPageId]);
      return map;
    } else {
      return _objectSpread(_objectSpread({}, map), {}, {
        [canonicalPageId]: pageId
      });
    }
  }, {});
  return {
    pageMap,
    canonicalPageMap
  };
}
// EXTERNAL MODULE: ./lib/get-site-for-domain.ts
var get_site_for_domain = __webpack_require__(8911);
;// CONCATENATED MODULE: ./lib/get-sites.ts


async function getSites() {
  return [await (0,get_site_for_domain/* getSiteForDomain */.Y)(config/* domain */.nw)];
}
;// CONCATENATED MODULE: ./lib/get-site-maps.ts
function get_site_maps_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function get_site_maps_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { get_site_maps_ownKeys(Object(source), true).forEach(function (key) { get_site_maps_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { get_site_maps_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function get_site_maps_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




async function getSiteMaps() {
  const sites = await getSites();
  const siteMaps = await external_p_map_default()(sites, async (site, index) => {
    try {
      console.log('getSiteMap', `${index + 1}/${sites.length}`, `(${(index + 1) / sites.length * 100 | 0}%)`, site);
      return get_site_maps_objectSpread({
        site
      }, await getAllPages(site.rootNotionPageId, site.rootNotionSpaceId));
    } catch (err) {
      console.warn('site build error', index, site, err);
    }
  }, {
    concurrency: 4
  });
  return siteMaps.filter(Boolean);
}

/***/ }),

/***/ 1163:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "J": function() { return /* binding */ mapNotionImageUrl; }
/* harmony export */ });
/* unused harmony export mapImageUrl */
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7355);

const mapNotionImageUrl = (url, block) => {
  if (!url) {
    return null;
  }

  if (url.startsWith('data:')) {
    return url;
  }

  if (_config__WEBPACK_IMPORTED_MODULE_0__/* .imageCDNHost */ .EN && url.startsWith(_config__WEBPACK_IMPORTED_MODULE_0__/* .imageCDNHost */ .EN)) {
    return url;
  } // const origUrl = url


  if (url.startsWith('/images')) {
    url = `https://www.notion.so${url}`;
  } // more recent versions of notion don't proxy unsplash images


  if (!url.startsWith('https://images.unsplash.com')) {
    url = `https://www.notion.so${url.startsWith('/image') ? url : `/image/${encodeURIComponent(url)}`}`;
    const notionImageUrlV2 = new URL(url);
    let table = block.parent_table === 'space' ? 'block' : block.parent_table;

    if (table === 'collection') {
      table = 'block';
    }

    notionImageUrlV2.searchParams.set('table', table);
    notionImageUrlV2.searchParams.set('id', block.id);
    notionImageUrlV2.searchParams.set('cache', 'v2');
    url = notionImageUrlV2.toString();
  } // console.log({ url, origUrl })


  return mapImageUrl(url);
};
const mapImageUrl = imageUrl => {
  if (imageUrl.startsWith('data:')) {
    return imageUrl;
  }

  if (_config__WEBPACK_IMPORTED_MODULE_0__/* .imageCDNHost */ .EN) {
    // Our proxy uses Cloudflare's global CDN to cache these image assets
    return `${_config__WEBPACK_IMPORTED_MODULE_0__/* .imageCDNHost */ .EN}/${encodeURIComponent(imageUrl)}`;
  } else {
    return imageUrl;
  }
};

/***/ }),

/***/ 6487:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "fx": function() { return /* binding */ getPage; },
  "R5": function() { return /* binding */ notion; }
});

// UNUSED EXPORTS: search

;// CONCATENATED MODULE: external "notion-client"
var external_notion_client_namespaceObject = require("notion-client");;
;// CONCATENATED MODULE: external "crypto"
var external_crypto_namespaceObject = require("crypto");;
var external_crypto_default = /*#__PURE__*/__webpack_require__.n(external_crypto_namespaceObject);
;// CONCATENATED MODULE: external "got"
var external_got_namespaceObject = require("got");;
var external_got_default = /*#__PURE__*/__webpack_require__.n(external_got_namespaceObject);
// EXTERNAL MODULE: external "p-map"
var external_p_map_ = __webpack_require__(8665);
var external_p_map_default = /*#__PURE__*/__webpack_require__.n(external_p_map_);
// EXTERNAL MODULE: ./lib/config.ts + 1 modules
var config = __webpack_require__(7355);
;// CONCATENATED MODULE: external "@google-cloud/firestore"
var firestore_namespaceObject = require("@google-cloud/firestore");;
;// CONCATENATED MODULE: ./lib/db.ts


let db = null;
let db_images = null;

if (config/* isPreviewImageSupportEnabled */.K6) {
  db = new firestore_namespaceObject.Firestore({
    projectId: config/* googleProjectId */.tk,
    credentials: config/* googleApplicationCredentials */.M1
  });
  db_images = db.collection(config/* firebaseCollectionImages */.D8);
}
;// CONCATENATED MODULE: ./lib/get-preview-images.ts
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }







function sha256(input) {
  const buffer = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return external_crypto_default().createHash('sha256').update(buffer).digest('hex');
}

async function getPreviewImages(images) {
  if (!config/* isPreviewImageSupportEnabled */.K6) {
    return {};
  }

  const imageDocRefs = images.map(url => {
    const id = sha256(url);
    return db_images.doc(id);
  });

  if (!imageDocRefs.length) {
    return {};
  }

  const imageDocs = await db.getAll(...imageDocRefs);
  const results = await external_p_map_default()(imageDocs, async (model, index) => {
    if (model.exists) {
      return model.data();
    } else {
      const json = {
        url: images[index],
        id: model.id
      };
      console.log('createPreviewImage server-side', json); // TODO: should we fire and forget here to speed up builds?

      return external_got_default().post(config/* api.createPreviewImage */.hi.createPreviewImage, {
        json
      }).json();
    }
  });
  return results.filter(Boolean).filter(image => !image.error).reduce((acc, result) => _objectSpread(_objectSpread({}, acc), {}, {
    [result.url]: result
  }), {});
}
// EXTERNAL MODULE: ./lib/map-image-url.ts
var map_image_url = __webpack_require__(1163);
;// CONCATENATED MODULE: external "static-tweets"
var external_static_tweets_namespaceObject = require("static-tweets");;
;// CONCATENATED MODULE: ./lib/notion.ts
function notion_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function notion_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { notion_ownKeys(Object(source), true).forEach(function (key) { notion_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { notion_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function notion_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }






const notion = new external_notion_client_namespaceObject.NotionAPI({
  apiBaseUrl: process.env.NOTION_API_BASE_URL
});
async function getPage(pageId) {
  const recordMap = await notion.getPage(pageId);
  const blockIds = Object.keys(recordMap.block);
  const imageUrls = blockIds.map(blockId => {
    var _recordMap$block$bloc;

    const block = (_recordMap$block$bloc = recordMap.block[blockId]) === null || _recordMap$block$bloc === void 0 ? void 0 : _recordMap$block$bloc.value;

    if (block) {
      var _block$format;

      if (block.type === 'image') {
        var _block$properties, _block$properties$sou, _block$properties$sou2;

        const source = (_block$properties = block.properties) === null || _block$properties === void 0 ? void 0 : (_block$properties$sou = _block$properties.source) === null || _block$properties$sou === void 0 ? void 0 : (_block$properties$sou2 = _block$properties$sou[0]) === null || _block$properties$sou2 === void 0 ? void 0 : _block$properties$sou2[0];

        if (source) {
          return {
            block,
            url: source
          };
        }
      }

      if ((_block$format = block.format) !== null && _block$format !== void 0 && _block$format.page_cover) {
        const source = block.format.page_cover;
        return {
          block,
          url: source
        };
      }
    }

    return null;
  }).filter(Boolean).map(({
    block,
    url
  }) => (0,map_image_url/* mapNotionImageUrl */.J)(url, block)).filter(Boolean);
  const urls = Array.from(new Set(imageUrls));
  const previewImageMap = await getPreviewImages(urls);
  recordMap.preview_images = previewImageMap;
  const tweetIds = blockIds.map(blockId => {
    var _recordMap$block$bloc2;

    const block = (_recordMap$block$bloc2 = recordMap.block[blockId]) === null || _recordMap$block$bloc2 === void 0 ? void 0 : _recordMap$block$bloc2.value;

    if (block) {
      if (block.type === 'tweet') {
        var _block$properties2, _block$properties2$so, _block$properties2$so2;

        const src = (_block$properties2 = block.properties) === null || _block$properties2 === void 0 ? void 0 : (_block$properties2$so = _block$properties2.source) === null || _block$properties2$so === void 0 ? void 0 : (_block$properties2$so2 = _block$properties2$so[0]) === null || _block$properties2$so2 === void 0 ? void 0 : _block$properties2$so2[0];

        if (src) {
          const id = src.split('?')[0].split('/').pop();
          if (id) return id;
        }
      }
    }

    return null;
  }).filter(Boolean);
  const tweetAsts = await external_p_map_default()(tweetIds, async tweetId => {
    try {
      return {
        tweetId,
        tweetAst: await (0,external_static_tweets_namespaceObject.fetchTweetAst)(tweetId)
      };
    } catch (err) {
      console.error('error fetching tweet info', tweetId, err);
    }
  }, {
    concurrency: 4
  });
  const tweetAstMap = tweetAsts.reduce((acc, {
    tweetId,
    tweetAst
  }) => {
    if (tweetAst) {
      return notion_objectSpread(notion_objectSpread({}, acc), {}, {
        [tweetId]: tweetAst
      });
    } else {
      return acc;
    }
  }, {});
  recordMap.tweetAstMap = tweetAstMap;
  return recordMap;
}
async function search(params) {
  return notion.search(params);
}

/***/ }),

/***/ 1412:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "g": function() { return /* binding */ resolveNotionPage; }
});

// EXTERNAL MODULE: external "notion-utils"
var external_notion_utils_ = __webpack_require__(1235);
;// CONCATENATED MODULE: ./lib/acl.ts
async function pageAcl({
  site,
  recordMap,
  pageId
}) {
  var _recordMap$block$root;

  if (!site) {
    return {
      error: {
        statusCode: 404,
        message: 'Unable to resolve notion site'
      }
    };
  }

  if (!recordMap) {
    return {
      error: {
        statusCode: 404,
        message: `Unable to resolve page for domain "${site.domain}". Notion page "${pageId}" not found.`
      }
    };
  }

  const keys = Object.keys(recordMap.block);
  const rootKey = keys[0];

  if (!rootKey) {
    return {
      error: {
        statusCode: 404,
        message: `Unable to resolve page for domain "${site.domain}". Notion page "${pageId}" invalid data.`
      }
    };
  }

  const rootValue = (_recordMap$block$root = recordMap.block[rootKey]) === null || _recordMap$block$root === void 0 ? void 0 : _recordMap$block$root.value;
  const rootSpaceId = rootValue === null || rootValue === void 0 ? void 0 : rootValue.space_id;

  if (rootSpaceId && site.rootNotionSpaceId && rootSpaceId !== site.rootNotionSpaceId) {
    if (true) {
      return {
        error: {
          statusCode: 404,
          message: `Notion page "${pageId}" doesn't belong to the Notion workspace owned by "${site.domain}".`
        }
      };
    }
  }
}
// EXTERNAL MODULE: ./lib/config.ts + 1 modules
var config = __webpack_require__(7355);
// EXTERNAL MODULE: ./lib/notion.ts + 7 modules
var notion = __webpack_require__(6487);
// EXTERNAL MODULE: ./lib/get-site-maps.ts + 2 modules
var get_site_maps = __webpack_require__(5717);
// EXTERNAL MODULE: ./lib/get-site-for-domain.ts
var get_site_for_domain = __webpack_require__(8911);
;// CONCATENATED MODULE: ./lib/resolve-notion-page.ts
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }







async function resolveNotionPage(domain, rawPageId) {
  let site;
  let pageId;
  let recordMap;

  if (rawPageId && rawPageId !== 'index') {
    pageId = (0,external_notion_utils_.parsePageId)(rawPageId);

    if (!pageId) {
      // check if the site configuration provides an override of a fallback for
      // the page's URI
      const override = config/* pageUrlOverrides */._w[rawPageId] || config/* pageUrlAdditions */.mH[rawPageId];

      if (override) {
        pageId = (0,external_notion_utils_.parsePageId)(override);
      }
    }

    if (pageId) {
      const resources = await Promise.all([(0,get_site_for_domain/* getSiteForDomain */.Y)(domain), (0,notion/* getPage */.fx)(pageId)]);
      site = resources[0];
      recordMap = resources[1];
    } else {
      // handle mapping of user-friendly canonical page paths to Notion page IDs
      // e.g., /developer-x-entrepreneur versus /71201624b204481f862630ea25ce62fe
      const siteMaps = await (0,get_site_maps/* getSiteMaps */.g)();
      const siteMap = siteMaps[0];
      pageId = siteMap === null || siteMap === void 0 ? void 0 : siteMap.canonicalPageMap[rawPageId];

      if (pageId) {
        // TODO: we're not re-using the site from siteMaps because it is
        // cached aggressively
        // site = await getSiteForDomain(domain)
        // recordMap = siteMap.pageMap[pageId]
        const resources = await Promise.all([(0,get_site_for_domain/* getSiteForDomain */.Y)(domain), (0,notion/* getPage */.fx)(pageId)]);
        site = resources[0];
        recordMap = resources[1];
      } else {
        return {
          error: {
            message: `Not found "${rawPageId}"`,
            statusCode: 404
          }
        };
      }
    }
  } else {
    site = await (0,get_site_for_domain/* getSiteForDomain */.Y)(domain);
    pageId = site.rootNotionPageId;
    console.log(site);
    recordMap = await (0,notion/* getPage */.fx)(pageId);
  }

  const props = {
    site,
    recordMap,
    pageId
  };
  return _objectSpread(_objectSpread({}, props), await pageAcl(props));
}

/***/ }),

/***/ 6071:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
var __webpack_unused_export__;


var _interopRequireWildcard = __webpack_require__(862);

__webpack_unused_export__ = true;
exports.default = void 0;

var _react = _interopRequireWildcard(__webpack_require__(9297));

var _router = __webpack_require__(1689);

var _router2 = __webpack_require__(2441);

var _useIntersection = __webpack_require__(5749);

const prefetched = {};

function prefetch(router, href, as, options) {
  if (true) return;
  if (!(0, _router.isLocalURL)(href)) return; // Prefetch the JSON page if asked (only in the client)
  // We need to handle a prefetch error here since we may be
  // loading with priority which can reject but we don't
  // want to force navigation since this is only a prefetch

  router.prefetch(href, as, options).catch(err => {
    if (false) {}
  });
  const curLocale = options && typeof options.locale !== 'undefined' ? options.locale : router && router.locale; // Join on an invalid URI character

  prefetched[href + '%' + as + (curLocale ? '%' + curLocale : '')] = true;
}

function isModifiedEvent(event) {
  const {
    target
  } = event.currentTarget;
  return target && target !== '_self' || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || // triggers resource download
  event.nativeEvent && event.nativeEvent.which === 2;
}

function linkClicked(e, router, href, as, replace, shallow, scroll, locale) {
  const {
    nodeName
  } = e.currentTarget;

  if (nodeName === 'A' && (isModifiedEvent(e) || !(0, _router.isLocalURL)(href))) {
    // ignore click for browser’s default behavior
    return;
  }

  e.preventDefault(); //  avoid scroll for urls with anchor refs

  if (scroll == null) {
    scroll = as.indexOf('#') < 0;
  } // replace state instead of push if prop is present


  router[replace ? 'replace' : 'push'](href, as, {
    shallow,
    locale,
    scroll
  });
}

function Link(props) {
  if (false) {}

  const p = props.prefetch !== false;
  const router = (0, _router2.useRouter)();
  const pathname = router && router.pathname || '/';

  const {
    href,
    as
  } = _react.default.useMemo(() => {
    const [resolvedHref, resolvedAs] = (0, _router.resolveHref)(pathname, props.href, true);
    return {
      href: resolvedHref,
      as: props.as ? (0, _router.resolveHref)(pathname, props.as) : resolvedAs || resolvedHref
    };
  }, [pathname, props.href, props.as]);

  let {
    children,
    replace,
    shallow,
    scroll,
    locale
  } = props; // Deprecated. Warning shown by propType check. If the children provided is a string (<Link>example</Link>) we wrap it in an <a> tag

  if (typeof children === 'string') {
    children = /*#__PURE__*/_react.default.createElement("a", null, children);
  } // This will return the first child, if multiple are provided it will throw an error


  const child = _react.Children.only(children);

  const childRef = child && typeof child === 'object' && child.ref;
  const [setIntersectionRef, isVisible] = (0, _useIntersection.useIntersection)({
    rootMargin: '200px'
  });

  const setRef = _react.default.useCallback(el => {
    setIntersectionRef(el);

    if (childRef) {
      if (typeof childRef === 'function') childRef(el);else if (typeof childRef === 'object') {
        childRef.current = el;
      }
    }
  }, [childRef, setIntersectionRef]);

  (0, _react.useEffect)(() => {
    const shouldPrefetch = isVisible && p && (0, _router.isLocalURL)(href);
    const curLocale = typeof locale !== 'undefined' ? locale : router && router.locale;
    const isPrefetched = prefetched[href + '%' + as + (curLocale ? '%' + curLocale : '')];

    if (shouldPrefetch && !isPrefetched) {
      prefetch(router, href, as, {
        locale: curLocale
      });
    }
  }, [as, href, isVisible, locale, p, router]);
  const childProps = {
    ref: setRef,
    onClick: e => {
      if (child.props && typeof child.props.onClick === 'function') {
        child.props.onClick(e);
      }

      if (!e.defaultPrevented) {
        linkClicked(e, router, href, as, replace, shallow, scroll, locale);
      }
    }
  };

  childProps.onMouseEnter = e => {
    if (!(0, _router.isLocalURL)(href)) return;

    if (child.props && typeof child.props.onMouseEnter === 'function') {
      child.props.onMouseEnter(e);
    }

    prefetch(router, href, as, {
      priority: true
    });
  }; // If child is an <a> tag and doesn't have a href attribute, or if the 'passHref' property is
  // defined, we specify the current 'href', so that repetition is not needed by the user


  if (props.passHref || child.type === 'a' && !('href' in child.props)) {
    const curLocale = typeof locale !== 'undefined' ? locale : router && router.locale; // we only render domain locales if we are currently on a domain locale
    // so that locale links are still visitable in development/preview envs

    const localeDomain = router && router.isLocaleDomain && (0, _router.getDomainLocale)(as, curLocale, router && router.locales, router && router.domainLocales);
    childProps.href = localeDomain || (0, _router.addBasePath)((0, _router.addLocale)(as, curLocale, router && router.defaultLocale));
  }

  return /*#__PURE__*/_react.default.cloneElement(child, childProps);
}

var _default = Link;
exports.default = _default;

/***/ }),

/***/ 6528:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


exports.__esModule = true;
exports.removePathTrailingSlash = removePathTrailingSlash;
exports.normalizePathTrailingSlash = void 0;
/**
* Removes the trailing slash of a path if there is one. Preserves the root path `/`.
*/

function removePathTrailingSlash(path) {
  return path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
}
/**
* Normalizes the trailing slash of a path according to the `trailingSlash` option
* in `next.config.js`.
*/


const normalizePathTrailingSlash =  false ? 0 : removePathTrailingSlash;
exports.normalizePathTrailingSlash = normalizePathTrailingSlash;

/***/ }),

/***/ 8391:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


exports.__esModule = true;
exports.cancelIdleCallback = exports.requestIdleCallback = void 0;

const requestIdleCallback = typeof self !== 'undefined' && self.requestIdleCallback || function (cb) {
  let start = Date.now();
  return setTimeout(function () {
    cb({
      didTimeout: false,
      timeRemaining: function () {
        return Math.max(0, 50 - (Date.now() - start));
      }
    });
  }, 1);
};

exports.requestIdleCallback = requestIdleCallback;

const cancelIdleCallback = typeof self !== 'undefined' && self.cancelIdleCallback || function (id) {
  return clearTimeout(id);
};

exports.cancelIdleCallback = cancelIdleCallback;

/***/ }),

/***/ 7599:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(5318);

exports.__esModule = true;
exports.markAssetError = markAssetError;
exports.isAssetError = isAssetError;
exports.getClientBuildManifest = getClientBuildManifest;
exports.default = void 0;

var _getAssetPathFromRoute = _interopRequireDefault(__webpack_require__(2238));

var _requestIdleCallback = __webpack_require__(8391); // 3.8s was arbitrarily chosen as it's what https://web.dev/interactive
// considers as "Good" time-to-interactive. We must assume something went
// wrong beyond this point, and then fall-back to a full page transition to
// show the user something of value.


const MS_MAX_IDLE_DELAY = 3800;

function withFuture(key, map, generator) {
  let entry = map.get(key);

  if (entry) {
    if ('future' in entry) {
      return entry.future;
    }

    return Promise.resolve(entry);
  }

  let resolver;
  const prom = new Promise(resolve => {
    resolver = resolve;
  });
  map.set(key, entry = {
    resolve: resolver,
    future: prom
  });
  return generator ? // eslint-disable-next-line no-sequences
  generator().then(value => (resolver(value), value)) : prom;
}

function hasPrefetch(link) {
  try {
    link = document.createElement('link');
    return (// detect IE11 since it supports prefetch but isn't detected
      // with relList.support
      !!window.MSInputMethodContext && !!document.documentMode || link.relList.supports('prefetch')
    );
  } catch (_unused) {
    return false;
  }
}

const canPrefetch = hasPrefetch();

function prefetchViaDom(href, as, link) {
  return new Promise((res, rej) => {
    if (document.querySelector(`link[rel="prefetch"][href^="${href}"]`)) {
      return res();
    }

    link = document.createElement('link'); // The order of property assignment here is intentional:

    if (as) link.as = as;
    link.rel = `prefetch`;
    link.crossOrigin = undefined;
    link.onload = res;
    link.onerror = rej; // `href` should always be last:

    link.href = href;
    document.head.appendChild(link);
  });
}

const ASSET_LOAD_ERROR = Symbol('ASSET_LOAD_ERROR'); // TODO: unexport

function markAssetError(err) {
  return Object.defineProperty(err, ASSET_LOAD_ERROR, {});
}

function isAssetError(err) {
  return err && ASSET_LOAD_ERROR in err;
}

function appendScript(src, script) {
  return new Promise((resolve, reject) => {
    script = document.createElement('script'); // The order of property assignment here is intentional.
    // 1. Setup success/failure hooks in case the browser synchronously
    //    executes when `src` is set.

    script.onload = resolve;

    script.onerror = () => reject(markAssetError(new Error(`Failed to load script: ${src}`))); // 2. Configure the cross-origin attribute before setting `src` in case the
    //    browser begins to fetch.


    script.crossOrigin = undefined; // 3. Finally, set the source and inject into the DOM in case the child
    //    must be appended for fetching to start.

    script.src = src;
    document.body.appendChild(script);
  });
} // Resolve a promise that times out after given amount of milliseconds.


function resolvePromiseWithTimeout(p, ms, err) {
  return new Promise((resolve, reject) => {
    let cancelled = false;
    p.then(r => {
      // Resolved, cancel the timeout
      cancelled = true;
      resolve(r);
    }).catch(reject);
    (0, _requestIdleCallback.requestIdleCallback)(() => setTimeout(() => {
      if (!cancelled) {
        reject(err);
      }
    }, ms));
  });
} // TODO: stop exporting or cache the failure
// It'd be best to stop exporting this. It's an implementation detail. We're
// only exporting it for backwards compatibilty with the `page-loader`.
// Only cache this response as a last resort if we cannot eliminate all other
// code branches that use the Build Manifest Callback and push them through
// the Route Loader interface.


function getClientBuildManifest() {
  if (self.__BUILD_MANIFEST) {
    return Promise.resolve(self.__BUILD_MANIFEST);
  }

  const onBuildManifest = new Promise(resolve => {
    // Mandatory because this is not concurrent safe:
    const cb = self.__BUILD_MANIFEST_CB;

    self.__BUILD_MANIFEST_CB = () => {
      resolve(self.__BUILD_MANIFEST);
      cb && cb();
    };
  });
  return resolvePromiseWithTimeout(onBuildManifest, MS_MAX_IDLE_DELAY, markAssetError(new Error('Failed to load client build manifest')));
}

function getFilesForRoute(assetPrefix, route) {
  if (false) {}

  return getClientBuildManifest().then(manifest => {
    if (!(route in manifest)) {
      throw markAssetError(new Error(`Failed to lookup route: ${route}`));
    }

    const allFiles = manifest[route].map(entry => assetPrefix + '/_next/' + encodeURI(entry));
    return {
      scripts: allFiles.filter(v => v.endsWith('.js')),
      css: allFiles.filter(v => v.endsWith('.css'))
    };
  });
}

function createRouteLoader(assetPrefix) {
  const entrypoints = new Map();
  const loadedScripts = new Map();
  const styleSheets = new Map();
  const routes = new Map();

  function maybeExecuteScript(src) {
    let prom = loadedScripts.get(src);

    if (prom) {
      return prom;
    } // Skip executing script if it's already in the DOM:


    if (document.querySelector(`script[src^="${src}"]`)) {
      return Promise.resolve();
    }

    loadedScripts.set(src, prom = appendScript(src));
    return prom;
  }

  function fetchStyleSheet(href) {
    let prom = styleSheets.get(href);

    if (prom) {
      return prom;
    }

    styleSheets.set(href, prom = fetch(href).then(res => {
      if (!res.ok) {
        throw new Error(`Failed to load stylesheet: ${href}`);
      }

      return res.text().then(text => ({
        href: href,
        content: text
      }));
    }).catch(err => {
      throw markAssetError(err);
    }));
    return prom;
  }

  return {
    whenEntrypoint(route) {
      return withFuture(route, entrypoints);
    },

    onEntrypoint(route, execute) {
      Promise.resolve(execute).then(fn => fn()).then(exports => ({
        component: exports && exports.default || exports,
        exports: exports
      }), err => ({
        error: err
      })).then(input => {
        const old = entrypoints.get(route);
        entrypoints.set(route, input);
        if (old && 'resolve' in old) old.resolve(input);
      });
    },

    loadRoute(route, prefetch) {
      return withFuture(route, routes, () => {
        return resolvePromiseWithTimeout(getFilesForRoute(assetPrefix, route).then(({
          scripts,
          css
        }) => {
          return Promise.all([entrypoints.has(route) ? [] : Promise.all(scripts.map(maybeExecuteScript)), Promise.all(css.map(fetchStyleSheet))]);
        }).then(res => {
          return this.whenEntrypoint(route).then(entrypoint => ({
            entrypoint,
            styles: res[1]
          }));
        }), MS_MAX_IDLE_DELAY, markAssetError(new Error(`Route did not complete loading: ${route}`))).then(({
          entrypoint,
          styles
        }) => {
          const res = Object.assign({
            styles: styles
          }, entrypoint);
          return 'error' in entrypoint ? entrypoint : res;
        }).catch(err => {
          if (prefetch) {
            // we don't want to cache errors during prefetch
            throw err;
          }

          return {
            error: err
          };
        });
      });
    },

    prefetch(route) {
      // https://github.com/GoogleChromeLabs/quicklink/blob/453a661fa1fa940e2d2e044452398e38c67a98fb/src/index.mjs#L115-L118
      // License: Apache 2.0
      let cn;

      if (cn = navigator.connection) {
        // Don't prefetch if using 2G or if Save-Data is enabled.
        if (cn.saveData || /2g/.test(cn.effectiveType)) return Promise.resolve();
      }

      return getFilesForRoute(assetPrefix, route).then(output => Promise.all(canPrefetch ? output.scripts.map(script => prefetchViaDom(script, 'script')) : [])).then(() => {
        (0, _requestIdleCallback.requestIdleCallback)(() => this.loadRoute(route, true).catch(() => {}));
      }).catch( // swallow prefetch errors
      () => {});
    }

  };
}

var _default = createRouteLoader;
exports.default = _default;

/***/ }),

/***/ 2441:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var _interopRequireWildcard = __webpack_require__(862);

var _interopRequireDefault = __webpack_require__(5318);

exports.__esModule = true;
exports.useRouter = useRouter;
exports.makePublicRouterInstance = makePublicRouterInstance;
exports.createRouter = exports.withRouter = exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(9297));

var _router2 = _interopRequireWildcard(__webpack_require__(1689));

exports.Router = _router2.default;
exports.NextRouter = _router2.NextRouter;

var _routerContext = __webpack_require__(8417);

var _withRouter = _interopRequireDefault(__webpack_require__(3168));

exports.withRouter = _withRouter.default;
/* global window */

const singletonRouter = {
  router: null,
  // holds the actual router instance
  readyCallbacks: [],

  ready(cb) {
    if (this.router) return cb();

    if (false) {}
  }

}; // Create public properties and methods of the router in the singletonRouter

const urlPropertyFields = ['pathname', 'route', 'query', 'asPath', 'components', 'isFallback', 'basePath', 'locale', 'locales', 'defaultLocale', 'isReady', 'isPreview', 'isLocaleDomain'];
const routerEvents = ['routeChangeStart', 'beforeHistoryChange', 'routeChangeComplete', 'routeChangeError', 'hashChangeStart', 'hashChangeComplete'];
const coreMethodFields = ['push', 'replace', 'reload', 'back', 'prefetch', 'beforePopState']; // Events is a static property on the router, the router doesn't have to be initialized to use it

Object.defineProperty(singletonRouter, 'events', {
  get() {
    return _router2.default.events;
  }

});
urlPropertyFields.forEach(field => {
  // Here we need to use Object.defineProperty because, we need to return
  // the property assigned to the actual router
  // The value might get changed as we change routes and this is the
  // proper way to access it
  Object.defineProperty(singletonRouter, field, {
    get() {
      const router = getRouter();
      return router[field];
    }

  });
});
coreMethodFields.forEach(field => {
  // We don't really know the types here, so we add them later instead
  ;

  singletonRouter[field] = (...args) => {
    const router = getRouter();
    return router[field](...args);
  };
});
routerEvents.forEach(event => {
  singletonRouter.ready(() => {
    _router2.default.events.on(event, (...args) => {
      const eventField = `on${event.charAt(0).toUpperCase()}${event.substring(1)}`;
      const _singletonRouter = singletonRouter;

      if (_singletonRouter[eventField]) {
        try {
          _singletonRouter[eventField](...args);
        } catch (err) {
          console.error(`Error when running the Router event: ${eventField}`);
          console.error(`${err.message}\n${err.stack}`);
        }
      }
    });
  });
});

function getRouter() {
  if (!singletonRouter.router) {
    const message = 'No router instance found.\n' + 'You should only use "next/router" inside the client side of your app.\n';
    throw new Error(message);
  }

  return singletonRouter.router;
} // Export the singletonRouter and this is the public API.


var _default = singletonRouter; // Reexport the withRoute HOC

exports.default = _default;

function useRouter() {
  return _react.default.useContext(_routerContext.RouterContext);
} // INTERNAL APIS
// -------------
// (do not use following exports inside the app)
// Create a router and assign it as the singleton instance.
// This is used in client side when we are initilizing the app.
// This should **not** use inside the server.


const createRouter = (...args) => {
  singletonRouter.router = new _router2.default(...args);
  singletonRouter.readyCallbacks.forEach(cb => cb());
  singletonRouter.readyCallbacks = [];
  return singletonRouter.router;
}; // This function is used to create the `withRouter` router instance


exports.createRouter = createRouter;

function makePublicRouterInstance(router) {
  const _router = router;
  const instance = {};

  for (const property of urlPropertyFields) {
    if (typeof _router[property] === 'object') {
      instance[property] = Object.assign(Array.isArray(_router[property]) ? [] : {}, _router[property]); // makes sure query is not stateful

      continue;
    }

    instance[property] = _router[property];
  } // Events is a static property on the router, the router doesn't have to be initialized to use it


  instance.events = _router2.default.events;
  coreMethodFields.forEach(field => {
    instance[field] = (...args) => {
      return _router[field](...args);
    };
  });
  return instance;
}

/***/ }),

/***/ 5749:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.useIntersection = useIntersection;

var _react = __webpack_require__(9297);

var _requestIdleCallback = __webpack_require__(8391);

const hasIntersectionObserver = typeof IntersectionObserver !== 'undefined';

function useIntersection({
  rootMargin,
  disabled
}) {
  const isDisabled = disabled || !hasIntersectionObserver;
  const unobserve = (0, _react.useRef)();
  const [visible, setVisible] = (0, _react.useState)(false);
  const setRef = (0, _react.useCallback)(el => {
    if (unobserve.current) {
      unobserve.current();
      unobserve.current = undefined;
    }

    if (isDisabled || visible) return;

    if (el && el.tagName) {
      unobserve.current = observe(el, isVisible => isVisible && setVisible(isVisible), {
        rootMargin
      });
    }
  }, [isDisabled, rootMargin, visible]);
  (0, _react.useEffect)(() => {
    if (!hasIntersectionObserver) {
      if (!visible) {
        const idleCallback = (0, _requestIdleCallback.requestIdleCallback)(() => setVisible(true));
        return () => (0, _requestIdleCallback.cancelIdleCallback)(idleCallback);
      }
    }
  }, [visible]);
  return [setRef, visible];
}

function observe(element, callback, options) {
  const {
    id,
    observer,
    elements
  } = createObserver(options);
  elements.set(element, callback);
  observer.observe(element);
  return function unobserve() {
    elements.delete(element);
    observer.unobserve(element); // Destroy observer when there's nothing left to watch:

    if (elements.size === 0) {
      observer.disconnect();
      observers.delete(id);
    }
  };
}

const observers = new Map();

function createObserver(options) {
  const id = options.rootMargin || '';
  let instance = observers.get(id);

  if (instance) {
    return instance;
  }

  const elements = new Map();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const callback = elements.get(entry.target);
      const isVisible = entry.isIntersecting || entry.intersectionRatio > 0;

      if (callback && isVisible) {
        callback(isVisible);
      }
    });
  }, options);
  observers.set(id, instance = {
    id,
    observer,
    elements
  });
  return instance;
}

/***/ }),

/***/ 3168:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(5318);

exports.__esModule = true;
exports.default = withRouter;

var _react = _interopRequireDefault(__webpack_require__(9297));

var _router = __webpack_require__(2441);

function withRouter(ComposedComponent) {
  function WithRouterWrapper(props) {
    return /*#__PURE__*/_react.default.createElement(ComposedComponent, Object.assign({
      router: (0, _router.useRouter)()
    }, props));
  }

  WithRouterWrapper.getInitialProps = ComposedComponent.getInitialProps // This is needed to allow checking for custom getInitialProps in _app
  ;
  WithRouterWrapper.origGetInitialProps = ComposedComponent.origGetInitialProps;

  if (false) {}

  return WithRouterWrapper;
}

/***/ }),

/***/ 1253:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


exports.__esModule = true;
exports.normalizeLocalePath = normalizeLocalePath;

function normalizeLocalePath(pathname, locales) {
  let detectedLocale; // first item will be empty string from splitting at first char

  const pathnameParts = pathname.split('/');
  (locales || []).some(locale => {
    if (pathnameParts[1].toLowerCase() === locale.toLowerCase()) {
      detectedLocale = locale;
      pathnameParts.splice(1, 1);
      pathname = pathnameParts.join('/') || '/';
      return true;
    }

    return false;
  });
  return {
    pathname,
    detectedLocale
  };
}

/***/ }),

/***/ 7332:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


exports.__esModule = true;
exports.default = mitt;
/*
MIT License
Copyright (c) Jason Miller (https://jasonformat.com/)
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
// This file is based on https://github.com/developit/mitt/blob/v1.1.3/src/index.js
// It's been edited for the needs of this script
// See the LICENSE at the top of the file

function mitt() {
  const all = Object.create(null);
  return {
    on(type, handler) {
      ;
      (all[type] || (all[type] = [])).push(handler);
    },

    off(type, handler) {
      if (all[type]) {
        all[type].splice(all[type].indexOf(handler) >>> 0, 1);
      }
    },

    emit(type, ...evts) {
      // eslint-disable-next-line array-callback-return
      ;
      (all[type] || []).slice().map(handler => {
        handler(...evts);
      });
    }

  };
}

/***/ }),

/***/ 1689:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.getDomainLocale = getDomainLocale;
exports.addLocale = addLocale;
exports.delLocale = delLocale;
exports.hasBasePath = hasBasePath;
exports.addBasePath = addBasePath;
exports.delBasePath = delBasePath;
exports.isLocalURL = isLocalURL;
exports.interpolateAs = interpolateAs;
exports.resolveHref = resolveHref;
exports.default = void 0;

var _normalizeTrailingSlash = __webpack_require__(6528);

var _routeLoader = __webpack_require__(7599);

var _denormalizePagePath = __webpack_require__(9320);

var _normalizeLocalePath = __webpack_require__(1253);

var _mitt = _interopRequireDefault(__webpack_require__(7332));

var _utils = __webpack_require__(3937);

var _isDynamic = __webpack_require__(3288);

var _parseRelativeUrl = __webpack_require__(4436);

var _querystring = __webpack_require__(4915);

var _resolveRewrites = _interopRequireDefault(__webpack_require__(4453));

var _routeMatcher = __webpack_require__(7451);

var _routeRegex = __webpack_require__(8193);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
} // tslint:disable:no-console


let detectDomainLocale;

if (false) {}

const basePath =  false || '';

function buildCancellationError() {
  return Object.assign(new Error('Route Cancelled'), {
    cancelled: true
  });
}

function addPathPrefix(path, prefix) {
  return prefix && path.startsWith('/') ? path === '/' ? (0, _normalizeTrailingSlash.normalizePathTrailingSlash)(prefix) : `${prefix}${pathNoQueryHash(path) === '/' ? path.substring(1) : path}` : path;
}

function getDomainLocale(path, locale, locales, domainLocales) {
  if (false) {}

  return false;
}

function addLocale(path, locale, defaultLocale) {
  if (false) {}

  return path;
}

function delLocale(path, locale) {
  if (false) {}

  return path;
}

function pathNoQueryHash(path) {
  const queryIndex = path.indexOf('?');
  const hashIndex = path.indexOf('#');

  if (queryIndex > -1 || hashIndex > -1) {
    path = path.substring(0, queryIndex > -1 ? queryIndex : hashIndex);
  }

  return path;
}

function hasBasePath(path) {
  path = pathNoQueryHash(path);
  return path === basePath || path.startsWith(basePath + '/');
}

function addBasePath(path) {
  // we only add the basepath on relative urls
  return addPathPrefix(path, basePath);
}

function delBasePath(path) {
  path = path.slice(basePath.length);
  if (!path.startsWith('/')) path = `/${path}`;
  return path;
}
/**
* Detects whether a given url is routable by the Next.js router (browser only).
*/


function isLocalURL(url) {
  // prevent a hydration mismatch on href for url with anchor refs
  if (url.startsWith('/') || url.startsWith('#')) return true;

  try {
    // absolute urls can be local if they are on the same origin
    const locationOrigin = (0, _utils.getLocationOrigin)();
    const resolved = new URL(url, locationOrigin);
    return resolved.origin === locationOrigin && hasBasePath(resolved.pathname);
  } catch (_) {
    return false;
  }
}

function interpolateAs(route, asPathname, query) {
  let interpolatedRoute = '';
  const dynamicRegex = (0, _routeRegex.getRouteRegex)(route);
  const dynamicGroups = dynamicRegex.groups;
  const dynamicMatches = // Try to match the dynamic route against the asPath
  (asPathname !== route ? (0, _routeMatcher.getRouteMatcher)(dynamicRegex)(asPathname) : '') || // Fall back to reading the values from the href
  // TODO: should this take priority; also need to change in the router.
  query;
  interpolatedRoute = route;
  const params = Object.keys(dynamicGroups);

  if (!params.every(param => {
    let value = dynamicMatches[param] || '';
    const {
      repeat,
      optional
    } = dynamicGroups[param]; // support single-level catch-all
    // TODO: more robust handling for user-error (passing `/`)

    let replaced = `[${repeat ? '...' : ''}${param}]`;

    if (optional) {
      replaced = `${!value ? '/' : ''}[${replaced}]`;
    }

    if (repeat && !Array.isArray(value)) value = [value];
    return (optional || param in dynamicMatches) && ( // Interpolate group into data URL if present
    interpolatedRoute = interpolatedRoute.replace(replaced, repeat ? value.map( // these values should be fully encoded instead of just
    // path delimiter escaped since they are being inserted
    // into the URL and we expect URL encoded segments
    // when parsing dynamic route params
    segment => encodeURIComponent(segment)).join('/') : encodeURIComponent(value)) || '/');
  })) {
    interpolatedRoute = ''; // did not satisfy all requirements
    // n.b. We ignore this error because we handle warning for this case in
    // development in the `<Link>` component directly.
  }

  return {
    params,
    result: interpolatedRoute
  };
}

function omitParmsFromQuery(query, params) {
  const filteredQuery = {};
  Object.keys(query).forEach(key => {
    if (!params.includes(key)) {
      filteredQuery[key] = query[key];
    }
  });
  return filteredQuery;
}
/**
* Resolves a given hyperlink with a certain router state (basePath not included).
* Preserves absolute urls.
*/


function resolveHref(currentPath, href, resolveAs) {
  // we use a dummy base url for relative urls
  const base = new URL(currentPath, 'http://n');
  const urlAsString = typeof href === 'string' ? href : (0, _utils.formatWithValidation)(href); // Return because it cannot be routed by the Next.js router

  if (!isLocalURL(urlAsString)) {
    return resolveAs ? [urlAsString] : urlAsString;
  }

  try {
    const finalUrl = new URL(urlAsString, base);
    finalUrl.pathname = (0, _normalizeTrailingSlash.normalizePathTrailingSlash)(finalUrl.pathname);
    let interpolatedAs = '';

    if ((0, _isDynamic.isDynamicRoute)(finalUrl.pathname) && finalUrl.searchParams && resolveAs) {
      const query = (0, _querystring.searchParamsToUrlQuery)(finalUrl.searchParams);
      const {
        result,
        params
      } = interpolateAs(finalUrl.pathname, finalUrl.pathname, query);

      if (result) {
        interpolatedAs = (0, _utils.formatWithValidation)({
          pathname: result,
          hash: finalUrl.hash,
          query: omitParmsFromQuery(query, params)
        });
      }
    } // if the origin didn't change, it means we received a relative href


    const resolvedHref = finalUrl.origin === base.origin ? finalUrl.href.slice(finalUrl.origin.length) : finalUrl.href;
    return resolveAs ? [resolvedHref, interpolatedAs || resolvedHref] : resolvedHref;
  } catch (_) {
    return resolveAs ? [urlAsString] : urlAsString;
  }
}

function stripOrigin(url) {
  const origin = (0, _utils.getLocationOrigin)();
  return url.startsWith(origin) ? url.substring(origin.length) : url;
}

function prepareUrlAs(router, url, as) {
  // If url and as provided as an object representation,
  // we'll format them into the string version here.
  let [resolvedHref, resolvedAs] = resolveHref(router.pathname, url, true);
  const origin = (0, _utils.getLocationOrigin)();
  const hrefHadOrigin = resolvedHref.startsWith(origin);
  const asHadOrigin = resolvedAs && resolvedAs.startsWith(origin);
  resolvedHref = stripOrigin(resolvedHref);
  resolvedAs = resolvedAs ? stripOrigin(resolvedAs) : resolvedAs;
  const preparedUrl = hrefHadOrigin ? resolvedHref : addBasePath(resolvedHref);
  const preparedAs = as ? stripOrigin(resolveHref(router.pathname, as)) : resolvedAs || resolvedHref;
  return {
    url: preparedUrl,
    as: asHadOrigin ? preparedAs : addBasePath(preparedAs)
  };
}

function resolveDynamicRoute(pathname, pages) {
  const cleanPathname = (0, _normalizeTrailingSlash.removePathTrailingSlash)((0, _denormalizePagePath.denormalizePagePath)(pathname));

  if (cleanPathname === '/404' || cleanPathname === '/_error') {
    return pathname;
  } // handle resolving href for dynamic routes


  if (!pages.includes(cleanPathname)) {
    // eslint-disable-next-line array-callback-return
    pages.some(page => {
      if ((0, _isDynamic.isDynamicRoute)(page) && (0, _routeRegex.getRouteRegex)(page).re.test(cleanPathname)) {
        pathname = page;
        return true;
      }
    });
  }

  return (0, _normalizeTrailingSlash.removePathTrailingSlash)(pathname);
}

const manualScrollRestoration = (/* unused pure expression or super */ null && ( false && 0));
const SSG_DATA_NOT_FOUND = Symbol('SSG_DATA_NOT_FOUND');

function fetchRetry(url, attempts) {
  return fetch(url, {
    // Cookies are required to be present for Next.js' SSG "Preview Mode".
    // Cookies may also be required for `getServerSideProps`.
    //
    // > `fetch` won’t send cookies, unless you set the credentials init
    // > option.
    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    //
    // > For maximum browser compatibility when it comes to sending &
    // > receiving cookies, always supply the `credentials: 'same-origin'`
    // > option instead of relying on the default.
    // https://github.com/github/fetch#caveats
    credentials: 'same-origin'
  }).then(res => {
    if (!res.ok) {
      if (attempts > 1 && res.status >= 500) {
        return fetchRetry(url, attempts - 1);
      }

      if (res.status === 404) {
        return res.json().then(data => {
          if (data.notFound) {
            return {
              notFound: SSG_DATA_NOT_FOUND
            };
          }

          throw new Error(`Failed to load static props`);
        });
      }

      throw new Error(`Failed to load static props`);
    }

    return res.json();
  });
}

function fetchNextData(dataHref, isServerRender) {
  return fetchRetry(dataHref, isServerRender ? 3 : 1).catch(err => {
    // We should only trigger a server-side transition if this was caused
    // on a client-side transition. Otherwise, we'd get into an infinite
    // loop.
    if (!isServerRender) {
      (0, _routeLoader.markAssetError)(err);
    }

    throw err;
  });
}

class Router {
  /**
  * Map of all components loaded in `Router`
  */
  // Static Data Cache
  // In-flight Server Data Requests, for deduping
  constructor(_pathname, _query, _as, {
    initialProps,
    pageLoader,
    App,
    wrapApp,
    Component,
    err,
    subscription,
    isFallback,
    locale,
    locales,
    defaultLocale,
    domainLocales,
    isPreview
  }) {
    this.route = void 0;
    this.pathname = void 0;
    this.query = void 0;
    this.asPath = void 0;
    this.basePath = void 0;
    this.components = void 0;
    this.sdc = {};
    this.sdr = {};
    this.sub = void 0;
    this.clc = void 0;
    this.pageLoader = void 0;
    this._bps = void 0;
    this.events = void 0;
    this._wrapApp = void 0;
    this.isSsr = void 0;
    this.isFallback = void 0;
    this._inFlightRoute = void 0;
    this._shallow = void 0;
    this.locale = void 0;
    this.locales = void 0;
    this.defaultLocale = void 0;
    this.domainLocales = void 0;
    this.isReady = void 0;
    this.isPreview = void 0;
    this.isLocaleDomain = void 0;
    this._idx = 0;

    this.onPopState = e => {
      const state = e.state;

      if (!state) {
        // We get state as undefined for two reasons.
        //  1. With older safari (< 8) and older chrome (< 34)
        //  2. When the URL changed with #
        //
        // In the both cases, we don't need to proceed and change the route.
        // (as it's already changed)
        // But we can simply replace the state with the new changes.
        // Actually, for (1) we don't need to nothing. But it's hard to detect that event.
        // So, doing the following for (1) does no harm.
        const {
          pathname,
          query
        } = this;
        this.changeState('replaceState', (0, _utils.formatWithValidation)({
          pathname: addBasePath(pathname),
          query
        }), (0, _utils.getURL)());
        return;
      }

      if (!state.__N) {
        return;
      }

      let forcedScroll;
      const {
        url,
        as,
        options,
        idx
      } = state;

      if (false) {}

      this._idx = idx;
      const {
        pathname
      } = (0, _parseRelativeUrl.parseRelativeUrl)(url); // Make sure we don't re-render on initial load,
      // can be caused by navigating back from an external site

      if (this.isSsr && as === this.asPath && pathname === this.pathname) {
        return;
      } // If the downstream application returns falsy, return.
      // They will then be responsible for handling the event.


      if (this._bps && !this._bps(state)) {
        return;
      }

      this.change('replaceState', url, as, Object.assign({}, options, {
        shallow: options.shallow && this._shallow,
        locale: options.locale || this.defaultLocale
      }), forcedScroll);
    }; // represents the current component key


    this.route = (0, _normalizeTrailingSlash.removePathTrailingSlash)(_pathname); // set up the component cache (by route keys)

    this.components = {}; // We should not keep the cache, if there's an error
    // Otherwise, this cause issues when when going back and
    // come again to the errored page.

    if (_pathname !== '/_error') {
      this.components[this.route] = {
        Component,
        initial: true,
        props: initialProps,
        err,
        __N_SSG: initialProps && initialProps.__N_SSG,
        __N_SSP: initialProps && initialProps.__N_SSP
      };
    }

    this.components['/_app'] = {
      Component: App,
      styleSheets: [
        /* /_app does not need its stylesheets managed */
      ]
    }; // Backwards compat for Router.router.events
    // TODO: Should be remove the following major version as it was never documented

    this.events = Router.events;
    this.pageLoader = pageLoader;
    this.pathname = _pathname;
    this.query = _query; // if auto prerendered and dynamic route wait to update asPath
    // until after mount to prevent hydration mismatch

    const autoExportDynamic = (0, _isDynamic.isDynamicRoute)(_pathname) && self.__NEXT_DATA__.autoExport;

    this.asPath = autoExportDynamic ? _pathname : _as;
    this.basePath = basePath;
    this.sub = subscription;
    this.clc = null;
    this._wrapApp = wrapApp; // make sure to ignore extra popState in safari on navigating
    // back from external site

    this.isSsr = true;
    this.isFallback = isFallback;
    this.isReady = !!(self.__NEXT_DATA__.gssp || self.__NEXT_DATA__.gip || !autoExportDynamic && !self.location.search && !false);
    this.isPreview = !!isPreview;
    this.isLocaleDomain = false;

    if (false) {}

    if (false) {}
  }

  reload() {
    window.location.reload();
  }
  /**
  * Go back in history
  */


  back() {
    window.history.back();
  }
  /**
  * Performs a `pushState` with arguments
  * @param url of the route
  * @param as masks `url` for the browser
  * @param options object you can define `shallow` and other options
  */


  push(url, as, options = {}) {
    if (false) {}

    ;
    ({
      url,
      as
    } = prepareUrlAs(this, url, as));
    return this.change('pushState', url, as, options);
  }
  /**
  * Performs a `replaceState` with arguments
  * @param url of the route
  * @param as masks `url` for the browser
  * @param options object you can define `shallow` and other options
  */


  replace(url, as, options = {}) {
    ;
    ({
      url,
      as
    } = prepareUrlAs(this, url, as));
    return this.change('replaceState', url, as, options);
  }

  async change(method, url, as, options, forcedScroll) {
    var _options$scroll;

    if (!isLocalURL(url)) {
      window.location.href = url;
      return false;
    } // for static pages with query params in the URL we delay
    // marking the router ready until after the query is updated


    if (options._h) {
      this.isReady = true;
    } // Default to scroll reset behavior unless explicitly specified to be
    // `false`! This makes the behavior between using `Router#push` and a
    // `<Link />` consistent.


    options.scroll = !!((_options$scroll = options.scroll) != null ? _options$scroll : true);
    let localeChange = options.locale !== this.locale;

    if (false) { var _this$locales; }

    if (!options._h) {
      this.isSsr = false;
    } // marking route changes as a navigation start entry


    if (_utils.ST) {
      performance.mark('routeChange');
    }

    const {
      shallow = false
    } = options;
    const routeProps = {
      shallow
    };

    if (this._inFlightRoute) {
      this.abortComponentLoad(this._inFlightRoute, routeProps);
    }

    as = addBasePath(addLocale(hasBasePath(as) ? delBasePath(as) : as, options.locale, this.defaultLocale));
    const cleanedAs = delLocale(hasBasePath(as) ? delBasePath(as) : as, this.locale);
    this._inFlightRoute = as; // If the url change is only related to a hash change
    // We should not proceed. We should only change the state.
    // WARNING: `_h` is an internal option for handing Next.js client-side
    // hydration. Your app should _never_ use this property. It may change at
    // any time without notice.

    if (!options._h && this.onlyAHashChange(cleanedAs)) {
      this.asPath = cleanedAs;
      Router.events.emit('hashChangeStart', as, routeProps); // TODO: do we need the resolved href when only a hash change?

      this.changeState(method, url, as, options);
      this.scrollToHash(cleanedAs);
      this.notify(this.components[this.route], null);
      Router.events.emit('hashChangeComplete', as, routeProps);
      return true;
    }

    let parsed = (0, _parseRelativeUrl.parseRelativeUrl)(url);
    let {
      pathname,
      query
    } = parsed; // The build manifest needs to be loaded before auto-static dynamic pages
    // get their query parameters to allow ensuring they can be parsed properly
    // when rewritten to

    let pages, rewrites;

    try {
      pages = await this.pageLoader.getPageList();
      ({
        __rewrites: rewrites
      } = await (0, _routeLoader.getClientBuildManifest)());
    } catch (err) {
      // If we fail to resolve the page list or client-build manifest, we must
      // do a server-side transition:
      window.location.href = as;
      return false;
    } // If asked to change the current URL we should reload the current page
    // (not location.reload() but reload getInitialProps and other Next.js stuffs)
    // We also need to set the method = replaceState always
    // as this should not go into the history (That's how browsers work)
    // We should compare the new asPath to the current asPath, not the url


    if (!this.urlIsNew(cleanedAs) && !localeChange) {
      method = 'replaceState';
    } // we need to resolve the as value using rewrites for dynamic SSG
    // pages to allow building the data URL correctly


    let resolvedAs = as; // url and as should always be prefixed with basePath by this
    // point by either next/link or router.push/replace so strip the
    // basePath from the pathname to match the pages dir 1-to-1

    pathname = pathname ? (0, _normalizeTrailingSlash.removePathTrailingSlash)(delBasePath(pathname)) : pathname;

    if (pathname !== '/_error') {
      if (false) {} else {
        parsed.pathname = resolveDynamicRoute(pathname, pages);

        if (parsed.pathname !== pathname) {
          pathname = parsed.pathname;
          url = (0, _utils.formatWithValidation)(parsed);
        }
      }
    }

    const route = (0, _normalizeTrailingSlash.removePathTrailingSlash)(pathname);

    if (!isLocalURL(as)) {
      if (false) {}

      window.location.href = as;
      return false;
    }

    resolvedAs = delLocale(delBasePath(resolvedAs), this.locale);

    if ((0, _isDynamic.isDynamicRoute)(route)) {
      const parsedAs = (0, _parseRelativeUrl.parseRelativeUrl)(resolvedAs);
      const asPathname = parsedAs.pathname;
      const routeRegex = (0, _routeRegex.getRouteRegex)(route);
      const routeMatch = (0, _routeMatcher.getRouteMatcher)(routeRegex)(asPathname);
      const shouldInterpolate = route === asPathname;
      const interpolatedAs = shouldInterpolate ? interpolateAs(route, asPathname, query) : {};

      if (!routeMatch || shouldInterpolate && !interpolatedAs.result) {
        const missingParams = Object.keys(routeRegex.groups).filter(param => !query[param]);

        if (missingParams.length > 0) {
          if (false) {}

          throw new Error((shouldInterpolate ? `The provided \`href\` (${url}) value is missing query values (${missingParams.join(', ')}) to be interpolated properly. ` : `The provided \`as\` value (${asPathname}) is incompatible with the \`href\` value (${route}). `) + `Read more: https://nextjs.org/docs/messages/${shouldInterpolate ? 'href-interpolation-failed' : 'incompatible-href-as'}`);
        }
      } else if (shouldInterpolate) {
        as = (0, _utils.formatWithValidation)(Object.assign({}, parsedAs, {
          pathname: interpolatedAs.result,
          query: omitParmsFromQuery(query, interpolatedAs.params)
        }));
      } else {
        // Merge params into `query`, overwriting any specified in search
        Object.assign(query, routeMatch);
      }
    }

    Router.events.emit('routeChangeStart', as, routeProps);

    try {
      var _self$__NEXT_DATA__$p, _self$__NEXT_DATA__$p2;

      let routeInfo = await this.getRouteInfo(route, pathname, query, as, resolvedAs, routeProps);
      let {
        error,
        props,
        __N_SSG,
        __N_SSP
      } = routeInfo; // handle redirect on client-transition

      if ((__N_SSG || __N_SSP) && props) {
        if (props.pageProps && props.pageProps.__N_REDIRECT) {
          const destination = props.pageProps.__N_REDIRECT; // check if destination is internal (resolves to a page) and attempt
          // client-navigation if it is falling back to hard navigation if
          // it's not

          if (destination.startsWith('/')) {
            const parsedHref = (0, _parseRelativeUrl.parseRelativeUrl)(destination);
            parsedHref.pathname = resolveDynamicRoute(parsedHref.pathname, pages);

            if (pages.includes(parsedHref.pathname)) {
              const {
                url: newUrl,
                as: newAs
              } = prepareUrlAs(this, destination, destination);
              return this.change(method, newUrl, newAs, options);
            }
          }

          window.location.href = destination;
          return new Promise(() => {});
        }

        this.isPreview = !!props.__N_PREVIEW; // handle SSG data 404

        if (props.notFound === SSG_DATA_NOT_FOUND) {
          let notFoundRoute;

          try {
            await this.fetchComponent('/404');
            notFoundRoute = '/404';
          } catch (_) {
            notFoundRoute = '/_error';
          }

          routeInfo = await this.getRouteInfo(notFoundRoute, notFoundRoute, query, as, resolvedAs, {
            shallow: false
          });
        }
      }

      Router.events.emit('beforeHistoryChange', as, routeProps);
      this.changeState(method, url, as, options);

      if (false) {} // shallow routing is only allowed for same page URL changes.


      const isValidShallowRoute = options.shallow && this.route === route;

      if (options._h && pathname === '/_error' && ((_self$__NEXT_DATA__$p = self.__NEXT_DATA__.props) == null ? void 0 : (_self$__NEXT_DATA__$p2 = _self$__NEXT_DATA__$p.pageProps) == null ? void 0 : _self$__NEXT_DATA__$p2.statusCode) === 500 && props != null && props.pageProps) {
        // ensure statusCode is still correct for static 500 page
        // when updating query information
        props.pageProps.statusCode = 500;
      }

      await this.set(route, pathname, query, cleanedAs, routeInfo, forcedScroll || (isValidShallowRoute || !options.scroll ? null : {
        x: 0,
        y: 0
      })).catch(e => {
        if (e.cancelled) error = error || e;else throw e;
      });

      if (error) {
        Router.events.emit('routeChangeError', error, cleanedAs, routeProps);
        throw error;
      }

      if (false) {}

      Router.events.emit('routeChangeComplete', as, routeProps);
      return true;
    } catch (err) {
      if (err.cancelled) {
        return false;
      }

      throw err;
    }
  }

  changeState(method, url, as, options = {}) {
    if (false) {}

    if (method !== 'pushState' || (0, _utils.getURL)() !== as) {
      this._shallow = options.shallow;
      window.history[method]({
        url,
        as,
        options,
        __N: true,
        idx: this._idx = method !== 'pushState' ? this._idx : this._idx + 1
      }, // Most browsers currently ignores this parameter, although they may use it in the future.
      // Passing the empty string here should be safe against future changes to the method.
      // https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState
      '', as);
    }
  }

  async handleRouteInfoError(err, pathname, query, as, routeProps, loadErrorFail) {
    if (err.cancelled) {
      // bubble up cancellation errors
      throw err;
    }

    if ((0, _routeLoader.isAssetError)(err) || loadErrorFail) {
      Router.events.emit('routeChangeError', err, as, routeProps); // If we can't load the page it could be one of following reasons
      //  1. Page doesn't exists
      //  2. Page does exist in a different zone
      //  3. Internal error while loading the page
      // So, doing a hard reload is the proper way to deal with this.

      window.location.href = as; // Changing the URL doesn't block executing the current code path.
      // So let's throw a cancellation error stop the routing logic.

      throw buildCancellationError();
    }

    try {
      let Component;
      let styleSheets;
      let props;

      if (typeof Component === 'undefined' || typeof styleSheets === 'undefined') {
        ;
        ({
          page: Component,
          styleSheets
        } = await this.fetchComponent('/_error'));
      }

      const routeInfo = {
        props,
        Component,
        styleSheets,
        err,
        error: err
      };

      if (!routeInfo.props) {
        try {
          routeInfo.props = await this.getInitialProps(Component, {
            err,
            pathname,
            query
          });
        } catch (gipErr) {
          console.error('Error in error page `getInitialProps`: ', gipErr);
          routeInfo.props = {};
        }
      }

      return routeInfo;
    } catch (routeInfoErr) {
      return this.handleRouteInfoError(routeInfoErr, pathname, query, as, routeProps, true);
    }
  }

  async getRouteInfo(route, pathname, query, as, resolvedAs, routeProps) {
    try {
      const existingRouteInfo = this.components[route];

      if (routeProps.shallow && existingRouteInfo && this.route === route) {
        return existingRouteInfo;
      }

      const cachedRouteInfo = existingRouteInfo && 'initial' in existingRouteInfo ? undefined : existingRouteInfo;
      const routeInfo = cachedRouteInfo ? cachedRouteInfo : await this.fetchComponent(route).then(res => ({
        Component: res.page,
        styleSheets: res.styleSheets,
        __N_SSG: res.mod.__N_SSG,
        __N_SSP: res.mod.__N_SSP
      }));
      const {
        Component,
        __N_SSG,
        __N_SSP
      } = routeInfo;

      if (false) {}

      let dataHref;

      if (__N_SSG || __N_SSP) {
        dataHref = this.pageLoader.getDataHref((0, _utils.formatWithValidation)({
          pathname,
          query
        }), resolvedAs, __N_SSG, this.locale);
      }

      const props = await this._getData(() => __N_SSG ? this._getStaticData(dataHref) : __N_SSP ? this._getServerData(dataHref) : this.getInitialProps(Component, // we provide AppTree later so this needs to be `any`
      {
        pathname,
        query,
        asPath: as
      }));
      routeInfo.props = props;
      this.components[route] = routeInfo;
      return routeInfo;
    } catch (err) {
      return this.handleRouteInfoError(err, pathname, query, as, routeProps);
    }
  }

  set(route, pathname, query, as, data, resetScroll) {
    this.isFallback = false;
    this.route = route;
    this.pathname = pathname;
    this.query = query;
    this.asPath = as;
    return this.notify(data, resetScroll);
  }
  /**
  * Callback to execute before replacing router state
  * @param cb callback to be executed
  */


  beforePopState(cb) {
    this._bps = cb;
  }

  onlyAHashChange(as) {
    if (!this.asPath) return false;
    const [oldUrlNoHash, oldHash] = this.asPath.split('#');
    const [newUrlNoHash, newHash] = as.split('#'); // Makes sure we scroll to the provided hash if the url/hash are the same

    if (newHash && oldUrlNoHash === newUrlNoHash && oldHash === newHash) {
      return true;
    } // If the urls are change, there's more than a hash change


    if (oldUrlNoHash !== newUrlNoHash) {
      return false;
    } // If the hash has changed, then it's a hash only change.
    // This check is necessary to handle both the enter and
    // leave hash === '' cases. The identity case falls through
    // and is treated as a next reload.


    return oldHash !== newHash;
  }

  scrollToHash(as) {
    const [, hash] = as.split('#'); // Scroll to top if the hash is just `#` with no value or `#top`
    // To mirror browsers

    if (hash === '' || hash === 'top') {
      window.scrollTo(0, 0);
      return;
    } // First we check if the element by id is found


    const idEl = document.getElementById(hash);

    if (idEl) {
      idEl.scrollIntoView();
      return;
    } // If there's no element with the id, we check the `name` property
    // To mirror browsers


    const nameEl = document.getElementsByName(hash)[0];

    if (nameEl) {
      nameEl.scrollIntoView();
    }
  }

  urlIsNew(asPath) {
    return this.asPath !== asPath;
  }
  /**
  * Prefetch page code, you may wait for the data during page rendering.
  * This feature only works in production!
  * @param url the href of prefetched page
  * @param asPath the as path of the prefetched page
  */


  async prefetch(url, asPath = url, options = {}) {
    let parsed = (0, _parseRelativeUrl.parseRelativeUrl)(url);
    let {
      pathname
    } = parsed;

    if (false) {}

    const pages = await this.pageLoader.getPageList();
    let resolvedAs = asPath;

    if (false) {} else {
      parsed.pathname = resolveDynamicRoute(parsed.pathname, pages);

      if (parsed.pathname !== pathname) {
        pathname = parsed.pathname;
        url = (0, _utils.formatWithValidation)(parsed);
      }
    }

    const route = (0, _normalizeTrailingSlash.removePathTrailingSlash)(pathname); // Prefetch is not supported in development mode because it would trigger on-demand-entries

    if (false) {}

    await Promise.all([this.pageLoader._isSsg(route).then(isSsg => {
      return isSsg ? this._getStaticData(this.pageLoader.getDataHref(url, resolvedAs, true, typeof options.locale !== 'undefined' ? options.locale : this.locale)) : false;
    }), this.pageLoader[options.priority ? 'loadPage' : 'prefetch'](route)]);
  }

  async fetchComponent(route) {
    let cancelled = false;

    const cancel = this.clc = () => {
      cancelled = true;
    };

    const componentResult = await this.pageLoader.loadPage(route);

    if (cancelled) {
      const error = new Error(`Abort fetching component for route: "${route}"`);
      error.cancelled = true;
      throw error;
    }

    if (cancel === this.clc) {
      this.clc = null;
    }

    return componentResult;
  }

  _getData(fn) {
    let cancelled = false;

    const cancel = () => {
      cancelled = true;
    };

    this.clc = cancel;
    return fn().then(data => {
      if (cancel === this.clc) {
        this.clc = null;
      }

      if (cancelled) {
        const err = new Error('Loading initial props cancelled');
        err.cancelled = true;
        throw err;
      }

      return data;
    });
  }

  _getStaticData(dataHref) {
    const {
      href: cacheKey
    } = new URL(dataHref, window.location.href);

    if ( true && !this.isPreview && this.sdc[cacheKey]) {
      return Promise.resolve(this.sdc[cacheKey]);
    }

    return fetchNextData(dataHref, this.isSsr).then(data => {
      this.sdc[cacheKey] = data;
      return data;
    });
  }

  _getServerData(dataHref) {
    const {
      href: resourceKey
    } = new URL(dataHref, window.location.href);

    if (this.sdr[resourceKey]) {
      return this.sdr[resourceKey];
    }

    return this.sdr[resourceKey] = fetchNextData(dataHref, this.isSsr).then(data => {
      delete this.sdr[resourceKey];
      return data;
    }).catch(err => {
      delete this.sdr[resourceKey];
      throw err;
    });
  }

  getInitialProps(Component, ctx) {
    const {
      Component: App
    } = this.components['/_app'];

    const AppTree = this._wrapApp(App);

    ctx.AppTree = AppTree;
    return (0, _utils.loadGetInitialProps)(App, {
      AppTree,
      Component,
      router: this,
      ctx
    });
  }

  abortComponentLoad(as, routeProps) {
    if (this.clc) {
      Router.events.emit('routeChangeError', buildCancellationError(), as, routeProps);
      this.clc();
      this.clc = null;
    }
  }

  notify(data, resetScroll) {
    return this.sub(data, this.components['/_app'].Component, resetScroll);
  }

}

exports.default = Router;
Router.events = (0, _mitt.default)();

/***/ }),

/***/ 7687:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.formatUrl = formatUrl;

var querystring = _interopRequireWildcard(__webpack_require__(4915));

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
} // Format function modified from nodejs
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.


const slashedProtocols = /https?|ftp|gopher|file/;

function formatUrl(urlObj) {
  let {
    auth,
    hostname
  } = urlObj;
  let protocol = urlObj.protocol || '';
  let pathname = urlObj.pathname || '';
  let hash = urlObj.hash || '';
  let query = urlObj.query || '';
  let host = false;
  auth = auth ? encodeURIComponent(auth).replace(/%3A/i, ':') + '@' : '';

  if (urlObj.host) {
    host = auth + urlObj.host;
  } else if (hostname) {
    host = auth + (~hostname.indexOf(':') ? `[${hostname}]` : hostname);

    if (urlObj.port) {
      host += ':' + urlObj.port;
    }
  }

  if (query && typeof query === 'object') {
    query = String(querystring.urlQueryToSearchParams(query));
  }

  let search = urlObj.search || query && `?${query}` || '';
  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  if (urlObj.slashes || (!protocol || slashedProtocols.test(protocol)) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname[0] !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash[0] !== '#') hash = '#' + hash;
  if (search && search[0] !== '?') search = '?' + search;
  pathname = pathname.replace(/[?#]/g, encodeURIComponent);
  search = search.replace('#', '%23');
  return `${protocol}${host}${pathname}${search}${hash}`;
}

/***/ }),

/***/ 3288:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


exports.__esModule = true;
exports.isDynamicRoute = isDynamicRoute; // Identify /[param]/ in route string

const TEST_ROUTE = /\/\[[^/]+?\](?=\/|$)/;

function isDynamicRoute(route) {
  return TEST_ROUTE.test(route);
}

/***/ }),

/***/ 4436:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.parseRelativeUrl = parseRelativeUrl;

var _utils = __webpack_require__(3937);

var _querystring = __webpack_require__(4915);
/**
* Parses path-relative urls (e.g. `/hello/world?foo=bar`). If url isn't path-relative
* (e.g. `./hello`) then at least base must be.
* Absolute urls are rejected with one exception, in the browser, absolute urls that are on
* the current origin will be parsed as relative
*/


function parseRelativeUrl(url, base) {
  const globalBase = new URL( true ? 'http://n' : 0);
  const resolvedBase = base ? new URL(base, globalBase) : globalBase;
  const {
    pathname,
    searchParams,
    search,
    hash,
    href,
    origin
  } = new URL(url, resolvedBase);

  if (origin !== globalBase.origin) {
    throw new Error(`invariant: invalid relative URL, router received ${url}`);
  }

  return {
    pathname,
    query: (0, _querystring.searchParamsToUrlQuery)(searchParams),
    search,
    hash,
    href: href.slice(globalBase.origin.length)
  };
}

/***/ }),

/***/ 4915:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


exports.__esModule = true;
exports.searchParamsToUrlQuery = searchParamsToUrlQuery;
exports.urlQueryToSearchParams = urlQueryToSearchParams;
exports.assign = assign;

function searchParamsToUrlQuery(searchParams) {
  const query = {};
  searchParams.forEach((value, key) => {
    if (typeof query[key] === 'undefined') {
      query[key] = value;
    } else if (Array.isArray(query[key])) {
      ;
      query[key].push(value);
    } else {
      query[key] = [query[key], value];
    }
  });
  return query;
}

function stringifyUrlQueryParam(param) {
  if (typeof param === 'string' || typeof param === 'number' && !isNaN(param) || typeof param === 'boolean') {
    return String(param);
  } else {
    return '';
  }
}

function urlQueryToSearchParams(urlQuery) {
  const result = new URLSearchParams();
  Object.entries(urlQuery).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(item => result.append(key, stringifyUrlQueryParam(item)));
    } else {
      result.set(key, stringifyUrlQueryParam(value));
    }
  });
  return result;
}

function assign(target, ...searchParamsList) {
  searchParamsList.forEach(searchParams => {
    Array.from(searchParams.keys()).forEach(key => target.delete(key));
    searchParams.forEach((value, key) => target.append(key, value));
  });
  return target;
}

/***/ }),

/***/ 7451:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


exports.__esModule = true;
exports.getRouteMatcher = getRouteMatcher;

function getRouteMatcher(routeRegex) {
  const {
    re,
    groups
  } = routeRegex;
  return pathname => {
    const routeMatch = re.exec(pathname);

    if (!routeMatch) {
      return false;
    }

    const decode = param => {
      try {
        return decodeURIComponent(param);
      } catch (_) {
        const err = new Error('failed to decode param');
        err.code = 'DECODE_FAILED';
        throw err;
      }
    };

    const params = {};
    Object.keys(groups).forEach(slugName => {
      const g = groups[slugName];
      const m = routeMatch[g.pos];

      if (m !== undefined) {
        params[slugName] = ~m.indexOf('/') ? m.split('/').map(entry => decode(entry)) : g.repeat ? [decode(m)] : decode(m);
      }
    });
    return params;
  };
}

/***/ }),

/***/ 8193:
/***/ (function(__unused_webpack_module, exports) {

"use strict";


exports.__esModule = true;
exports.getRouteRegex = getRouteRegex; // this isn't importing the escape-string-regex module
// to reduce bytes

function escapeRegex(str) {
  return str.replace(/[|\\{}()[\]^$+*?.-]/g, '\\$&');
}

function parseParameter(param) {
  const optional = param.startsWith('[') && param.endsWith(']');

  if (optional) {
    param = param.slice(1, -1);
  }

  const repeat = param.startsWith('...');

  if (repeat) {
    param = param.slice(3);
  }

  return {
    key: param,
    repeat,
    optional
  };
}

function getRouteRegex(normalizedRoute) {
  const segments = (normalizedRoute.replace(/\/$/, '') || '/').slice(1).split('/');
  const groups = {};
  let groupIndex = 1;
  const parameterizedRoute = segments.map(segment => {
    if (segment.startsWith('[') && segment.endsWith(']')) {
      const {
        key,
        optional,
        repeat
      } = parseParameter(segment.slice(1, -1));
      groups[key] = {
        pos: groupIndex++,
        repeat,
        optional
      };
      return repeat ? optional ? '(?:/(.+?))?' : '/(.+?)' : '/([^/]+?)';
    } else {
      return `/${escapeRegex(segment)}`;
    }
  }).join(''); // dead code eliminate for browser since it's only needed
  // while generating routes-manifest

  if (true) {
    let routeKeyCharCode = 97;
    let routeKeyCharLength = 1; // builds a minimal routeKey using only a-z and minimal number of characters

    const getSafeRouteKey = () => {
      let routeKey = '';

      for (let i = 0; i < routeKeyCharLength; i++) {
        routeKey += String.fromCharCode(routeKeyCharCode);
        routeKeyCharCode++;

        if (routeKeyCharCode > 122) {
          routeKeyCharLength++;
          routeKeyCharCode = 97;
        }
      }

      return routeKey;
    };

    const routeKeys = {};
    let namedParameterizedRoute = segments.map(segment => {
      if (segment.startsWith('[') && segment.endsWith(']')) {
        const {
          key,
          optional,
          repeat
        } = parseParameter(segment.slice(1, -1)); // replace any non-word characters since they can break
        // the named regex

        let cleanedKey = key.replace(/\W/g, '');
        let invalidKey = false; // check if the key is still invalid and fallback to using a known
        // safe key

        if (cleanedKey.length === 0 || cleanedKey.length > 30) {
          invalidKey = true;
        }

        if (!isNaN(parseInt(cleanedKey.substr(0, 1)))) {
          invalidKey = true;
        }

        if (invalidKey) {
          cleanedKey = getSafeRouteKey();
        }

        routeKeys[cleanedKey] = key;
        return repeat ? optional ? `(?:/(?<${cleanedKey}>.+?))?` : `/(?<${cleanedKey}>.+?)` : `/(?<${cleanedKey}>[^/]+?)`;
      } else {
        return `/${escapeRegex(segment)}`;
      }
    }).join('');
    return {
      re: new RegExp(`^${parameterizedRoute}(?:/)?$`),
      groups,
      routeKeys,
      namedRegex: `^${namedParameterizedRoute}(?:/)?$`
    };
  }

  return {
    re: new RegExp(`^${parameterizedRoute}(?:/)?$`),
    groups
  };
}

/***/ }),

/***/ 3937:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.execOnce = execOnce;
exports.getLocationOrigin = getLocationOrigin;
exports.getURL = getURL;
exports.getDisplayName = getDisplayName;
exports.isResSent = isResSent;
exports.loadGetInitialProps = loadGetInitialProps;
exports.formatWithValidation = formatWithValidation;
exports.ST = exports.SP = exports.urlObjectKeys = void 0;

var _formatUrl = __webpack_require__(7687);
/**
* Utils
*/


function execOnce(fn) {
  let used = false;
  let result;
  return (...args) => {
    if (!used) {
      used = true;
      result = fn(...args);
    }

    return result;
  };
}

function getLocationOrigin() {
  const {
    protocol,
    hostname,
    port
  } = window.location;
  return `${protocol}//${hostname}${port ? ':' + port : ''}`;
}

function getURL() {
  const {
    href
  } = window.location;
  const origin = getLocationOrigin();
  return href.substring(origin.length);
}

function getDisplayName(Component) {
  return typeof Component === 'string' ? Component : Component.displayName || Component.name || 'Unknown';
}

function isResSent(res) {
  return res.finished || res.headersSent;
}

async function loadGetInitialProps(App, ctx) {
  if (false) { var _App$prototype; } // when called from _app `ctx` is nested in `ctx`


  const res = ctx.res || ctx.ctx && ctx.ctx.res;

  if (!App.getInitialProps) {
    if (ctx.ctx && ctx.Component) {
      // @ts-ignore pageProps default
      return {
        pageProps: await loadGetInitialProps(ctx.Component, ctx.ctx)
      };
    }

    return {};
  }

  const props = await App.getInitialProps(ctx);

  if (res && isResSent(res)) {
    return props;
  }

  if (!props) {
    const message = `"${getDisplayName(App)}.getInitialProps()" should resolve to an object. But found "${props}" instead.`;
    throw new Error(message);
  }

  if (false) {}

  return props;
}

const urlObjectKeys = ['auth', 'hash', 'host', 'hostname', 'href', 'path', 'pathname', 'port', 'protocol', 'query', 'search', 'slashes'];
exports.urlObjectKeys = urlObjectKeys;

function formatWithValidation(url) {
  if (false) {}

  return (0, _formatUrl.formatUrl)(url);
}

const SP = typeof performance !== 'undefined';
exports.SP = SP;
const ST = SP && typeof performance.mark === 'function' && typeof performance.measure === 'function';
exports.ST = ST;

/***/ }),

/***/ 5722:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getStaticProps": function() { return /* binding */ getStaticProps; },
/* harmony export */   "default": function() { return /* binding */ NotionDomainPage; }
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5282);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9297);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lib_config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7355);
/* harmony import */ var lib_resolve_notion_page__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1412);
/* harmony import */ var components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(1185);


function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





const getStaticProps = async () => {
  try {
    const props = await (0,lib_resolve_notion_page__WEBPACK_IMPORTED_MODULE_3__/* .resolveNotionPage */ .g)(lib_config__WEBPACK_IMPORTED_MODULE_2__/* .domain */ .nw);
    return {
      props,
      revalidate: 10
    };
  } catch (err) {
    console.error('page error', lib_config__WEBPACK_IMPORTED_MODULE_2__/* .domain */ .nw, err); // we don't want to publish the error version of this page, so
    // let next.js know explicitly that incremental SSG failed

    throw err;
  }
};
function NotionDomainPage(props) {
  return /*#__PURE__*/react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(components__WEBPACK_IMPORTED_MODULE_4__/* .NotionPage */ .mK, _objectSpread({}, props));
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

/***/ 2539:
/***/ (function(module) {

// Exports
module.exports = {
	"pageSocial": "PageSocial_pageSocial__2WqHl",
	"action": "PageSocial_action__2zgVt",
	"actionBg": "PageSocial_actionBg__3CigO",
	"actionBgPane": "PageSocial_actionBgPane__gbBkL",
	"facebook": "PageSocial_facebook__3o4sf",
	"twitter": "PageSocial_twitter__-BgFt",
	"linkedin": "PageSocial_linkedin__nElHT",
	"github": "PageSocial_github__slQ0z",
	"medium": "PageSocial_medium__xqvNJ",
	"email": "PageSocial_email__22NP5",
	"links": "PageSocial_links__3pCg6"
};


/***/ }),

/***/ 1487:
/***/ (function(module) {

// Exports
module.exports = {
	"container": "styles_container__34prM",
	"loadingIcon": "styles_loadingIcon__3Ke2b",
	"spinner": "styles_spinner__307xT",
	"main": "styles_main__2iNpi",
	"errorImage": "styles_errorImage__1yOPE",
	"footer": "styles_footer__1r_c6",
	"copyright": "styles_copyright__3kWHj",
	"settings": "styles_settings__1ed8a",
	"social": "styles_social__235gY",
	"toggleDarkMode": "styles_toggleDarkMode__1icXg",
	"twitter": "styles_twitter__WwfaA",
	"github": "styles_github__32xIr",
	"linkedin": "styles_linkedin__1XGvB",
	"comments": "styles_comments__eWSFD",
	"utterances": "styles_utterances__3A-24",
	"pageActions": "styles_pageActions__3AS89",
	"likeTweet": "styles_likeTweet__1MKrv",
	"retweet": "styles_retweet__3elI5",
	"githubCorner": "styles_githubCorner__1WYyN",
	"octoArm": "styles_octoArm__LVchX",
	"octocat-wave": "styles_octocat-wave__13zbz"
};


/***/ }),

/***/ 9320:
/***/ (function(__unused_webpack_module, exports) {

"use strict";
exports.__esModule=true;exports.normalizePathSep=normalizePathSep;exports.denormalizePagePath=denormalizePagePath;function normalizePathSep(path){return path.replace(/\\/g,'/');}function denormalizePagePath(page){page=normalizePathSep(page);if(page.startsWith('/index/')){page=page.slice(6);}else if(page==='/index'){page='/';}return page;}
//# sourceMappingURL=denormalize-page-path.js.map

/***/ }),

/***/ 1664:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(6071)


/***/ }),

/***/ 8417:
/***/ (function(module) {

"use strict";
module.exports = require("next/dist/next-server/lib/router-context.js");;

/***/ }),

/***/ 2238:
/***/ (function(module) {

"use strict";
module.exports = require("next/dist/next-server/lib/router/utils/get-asset-path-from-route.js");;

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

/***/ 8665:
/***/ (function(module) {

"use strict";
module.exports = require("p-map");;

/***/ }),

/***/ 3303:
/***/ (function(module) {

"use strict";
module.exports = require("p-memoize");;

/***/ }),

/***/ 9297:
/***/ (function(module) {

"use strict";
module.exports = require("react");;

/***/ }),

/***/ 761:
/***/ (function(module) {

"use strict";
module.exports = require("react-notion-x");;

/***/ }),

/***/ 5282:
/***/ (function(module) {

"use strict";
module.exports = require("react/jsx-runtime");;

/***/ }),

/***/ 4453:
/***/ (function() {

/* (ignored) */

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
var __webpack_exports__ = (__webpack_exec__(5722));
module.exports = __webpack_exports__;

})();