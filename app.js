let envtemp = require("./config");
const env = envtemp[process.env.NODE_ENV];
for (let key in env) {
  process.env[key] = env[key];
}

const express = require("express");
const expressWs = require("express-ws");
const WebSocket = require("ws");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
var passport = require("passport");
const NodeCache = require("node-cache");
const cache = new NodeCache({ enableLegacyCallbacks: true, checkperiod: 60 });
const cacheSAMLUser = new NodeCache({
  enableLegacyCallbacks: true,
  checkperiod: 60,
});
const cacheNodeAccess = new NodeCache({
  enableLegacyCallbacks: true,
  checkperiod: 60,
});
const cacheNodeId = new NodeCache({
  enableLegacyCallbacks: true,
  checkperiod: 60,
});
const cacheStaticData = new NodeCache();
var proxy = require("express-http-proxy");
const fetch = require("node-fetch");
cache.on("expired", function (key, value) {
  // token expired
});
const { passportSaml, samlStrategy } = require("./app/passport/passport-saml");
passportSaml(passport);
const jwt = require("jsonwebtoken");
// logger
const { performance } = require("perf_hooks");
var moment = require("moment-timezone");
moment.tz.setDefault("Asia/Bangkok");
const Utils = require("./utils");
var log4js = require("./config/log4js/logger-util");
const accessLogger = log4js.getLogger("access");
const appLogger = log4js.getLogger("application");
var ip = "";
const numberDigit = 3;
// get ip
require("dns").lookup(
  require("os").hostname(),
  function (err, address, family) {
    ip = address;
  }
);
var os = require("os");
var hostname = os.hostname();

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  express.static(path.join(__dirname, "./dist/TTS-transform"), {
    setHeaders: function (res, path) {
      res.set("Server", process.env.HTTP_HEADER_SERVER);
      res.set(
        "Access-Control-Allow-Origin",
        process.env.HTTP_HEADER_ACCESS_CONTROL_ALLOW_ORIGIN
      );
      res.set(
        "Access-Control-Allow-Credentials",
        process.env.HTTP_HEADER_ACCESS_CONTROL_ALLOW_CREDENTIALS
      );
      res.set(
        "Access-Control-Allow-Headers",
        process.env.HTTP_HEADER_ACCESS_CONTROL_ALLOW_HEADERS
      );
      res.set(
        "Access-Control-Allow-Method",
        process.env.HTTP_HEADER_ACCESS_CONTROL_ALLOW_METHODS
      );
      res.set(
        "Access-Control-Expose-Headers",
        process.env.HTTP_HEADER_ACCESS_CONTROL_EXPOSE_HEADERS
      );
      res.set("x-frame-options", process.env.HTTP_HEADER_X_FRAME_OPTIONS);
      res.set("x-powered-by", process.env.HTTP_HEADER_X_POWERED_BY);
      res.set("x-xss-protection", process.env.HTTP_HEADER_X_XSS_PROTECTION);
      res.set("Cache-Control", process.env.HTTP_HEADER_CACHE_CONTROL);
      res.set("x-content-type", process.env.HTTP_HEADER_X_CONTENT_TYPE_OPTIONS);
      res.set(
        "Strict-Transport-Security",
        process.env.HTTP_HEADER_STRICT_TRANSPORT_SECURITY
      );
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

const loginPath = "login-asc";
const changeLoginProfilePath = "change-log-in-profile";
const changeLogoutProfilePath = "change-log-out-profile";
const getRegionPath = "get-region";
const tokenDurationInMinute = 5;
const cacheDurationInMinute = 60;

const generateToken = (user) => {
  let profile = null;
  if (user) {
    profile = user;
  }
  if (!profile) return null;
  profile.iat = parseInt(new Date().getTime());
  profile.exp = parseInt(
    new Date().getTime() +
      tokenDurationInMinute * 60 * 1000 +
      Math.floor(Math.random() * 1000)
  );
  let token = jwt.sign(profile, process.env.SECRET || "TTS-transform");
  cache.set(profile.name, token, cacheDurationInMinute * 60);
  let val = cache.get(profile.name);
  profile.token = token;
  return profile;
};

const isMultipartRequest = function (req) {
  let contentTypeHeader = req.headers["content-type"];
  return contentTypeHeader && contentTypeHeader.indexOf("multipart") > -1;
};

const bodyParserJsonMiddleware = function () {
  return function (req, res, next) {
    if (isMultipartRequest(req)) {
      return next();
    }
    return express.json({ limit: "15mb" })(req, res, next);
  };
};

app.use(bodyParserJsonMiddleware());
app.use(express.urlencoded({ limit: "15mb" }));

app.get(
  "/login-saml",
  passport.authenticate("saml", {
    failureRedirect: "/",
    failureFlash: true,
  })
);

app.post(
  process.env.SAML_CALLBACK_LOGIN_PATH,
  passport.authenticate("saml", { failureRedirect: "/", failureFlash: true }),
  async (req, res, next) => {
    // console.log('====================SAML_CALLBACK_LOGIN_PATH=======================');
    // console.log('====================SAML_CALLBACK_LOGIN_PATH req.user =',req.user);
    try {
      if (req.user) {
        let token = jwt.sign(
          { name: req.user.nameID },
          process.env.SECRET || "TTS-transform"
        );
        // console.log('====================SAML_CALLBACK_LOGIN_PATH token =',token);
        let xSessionId = Utils.generatorXSession();
        // console.log('====================SAML_CALLBACK_LOGIN_PATH xSessionId =',xSessionId);
        // console.log('====================SAML_CALLBACK_LOGIN_PATH current-user uri =',process.env.TARGET_HOST_HOSTNAME,':',process.env.TARGET_HOST_PORT,'/api/v1/current-user');
        const response = await fetch(
          `${process.env.TARGET_HOST_HOSTNAME}:${process.env.TARGET_HOST_PORT}/api/v1/current-user`,
          {
            method: "get",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              "X-session-Id": xSessionId,
              projectCode: process.env.PROJECT_CODE,
              transactionId: `${xSessionId}${moment().format(
                "YYYYDDMMHHmmss"
              )}`,
              transactionDate: moment().format("DD/MM/YYYY HH:mm:ss"),
              moduleName: "LOGIN_SAML",
              channel: process.env.LOG_CHANNEL,
              username: req.user.nameID,
            },
          }
        );
        // console.log('====================SAML_CALLBACK_LOGIN_PATH current-user response =',response);
        const data = await response.json();
        const accessId =
          Date.now().toString().substring(0, 9) + data.resultData.id;
        const serv = req.headers.host;
        // console.log('jti: accessId, pid: data.resultData.id, serv, name: req.user.nameID, ::: ',accessId, data.resultData.id, serv, req.user.nameID);
        let jwtUser = {
          jti: accessId,
          pid: data.resultData.id,
          serv,
          name: req.user.nameID,
          fname: data.resultData.firstname + " " + data.resultData.lastname,
          authorities: null,
          enabled: true,
          lastPasswordResetDate: null,
        };
        cacheSAMLUser.set(
          req.user.nameID,
          req.user,
          cacheDurationInMinute * 60
        );
        token = generateToken(jwtUser).token;

        let profile = data.resultData;
        profile.name = profile.username;
        // console.log(' profile be : ',profile);
        // profile.lastLogin = new Date().toLocaleString('en-US');
        let currentDate = new Date().toLocaleString("en-US", {
          day: "numeric", // numeric, 2-digit
          month: "numeric", // numeric, 2-digit,
          year: "numeric", // numeric, 2-digit
          hour: "numeric", // numeric, 2-digit
          minute: "numeric", // numeric, 2-digit
          second: "numeric", // numeric, 2-digit
        });
        profile.lastLogin = currentDate;

        // console.log(' currentDate >>>> : ',currentDate);
        // console.log(' profile af : ',profile);

        // localStorage.setItem('profile',JSON.stringify(profile));
        let userProfile = encodeURIComponent(JSON.stringify(profile));
        // console.log(' userProfile >>>>> ',userProfile);
        res.set("Cache-Control", "no-store");
        res.set("profile", userProfile);
        res.redirect(`/?token=${token}&isSAML=true&profile=${userProfile}`);
      }
    } catch (e) {
      // console.log(' catch error : ');
      res.redirect("/");
    }
  }
);

app.post("/refresh-token", (req, res, next) => {
  // logging
  const t0 = performance.now();
  var startDate = moment().format("DD/MM/YYYY HH:mm:ss");

  if (!req.headers["authorization"]) {
    return res.status(401).json({
      status: "error",
      errorMessage: Utils.ERROR_MESSAGE.NOT_REGISTERED,
    });
  }
  let [authType, token] = req.headers["authorization"].split(" ");
  try {
    if (token && authType == "Bearer") {
      let profile = jwt.verify(token, process.env.SECRET || "TTS-transform");
      let _token = cache.get(profile.name);
      if (_token != token) {
        if (!_token) {
          return res.status(401).json({
            status: "error",
            errorMessage: Utils.ERROR_MESSAGE.NOT_REGISTERED,
          });
        }
        const nodeId = cacheNodeId.get(profile.name);
        if (nodeId) {
          if (cacheNodeAccess.get(nodeId) !== profile.name) {
            return res.status(409).json({
              status: "error",
              errorMessage: Utils.ERROR_MESSAGE.NODE_ACCESS_CONFLIC,
            });
          }
        }
        return res.status(409).json({
          status: "error",
          errorMessage: Utils.ERROR_MESSAGE.USER_ACCESS_CONFLIC,
        });
      }
      profile.iat = parseInt(new Date().getTime());
      profile.exp = parseInt(
        new Date().getTime() +
          tokenDurationInMinute * 60 * 1000 +
          Math.floor(Math.random() * 1000)
      );
      token = jwt.sign(profile, process.env.SECRET || "TTS-transform");
      cache.set(profile.name, token, cacheDurationInMinute * 60);
      if (cacheSAMLUser.get(profile.name)) {
        cacheSAMLUser.set(
          profile.name,
          cacheSAMLUser.get(profile.name),
          cacheDurationInMinute * 60
        );
      }
      // logging
      let tread = `${req.protocol}-${req.hostname}:${req.socket.localPort}`;
      const t1 = performance.now();
      let errorCode = Utils.TEXT_ERROR.SUCCESS.CODE;
      var dataLog = {
        STARTDATE: startDate,
        HOSTNAME: hostname,
        USERNAME: req.headers["username"] || "",
        SESSIONID: req.headers["x-session-id"] || "",
        REQUESTID: req.headers["transactionid"] || "",
        STATUS:
          res.statusCode == 200
            ? Utils.TEXT_RESULT.SUCCESS
            : Utils.TEXT_RESULT.ERROR,
        ERROR_CODE: errorCode || "",
        ERROR_MESSAGE: "",
        ERROR_EXCEPTION: "",
        RETURN_DATE: moment().format("DD/MM/YYYY HH:mm:ss"),
        RETURN_TIME_SEC: ((t1 - t0) / 1000).toFixed(numberDigit),
        SERVICE_NAME: "refreshToken",
        MODULE_NAME: "TT-REFRESH_TOKEN",
        APP_NAME: process.env.LOG_APPNAME,
        CHANNEL: req.headers["channel"] || "",
        REQUEST_DATA: "",
      };
      if (res.statusCode != 200) {
        appLogger.error(Utils.getLogString(dataLog));
      } else {
        appLogger.debug(Utils.getLogString(dataLog));
      }
      // access log
      var dataLog = {
        TIMESTAMP: startDate,
        THREAD: tread || "",
        HOSTNAME: hostname || "",
        USERNAME: req.headers["username"] || "",
        IP: req.headers["x-forwarded-for"] || "",
        SESSIONID: req.headers["x-session-id"] || "",
        REQUESTID: req.headers["transactionid"] || "",
        REQUESTDATE: req.headers["transactiondate"] || "",
        METHOD: req.method || "",
        RESULT:
          res.statusCode == 200
            ? Utils.TEXT_RESULT.SUCCESS
            : Utils.TEXT_RESULT.ERROR,
        ERROR_CODE: Utils.convertStringToErrorCode(
          Utils.TEXT_ERROR.SUCCESS.TEXT
        ),
        RESPONSE_DATE: moment().format("DD/MM/YYYY HH:mm:ss"),
        RESPONSE_TIME_SEC: ((t1 - t0) / 1000).toFixed(numberDigit),
        SERVICE_NAME: "refreshToken",
        MODULE_NAME: "TT-REFRESH_TOKEN",
        APP_NAME: process.env.LOG_APPNAME,
        CHANNEL: req.headers["channel"] || "",
      };
      accessLogger.info(Utils.getLogString(dataLog));

      return res.json({
        status: "success",
        resultData: {
          token: token,
        },
      });
    } else {
      return res.end();
    }
  } catch (error) {
    // logging
    const t1 = performance.now();
    let profile = {
      name: null,
    };
    if (
      req.headers["authorization"] != undefined &&
      req.headers["authorization"] != null
    ) {
      profile = jwt.verify(token, process.env.SECRET || "TTS-transform");
    }
    let errorCode = Utils.TEXT_ERROR.CODE_ERROR.CODE;
    var dataLog = {
      STARTDATE: startDate,
      HOSTNAME: hostname,
      USERNAME: req.headers["username"] || "",
      SESSIONID: req.headers["x-session-id"] || "",
      REQUESTID: req.headers["transactionid"] || "",
      STATUS:
        res.statusCode == 200
          ? Utils.TEXT_RESULT.SUCCESS
          : Utils.TEXT_RESULT.ERROR,
      ERROR_CODE: errorCode || "",
      ERROR_MESSAGE: error.message || "",
      ERROR_EXCEPTION: error.message || "",
      RETURN_DATE: moment().format("DD/MM/YYYY HH:mm:ss"),
      RETURN_TIME_SEC: ((t1 - t0) / 1000).toFixed(numberDigit),
      SERVICE_NAME: "refreshToken",
      MODULE_NAME: "TT-REFRESH_TOKEN",
      APP_NAME: process.env.LOG_APPNAME,
      CHANNEL: req.headers["channel"] || "",
      REQUEST_DATA: "",
    };
    appLogger.error(Utils.getLogString(dataLog));
    // access log
    var dataLog = {
      TIMESTAMP: startDate,
      THREAD: tread || "",
      HOSTNAME: hostname,
      USERNAME: req.headers["username"] || "",
      IP: req.headers["x-forwarded-for"] || "",
      SESSIONID: req.headers["x-session-id"] || "",
      REQUESTID: req.headers["transactionid"] || "",
      REQUESTDATE: req.headers["transactiondate"] || "",
      METHOD: req.method,
      RESULT:
        res.statusCode == 200
          ? Utils.TEXT_RESULT.SUCCESS
          : Utils.TEXT_RESULT.ERROR,
      ERROR_CODE: Utils.convertStringToErrorCode(
        Utils.TEXT_ERROR.CODE_ERROR.TEXT
      ),
      RESPONSE_DATE: moment().format("DD/MM/YYYY HH:mm:ss"),
      RESPONSE_TIME_SEC: ((t1 - t0) / 1000).toFixed(numberDigit),
      SERVICE_NAME: "refreshToken",
      MODULE_NAME: "TT-REFRESH_TOKEN",
      APP_NAME: process.env.LOG_APPNAME,
      CHANNEL: req.headers["channel"] || "",
    };
    accessLogger.info(Utils.getLogString(dataLog));

    if (
      error.name == "JsonWebTokenError" &&
      error.message == "invalid signature"
    ) {
      return res.json({
        status: "error",
        errorMessage: Utils.ERROR_MESSAGE.NOT_REGISTERED,
      });
    }
    return res.json({
      statusCode: 500,
      errorMessage: Utils.ERROR_MESSAGE.SYSTEM_ERROR,
    });
  }
});

const proxyMiddleware = function () {
  // console.log('-----------------------------------proxyMiddleware-----------------------------------------');
  return function (req, res, next) {
    if (req.path.search("api") < 0 && process.env.NODE_ENV !== "dev") {
      return res.sendFile(
        path.join(__dirname, "/dist/TTS-transform", "index.html")
      );
    }
    // set THREAD
    let tread = `${req.protocol}-${req.hostname}:${req.socket.localPort}`;
    // console.log('===========================tread : ',tread);
    // set ip headers
    req.headers["ip"] = ip;

    let channel = req.headers["channel"];
    // logging
    const t0 = performance.now();
    let startDate = moment().format("DD/MM/YYYY HH:mm:ss");
    let t1 = performance.now();

    // console.log('-----------------------------------proxyMiddleware return-----------------------------------------');
    // console.log('-----------------------------------proxyMiddleware TARGET_HOST_HOSTNAME TARGET_HOST_PORT : ',
    // process.env.TARGET_HOST_HOSTNAME,':',process.env.TARGET_HOST_PORT);
    // application log
    var dataAppLog = {
      STARTDATE: startDate,
      HOSTNAME: hostname,
      USERNAME: req.headers["username"] || "",
      SESSIONID: req.headers["x-session-id"] || "",
      REQUESTID: req.headers["transactionid"] || "",
      STATUS: "",
      ERROR_CODE: "",
      ERROR_MESSAGE: "",
      ERROR_EXCEPTION: "",
      RETURN_DATE: moment().format("DD/MM/YYYY HH:mm:ss"),
      RETURN_TIME_SEC: ((t1 - t0) / 1000).toFixed(numberDigit),
      SERVICE_NAME: "validateToken",
      MODULE_NAME: req.headers["modulename"],
      APP_NAME: process.env.LOG_APPNAME,
      CHANNEL: channel || "",
      REQUEST_DATA: "",
    };
    // access log
    var dataLog = {
      TIMESTAMP: startDate,
      THREAD: tread || "",
      HOSTNAME: hostname,
      USERNAME: req.headers["username"] || "",
      IP: req.headers["x-forwarded-for"] || "",
      SESSIONID: req.headers["x-session-id"] || "",
      REQUESTID: req.headers["transactionid"] || "",
      REQUESTDATE: req.headers["transactiondate"] || "",
      METHOD: req.method,
      RESULT:
        res.statusCode == 200
          ? Utils.TEXT_RESULT.SUCCESS
          : Utils.TEXT_RESULT.ERROR,
      ERROR_CODE: Utils.convertStringToErrorCode(Utils.TEXT_ERROR.SUCCESS.TEXT),
      RESPONSE_DATE: moment().format("DD/MM/YYYY HH:mm:ss"),
      RESPONSE_TIME_SEC: ((t1 - t0) / 1000).toFixed(numberDigit),
      SERVICE_NAME: "validateToken",
      MODULE_NAME: req.headers["modulename"] || "",
      APP_NAME: process.env.LOG_APPNAME,
      CHANNEL: channel || "",
    };
    req.headers["channel"] = process.env.LOG_CHANNEL;

    let reqAsBuffer = false;
    let reqBodyEncoding = true;
    let parseReqBody = true;
    if (isMultipartRequest(req)) {
      reqAsBuffer = true;
      reqBodyEncoding = null;
      parseReqBody = false;
    }
    return proxy(
      `${process.env.TARGET_HOST_HOSTNAME}:${process.env.TARGET_HOST_PORT}`,
      {
        timeout: 6000 * 1000, // in milliseconds, 10 seconds
        reqAsBuffer,
        reqBodyEncoding,
        parseReqBody,
        https: true,
        proxyReqOptDecorator: async function (proxyReqOpts, srcReq) {
          // console.log('-----------------------proxyReqOpts authorization : ',proxyReqOpts.headers['authorization']);
          if (proxyReqOpts.path.search(loginPath) >= 0) {
            if (process.env.LOGIN_BY_PASS === "true") {
              proxyReqOpts.body = srcReq.body;
              proxyReqOpts.body["serv"] = srcReq.headers.host;
              proxyReqOpts.rejectUnauthorized = false;
              // console.log('-----------------------proxyReqOptDecorator : ',proxyReqOpts);
              return proxyReqOpts;
            } else {
              t1 = performance.now();
              dataLog.RESULT = Utils.TEXT_RESULT.ERROR;
              dataLog.ERROR_CODE = Utils.convertStringToErrorCode(
                Utils.TEXT_ERROR.INVALID_URL.TEXT
              );
              dataLog.RESPONSE_DATE = moment().format("DD/MM/YYYY HH:mm:ss");
              dataLog.RESPONSE_TIME_SEC = ((t1 - t0) / 1000).toFixed(
                numberDigit
              );
              accessLogger.error(Utils.getLogString(dataLog));

              dataAppLog.STATUS = Utils.TEXT_RESULT.ERROR;
              dataAppLog.ERROR_CODE = Utils.convertStringToErrorCode(
                Utils.TEXT_ERROR.INVALID_URL.TEXT
              );
              dataAppLog.ERROR_MESSAGE = Utils.TEXT_ERROR.INVALID_URL.TEXT;
              dataAppLog.ERROR_EXCEPTION = "";
              dataAppLog.RETURN_TIME_SEC = ((t1 - t0) / 1000).toFixed(
                numberDigit
              );
              appLogger.error(Utils.getLogString(dataAppLog));
              return Promise.reject(
                srcReq.res.status(404).json({
                  status: "error",
                  errorMessage: Utils.TEXT_ERROR.INVALID_URL.TEXT,
                })
              );
            }
          }
          if (process.env.MULTIPLE_LOGIN === "true") {
            if (proxyReqOpts.path.search(getRegionPath) >= 0) {
              let regions = JSON.parse(cacheStaticData.get("REGIONS"));
              if (proxyReqOpts.params.regionId) {
                return Promise.reject(
                  srcReq.res.send({
                    status: "success",
                    resultData: regions.find(
                      (region) =>
                        region.regionId === proxyReqOpts.params.regionId
                    ),
                  })
                );
              }
              return Promise.reject(
                srcReq.res.send({
                  status: "success",
                  resultData: regions,
                })
              );
            }
            return proxyReqOpts;
          }
          if (!proxyReqOpts.headers["authorization"]) {
            t1 = performance.now();
            dataLog.RESULT = Utils.TEXT_RESULT.ERROR;
            dataLog.ERROR_CODE = Utils.convertStringToErrorCode(
              Utils.TEXT_ERROR.AUTHORIZE_INVALID.TEXT
            );
            dataLog.RESPONSE_DATE = moment().format("DD/MM/YYYY HH:mm:ss");
            dataLog.RESPONSE_TIME_SEC = ((t1 - t0) / 1000).toFixed(numberDigit);
            accessLogger.info(Utils.getLogString(dataLog));

            dataAppLog.STATUS = Utils.TEXT_RESULT.ERROR;
            dataAppLog.ERROR_CODE = Utils.convertStringToErrorCode(
              Utils.TEXT_ERROR.AUTHORIZE_INVALID.TEXT
            );
            dataAppLog.ERROR_MESSAGE = Utils.TEXT_ERROR.AUTHORIZE_INVALID.TEXT;
            dataAppLog.ERROR_EXCEPTION = "";
            dataAppLog.RETURN_TIME_SEC = ((t1 - t0) / 1000).toFixed(
              numberDigit
            );
            dataAppLog.REQUEST_DATA =
              proxyReqOpts.headers["authorization"] || "";
            appLogger.error(Utils.getLogString(dataAppLog));
            return Promise.reject(
              srcReq.res.status(401).json({
                status: "error",
                errorMessage: Utils.ERROR_MESSAGE.NOT_REGISTERED,
              })
            );
          } else {
            let [authType, token] =
              proxyReqOpts.headers["authorization"].split(" ");
            try {
              if (token && authType == "Bearer") {
                let profile = jwt.verify(
                  token,
                  process.env.SECRET || "TTS-transform"
                );
                let _token = cache.get(profile.name);
                if (_token != token) {
                  t1 = performance.now();
                  dataLog.RESULT = Utils.TEXT_RESULT.ERROR;
                  dataLog.ERROR_CODE = Utils.convertStringToErrorCode(
                    Utils.TEXT_ERROR.AUTHORIZE_INVALID.TEXT
                  );
                  dataLog.RESPONSE_DATE = moment().format(
                    "DD/MM/YYYY HH:mm:ss"
                  );
                  dataLog.RESPONSE_TIME_SEC = ((t1 - t0) / 1000).toFixed(
                    numberDigit
                  );
                  accessLogger.info(Utils.getLogString(dataLog));

                  dataAppLog.STATUS = Utils.TEXT_RESULT.ERROR;
                  dataAppLog.ERROR_CODE = Utils.convertStringToErrorCode(
                    Utils.TEXT_ERROR.AUTHORIZE_INVALID.TEXT
                  );
                  dataAppLog.ERROR_MESSAGE =
                    Utils.TEXT_ERROR.AUTHORIZE_INVALID.TEXT;
                  dataAppLog.ERROR_EXCEPTION = "";
                  dataAppLog.RETURN_TIME_SEC = ((t1 - t0) / 1000).toFixed(
                    numberDigit
                  );
                  dataAppLog.REQUEST_DATA =
                    proxyReqOpts.headers["authorization"] || "";
                  appLogger.error(Utils.getLogString(dataAppLog));
                  if (!_token) {
                    return Promise.reject(
                      srcReq.res.status(401).json({
                        status: "error",
                        errorMessage: Utils.ERROR_MESSAGE.NOT_REGISTERED,
                      })
                    );
                  }
                  const nodeId = cacheNodeId.get(profile.name);
                  if (nodeId) {
                    if (cacheNodeAccess.get(nodeId) !== profile.name) {
                      return Promise.reject(
                        srcReq.res.status(409).json({
                          status: "error",
                          errorMessage: Utils.ERROR_MESSAGE.NODE_ACCESS_CONFLIC,
                        })
                      );
                    }
                  }
                  return Promise.reject(
                    srcReq.res.status(409).json({
                      status: "error",
                      errorMessage: Utils.ERROR_MESSAGE.USER_ACCESS_CONFLIC,
                    })
                  );
                } else if (new Date() > new Date(profile.exp)) {
                  t1 = performance.now();
                  dataLog.RESULT = Utils.TEXT_RESULT.ERROR;
                  dataLog.ERROR_CODE = Utils.convertStringToErrorCode(
                    Utils.TEXT_ERROR.AUTHORIZE_INVALID.TEXT
                  );
                  dataLog.RESPONSE_DATE = moment().format(
                    "DD/MM/YYYY HH:mm:ss"
                  );
                  dataLog.RESPONSE_TIME_SEC = ((t1 - t0) / 1000).toFixed(
                    numberDigit
                  );
                  accessLogger.info(Utils.getLogString(dataLog));

                  dataAppLog.STATUS = Utils.TEXT_RESULT.ERROR;
                  dataAppLog.ERROR_CODE = Utils.convertStringToErrorCode(
                    Utils.TEXT_ERROR.AUTHORIZE_INVALID.TEXT
                  );
                  dataAppLog.ERROR_MESSAGE =
                    Utils.TEXT_ERROR.AUTHORIZE_INVALID.TEXT;
                  dataAppLog.ERROR_EXCEPTION = "";
                  dataAppLog.RETURN_TIME_SEC = ((t1 - t0) / 1000).toFixed(
                    numberDigit
                  );
                  dataAppLog.REQUEST_DATA =
                    proxyReqOpts.headers["authorization"] || "";
                  appLogger.error(Utils.getLogString(dataAppLog));
                  // console.log(new Date() + " > " + new Date(profile.exp));
                  return Promise.reject(
                    srcReq.res.status(403).json({
                      status: "error",
                      errorMessage: Utils.ERROR_MESSAGE.USER_SESSION_EXPIRED,
                    })
                  );
                }
                if (proxyReqOpts.path.search(getRegionPath) >= 0) {
                  let regions = JSON.parse(cacheStaticData.get("REGIONS"));
                  if (proxyReqOpts.params.regionId) {
                    return Promise.reject(
                      srcReq.res.send({
                        status: "success",
                        resultData: regions.find(
                          (region) =>
                            region.regionId === proxyReqOpts.params.regionId
                        ),
                      })
                    );
                  }
                  return Promise.reject(
                    srcReq.res.send({
                      status: "success",
                      resultData: regions,
                    })
                  );
                }
                t1 = performance.now();
                dataLog.RESULT = Utils.TEXT_RESULT.SUCCESS;
                dataLog.ERROR_CODE = Utils.convertStringToErrorCode(
                  Utils.TEXT_ERROR.SUCCESS.TEXT
                );
                dataLog.RESPONSE_DATE = moment().format("DD/MM/YYYY HH:mm:ss");
                dataLog.RESPONSE_TIME_SEC = ((t1 - t0) / 1000).toFixed(
                  numberDigit
                );
                accessLogger.info(Utils.getLogString(dataLog));
                cache.set(profile.name, token, cacheDurationInMinute * 60);
                proxyReqOpts.currentUser = profile;
                return proxyReqOpts;
              } else {
                t1 = performance.now();
                dataLog.RESULT = Utils.TEXT_RESULT.ERROR;
                dataLog.ERROR_CODE = Utils.convertStringToErrorCode(
                  Utils.TEXT_ERROR.AUTHORIZE_INVALID.TEXT
                );
                dataLog.RESPONSE_DATE = moment().format("DD/MM/YYYY HH:mm:ss");
                dataLog.RESPONSE_TIME_SEC = ((t1 - t0) / 1000).toFixed(
                  numberDigit
                );
                accessLogger.info(Utils.getLogString(dataLog));

                dataAppLog.STATUS = Utils.TEXT_RESULT.ERROR;
                dataAppLog.ERROR_CODE = Utils.convertStringToErrorCode(
                  Utils.TEXT_ERROR.AUTHORIZE_INVALID.TEXT
                );
                dataAppLog.ERROR_MESSAGE =
                  Utils.TEXT_ERROR.AUTHORIZE_INVALID.TEXT;
                dataAppLog.ERROR_EXCEPTION = "";
                dataAppLog.RETURN_TIME_SEC = ((t1 - t0) / 1000).toFixed(
                  numberDigit
                );
                dataAppLog.REQUEST_DATA =
                  proxyReqOpts.headers["authorization"] || "";
                appLogger.error(Utils.getLogString(dataAppLog));
                return Promise.reject(
                  srcReq.res.status(401).json({
                    status: "error",
                    errorMessage: Utils.ERROR_MESSAGE.NOT_REGISTERED,
                  })
                );
              }
            } catch (error) {
              if (
                error.name == "JsonWebTokenError" &&
                error.message == "invalid signature"
              ) {
                t1 = performance.now();
                dataLog.RESULT = Utils.TEXT_RESULT.ERROR;
                dataLog.ERROR_CODE = Utils.convertStringToErrorCode(
                  Utils.TEXT_ERROR.AUTHORIZE_INVALID.TEXT
                );
                dataLog.RESPONSE_DATE = moment().format("DD/MM/YYYY HH:mm:ss");
                dataLog.RESPONSE_TIME_SEC = ((t1 - t0) / 1000).toFixed(
                  numberDigit
                );
                accessLogger.info(Utils.getLogString(dataLog));

                dataAppLog.STATUS = Utils.TEXT_RESULT.ERROR;
                dataAppLog.ERROR_CODE = Utils.convertStringToErrorCode(
                  Utils.TEXT_ERROR.AUTHORIZE_INVALID.TEXT
                );
                dataAppLog.ERROR_MESSAGE =
                  Utils.TEXT_ERROR.AUTHORIZE_INVALID.TEXT;
                dataAppLog.ERROR_EXCEPTION = "";
                dataAppLog.RETURN_TIME_SEC = ((t1 - t0) / 1000).toFixed(
                  numberDigit
                );
                dataAppLog.REQUEST_DATA =
                  proxyReqOpts.headers["authorization"] || "";
                appLogger.error(Utils.getLogString(dataAppLog));
                return Promise.reject(
                  srcReq.res.status(401).json({
                    status: "error",
                    errorMessage: Utils.ERROR_MESSAGE.NOT_REGISTERED,
                  })
                );
              }
              t1 = performance.now();
              dataLog.RESULT = Utils.TEXT_RESULT.ERROR;
              dataLog.ERROR_CODE = Utils.convertStringToErrorCode(
                Utils.TEXT_ERROR.CODE_ERROR.TEXT
              );
              dataLog.RESPONSE_DATE = moment().format("DD/MM/YYYY HH:mm:ss");
              dataLog.RESPONSE_TIME_SEC = ((t1 - t0) / 1000).toFixed(
                numberDigit
              );
              accessLogger.info(Utils.getLogString(dataLog));

              dataAppLog.STATUS = Utils.TEXT_RESULT.ERROR;
              dataAppLog.ERROR_CODE = Utils.convertStringToErrorCode(
                Utils.TEXT_ERROR.CODE_ERROR.TEXT
              );
              dataAppLog.ERROR_MESSAGE = Utils.TEXT_ERROR.CODE_ERROR.TEXT;
              dataAppLog.ERROR_EXCEPTION = "";
              dataAppLog.RETURN_TIME_SEC = ((t1 - t0) / 1000).toFixed(
                numberDigit
              );
              dataAppLog.REQUEST_DATA =
                proxyReqOpts.headers["authorization"] || "";
              appLogger.error(Utils.getLogString(dataAppLog));
              return Promise.reject(
                srcReq.res.status(500).json({
                  status: "error",
                  errorMessage: Utils.ERROR_MESSAGE.SYSTEM_ERROR,
                })
              );
            }
          }
        },
        userResDecorator: function (proxyRes, proxyResData, userReq, userRes) {
          // logging
          const t1 = performance.now();
          let profile = {
            name: null,
          };
          if (
            userReq.headers["authorization"] != undefined &&
            userReq.headers["authorization"] != null
          ) {
            let [authType, token] = userReq.headers["authorization"].split(" ");
            profile = jwt.verify(token, process.env.SECRET || "TTS-transform");
          } else {
            profile["name"] = "";
          }
          let requestData = "";
          if (proxyRes.headers["content-type"] !== "multipart/form-data") {
            if (userReq.method == "POST") {
              requestData = JSON.stringify(userReq.body);
            } else {
              if (
                Object.keys(userReq.params).length != 0 &&
                userReq.params.constructor === Object
              ) {
                requestData = JSON.stringify(userReq.params);
              } else {
                requestData = JSON.stringify(userReq.query);
              }
            }
          }
          let status = Utils.TEXT_RESULT.SUCCESS;
          let errorCode = Utils.TEXT_ERROR.SUCCESS.CODE;
          if (res.statusCode == 200) {
            status = Utils.TEXT_RESULT.SUCCESS;
            errorCode = Utils.TEXT_ERROR.SUCCESS.CODE;
          } else if (res.statusCode == 404) {
            status = Utils.TEXT_RESULT.ERROR;
            errorCode = Utils.TEXT_ERROR.INVALID_URL.CODE;
          } else if (res.statusCode == 504) {
            status = Utils.TEXT_RESULT.ERROR;
            errorCode = Utils.TEXT_ERROR.SERVICE_TIMEOUT.CODE;
          } else {
            status = Utils.TEXT_RESULT.ERROR;
            errorCode = Utils.TEXT_ERROR.CODE_ERROR.CODE;
          }
          if (
            proxyRes.headers["error_code"] &&
            proxyRes.headers["error_code"] !== "000"
          ) {
            status = Utils.TEXT_RESULT.ERROR;
            errorCode = proxyRes.headers["error_code"];
          }
          // application log
          var dataAppLog = {
            STARTDATE: startDate,
            HOSTNAME: hostname,
            USERNAME: req.headers["username"] || "",
            SESSIONID: req.headers["x-session-id"] || "",
            REQUESTID: req.headers["transactionid"] || "",
            STATUS: status,
            ERROR_CODE: errorCode,
            ERROR_MESSAGE: "",
            ERROR_EXCEPTION: "",
            RETURN_DATE: moment().format("DD/MM/YYYY HH:mm:ss"),
            RETURN_TIME_SEC: ((t1 - t0) / 1000).toFixed(numberDigit),
            SERVICE_NAME: userReq.path,
            MODULE_NAME: userReq.headers["modulename"] || "",
            APP_NAME: process.env.LOG_APPNAME,
            CHANNEL: channel || "",
            REQUEST_DATA: requestData || "",
          };
          if (res.statusCode != 200) {
            dataAppLog.ERROR_MESSAGE = Utils.TEXT_ERROR.CODE_ERROR.TEXT;
            appLogger.error(Utils.getLogString(dataAppLog));
          } else {
            appLogger.debug(Utils.getLogString(dataAppLog));
          }
          // access log
          var dataLog = {
            TIMESTAMP: startDate,
            THREAD: tread || "",
            HOSTNAME: hostname,
            USERNAME: req.headers["username"] || "",
            IP: req.headers["x-forwarded-for"] || "",
            SESSIONID: userReq.headers["x-session-id"] || "",
            REQUESTID: req.headers["transactionid"] || "",
            REQUESTDATE: userReq.headers["transactiondate"] || "",
            METHOD: userReq.method,
            STATUS: status,
            ERROR_CODE: errorCode,
            RESPONSE_DATE: moment().format("DD/MM/YYYY HH:mm:ss"),
            RESPONSE_TIME_SEC: ((t1 - t0) / 1000).toFixed(numberDigit),
            SERVICE_NAME: userReq.path,
            MODULE_NAME: userReq.headers["modulename"] || "",
            APP_NAME: process.env.LOG_APPNAME,
            CHANNEL: channel || "",
          };
          accessLogger.info(Utils.getLogString(dataLog));

          if (
            proxyRes.headers["content-type"] === "multipart/form-data" ||
            proxyRes.headers["content-type"] === "application/vnd.ms-excel"
          ) {
            return proxyResData;
          }
          let data = JSON.parse(proxyResData.toString("utf8"));
          if (data.status === "error") {
            return JSON.stringify(data);
          }
          if (
            data.error === "INTERNAL_SERVER_ERROR" ||
            data.error === "Internal Server Error"
          ) {
            return Promise.reject(
              userRes.status(500).json({
                status: "error",
                errorMessage: Utils.ERROR_MESSAGE.SYSTEM_ERROR,
              })
            );
          }
          if (userReq.path.search(loginPath) >= 0) {
            if (data === null) {
              return Promise.reject(
                userRes.status(500).json({
                  status: "error",
                  errorMessage: Utils.ERROR_MESSAGE.SYSTEM_ERROR,
                })
              );
            }
            data.resultData.result = generateToken(data.resultData.result);
          }
          if (userReq.path.search(changeLoginProfilePath) >= 0) {
            if (userReq.body.node) {
              let previousUsername = cacheNodeAccess.get(userReq.body.node.id);
              if (previousUsername) {
                if (previousUsername !== profile.name) {
                  if (cache.get(previousUsername)) {
                    cache.set(
                      previousUsername,
                      cache.get(previousUsername) + new Date().toString(),
                      cacheDurationInMinute * 60
                    );
                  }
                  if (cacheSAMLUser.get(previousUsername)) {
                    cacheSAMLUser.set(
                      previousUsername,
                      cacheSAMLUser.get(previousUsername) +
                        new Date().toString(),
                      cacheDurationInMinute * 60
                    );
                  }
                }
              }
              cacheNodeAccess.set(userReq.body.node.id, profile.name);
              cacheNodeId.set(profile.name, userReq.body.node.id);
            }
          }
          if (userReq.path.search(changeLogoutProfilePath) >= 0) {
            if (!cacheSAMLUser.get(profile.name)) {
              cache.take(profile.name);
            }
          }
          return JSON.stringify(data);
        },
        proxyErrorHandler: function (err, res, next) {
          // logging
          const t1 = performance.now();
          let errorCode = Utils.TEXT_ERROR.CODE_ERROR.CODE;
          let requestData = "";
          if (req.method == "POST") {
            requestData = JSON.stringify(req.body);
          } else {
            requestData = JSON.stringify(req.params);
          }
          // application log
          var dataAppLog = {
            STARTDATE: startDate,
            HOSTNAME: hostname,
            USERNAME: req.headers["username"] || "",
            SESSIONID: req.headers["x-session-id"] || "",
            REQUESTID: req.headers["transactionid"] || "",
            STATUS: Utils.TEXT_RESULT.ERROR,
            ERROR_CODE: errorCode,
            ERROR_MESSAGE: err.message || "",
            ERROR_EXCEPTION: err.stack || "",
            RETURN_DATE: moment().format("DD/MM/YYYY HH:mm:ss"),
            RETURN_TIME_SEC: ((t1 - t0) / 1000).toFixed(numberDigit),
            SERVICE_NAME: req.path,
            MODULE_NAME: req.headers["modulename"] || "",
            APP_NAME: process.env.LOG_APPNAME,
            CHANNEL: channel || "",
            REQUEST_DATA: requestData || "",
          };
          appLogger.error(Utils.getLogString(dataAppLog));
          // access log
          var dataLog = {
            TIMESTAMP: startDate,
            THREAD: tread || "",
            HOSTNAME: hostname,
            USERNAME: req.headers["username"] || "",
            IP: req.headers["x-forwarded-for"] || "",
            SESSIONID: req.headers["x-session-id"] || "",
            REQUESTID: req.headers["transactionid"] || "",
            REQUESTDATE: req.headers["transactiondate"] || "",
            METHOD: req.method,
            STATUS: Utils.TEXT_RESULT.ERROR,
            ERROR_CODE: errorCode,
            RESPONSE_DATE: moment().format("DD/MM/YYYY HH:mm:ss"),
            RESPONSE_TIME_SEC: ((t1 - t0) / 1000).toFixed(numberDigit),
            SERVICE_NAME: req.path,
            MODULE_NAME: req.headers["modulename"] || "",
            APP_NAME: process.env.LOG_APPNAME,
            CHANNEL: channel || "",
          };
          accessLogger.info(Utils.getLogString(dataLog));

          let profile = {
            name: null,
          };
          if (
            req.headers["authorization"] != undefined &&
            req.headers["authorization"] != null
          ) {
            let [authType, token] = req.headers["authorization"].split(" ");
            profile = jwt.verify(token, process.env.SECRET || "TTS-transform");
          }

          switch (err && err.statusCode) {
            case "ECONNRESET": {
              return res
                .status(500)
                .json({
                  status: "error",
                  errorMessage: Utils.ERROR_MESSAGE.SYSTEM_ERROR,
                });
            }
            case "ECONNREFUSED": {
              return res
                .status(500)
                .json({
                  status: "error",
                  errorMessage: Utils.ERROR_MESSAGE.SYSTEM_ERROR,
                });
            }
            default: {
              next(err);
            }
          }
        },
      }
    )(req, res, next);
  };
};

app.post(process.env.SAML_CALLBACK_LOGOUT_PATH, (req, res, next) => {
  res.redirect("/");
});

app.post("/logout-saml", (req, res, next) => {
  // logging
  // console.log('==========================logout-saml node: ');
  let tread = `${req.protocol}-${req.hostname}:${req.socket.localPort}`;
  let t0 = performance.now();
  let startDate = moment().format("DD/MM/YYYY HH:mm:ss");
  let t1;
  let dataLog = {
    STARTDATE: startDate,
    HOSTNAME: hostname,
    USERNAME: req.headers["username"] || "",
    SESSIONID: req.headers["x-session-id"] || "",
    REQUESTID: req.headers["transactionid"] || "",
    STATUS: Utils.TEXT_RESULT.ERROR,
    ERROR_CODE: Utils.TEXT_ERROR.AUTHORIZE_INVALID.CODE,
    ERROR_MESSAGE: Utils.TEXT_ERROR.AUTHORIZE_INVALID.TEXT,
    ERROR_EXCEPTION: "",
    RETURN_DATE: moment().format("DD/MM/YYYY HH:mm:ss"),
    RETURN_TIME_SEC: ((t1 - t0) / 1000).toFixed(numberDigit),
    SERVICE_NAME: "logoutSAML",
    MODULE_NAME: "TTS-LOGOUT_SAML",
    APP_NAME: process.env.LOG_APPNAME,
    CHANNEL: req.headers["channel"] || "",
    REQUEST_DATA: req.headers["authorization"] || "",
  };
  // access log
  var dataAccessLog = {
    TIMESTAMP: startDate,
    THREAD: tread || "",
    HOSTNAME: hostname || "",
    USERNAME: req.headers["username"] || "",
    IP: req.headers["x-forwarded-for"] || "",
    SESSIONID: req.headers["x-session-id"] || "",
    REQUESTID: req.headers["transactionid"] || "",
    REQUESTDATE: req.headers["transactiondate"] || "",
    METHOD: req.method || "",
    STATUS: Utils.TEXT_RESULT.ERROR,
    ERROR_CODE: Utils.TEXT_ERROR.AUTHORIZE_INVALID.CODE,
    RESPONSE_DATE: moment().format("DD/MM/YYYY HH:mm:ss"),
    RESPONSE_TIME_SEC: ((t1 - t0) / 1000).toFixed(numberDigit),
    SERVICE_NAME: req.path || "",
    MODULE_NAME: "TTS-LOGOUT_SAML",
    APP_NAME: process.env.LOG_APPNAME,
    CHANNEL: req.headers["channel"] || "",
  };
  try {
    let [authType, token] = req.headers["authorization"].split(" ");
    // console.log('==========================logout-saml authType, token : ',authType, token);
    if (token && authType == "Bearer") {
      let profile = jwt.verify(token, process.env.SECRET || "TTS-transform");
      let _token = cache.get(profile.name);
      if (_token != token) {
        if (!_token) {
          t1 = performance.now();
          dataLog.RETURN_TIME_SEC = ((t1 - t0) / 1000).toFixed(numberDigit);
          dataLog.ERROR_CODE = Utils.convertStringToErrorCode(
            Utils.TEXT_ERROR.AUTHORIZE_INVALID.TEXT
          );
          dataLog.ERROR_MESSAGE = Utils.TEXT_ERROR.AUTHORIZE_INVALID.TEXT;
          appLogger.error(Utils.getLogString(dataLog));
          dataAccessLog.RESPONSE_TIME_SEC = ((t1 - t0) / 1000).toFixed(
            numberDigit
          );
          accessLogger.info(Utils.getLogString(dataAccessLog));
          return res.status(401).json({
            status: "error",
            errorMessage: SYSTEM_ERROR.NOT_REGISTERED,
          });
        }
        t1 = performance.now();
        dataLog.RETURN_TIME_SEC = ((t1 - t0) / 1000).toFixed(numberDigit);
        dataLog.ERROR_CODE = Utils.convertStringToErrorCode(
          Utils.TEXT_ERROR.AUTHORIZE_INVALID.TEXT
        );
        dataLog.ERROR_MESSAGE = Utils.TEXT_ERROR.AUTHORIZE_INVALID.TEXT;
        if (nodeId) {
          if (cacheNodeAccess.get(nodeId) !== profile.name) {
            dataLog.ERROR_MESSAGE = Utils.TEXT_ERROR.AUTHORIZE_INVALID.TEXT;
          }
        }
        appLogger.error(Utils.getLogString(dataLog));
        dataAccessLog.RESPONSE_TIME_SEC = ((t1 - t0) / 1000).toFixed(
          numberDigit
        );
        accessLogger.info(Utils.getLogString(dataAccessLog));
        const nodeId = cacheNodeId.get(profile.name);
        if (nodeId) {
          if (cacheNodeAccess.get(nodeId) !== profile.name) {
            return res.status(409).json({
              status: "error",
              errorMessage: Utils.ERROR_MESSAGE.NODE_ACCESS_CONFLIC,
            });
          }
        }
        return res.status(409).json({
          status: "error",
          errorMessage: Utils.ERROR_MESSAGE.USER_ACCESS_CONFLIC,
        });
      }
      let user = cacheSAMLUser.get(profile.name);
      // console.log('==========================logout-saml user >> ',user);
      req.user = {
        nameID: user.nameID,
        sessionIndex: user.sessionIndex,
      };
      samlStrategy.logout(req, async function (err, url) {
        if (!err) {
          t1 = performance.now();
          cache.take(profile.name);
          cacheSAMLUser.take(profile.name);
          dataAccessLog.STATUS = Utils.TEXT_RESULT.SUCCESS;
          dataAccessLog.ERROR_CODE = Utils.TEXT_ERROR.SUCCESS.CODE;
          dataAccessLog.RESPONSE_TIME_SEC = ((t1 - t0) / 1000).toFixed(
            numberDigit
          );
          accessLogger.info(Utils.getLogString(dataAccessLog));
          res.send({ status: "success", resultData: { url } });
        } else {
          t1 = performance.now();
          dataLog.RETURN_TIME_SEC = ((t1 - t0) / 1000).toFixed(numberDigit);
          dataLog.STATUS = Utils.TEXT_RESULT.SUCCESS;
          dataLog.ERROR_CODE = Utils.convertStringToErrorCode(
            Utils.TEXT_ERROR.AUTHORIZE_INVALID.TEXT
          );
          dataLog.ERROR_MESSAGE = Utils.TEXT_ERROR.AUTHORIZE_INVALID.TEXT;
          dataLog.ERROR_EXCEPTION = "";
          appLogger.error(Utils.getLogString(dataLog));
          dataAccessLog.RESPONSE_TIME_SEC = ((t1 - t0) / 1000).toFixed(
            numberDigit
          );
          accessLogger.info(Utils.getLogString(dataAccessLog));
          return res.status(500).json({ status: "error", resultData: null });
        }
      });
    }
  } catch (e) {
    t1 = performance.now();
    dataLog.RETURN_TIME_SEC = ((t1 - t0) / 1000).toFixed(numberDigit);
    appLogger.error(Utils.getLogString(dataLog));
    dataAccessLog.RESPONSE_TIME_SEC = ((t1 - t0) / 1000).toFixed(numberDigit);
    accessLogger.info(Utils.getLogString(dataAccessLog));
    applicationLogProcess(
      req,
      Utils.TEXT_RESULT.ERROR,
      Utils.TEXT_ERROR.SERVICE_TIMEOUT.CODE,
      Utils.TEXT_ERROR.SERVICE_TIMEOUT.TEXT,
      "",
      t0,
      null
    );
    return res.status(500).json({ status: "error", resultData: null });
  }
});

app.use("/", proxyMiddleware());

var fs = require("fs");
var https = require("https");

var privateKey = fs.readFileSync(process.env.SERVER_PRIVATE_KEY_PATH, "utf8");
var certificate = fs.readFileSync(process.env.SERVER_CERTIFICATE_PATH, "utf8");

// var credentials = { key: privateKey, cert: certificate };
var credentials = {
  key: privateKey,
  cert: certificate,
  secureProtocol: "TLSv1_2_method",
  strictSSL: false,
  requestCert: false,
  rejectUnauthorized: false,
  // default node 0.12 ciphers with RC4 disabled!!!
  ciphers:
    "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256:TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384:TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256:TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384:TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256:TLS_ECDHE_RSA_WITH_ARIA_256_GCM_SHA384:TLS_ECDHE_RSA_WITH_ARIA_128_GCM_SHA256:TLS_RSA_WITH_AES_256_GCM_SHA384:TLS_RSA_WITH_AES_256_CCM_8:TLS_RSA_WITH_AES_256_CCM:TLS_RSA_WITH_ARIA_256_GCM_SHA384:TLS_RSA_WITH_AES_128_GCM_SHA256:TLS_RSA_WITH_AES_128_CCM_8:TLS_RSA_WITH_AES_128_CCM:TLS_RSA_WITH_ARIA_128_GCM_SHA256:TLS_RSA_WITH_AES_256_CBC_SHA256:TLS_RSA_WITH_AES_128_CBC_SHA256",
  honorCipherOrder: true,
};

var httpsServer = https.createServer(credentials, app);

httpsServer.listen(parseInt(process.env.PORT || 443), async () => {
  console.log(`Sever start at port ${parseInt(process.env.PORT || 443)}`);
});

//initialize the WebSocket server instance https
const HttpsServer = require("https").createServer;
server = HttpsServer({
  cert: fs.readFileSync(process.env.SERVER_CERTIFICATE_PATH, "utf8"),
  key: fs.readFileSync(process.env.SERVER_PRIVATE_KEY_PATH, "utf8"),
});
wss = new WebSocket.Server({
  server: server,
});

function createMessage(
  command,
  broadcast = false,
  senderName = "NS",
  receiver
) {
  msg = {
    sender: senderName,
    content: command,
    isBroadcast: broadcast,
    receiver: receiver,
  };
  return JSON.stringify(msg);
}

var Message;

wss.on("connection", (ws) => {
  const extWs = ws;

  extWs.isAlive = true;

  ws.on("pong", () => {
    extWs.isAlive = true;
  });

  //connection is up, let's add a simple simple event
  ws.on("message", (msg) => {
    console.log("---------------on msg =>", msg);
    let message = JSON.parse(msg);
    // console.log('---------------on message =>',message);
    setTimeout(() => {
      if (message.isBroadcast) {
        //send back the message to the other clients
        wss.clients.forEach((client) => {
          if (client != ws) {
            client.send(
              createMessage(
                message.content,
                true,
                message.sender,
                message.receiver
              )
            );
          }
        });
      }
      console.log(
        `You sent -> ${message.content}`,
        message.isBroadcast,
        message.sender
      );
      let test = createMessage(
        `You sent -> ${message.content}`,
        false,
        "system",
        message.receiver
      );
      console.log("test ==> ", test);
      ws.send(createMessage(`You sent -> ${message.content}`, false, "system"));
    }, 1000);
  });

  //send immediatly a feedback to the incoming connection
  JSON.stringify("Hi there, I am a WebSocket server", false, "system");
  console.log(
    "incoming connection   ==> ",
    createMessage("Hi there, I am a WebSocket server", false, "system")
  );
  ws.send(createMessage("Hi there, I am a WebSocket server", false, "system"));

  ws.on("error", (err) => {
    console.warn(`Client disconnected - reason: ${err}`);
  });
});

setInterval(() => {
  wss.clients.forEach((ws) => {
    const extWs = ws;

    if (!extWs.isAlive) return ws.terminate();

    extWs.isAlive = false;
    ws.ping(null, undefined);
  });
}, 10000);

server.listen(parseInt(process.env.SOCKET_PORT || 3005), async () => {
  console.log(
    `Sever start at port ${parseInt(process.env.SOCKET_PORT || 3005)}`
  );
});
