var apiKey = require('cot_recaptcha/apikey.js');

function verify(request, response, requestBody) {
  try {
    var req = JSON.parse(requestBody);
    var key = req["app_config"] || request.getHeader("app_config");
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
            var target_app = meta.config_app_name;
            var target_entity = meta.da_entity_name;
            var route_type = meta.route_type;
            var full_path = meta.full_path;

            //apiKey.emailLog(JSON.stringify(meta) , target_app + "|" + target_entity +  "|" + route_type );

            if (meta && route_type) {
              /*PASSED ALL CHECKS LETS DO THE CAPTCHA*/

              var captchaResponseToken = req.captchaResponseToken || request.getHeader("captchaResponseToken");
              var returnValue = {};
              var responseConfigSET = apiKey.config_captcha;
              var config_requiredScore = responseConfigSET.requiredScore || 70;
              var config_secret = responseConfigSET.secret;
              var config_verifyurl = responseConfigSET.verifyurl;
              var relay_uri = responseConfigSET.relay_uri;

              ajax.request(
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                  data: {
                    "response": String(captchaResponseToken)
                  },
                  uri: relay_uri,
                  useProxy: false,
                  method: "POST"
                },
                function (captcha_response) {
                  //apiKey.emailLog(JSON.stringify(captcha_response), "captcha response");
                  returnValue = JSON.parse(captcha_response.body);
                  returnValue.score = (returnValue['score'] * 100);
                  returnValue.requiredScore = config_requiredScore;

                  if (returnValue.score >= returnValue.requiredScore) {
                    apiKey.emailLog(JSON.stringify(returnValue), "captcha response success process");
                    var post_uri;
                    /*all good process request*/
                    if (route_type == "da") {
                      post_uri = base + '/c3api_data/v2/DataAccess.svc/' + target_app + "/" + target_entity;
                      //apiKey.emailLog(post_uri, "post uri");
                    }
                    else if (route_type == "full_path") {
                      post_uri = full_path;
                    }
                    else{
                      response.setStatusCode(500);
                      response.setContent("full path not specified");
                    }
                    if (post_uri) {
                      ajax.request(
                        {
                          headers: {
                            "Content-Type": "application/json",
                          },
                          uri: post_uri,
                          data: JSON.stringify(req),
                          method: "POST"
                        },
                        function ok_function(post_response) {
                          response.setStatusCode(201);
                          response.setContent(JSON.stringify(post_response));
                        },
                        function error_function(post_response) {
                          response.setStatusCode(500);
                          response.setContent(post_uri + "--ERROR--" + JSON.stringify(post_response));
                        });
                    } else {
                      response.setStatusCode(421);
                      response.setContent(JSON.stringify({"error": "post url not set"}));
                    }
                  }
                  else {
                    response.setStatusCode(422);
                    response.setContent(JSON.stringify(returnValue));
                  }
                },
                function (captcha_response) {
                  response.setStatusCode(500);
                  response.setContent("GOOGLE CAPTCHA ERROR 1: " + JSON.stringify(captcha_response));
                });

            } else {
              response.setStatusCode(500);
              response.setContent(JSON.stringify({"status": false, message: "unspecified error 243: " + base}));
            }
          },
          function errorFunction(get_response) {
            response.setStatusCode(400);
            response.setContent(JSON.stringify(get_response));
          });

      }
      else {
        response.setStatusCode(500);
        response.setContent(JSON.stringify({"status": false, message: "did not pass whitelist: " + base}));
      }
    }
    else {
      response.setStatusCode(500);
      response.setContent(JSON.stringify({"status": false, message: "unspecified error 883"}));
    }

  } catch (e) {
    response.setStatusCode(500);
    response.setContent(JSON.stringify({"status": false, message: "unspecified error"}));
    apiKey.emailLog(e.toString(), "error cot_recaptcha app_config.simple.extension verify");
  }
}


