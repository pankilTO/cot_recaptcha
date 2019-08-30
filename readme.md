cot_recaptcha
===========
Describe your app.
##Quick Start
1. Create new app_config
1. New app_config will return UUID for use in your recaptha implementation.
1. Post your payload to /c3api_data/v2/DataAccess.svc/cot_recaptha/app_config/ca.toronto.api.dataaccess.odata4.verify
1. include your UUID in the header "app_config"
1. The SSJS will run recaptcha code, if success - SSJS will process your request (POST)
