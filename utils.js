exports.getLogString = function (data) {
  var str = "";
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      var element = data[key];
      str += "|" + element;
    }
  }
  return str.length > 0 && str.indexOf("|") == 0 ? str.slice(1) : str;
};

exports.convertStringToErrorCode = (error) => {
  switch (error) {
    case this.TEXT_ERROR.SUCCESS.TEXT:
      return this.TEXT_ERROR.SUCCESS.CODE;
    case this.TEXT_ERROR.SUCCESS_NO_DATA.TEXT:
      return this.TEXT_ERROR.SUCCESS_NO_DATA.CODE;
    case this.TEXT_ERROR.USER_PASS_INVALID.TEXT:
      return this.TEXT_ERROR.USER_PASS_INVALID.CODE;
    case this.TEXT_ERROR.ACCOUNT_INVALID.TEXT:
      return this.TEXT_ERROR.ACCOUNT_INVALID.CODE;
    case this.TEXT_ERROR.AUTHORIZE_INVALID.TEXT:
      return this.TEXT_ERROR.AUTHORIZE_INVALID.CODE;
    case this.TEXT_ERROR.SAVE_INCOMPLETED.TEXT:
      return this.TEXT_ERROR.SAVE_INCOMPLETED.CODE;
    case this.TEXT_ERROR.UPDATE_INCOMPLETED.TEXT:
      return this.TEXT_ERROR.UPDATE_INCOMPLETED.CODE;
    case this.TEXT_ERROR.DELETE_INCOMPLETED.TEXT:
      return this.TEXT_ERROR.DELETE_INCOMPLETED.CODE;
    case this.TEXT_ERROR.IMPORT_INCOMPLETED.TEXT:
      return this.TEXT_ERROR.IMPORT_INCOMPLETED.CODE;
    case this.TEXT_ERROR.EXPORT_INCOMPLETED.TEXT:
      return this.TEXT_ERROR.EXPORT_INCOMPLETED.CODE;
    case this.TEXT_ERROR.NO_DIRECTORY.TEXT:
      return this.TEXT_ERROR.NO_DIRECTORY.CODE;
    case this.TEXT_ERROR.NO_FILE.TEXT:
      return this.TEXT_ERROR.NO_FILE.CODE;
    case this.TEXT_ERROR.PERMISSION_DENIED.TEXT:
      return this.TEXT_ERROR.PERMISSION_DENIED.CODE;
    case this.TEXT_ERROR.IMPORT_NO_DIRECTORY.TEXT:
      return this.TEXT_ERROR.IMPORT_NO_DIRECTORY.CODE;
    case this.TEXT_ERROR.IMPORT_NO_FILE.TEXT:
      return this.TEXT_ERROR.IMPORT_NO_FILE.CODE;
    case this.TEXT_ERROR.IMPORT_PERMISSION_DENIED.TEXT:
      return this.TEXT_ERROR.IMPORT_PERMISSION_DENIED.CODE;
    case this.TEXT_ERROR.UPLOAD_NO_DIRECTORY.TEXT:
      return this.TEXT_ERROR.UPLOAD_NO_DIRECTORY.CODE;
    case this.TEXT_ERROR.UPLOAD_NO_FILE.TEXT:
      return this.TEXT_ERROR.UPLOAD_NO_FILE.CODE;
    case this.TEXT_ERROR.UPLOAD_PERMISSION_DENIED.TEXT:
      return this.TEXT_ERROR.UPLOAD_PERMISSION_DENIED.CODE;
    case this.TEXT_ERROR.DOWNLOAD_NO_DIRECTORY.TEXT:
      return this.TEXT_ERROR.DOWNLOAD_NO_DIRECTORY.CODE;
    case this.TEXT_ERROR.DOWNLOAD_NO_FILE.TEXT:
      return this.TEXT_ERROR.DOWNLOAD_NO_FILE.CODE;
    case this.TEXT_ERROR.DOWNLOAD_PERMISSION_DENIED.TEXT:
      return this.TEXT_ERROR.DOWNLOAD_PERMISSION_DENIED.CODE;
    case this.TEXT_ERROR.SERVICE_TIMEOUT.TEXT:
      return this.TEXT_ERROR.SERVICE_TIMEOUT.CODE;
    case this.TEXT_ERROR.FILE_EXISTS.TEXT:
      return this.TEXT_ERROR.FILE_EXISTS.CODE;
    case this.TEXT_ERROR.FILE_TYPE_INVALID.TEXT:
      return this.TEXT_ERROR.FILE_TYPE_INVALID.CODE;
    case this.TEXT_ERROR.DUPLICATED_DATA.TEXT:
      return this.TEXT_ERROR.DUPLICATED_DATA.CODE;
    case this.TEXT_ERROR.COLUMN_EMPTY.TEXT:
      return this.TEXT_ERROR.COLUMN_EMPTY.CODE;
    case this.TEXT_ERROR.DATA_OVER_LIMIT.TEXT:
      return this.TEXT_ERROR.DATA_OVER_LIMIT.CODE;
    case this.TEXT_ERROR.INVALID_URL.TEXT:
      return this.TEXT_ERROR.INVALID_URL.CODE;
    case this.TEXT_ERROR.INVALID_IP.TEXT:
      return this.TEXT_ERROR.INVALID_IP.CODE;
    case this.TEXT_ERROR.INVALID_PORT.TEXT:
      return this.TEXT_ERROR.INVALID_PORT.CODE;
    case this.TEXT_ERROR.INVALID_DIRECTORY.TEXT:
      return this.TEXT_ERROR.INVALID_DIRECTORY.CODE;
    case this.TEXT_ERROR.PRICE_EMPTY_ZERO.TEXT:
      return this.TEXT_ERROR.PRICE_EMPTY_ZERO.CODE;
    case this.TEXT_ERROR.AMOUNT_EMPTY_ZERO.TEXT:
      return this.TEXT_ERROR.AMOUNT_EMPTY_ZERO.CODE;
    case this.TEXT_ERROR.DOCUMENT_INVALID.TEXT:
      return this.TEXT_ERROR.DOCUMENT_INVALID.CODE;
    case this.TEXT_ERROR.BUDGET_CODE_INVALID.TEXT:
      return this.TEXT_ERROR.BUDGET_CODE_INVALID.CODE;
    case this.TEXT_ERROR.PROJECT_CODE_INVALID.TEXT:
      return this.TEXT_ERROR.PROJECT_CODE_INVALID.CODE;
    case this.TEXT_ERROR.RECALL_NOT_SUCCESS.TEXT:
      return this.TEXT_ERROR.RECALL_NOT_SUCCESS.CODE;
    case this.TEXT_ERROR.CODE_ERROR.TEXT:
      return this.TEXT_ERROR.CODE_ERROR.CODE;
    default:
      return this.TEXT_ERROR.SUCCESS.CODE;
  }
};

