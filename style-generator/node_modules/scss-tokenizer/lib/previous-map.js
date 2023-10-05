'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jsBase = require('js-base64');

var _sourceMap = require('source-map');

var _sourceMap2 = _interopRequireDefault(_sourceMap);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PreviousMap = function () {
    function PreviousMap(css, opts) {
        _classCallCheck(this, PreviousMap);

        this.loadAnnotation(css);
        this.inline = this.startWith(this.annotation, 'data:');

        var prev = opts.map ? opts.map.prev : undefined;
        var text = this.loadMap(opts.from, prev);
        if (text) this.text = text;
    }

    _createClass(PreviousMap, [{
        key: 'consumer',
        value: function consumer() {
            if (!this.consumerCache) {
                this.consumerCache = new _sourceMap2.default.SourceMapConsumer(this.text);
            }
            return this.consumerCache;
        }
    }, {
        key: 'withContent',
        value: function withContent() {
            return !!(this.consumer().sourcesContent && this.consumer().sourcesContent.length > 0);
        }
    }, {
        key: 'startWith',
        value: function startWith(string, start) {
            if (!string) return false;
            return string.substr(0, start.length) === start;
        }
    }, {
        key: 'loadAnnotation',
        value: function loadAnnotation(css) {
            var match = css.match(/\/\*\s*# sourceMappingURL=((?:(?!sourceMappingURL=).)*)\s*\*\//);
            if (match) this.annotation = match[1].trim();
        }
    }, {
        key: 'decodeInline',
        value: function decodeInline(text) {
            var utfd64 = 'data:application/json;charset=utf-8;base64,';
            var utf64 = 'data:application/json;charset=utf8;base64,';
            var b64 = 'data:application/json;base64,';
            var uri = 'data:application/json,';

            if (this.startWith(text, uri)) {
                return decodeURIComponent(text.substr(uri.length));
            } else if (this.startWith(text, base64)) {
                return _jsBase.Base64.decode(text.substr(base64.length));
            } else if (this.startWith(text, utf64)) {
                return _jsBase.Base64.decode(text.substr(utf64.length));
            } else if (this.startWith(text, utfd64)) {
                return _jsBase.Base64.decode(text.substr(utfd64.length));
            } else {
                var encoding = text.match(/data:application\/json;([^,]+),/)[1];
                throw new Error('Unsupported source map encoding ' + encoding);
            }
        }
    }, {
        key: 'loadMap',
        value: function loadMap(file, prev) {
            if (prev === false) return false;

            if (prev) {
                if (typeof prev === 'string') {
                    return prev;
                } else if (prev instanceof _sourceMap2.default.SourceMapConsumer) {
                    return _sourceMap2.default.SourceMapGenerator.fromSourceMap(prev).toString();
                } else if (prev instanceof _sourceMap2.default.SourceMapGenerator) {
                    return prev.toString();
                } else if ((typeof prev === 'undefined' ? 'undefined' : _typeof(prev)) === 'object' && prev.mappings) {
                    return JSON.stringify(prev);
                } else {
                    throw new Error('Unsupported previous source map format: ' + prev.toString());
                }
            } else if (this.inline) {
                return this.decodeInline(this.annotation);
            } else if (this.annotation) {
                var map = this.annotation;
                if (file) map = _path2.default.join(_path2.default.dirname(file), map);

                this.root = _path2.default.dirname(map);
                if (_fs2.default.existsSync && _fs2.default.existsSync(map)) {
                    return _fs2.default.readFileSync(map, 'utf-8').toString().trim();
                } else {
                    return false;
                }
            }
        }
    }]);

    return PreviousMap;
}();

exports.default = PreviousMap;