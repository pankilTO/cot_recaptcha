exports.APP = "cot_recatcha";
exports.DOMAIN = "https://was-intra-sit.toronto.ca";
exports.PUBLIC_DOMAIN = "https://was-inter-sit.toronto.ca";
exports.C3API_AUTH_USERNAME = "c3api_config";
exports.C3API_AUTH_PASSWORD = "nAcrAspe3epa";
exports.C3API_DATA_CONFIGURATION_URL =  "/c3api_data/v2/DataAccess.svc/cot_recaptcha/app_config";
exports.header = "APIKEY";
exports.value = "5a2ec1dd-3e30-4c26-b45f-1d829574343d";
exports.public_whitelist = [
  "https://was-inter-sit.toronto.ca",
  "https://was-inter-qa.toronto.ca",
  "https://secure.toronto.ca",
  "https://was-intra-sit.toronto.ca",
  "https://was-intra-qa.toronto.ca",
  "https://insideto-secure.toronto.ca",
  "https://contrib0.wp.intra.dev-toronto.ca"
];
exports.whitelist = [
  "was-intra-sit.toronto.ca",
  "was-intra-qa.toronto.ca",
  "insideto-secure.toronto.ca"];
exports.config_captcha = {
  "secret":"6LeN_XIUAAAAAFLiG76A2cHays-MKLELHaktiGDq",
  "verifyurl":"https://www.google.com/recaptcha/api/siteverify",
  "requiredScore": 70,
  'relay_uri':'https://insideto-secure.toronto.ca/c3api_data/v2/DataAccess.svc/captcha/verify/ca.toronto.api.dataaccess.odata4.captcha'
};
exports.verfiy = function (request) {
  var a = request.getRawBaseUri();
  var base = a.substring(a.indexOf("//") + 2, a.indexOf(".ca/") + 3);
  if (request.getHeader(exports.header) != exports.value) {
    if (exports.whitelist.indexOf(base) == -1) {
      return false;
    }
    else {
      return true;
    }

  } else {
    return true
  }
};
exports.Base64 = {
  decode: function (str) {
    return new java.lang.String(java.util.Base64.decoder.decode(str));
  },
  encode: function (str) {
    return java.util.Base64.encoder.encodeToString(str.bytes);
  }
};
exports.emailLog = function(msg, title) {

  var finalTitle = "EMAIL LOG";
  if (title !== null) {
    finalTitle = title;
  }
  mailClient.createMail()
    .setSubject(finalTitle + " - " + exports.APP)
    .setBody(msg)
    .setFrom("dataaccess@toronto.ca")
    .setTo(["graham.perry@toronto.ca"])
    .send();
};
exports.dateFormat = function (date, mask) {
  return String(new java.text.SimpleDateFormat(mask).format(new java.util.Date(date.toString())));
};
Date.prototype.format = function (mask) {
  return exports.dateFormat(this, mask);
};
Date.prototype.addMinutes = function (minutes) {
  var date = new Date(this.valueOf());
  date.setMinutes(date.getMinutes() + minutes);
  return date;
};
Date.prototype.subtractSeconds = function (seconds) {
  var date = new Date(this.valueOf());
  date.setSeconds(date.getSeconds() - seconds);
  return date;
};
Date.prototype.subtractMonths = function (months) {
  var date = new Date(this.valueOf());
  date.setMonth(date.getMonth() - months);
  return date;
};
Array.prototype.unique = function () {
  return this.filter(function (value, index, self) {
    return self.indexOf(value) === index;
  });
};
exports.generateUUID = function () {
  var UUID = Java.type("java.util.UUID");
  return UUID.randomUUID().toString();
};
exports.deleteOldData = function (days, uri) {
  try {

    var date = new Date();
    date.setDate(date.getDate() - days);
    var isoDate = date.format("yyyy-MM-dd'T'HH:mm:ss") + "-05:00";
    var url = uri + "/ca.toronto.api.dataaccess.odata4.RemoveAll?filter=__CreatedOn%20le%20" + isoDate;
    ajax.request({
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Basic " + exports.Base64.encode(exports.C3API_AUTH_USERNAME + ":" + exports.C3API_AUTH_PASSWORD)
        },
        method: 'POST',
        uri: url,
        data: "{}"
      },
      function okFunction(post_resp) {},
      function errorFunction(post_resp) {
        exports.emailLog(JSON.stringify(post_resp), "ERROR POST REMOVE ALL DELETE OLD DATA")
      });
  } catch (e) {
    exports.emailLog(e.toString(), "ERROR DELETE OLD DATA")
  }
};
exports.createAssociativeArray = function (key, targetArray) {
  var ret = new Array();
  try {

    for (var i = 0; i < targetArray.length; i++) {
      ret[targetArray[i][key]] = targetArray[i];
    }

  } catch (e) {

  }
  return ret;
};
