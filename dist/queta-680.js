(self["webpackChunkqueta"] = self["webpackChunkqueta"] || []).push([[680],{

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
var dependencies = Promise.all([__webpack_require__.e(/* import() */ 272).then(__webpack_require__.bind(__webpack_require__, 272)), __webpack_require__.e(/* import() */ 769).then(__webpack_require__.bind(__webpack_require__, 769))]).then(function (_ref) {
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
//# sourceMappingURL=queta-680.js.map