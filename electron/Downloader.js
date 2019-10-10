"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var request = require('request');
var youtubedl = require('youtube-dl');
var path = require("path");
var fs = require('fs');
var Downloader = /** @class */ (function () {
    function Downloader() {
        this.isLoadNow = false;
        this.videoInfoList = [];
        this.path = '';
    }
    Downloader.prototype.clear = function () {
        this.videoInfoList = [];
    };
    Downloader.prototype._doDownload = function (videoInfo) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                console.log('aaaaasdad');
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        // try {
                        // const video = youtubedl(videoInfo.url, ['--format=18']);
                        console.log('!!!', videoInfo.selectedFormat.format);
                        if (videoInfo.selectedFormat.format.includes('audio')) {
                            console.log(videoInfo.selectedFormat.format);
                            console.log(videoInfo.selectedFormat.url);
                            request
                                .get(videoInfo.selectedFormat.url)
                                .on('error', function (err) {
                                reject(err);
                            })
                                .on('end', function (err) {
                                resolve('ok');
                            })
                                .pipe(fs.createWriteStream(path.join(_this.path, videoInfo.title + '.' + videoInfo.selectedFormat.ext)));
                            // youtubedl.exec(videoInfo.selectedFormat.url, ['-x', '--audio-format', 'mp3'], {}, function (err, output) {
                            //   if (err) {
                            //     // console.log('------------------>', err);
                            //     reject(err);
                            //   } else  {
                            //     videoInfo.isLoaded = true;
                            //
                            //
                            //     resolve('ok');
                            //
                            //
                            //   }
                            //   console.log('------------------>', output);
                            // });
                        }
                        else {
                            console.log('!!!@!#@#');
                            var video = youtubedl(videoInfo.url, ["--format=" + videoInfo.selectedFormat.format_id]);
                            var output = path.join(_this.path, videoInfo.title + '.' + videoInfo.selectedFormat.ext);
                            video.pipe(fs.createWriteStream(output));
                            video.on('end', function () {
                                videoInfo.isLoaded = true;
                                resolve('ok');
                            });
                        }
                        // } catch (error) {
                        //   reject(error);
                        // }
                    })];
            });
        });
    };
    Downloader.prototype.setPath = function (pathStr) {
        this.path = pathStr;
    };
    Downloader.prototype.processArray = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _loop_1, this_1, _i, _a, videoInfo;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _loop_1 = function (videoInfo) {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        console.log('oooo');
                                        if (!(!videoInfo.isLoaded && this_1.isLoadNow)) return [3 /*break*/, 2];
                                        console.log('aaaa');
                                        return [4 /*yield*/, this_1._doDownload(videoInfo)
                                                .then(function (info) {
                                                console.log('nnnnn');
                                                videoInfo.isLoaded = true;
                                            }, function (error) {
                                                videoInfo.isLoaded = true;
                                            })];
                                    case 1:
                                        _a.sent();
                                        _a.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, _a = this.videoInfoList;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        videoInfo = _a[_i];
                        return [5 /*yield**/, _loop_1(videoInfo)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, 'ok'];
                }
            });
        });
    };
    Downloader.prototype.getListImmediately = function () {
        // console.log('---> getListImmediately()')
        return {
            videoInfo: this.videoInfoList,
            isLoadNow: this.isLoadNow
        };
    };
    Downloader.prototype.stop = function () {
        this.clear();
        this.isLoadNow = false;
    };
    Downloader.prototype.download = function (videoInfo) {
        if (videoInfo === void 0) { videoInfo = []; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.isLoadNow = true;
                        videoInfo.forEach(function (e) {
                            var isUnique = true;
                            _this.videoInfoList.forEach(function (et) {
                                if (e.url === et.url && _this.isLoadNow) {
                                    isUnique = false;
                                }
                            });
                            if (isUnique && _this.isLoadNow) {
                                _this.videoInfoList.push(e);
                            }
                        });
                        if (!this.isLoadNow) return [3 /*break*/, 2];
                        console.log('pppp');
                        return [4 /*yield*/, this.processArray()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        this.isLoadNow = false;
                        return [2 /*return*/, this.videoInfoList];
                }
            });
        });
    };
    return Downloader;
}());
exports.Downloader = Downloader;
//# sourceMappingURL=Downloader.js.map