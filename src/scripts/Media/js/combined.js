/**
 * @method getSubmissionSections(form_id)
 * @param form_id {string} -  the entity set/collection name
 * @return JSON
 * Returns a cot_form sections array defining the form
 */
const getSubmissionSections = (form_id, data) => {

  let section, model, registerFormEvents, registerOnSaveEvents, registerPostSaveEvents;
  switch (form_id) {
    case 'Media':
      var editor = void 0;
      section = [{
        "id": "adminSection",
        "title": "Reference Data",
        "rows": [{
          fields: [{id: "id", bindTo: "id", title: "File Name", disabled: true, required: true}, {
            id: "__ContentType",
            bindTo: "__ContentType",
            title: "Content Type",
            disabled: true,
            required: true
          }, {
            id: "updateMedia", type: "button", title: "Update",
            onclick: function onclick() {
              updateMedia();
            }
          }]
        }, {
          fields: [{
            "id": "ace_editor",
            "type": "html",
            "html": "<div style=\"height:1500px;top: 0;right: 0;bottom: 0;left: 0;\" id=\"myAceEditor\"></div>"
          }]
        }]
      }];
      model = new CotModel({"id": "", "__ContentType": ""});
      registerFormEvents = (data) => {

        editor = ace.edit("myAceEditor");
        editor.setTheme("ace/theme/monokai");
        var dataType = "text";
        if (data.__ContentType === "application/javascript") {
          dataType = "text";
        } else {
        }

        $.ajax({
          "type": "GET",
          "dataType": dataType,
          "headers": {
            "Authorization": "AuthSession " + Cookies.get(config.default_repo + '.sid'),
            "Cache-Control": "no-cache"
          },
          "url": config.httpHost.app[httpHost] + config.api.post + config.default_repo + "/Media('" + data.id + "')/$value"
        }).success(function (result, status, xhr) {

          var mode = "";

          switch (xhr.getResponseHeader("content-type").split(",")[0]) {
            case "application/javascript":
              mode = "ace/mode/javascript";
              editor.session.setMode(mode);
              editor.session.setTabSize(2);
              editor.session.setUseWrapMode(true);
              editor.getSession().foldAll(1, 28);
              editor.setValue(result);
              break;
            case "application/json":
              mode = "ace/mode/json";
              editor.session.setMode(mode);
              editor.session.setTabSize(2);
              editor.session.setUseWrapMode(true);
              editor.getSession().foldAll(1, 28);
              editor.setValue(result);
              break;
            case "text/css":
              mode = "ace/mode/css";
              editor.session.setMode(mode);
              editor.session.setTabSize(2);
              editor.session.setUseWrapMode(true);
              editor.getSession().foldAll(1, 28);
              editor.setValue(result);
              break;
            case "text/html":
              mode = "ace/mode/html";
              editor.session.setMode(mode);
              editor.session.setTabSize(2);
              editor.session.setUseWrapMode(true);
              editor.getSession().foldAll(1, 28);
              editor.setValue(result);
              break;
            case "text/plain":
              mode = "ace/mode/text";
              editor.session.setMode(mode);
              editor.session.setTabSize(2);
              editor.session.setUseWrapMode(true);
              editor.getSession().foldAll(1, 28);
              editor.setValue(result);
              break;
          }
          if (mode != "") {
          } else {
          }
        }).error(function (e) {
          console.warn("error", e);
        });
      };

      const updateMedia = () => {

        var entitySet = "Media";
        var name = data.id;
        var contentType = data.__ContentType;
        var media = editor.getValue();
        var sid = Cookies.get(config.default_repo + ".sid");
        var base = config.httpHost.app[httpHost] + config.api.post + config.default_repo + "/";

        // ADD MEDIA
        function step3(entitySet, name, contentType, media, sid) {
          var defer = $.Deferred();

          contentType = contentType !== 'application/json' ? contentType : 'text/plain';

          var ajaxSetting = {
            contentType: contentType,
            data: media,
            method: 'PUT',
            url: base + entitySet + '(\'' + name + '\')/$value'
          };
          if (sid) {
            ajaxSetting.headers = {'Authorization': 'AuthSession ' + sid};
          }

          $.ajax(ajaxSetting).then(function (data, textStatus, jqXHR) {
            defer.resolve(data, textStatus, jqXHR);
          }, function (jqXHR, textStatus, errorThrown) {
            defer.reject(jqXHR, textStatus, errorThrown);
          });

          return defer.promise();
        }

        // CLEAN UP IF NEEDED
        function step4(entitySet, name, contentType, media, sid) {
          var defer = $.Deferred();

          if (contentType === 'application/json') {
            var ajaxSetting = {
              contentType: contentType,
              data: JSON.stringify({
                '@odata.mediaContentType': contentType,
                __ContentType: contentType,
                id: name
              }),
              method: 'PUT',
              url: base + entitySet + '(\'' + name + '\')'
            };
            if (sid) {
              ajaxSetting.headers = {'Authorization': 'AuthSession ' + sid};
            }

            $.ajax(ajaxSetting).then(function (data, textStatus, jqXHR) {
              defer.resolve(data, textStatus, jqXHR);
            }, function (jqXHR, textStatus, errorThrown) {
              defer.reject(jqXHR, textStatus, errorThrown);
            });
          } else {
            defer.resolve();
          }

          return defer.promise();
        }

        var defer = $.Deferred();
        step3(entitySet, name, contentType, media, sid).then(function (data, textStatus, jqXHR) {

          step4(entitySet, name, contentType, media, sid).then(function (data, textStatus, jqXHR) {

            defer.resolve(data, textStatus, jqXHR);
            hasher.setHash(entitySet + "/" + name + "/?ts=" + new Date().getTime());
          });
        });
      };

      break;
    case 'submissions':
      section = [
        {
          id: "submitter_information",
          title: "Your Information",
          className: 'example-form-section panel-default',
          rows: [
            {
              fields: [
                {
                  id: 'fullName',
                  title: 'Full Name',
                  type: 'text',
                  className: 'col-xs-12',
                  required: true,
                  htmlAttr: {maxLength: 100},
                  bindTo: 'fullName'
                }
              ]
            },
            {
              fields:
                [
                  {
                    id: 'phone',
                    title: 'Phone Number',
                    type: 'phone',
                    required: true,
                    infohelp: 'Ex: 416-555-5555',
                    validationMessage: 'Phone numbers must be entered in a valid format', //optional, when validationtype is used or type is set to daterangepicker||datetimepicker, this can be specified to override the default error message
                    options: {preferredCountries: ['ca', 'us']},
                    htmlAttr: {maxLength: 20},
                    bindTo: 'phone'
                  },
                  {
                    id: 'email',
                    title: 'Email',
                    type: 'email',
                    required: true,
                    infohelp: 'Ex: you@me.com',
                    htmlAttr: {maxLength: 254},
                    bindTo: 'email'
                  }
                ]
            }
          ]
        }
      ];
      model = new CotModel({
        "fullName": "",
        "phone": "",
        "email": ""
      });

      registerFormEvents = (data) => {
        console.log("registerFormEvents: Do something like add in addition form elements, hide elements ect");
        registerOnSaveEvents = (data) => {
          console.log("registerOnSaveEvents: Do something on save like modify the payload before AJAX call.");
        }};
      registerPostSaveEvents = (data) => {
        console.log("registerPostSaveEvents: Do something post save like change the route or display additional date. Note: If registerPostSaveEvents is implemented, you need to manage the state change after");
        // if this method is not implemented, then the framework will simply reload the new data from the server.
        router.navigate(form_id + '/' + data.id + '/?alert=success&msg=save.done&ts=' + new Date().getTime(), {trigger: true, replace: true});
      };

      break;
  }
  return [section, model, registerFormEvents, registerOnSaveEvents, registerPostSaveEvents];

};
/**
 *
 * @param formName
 * @param filter
 * @returns {[null,null,null]}
 */