exports.TEXT_RESULT = {
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
};

exports.TEXT_ERROR = {
  SUCCESS: {
    TEXT: "SUCCESS",
    CODE: "000",
  },
  SUCCESS_NO_DATA: {
    TEXT: "Data not found",
    CODE: "001",
  },
  USER_PASS_INVALID: {
    TEXT: "Username and password invalid",
    CODE: "E001",
  },
  ACCOUNT_INVALID: {
    TEXT: "Account invalid",
    CODE: "E002",
  },
  AUTHORIZE_INVALID: {
    TEXT: "Authorize invalid",
    CODE: "E003",
  },
  SAVE_INCOMPLETED: {
    TEXT: "Save not completed",
    CODE: "E101",
  },
  UPDATE_INCOMPLETED: {
    TEXT: "Update not completed",
    CODE: "E102",
  },
  DELETE_INCOMPLETED: {
    TEXT: "Delete not completed",
    CODE: "E103",
  },
  IMPORT_INCOMPLETED: {
    TEXT: "Import not completed",
    CODE: "E104",
  },
  EXPORT_INCOMPLETED: {
    TEXT: "Export not completed",
    CODE: "E105",
  },
  NO_DIRECTORY: {
    TEXT: "Directory not found",
    CODE: "E106",
  },
  NO_FILE: {
    TEXT: "File not found",
    CODE: "E107",
  },
  PERMISSION_DENIED: {
    TEXT: "Permission denied",
    CODE: "E108",
  },
  IMPORT_NO_DIRECTORY: {
    TEXT: "Import not completed (Directory not found)",
    CODE: "E109",
  },
  IMPORT_NO_FILE: {
    TEXT: "Import not completed (File not found)",
    CODE: "E110",
  },
  IMPORT_PERMISSION_DENIED: {
    TEXT: "Import not completed (Permission denied)",
    CODE: "E111",
  },
  UPLOAD_NO_DIRECTORY: {
    TEXT: "Upload not completed (Directory not found)",
    CODE: "E112",
  },
  UPLOAD_NO_FILE: {
    TEXT: "Upload not completed (File not found)",
    CODE: "E113",
  },
  UPLOAD_PERMISSION_DENIED: {
    TEXT: "Upload not completed (Permission denied)",
    CODE: "E114",
  },
  DOWNLOAD_NO_DIRECTORY: {
    TEXT: "Download not completed (Directory not found)",
    CODE: "E115",
  },
  DOWNLOAD_NO_FILE: {
    TEXT: "Download not completed (File not found)",
    CODE: "E116",
  },
  DOWNLOAD_PERMISSION_DENIED: {
    TEXT: "Download not completed (Permission denied)",
    CODE: "E117",
  },
  SERVICE_TIMEOUT: {
    TEXT: "Service Timeout",
    CODE: "E118",
  },
  FILE_EXISTS: {
    TEXT: "File is exists",
    CODE: "E119",
  },
  FILE_TYPE_INVALID: {
    TEXT: "File Type Invalid",
    CODE: "E120",
  },
  DUPLICATED_DATA: {
    TEXT: "Duplicated Data",
    CODE: "E121",
  },
  COLUMN_EMPTY: {
    TEXT: "Column is empty",
    CODE: "E122",
  },
  DATA_OVER_LIMIT: {
    TEXT: "Data over limit",
    CODE: "E123",
  },
  INVALID_URL: {
    TEXT: "Invalid URL",
    CODE: "E124",
  },
  INVALID_IP: {
    TEXT: "Invalid IP",
    CODE: "E125",
  },
  INVALID_PORT: {
    TEXT: "Invalid Port",
    CODE: "E126",
  },
  INVALID_DIRECTORY: {
    TEXT: "Invalid Directory",
    CODE: "E127",
  },
  PRICE_EMPTY_ZERO: {
    TEXT: "Price is empty or zero",
    CODE: "E301",
  },
  AMOUNT_EMPTY_ZERO: {
    TEXT: "Amount is empty or zero",
    CODE: "E302",
  },
  DOCUMENT_INVALID: {
    TEXT: "Document invalid",
    CODE: "E303",
  },
  BUDGET_CODE_INVALID: {
    TEXT: "Budget Code invalid",
    CODE: "E304",
  },
  PROJECT_CODE_INVALID: {
    TEXT: "Project Code invalid",
    CODE: "E305",
  },
  RECALL_NOT_SUCCESS: {
    TEXT: "Recall not success",
    CODE: "E306",
  },
  CODE_ERROR: {
    TEXT: "CODE ERROR",
    CODE: "E999",
  },
};

