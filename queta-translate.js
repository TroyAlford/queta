(self["webpackChunkqueta"] = self["webpackChunkqueta"] || []).push([[498],{

/***/ 228:
/***/ ((module) => {

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

module.exports = _arrayLikeToArray;

/***/ }),

/***/ 858:
/***/ ((module) => {

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

module.exports = _arrayWithHoles;

/***/ }),

/***/ 884:
/***/ ((module) => {

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

module.exports = _iterableToArrayLimit;

/***/ }),

/***/ 521:
/***/ ((module) => {

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableRest;

/***/ }),

/***/ 38:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayWithHoles = __webpack_require__(858);

var iterableToArrayLimit = __webpack_require__(884);

var unsupportedIterableToArray = __webpack_require__(379);

var nonIterableRest = __webpack_require__(521);

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
}

module.exports = _slicedToArray;

/***/ }),

/***/ 379:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var arrayLikeToArray = __webpack_require__(228);

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}

module.exports = _unsupportedIterableToArray;

/***/ }),

/***/ 747:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "dependencies": () => /* binding */ dependencies,
/* harmony export */   "resolve": () => /* binding */ resolve,
/* harmony export */   "translate": () => /* binding */ translate
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(38);
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__);

var glaemscribe = null;
var modes = [];
var dependencies = Promise.all([__webpack_require__.e(/* import() | glaemscribe */ 459).then(__webpack_require__.bind(__webpack_require__, 272)), __webpack_require__.e(/* import() | styles */ 532).then(__webpack_require__.bind(__webpack_require__, 769))]).then(function (_ref) {
  var _ref2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_ref, 1),
      gs = _ref2[0]["default"];

  glaemscribe = gs;
  glaemscribe.resource_manager.load_charsets();
  glaemscribe.resource_manager.load_modes();
  modes = Array.from(Object.values(glaemscribe.resource_manager.loaded_modes));
});
var resolve = function resolve(language, typeface) {
  var _mode$supported_chars;

  var mode = modes.find(function (m) {
    return m.name === language;
  });
  if (!mode) return {
    charset: null,
    mode: null
  };
  return {
    charset: (_mode$supported_chars = mode.supported_charsets[typeface]) !== null && _mode$supported_chars !== void 0 ? _mode$supported_chars : mode.default_charset,
    mode: mode
  };
};
var translate = function translate(text, language, typeface) {
  var _resolve = resolve(language, typeface),
      charset = _resolve.charset,
      mode = _resolve.mode;

  if (!mode) {
    return {
      success: false,
      text: text,
      translation: null
    };
  }

  var _mode$transcribe = mode.transcribe(text, charset),
      _mode$transcribe2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(_mode$transcribe, 2),
      success = _mode$transcribe2[0],
      transcription = _mode$transcribe2[1];

  return {
    success: success,
    text: text,
    translation: transcription
  };
};

/***/ })

}]);
//# sourceMappingURL=queta-translate.js.map