const getColumnDefinitions = (formName, filter) => {
  let columnDefs, view, view_config = {};
  //view_config.lengthMenu = [100, 10, 50, 1000];


  switch (formName) {
    case 'Media':
      columnDefs = [
        {
          title: "Actions",
          data: "id",
          orderable: false,
          defaultContent: "",
          render: function (data, type, row, meta) {
            let desc = "Open " + config.formName[formName] + " " + row[config.formHeaderFieldMap[formName]];
            let view_button = "<button aria-label='" + desc + "'class='btn btn-sm btn-default view_btn'>Open</button>";
            return view_button;
          }
        },
        {"data": "id", "title": "Name", "filter": false},
        {
          "data": "__ContentType",
          "title": "Content Type",
          "filter": false
        }
      ];
      view = 'Media';
      break;
    case 'submissions':
      columnDefs = [
        {
          title: "Actions",
          data: "id",
          orderable: false,
          defaultContent: "",
          render: function (data, type, row, meta) {
            let desc = "Open " + config.formName[formName] + " " + row[config.formHeaderFieldMap[formName]];
            let view_button = "<button aria-label=\"" + desc + "\" class=\"btn btn-sm btn-default view_btn\">Open</button>";
            return view_button;
          }
        },
        {
          "data": "__CreatedOn",
          "title": "Created",
          "filter": true,
          "type": "datetime",
          "sortOrder": "desc",
          "render": function (data) {
            return moment(data).format(config.dateTimeFormat)
          }
        },
        {"data": "fullName", "title": "Full Name", "filter": true, "type": "text"},
        {"data": "email", "title": "Email", "filter": true, "type": "text"},
        {"data": "phone", "title": "Phone", "filter": true, "type": "text"}
      ];
      view = "submissions";
      break;
    default:
      break;
  }
  return [columnDefs, view, view_config];
};
/**
 *
 */
