var fs = require("fs");
var mkdirp = require("mkdirp");
var path = require("path");
var moment = require("moment");
var log4js = require("log4js");
var logrotate = require("./log-rotator-util");
var logConfigPath = path.join(
  __dirname,
  "..",
  "..",
  "config",
  "log4js",
  "log4js-config.json"
);
var data = fs.readFileSync(logConfigPath, "utf8");
var logConfig = JSON.parse(data);
var os = require("os");
var hostname = os.hostname();
var cron = require("node-cron");

var logDir = process.env.LOG_PATH || "./logs";
var logRotateTime = process.env.LOG_ROTATE_TIME || "15";

for (var key in logConfig.appenders) {
  var logAppender = logConfig.appenders[key];
  if (logAppender.filename) {
    var fileNameSplit = logAppender.filename.split("/");
    // var pathFile = logDir + '/' + `${fileNameSplit[0]}/${hostname}_${process.env.LOG_APPNAME}_${moment().format("YYYYMMDD")}_${fileNameSplit[1]}`;
    var pathFile = logDir + "/" + logAppender.filename;
    var dirLog = path.dirname(pathFile);
    if (!fs.existsSync(dirLog)) {
      mkdirp(dirLog);
    }
    logAppender.filename = pathFile;
    logConfig.appenders[key] = logAppender;
  }
}
path.dirname(require.main.filename);

log4js.configure(logConfig);

var rotator = null;
if (rotator == null) {
  rotator = logrotate.rotator;
  for (var key in logConfig.appenders) {
    if (logConfig.appenders[key].type == "dateFile") {
      var pathLogFile = logConfig.appenders[key].filename;
      rotator.register(pathLogFile, {
        schedule: logRotateTime + "m",
        size: "10m",
        compress: false,
        count: 10,
        format: function (index) {
          let format = index;
          return format;
        },
      });
    }
  }

  rotator.on("error", function (err) {});
}

// set daily
cron.schedule(
  "0 0 * * *",
  async function () {
    for (var key in logConfig.appenders) {
      if (logConfig.appenders[key].type == "dateFile") {
        var pathLogFile = logConfig.appenders[key].filename;
        var fileNameSplit = pathLogFile.split("/");
        var pathFile =
          logDir +
          "/" +
          `${fileNameSplit[2]}/${hostname}_${process.env.LOG_APPNAME}_${moment()
            .subtract(1, "days")
            .format("YYYYMMDD")}_${fileNameSplit[3]}`;

        var dataRead = await fs.readFileSync(pathLogFile);
        await fs.writeFileSync(pathFile, dataRead);
        // truncate log file to size 0
        await fs.truncateSync(pathLogFile, 0, function (err) {
          if (err) {
            console.log(err);
            return;
          }
        });
      }
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Bangkok",
  }
);

module.exports = log4js;
