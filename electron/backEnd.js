"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var dataType_1 = require("./dataType");
var Info_1 = require("./Info");
var Downloader_1 = require("./Downloader");
var info = new Info_1.Info();
var downloader = new Downloader_1.Downloader();
var BackEnd = /** @class */ (function () {
    function BackEnd() {
        this.getInfo();
        this.getInfoListImmediately();
        this.download();
        this.getDownloadListImmediately();
        this.getDefaultPath();
        this.clearInfo();
        this.clearDownload();
        this.setPath();
        this.stopDownload();
        this.stopSearch();
        this.setProgressBar();
    }
    BackEnd.prototype.setBrowserWindow = function (win) {
        this.browserWindow = win;
    };
    BackEnd.prototype.stopDownload = function () {
        electron_1.ipcMain.on(dataType_1.MessageType.stopDownloadMessage, function (event, url) {
            downloader.stop();
        });
    };
    BackEnd.prototype.stopSearch = function () {
        electron_1.ipcMain.on(dataType_1.MessageType.stopSearchMessage, function (event, url) {
            info.stop();
        });
    };
    BackEnd.prototype.getInfo = function () {
        console.log('!!!!1');
        electron_1.ipcMain.on(dataType_1.MessageType.getInfoMessage, function (event, url) {
            console.log('!!!!2');
            info.get(url);
        });
    };
    BackEnd.prototype.getInfoListImmediately = function () {
        electron_1.ipcMain.on(dataType_1.MessageType.getInfoListImmediatelyMessage, function (event, url) {
            event.reply(dataType_1.MessageType.getInfoListImmediatelyReply, info.getInfoListImmediately());
        });
    };
    BackEnd.prototype.download = function () {
        electron_1.ipcMain.on(dataType_1.MessageType.downloadMessage, function (event, videoInfo) {
            downloader.download(videoInfo);
        });
    };
    BackEnd.prototype.getDownloadListImmediately = function () {
        electron_1.ipcMain.on(dataType_1.MessageType.getDownloadListImmediatelyMessage, function (event, url) {
            event.reply(dataType_1.MessageType.getDownloadListImmediatelyReply, downloader.getListImmediately());
        });
    };
    BackEnd.prototype.getDefaultPath = function () {
        electron_1.ipcMain.on(dataType_1.MessageType.getDefaultPathMessage, function (event, url) {
            event.reply(dataType_1.MessageType.getDefaultPathReply, require('os').homedir());
        });
    };
    BackEnd.prototype.clearDownload = function () {
        electron_1.ipcMain.on(dataType_1.MessageType.clearInfoMessage, function (event, url) {
            downloader.clear();
        });
    };
    BackEnd.prototype.clearInfo = function () {
        electron_1.ipcMain.on(dataType_1.MessageType.clearInfoMessage, function (event, url) {
            info.clear();
        });
    };
    BackEnd.prototype.setPath = function () {
        electron_1.ipcMain.on(dataType_1.MessageType.setPathMessage, function (event, path) {
            downloader.setPath(path);
        });
    };
    BackEnd.prototype.setProgressBar = function () {
        var _this = this;
        electron_1.ipcMain.on(dataType_1.MessageType.setProgressBarMessage, function (event, progress) {
            // console.log('---> setProgressBarMessage', progress)
            try {
                _this.browserWindow.setProgressBar(progress);
            }
            catch (e) {
                console.log(e);
            }
        });
    };
    return BackEnd;
}());
exports.BackEnd = BackEnd;
//# sourceMappingURL=backEnd.js.map