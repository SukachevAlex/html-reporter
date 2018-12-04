'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importStar(require("react"));
var react_redux_1 = require("react-redux");
var react_lazyload_1 = tslib_1.__importDefault(require("react-lazyload"));
var Screenshot = /** @class */ (function (_super) {
    tslib_1.__extends(Screenshot, _super);
    function Screenshot() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Screenshot.prototype.render = function () {
        var _a = this.props, noCache = _a.noCache, imagePath = _a.imagePath, lazyLoadOffset = _a.lazyLoadOffset;
        var url = noCache
            ? addTimestamp(encodeUri(imagePath))
            : encodeUri(imagePath);
        var elem = react_1.default.createElement("img", { src: url, className: 'image-box__screenshot' });
        return lazyLoadOffset ? (react_1.default.createElement(react_lazyload_1.default, { offset: lazyLoadOffset }, elem)) : elem;
    };
    Screenshot.defaultProps = {
        noCache: false
    };
    return Screenshot;
}(react_1.Component));
exports.default = react_redux_1.connect(function (_a) {
    var lazyLoadOffset = _a.view.lazyLoadOffset;
    return ({ lazyLoadOffset: lazyLoadOffset });
})(Screenshot);
function encodeUri(imagePath) {
    return imagePath
        .split('/')
        .map(function (item) { return encodeURIComponent(item); })
        .join('/');
}
// for prevent image caching
function addTimestamp(imagePath) {
    return imagePath + "?t=" + Date.now();
}
//# sourceMappingURL=screenshot.js.map