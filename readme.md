cot_recaptcha
===========
Describe your app.
##Quick Start
Create your application in the config api on SIT (make sure you are listed as an admin for this app)
1. cd to your newly scaffolded application
1. npm install
1. gulp config
1. gulp media
1. gulp deploy:dev
1. run your application
1. modify scripts\Media\js\combined.js and scripts\Media\json\combined.json to your needs.
1. gulp config and gulp media to deploy your changes.
your gulpfile.js has a variable defaulted to "SIT": const deployTo = "SIT";

scripts\Media\js\combined.js and scripts\Media\json\combined.json

To deploy the Media files use the "gulp media" command. This will run "gulp" and then deploy  the files to the Media entity collection (DataAccess) for your application

To deploy the application ACL and SSJS use the "gulp config". This will copy over all files in the src/ssjs folder to the config api for your application based on the deployment environment in your gulpfile.js (defaulted to SIT) 


registerEvents() - optional - called when the framework is loaded. Used to hook into events and set up the application as need for your specific usecase.

registerAuthEvents(oLogin)- optional - called every time the auth method is called and promise is resolved. Returns a promise.

appInitialize() - optional - called every time OpenView is called to open an entity collection in the datatable. Returns null. Can be used to hook into events on the datatable or other as need for your usecase.

getSubmissionSections(formName, data) method

each form/entity has the following methods called (if implemented)


registerFormEvents(data)

registerPostSaveEvents(data)

registerOnSaveEvents(data)

loadUserView(). Optional. Call in the toggleView method that swiches between form, dashboard and datatable views. This can be used to provide custom logic and show/hide differnet components based on the current users access rights (based on your logic and needs).


implement_noaccess() - Optional. If implemented, you can provide your own logic to manage unauthorized access to data or interface. Default, the framework calls noaccess().


getRoutes(). Optional - If implemented, allows you to override and define your own routes.
