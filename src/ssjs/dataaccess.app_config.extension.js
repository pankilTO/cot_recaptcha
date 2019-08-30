var apiKey = require('csu/apikey.js');
function afterQuery(content, request, uriInfo, response) {
  try {
    if (!apiKey.verfiy(request)) {
      throw true
    }

  } catch (error) {
    response.setStatusCode(500);
    response.setContent("No access.");
  }
}


function beforeContentParse(content, request, uriInfo, response) {
  try{
/*
    var httpMethod = request.getMethod();

    if ( httpMethod == "POST"){
      captcha_key = apiKey.generateUUID();
      apiKey.emailLog(captcha_key,"captcha_key" + "=" + captcha_key);
      content.addProperty("UUID", captcha_key);
    }
 */
  }
  catch(e){
    apiKey.emailLog(e.toString(), "error app_config afterCreate")
  }

}