const registerEvents = () => {
  console.log("reg events");
  $.ajaxSetup({cache: false});

  let cur_user = getCookie(config.default_repo + '.cot_uname') && getCookie(config.default_repo + '.cot_uname') !== "" ? getCookie(config.default_repo + '.cot_uname') : "not set"
  $("<span id=\"user_name_display\" style=\"margin-left:4px;\">" + cur_user + "</span>").insertAfter($("#user_auth_title"));


  $("#maincontent").off("click", ".view_btn").on("click", ".view_btn", function (e) {
    e.preventDefault();
    let row = $(this).closest('tr');
    row.addClass('selected');
    router.navigate(row.attr('data-formName') + '/' + row.attr('data-id') + '/?ts=' + new Date().getTime(), {trigger: true, replace: true});
  });
  $("#maincontent").off('click', '#tabExportCSV').on('click', '#tabExportCSV', function () {
    $(".dt-button.buttons-csv.buttons-html5").click();
  });
  $("#maincontent").off('click', '#tabExportEXCEL').on('click', '#tabExportEXCEL', function () {
    $(".dt-button.buttons-excel.buttons-html5").click();
  });
  $("#maincontent").off('click', '#tabExportPDF').on('click', '#tabExportPDF', function () {
    $(".dt-button.buttons-pdf.buttons-html5").click();
  });
  $("#maincontent").off('click', '#tabExportCopy').on('click', '#tabExportCopy', function () {
    $(".dt-button.buttons-copy.buttons-html5").click();
  });

  // Create New Entry button
  $("#maincontent").off('click', '.btn-createReport').on('click', '.btn-createReport', function () {
    router.navigate($(this).attr('data-id') + '/new/?ts=' + new Date().getTime(), {trigger: true, replace: true});
  });

  // Navigation tab links by report status
  $("#maincontent").off('click', '.tablink').on('click', '.tablink', function () {

    let newRoute = $(this).attr('data-id') + '/?ts=' + new Date().getTime() + '&status=' + $(this).attr('data-status') + '&filter=' + $(this).attr('data-filter');
    console.log("tablink click", newRoute );
    router.navigate(newRoute , {trigger: true, replace: true});
  });
  // GLOBAL SEARCH
  $("#maincontent").off('click', '.form-control-clear').on('click', '.form-control-clear', function () {
    $(this).prev('input').val('').focus();
    $(this).hide();
    myDataTable.dt.search("").draw();
  });
  $("#maincontent").off("click", "#btn_global_search").on("click", "#btn_global_search", function () {
    myDataTable.dt.search($("#admin_search").val().trim()).draw();
  });
  $("#maincontent").off("keyup", "#admin_search").on("keyup", "#admin_search", function (event) {
    $(this).next('span').toggle(Boolean($(this).val()));
    if (event.keyCode === 13) {
      $("#btn_global_search").click();
    }
  });
  $("#maincontent").off("focus", "#admin_search").on("focus", "#admin_search", function (e) {
    $("#custom-search-input").addClass("searchfocus");
  });
  $("#maincontent").off("blur", "#admin_search").on("blur", "#admin_search", function (e) {
    $("#custom-search-input").removeClass("searchfocus");
  });

  $(".form-control-clear").hide($(this).prev('input').val());

};

