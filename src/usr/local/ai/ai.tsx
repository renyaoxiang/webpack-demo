var AipSpeech = require("baidu-ai").speech;
var AipVoice = require("baidu-ai").speech;
// 设置APPID/AK/SK
var APP_ID = "你的 App ID";
var API_KEY = "你的 Api ID";
var SECRET_KEY = "你的 Secret Key";

var client = new AipVoice(APP_ID, API_KEY, SECRET_KEY);