exports.generatorXSession = () => {
  var result = "";
  var characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < 22; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

exports.ERROR_MESSAGE = {
  SYSTEM_ERROR: "System Error, Please Try again later.",
  NOT_REGISTERED: "คุณยังไม่ได้ทำการ Register เพื่อเป็นผู้ใช้ในระบบ TTS",
  INVALID_USERNAME_OR_PA$$WORD: "คุณใส่ ชื่อผู้ใช้ หรือ รหัสผ่าน ผิด",
  WAITING_RESPONSE: "คุณกำลังรอการตอบรับ การขอใช้งานระบบ TTS อยู่",
  USER_EXPIRED:
    "Username นี้ได้หมดอายุการใช้งานแล้ว กรุณาติดต่อหัวหน้าของท่านเพื่อขยายเวลาการทำงาน",
  USER_ACCESS_CONFLIC: "มีการเข้าสู่ระบบบัญชีผู้ใช้ของคุณจากเบราว์เซอร์อื่น",
  NODE_ACCESS_CONFLIC: "มีผู้ใช้งานอื่น Log In เข้ามายัง Main Node ของคุณ",
  USER_SESSION_EXPIRED: "คุณไม่ได้ทำการติดต่อกับระบบนานเกินไป กรุณา Login ใหม่",
};
