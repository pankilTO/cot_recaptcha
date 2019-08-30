var apiKey = require('cot_recaptcha/apikey.js');
function verify(request, response, requestBody) {
  try {
    var req = JSON.parse(requestBody);
    apiKey.emailLog(JSON.stringify(req), "verify");
    var key = request.getHeader("app_config");
    var C3API_DATA_CONFIGURATION_URL = apiKey.C3API_DATA_CONFIGURATION_URL;
    if (key && key != "") {
      var baseURI = request.getRawBaseUri();
      var base = baseURI.substring(0, baseURI.indexOf(".ca/") + 3);

      if (apiKey.public_whitelist.indexOf(base) > -1) {
        //passed whitelist

        authHeader = "Basic " + apiKey.Base64.encode(apiKey.C3API_AUTH_USERNAME + ":" + apiKey.C3API_AUTH_PASSWORD);

        var headers = {"Content-Type": "application/json"};
        headers[apiKey.header] = apiKey.value;
        headers["Authorization"] = authHeader;

        ajax.request({
            headers: headers,
            method: 'GET',
            uri: base + C3API_DATA_CONFIGURATION_URL + "('" + key + "')",
          },
          function okFunction(get_response) {


            var meta = JSON.parse(get_response.body);
            var taget_app = meta.config_app_name;
            var target_entity = meta.da_entity_name;

            if (taget_app && target_entity) {

              /*PASSED ALL CHECKS LETS DO THE CAPTCHA*/


              var captchaResponseToken = req.captchaResponseToken || request.getHeader("captchaResponseToken");
              var returnValue = {};
              var responseConfigSET = apiKey.config_captcha;
              var config_requiredScore = responseConfigSET.requiredScore || 70;
              var config_secret = responseConfigSET.secret;
              var config_verifyurl = responseConfigSET.verifyurl;
              response.setStatusCode(200);
              response.setContent(captchaResponseToken);

              ajax.request(
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                  uri: config_verifyurl+'?'+"secret=" + config_secret + '&response='+captchaResponseToken,
                  useProxy: true,
                  method: "GET"
                },
                function(captcha_response){
                  returnValue = JSON.parse(captcha_response.body);
                  returnValue.score = (returnValue['score']*100);
                  returnValue.requiredScore = config_requiredScore;

                  if(returnValue.score >=returnValue.requiredScore){
                    /*all good process request*/
                    let post_uri = base + '/c3api_data/v2/DataAccess.svc/' + target_app + "/" + target_entity;
                    ajax.request(
                      {
                        headers: {
                          "Content-Type": "application/json",
                        },
                        uri: post_uri,
                        data:JSON.stringify(req),
                        method: "POST"
                      },
                      function ok_function(post_response){
                        response.setStatusCode(201);
                        response.setContent(JSON.stringify(post_response));
                      },
                      function error_function(post_response){
                        response.setStatusCode(500);
                        response.setContent(post_uri + "" +JSON.stringify(post_response));
                      });
                  }
                  else{
                    response.setStatusCode(422);
                    response.setContent(JSON.stringify(returnValue));
                  }
                },
                function(captcha_response){
                  response.setStatusCode(500);
                  response.setContent(JSON.stringify(captcha_response));
                });

            } else {
              response.setStatusCode(400);
              response.setContent(JSON.stringify({"status": false, message: "unspecified error 243: " + base}));
            }
          },
          function errorFunction(get_response) {
            response.setStatusCode(400);
            response.setContent(JSON.stringify(get_response));
          });

      }
      else {
        response.setStatusCode(400);
        response.setContent(JSON.stringify({"status": false, message: "unspecified error 443: " + base}));
      }
    }
    else {
      response.setStatusCode(400);
      response.setContent(JSON.stringify({"status": false, message: "unspecified error 883"}));
    }

  } catch (e) {
    apiKey.emailLog(e.toString(), "error cot_recaptcha app_config.simple.extension verify");
  }
}


