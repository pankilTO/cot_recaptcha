cot_recaptcha
===========
Generic COT RECAPTCHA API endpoint to POST your public submissions to.
 
##Quick Start

1. Create new app_config: https://was-intra-sit.toronto.ca/webapps/cot_recaptcha
1. New app_config will return UUID for use in your recaptha implementation.
1. Post your payload to /c3api_data/v2/DataAccess.svc/cot_recaptha/app_config/ca.toronto.api.dataaccess.odata4.verify
1. include your UUID in the header "app_config"
1. The SSJS will run recaptcha code, if success - SSJS will process your request (POST)


## Front End Embedded Implementation
1. Add variable RECAPTCHA_SITEKEY to your gulpfile preprocessorContext;

`
let options = {
   pkg,
   embedArea: 'full',
   preprocessorContext: {
     RECAPTCHA_SITEKEY: "6LeN_XIUAAAAAEd8X21vFtkJ3_c7uA0xpUGcrGpe"
     }
 }`
 
1. Include the google script at the bottom of the footer section in your app.html

`<script src="https://www.google.com/recaptcha/api.js?render=<!--@echo RECAPTCHA_SITEKEY-->"></script>`
1. In your cot-form "success" function:
 - implement grecaptcha.ready
 - call grecaptcha.execute
 - execute your success code in the returned promise
 `      success: (event) => {
          event.preventDefault(); //this prevents the formvalidation library from auto-submitting if all fields pass validation
          let valuesToSubmit = this.model ? this.model.toJSON() : this.cotForm.getData();
  
          grecaptcha.ready(function() {
            grecaptcha.execute('/*@echo RECAPTCHA_SITEKEY*/').then(function(token) {
            /*process your form post as normal, but do your POST tp the appropriate SSJS Simple Extension code.*/
            })
            });`
 