/**
 * Optional. Called when dashboard route is used. Render your custom application dashboard here.
 */
const welcomePage = () => {
  console.log('welcome');
  $('.forForm, .forView, #form_pane, #view_pane').hide();
  $('#custom-search-input, #export-menu').hide();
  $('#dashboard_pane, .forDashboard').show();
  if ($('#viewtitle').html() != config.dashboard_title) {
    $("#viewtitle").html($("<span role='alert'>" + config.dashboard_title + "</span>"));
  }
  let welcome_template = config.dashboard_template;
  tpl('#dashboard_pane', welcome_template, function () {});
};

/**
 *  Optional - If implemented, allows you to override and define your own routes.
 *  @returns: backbone router object
 */
/*
const getRoutes = () => {
  console.log('custom getRoutes implemented');
  return {
    routes: {
      '': 'homePage',
      'noaccess(/)': 'noaccess',
      'dashboard(/)': 'dashboard',
      ':formName(/)': 'frontPage',
      ':formName/new(/)': 'newPage',
      ':formName/:id(/)': 'viewEditPage',
      '*default': 'defautRoute'
    },

    defautRoute: function () {
      if (this.lastFragment !== null) {
        this.navigate(this.lastFragment, {trigger: false});
      } else {
        this.navigate('', {trigger: true});
      }
    },

    route: function (route, name, callback) {
      const oldCallback = callback || (typeof name === 'function') ? name : this[name];
      if (oldCallback !== config.defautRoute) {
        const newCallback = (...args) => {
          config.lastFragment = Backbone.history.fragment;
          oldCallback.call(this, ...args);
        };

        if (callback) {
          callback = newCallback;
        } else if (typeof name === 'function') {
          name = newCallback;
        } else {
          this[name] = newCallback;
        }
      }

      return Backbone.Router.prototype.route.call(this, route, name, callback);
    },
    noaccess: function () {
      noaccess()
    },
    homePage: function () {
      homePage();
    },
    frontPage: function (formName, query) {
      frontPage(formName, query);
    },
    newPage: function (formName, query) {
      newPage(formName, query);
    },
    viewEditPage: function (formName, id, query) {
      viewEditPage(formName, id, query)
    }

  };
};
*/
/**
 * optional - called every time the auth method is called and promise is resolved. Returns a promise.
 * @param oLogin
 * @return jQuery promise
 */

/*
const registerAuthEvents = (oLogin) =>{
  let deferred = new $.Deferred();
  console.log('registerAuthEvents', oLogin);
  deferred.resolve();
  return deferred.promise();
};
*/
/**
 *  optional - called every time OpenView is called to open an entity collection in the datatable. Returns null. Can be used to hook into events on the datatable or other as need for your usecase.
 */
/*
const appInitialize = () =>{console.log('appInitialize')};
*/
/**
 * Optional. This can be used to provide custom logic and show/hide differnet components based on the current users access rights (based on your logic and needs). Called in the toggleView method that switches between form, dashboard and datatable views.
 */
/*
const loadUserView = () => {};
*/

/**
 * Optional. If implemented, you can provide your own logic to manage unauthorized access to data or interface. Default, the framework calls noaccess().
 */

/*
const implement_noaccess = () => {};
*/
