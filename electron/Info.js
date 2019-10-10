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
var YoutubeGrabber = require('youtube-grabber-js');
var youtubeDl = require('youtube-dl');
var dataType_1 = require("./dataType");
var Info = /** @class */ (function () {
    function Info() {
        this.isLoadNow = false;
        this.videoInfoList = [];
        this.videoUrlList = [];
    }
    Info.prototype.clear = function () {
        this.videoInfoList = [];
        this.videoUrlList = [];
    };
    Info.prototype._isValidUrl = function (url) {
        return YoutubeGrabber.isYoutubeURLValid(url);
    };
    Info.prototype._getType = function (url) {
        return YoutubeGrabber.getTypeOfResource(url);
    };
    Info.prototype.get = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var infoResponse, type, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log('get', url);
                        this.isLoadNow = true;
                        infoResponse = new dataType_1.InfoResponse();
                        infoResponse.valid = this._isValidUrl(url);
                        type = this._getType(url);
                        console.log('type', type);
                        if (!this.isLoadNow) return [3 /*break*/, 5];
                        if (!(type === dataType_1.DataType.video)) return [3 /*break*/, 1];
                        this.videoUrlList.push(url);
                        return [3 /*break*/, 5];
                    case 1:
                        if (!(type === dataType_1.DataType.playlist)) return [3 /*break*/, 3];
                        return [4 /*yield*/, YoutubeGrabber.getPlaylistInfo(url)
                                .then(function (res) {
                                console.log('---1', res);
                                if (res.error.status) {
                                    if (_this.errorCounter < 4) {
                                        _this.get(url);
                                    }
                                    else {
                                        infoResponse.error = res.error.reason;
                                    }
                                    _this.errorCounter++;
                                }
                                else {
                                    _this.errorCounter = 0;
                                    var playlistArr = res.info.videos.array;
                                    playlistArr.forEach(function (e) {
                                        _this.videoUrlList.push('https://www.youtube.com' + e.youtubeUrl);
                                    });
                                }
                            }, function (error) {
                                if (_this.errorCounter < 4) {
                                    _this.get(url);
                                }
                                _this.errorCounter++;
                                console.log('---2', error);
                                // infoResponse.error = error;
                            })];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        if (!(type === dataType_1.DataType.channel)) return [3 /*break*/, 5];
                        return [4 /*yield*/, YoutubeGrabber.getChannelInfo(url, { videos: true })
                                .then(function (res) {
                                if (res.error.status) {
                                    infoResponse.error = res.error.reason;
                                }
                                else {
                                    res.info.videos.forEach(function (e) {
                                        _this.videoUrlList.push('https://www.youtube.com' + e.youtubeUrl);
                                    });
                                }
                            }, function (error) {
                                infoResponse.error = error;
                            })];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5:
                        if (!this.isLoadNow) return [3 /*break*/, 7];
                        _a = infoResponse;
                        return [4 /*yield*/, this.processArray(this.videoUrlList)];
                    case 6:
                        _a.video = _b.sent();
                        _b.label = 7;
                    case 7:
                        setTimeout(function () {
                            _this.isLoadNow = false;
                            // this.videoInfoList = [];
                        }, 1000);
                        // return
                        // console.log('---> infoResponse', infoResponse)
                        return [2 /*return*/, infoResponse];
                }
            });
        });
    };
    Info.prototype.processArray = function (videoUrlList) {
        return __awaiter(this, void 0, void 0, function () {
            var res, _i, videoUrlList_1, videoUr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        res = [];
                        if (!this.isLoadNow) return [3 /*break*/, 4];
                        _i = 0, videoUrlList_1 = videoUrlList;
                        _a.label = 1;
                    case 1:
                        if (!(_i < videoUrlList_1.length)) return [3 /*break*/, 4];
                        videoUr = videoUrlList_1[_i];
                        if (!this.isLoadNow) return [3 /*break*/, 3];
                        return [4 /*yield*/, this._getInfo(videoUr)
                                .then(function (videoInfo) {
                                res.push(videoInfo);
                            }, function (error) {
                                // console.log('---> error 2');
                            })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, res];
                }
            });
        });
    };
    Info.prototype._getInfo = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        youtubeDl.getInfo(url, [], function (err, res) {
                            if (err == null) {
                                console.log(res);
                                var formatList_1 = [];
                                res.formats.forEach(function (e) {
                                    formatList_1.push(new dataType_1.Formats(e.format, e.format_note, e.format_id, e.filesize, e.ext, e.height, e.url));
                                });
                                var info = new dataType_1.VideoInfo();
                                info.channelUrl = res.channel_url;
                                info.formats = formatList_1;
                                info.title = res.title.split('/').join('').split('\\').join('');
                                info.description = res.description;
                                info.duration = res._duration_hms;
                                info.url = url;
                                info.selectedFormat = formatList_1[formatList_1.length - 1];
                                info.thumbnail = res.thumbnail;
                                _this.videoInfoList.push(info);
                                resolve(info);
                            }
                            else {
                                reject(err);
                            }
                        });
                    })];
            });
        });
    };
    Info.prototype.getInfoListImmediately = function () {
        return {
            videoInfoList: this.videoInfoList,
            videoUrlList: this.videoUrlList,
            isLoadNow: this.isLoadNow,
        };
    };
    Info.prototype.getDefaultPath = function () {
        return process.cwd();
    };
    Info.prototype.stop = function () {
        this.isLoadNow = false;
    };
    return Info;
}());
exports.Info = Info;
//# sourceMappingURL=Info.js.map