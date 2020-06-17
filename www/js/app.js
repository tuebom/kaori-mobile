// Dom7
var $$ = Dom7;
// localStorage.setItem('mbrid', '');

var mbrid = localStorage.getItem('mbrid');
var items = [];

var bBackPressed = false;

var destinationType = null;
var ref = null;

// Framework7 App main instance
var app  = new Framework7({
  root: '#app', // App root element
  id: 'io.framework7.kaori', // App bundle ID
  name: 'KAORI', // App name
  theme: 'auto', // Automatic theme detection
  init: true,
  initOnDeviceReady: true,
  
  touch: {
    disableContextMenu: false,
  },
  
  // App root data
  data: function () {
    return {
      db: null,

      mbrid: null,
      username: null,
      email: null,
      password: null,

      // endpoint: 'http://localhost/kaori/',
      // endpoint: 'http://212.24.111.23/kaori/',
      endpoint: 'https://kaoribali.com/dev/',

      total_items: 0, // total item cart

      // tax: 0,         // pajak
      // shipcost: 0,    // ongkos kirim
      // addcost: 0,     // payment gateway
      gtotal: 0,      // total

      currentDate: null,
      ordernum: null,
      lastURL: null,
      
      bLogedIn: false,
      // bUpdateInfo: false,
      token: null,
      push: null,
    };
  },
  // App root methods
  methods: {
    
    addItem: function(kode, qty) {
      
      var bFound = false;

      for (var i=0; i < items.length; i++)
        if (items[i].kdbar === kode) {
          
          bFound = true;
          items[i].qty += parseInt(qty);
          break;
        }

      if (!bFound) {
        items.push({ kdbar: kode, qty: parseInt(qty) })
      }
      
      // hitung total
      // app.methods.calcTotal();
    },
    deleteItem: function(kode) {
      
      for (var i =0; i < items.length; i++)
        if (items[i].kdbar === kode) {
          items.splice(i,1);
          break;
        }

      // app.methods.calcTotal();
    },
  
  },
  on: {

    init: function () { // sama dengan onDeviceReady
      
      // app.statusbar.hide();

      if (!this.data.bLogedIn) {
        $$('.member-status').css('display', 'none');
        $$('.member-edit').css('display', 'none');
      }
      
      // destinationType = navigator.camera.DestinationType;

      /*
      function copyDatabaseFile(dbName) {

        var sourceFileName = cordova.file.applicationDirectory + 'www/' + dbName;
        var targetDirName = cordova.file.dataDirectory;

        return Promise.all([
          new Promise(function (resolve, reject) {
            resolveLocalFileSystemURL(sourceFileName, resolve, reject);
          }),
          new Promise(function (resolve, reject) {
            resolveLocalFileSystemURL(targetDirName, resolve, reject);
          })
        ]).then(function (files) {
          var sourceFile = files[0];
          var targetDir = files[1];
          return new Promise(function (resolve, reject) {
            targetDir.getFile(dbName, {}, resolve, reject);
          }).then(function () {
            console.log("file already copied");
          }).catch(function () {
            console.log("file doesn't exist, copying it");
            return new Promise(function (resolve, reject) {
              sourceFile.copyTo(targetDir, dbName, resolve, reject);
            }).then(function () {
              console.log("database file copied");
            });
          });
        });
      }

      copyDatabaseFile('data.db').then(function () {
        // success! :)
        app.data.db = window.sqlitePlugin.openDatabase({name: 'data.db'});
        // var currentDate = new Date();
        // var month = currentDate.getMonth() + 1;
        // var year = currentDate.getFullYear();
        
        var db = app.data.db;
        
        if (db) {
          // app.dialog.alert('db is OK!');

          // $$('.item-basket').on('click', function () {
          //   var li = $$(this).parents("li");
          //   var kode = li.find('input').val();
          //   // console.log(kode)
          //   app.methods.addSalesItem(kode)
          //   // app.dialog.alert('Tes')
          // });                      
        }
      }).catch(function (err) {
        // error! :(
        console.log(err);
      }); //*/
      

      /*
      this.data.push = PushNotification.init({
        "android": {},
        "browser": {
          "pushServiceURL": "http://push.api.phonegap.com/v1/push"
        },
        "ios": {
            "sound": true,
            "vibration": true,
            "badge": true
        },
        "windows": {}
      });

      var push = this.data.push;

      push.on('registration', function(data) {

        var oldRegId = localStorage.getItem('RegId');
        if (oldRegId !== data.registrationId) {
            // Save new registration ID
            localStorage.setItem('RegId', data.registrationId);
            // Post registrationId to your app server as the value has changed
            // app.dialog.alert('Registrasi Id berhasil!');
        }

      });

      push.on('notification', function(data) {
        
        var db = app.data.db;
    
        if (db) {
          
          var now = new Date();
          var date = now.getFullYear()+'/'+(now.getMonth()+1)+'/'+now.getDate();
          var time = now.getHours() + ":" + now.getMinutes()
          
          db.transaction(function(tx) {
              db.transaction(function(tx) {
                tx.executeSql('insert into notifikasi (tgl, jam, info) values (?, ?, ?);', [date, time, data.message]);
              }, function(error) {
                app.dialog.alert('insert error: ' + error.message);
              });
          });
        }
      
        // show message
        app.dialog.alert(data.message, data.title);
        
        // update info saldo
        setTimeout(function () {

          app.request.get( app.data.endpoint + 'api/v1/member/saldo/'+ app.data.mbrid, function (res) {
          
            var data = JSON.parse(res);
        
            if (data.status) {
              $$('.saldo').text(parseInt(data.saldo).toLocaleString('ID'));
              app.data.saldo = parseInt(data.saldo);
              $$('.bonus').text(parseInt(data.bonus).toLocaleString('ID'));
              app.data.bonus = parseInt(data.bonus);
            } else {
              app.dialog.alert(data.message, data.title);
            }
          });
        }, 1000);
      }); //*/

      if (mbrid) {

        console.log('Direct login!')
        var mbrid = localStorage.getItem('mbrid');
        var nohp  = localStorage.getItem('nohp');
        var pin   = localStorage.getItem('pin');
        var gcmid = localStorage.getItem('RegId');

        this.data.mbrid = mbrid;
        this.data.nohp = nohp;
        this.data.pin = pin;

        var formData = {};
        formData.identity = nohp;
        formData.password = pin;
        formData.gcmid = gcmid;
  
        this.preloader.show();

        this.request.post(app.data.endpoint + 'api/v1/auth/login', formData, function (res) {
    
          app.preloader.hide();
          var data = JSON.parse(res);
      
          if (data.status) {

            // set data token
            app.data.bLogedIn = true;
            app.data.mbrid = mbrid;
            app.data.token = data.token;
            
            // ambil informasi saldo member
            app.request.get(app.data.endpoint + 'api/v1/member/saldo/'+mbrid, function (res) {
                
              var data = JSON.parse(res);
          
              if (data.status) {
                $$('.saldo').text(parseInt(data.saldo).toLocaleString('ID'));
                app.data.saldo = parseInt(data.saldo);
              } else {
                app.dialog.alert(data.message);
              }
            });

          } else {
            localStorage.setItem('mbrid', '');
            this.loginScreen.open('#my-login-screen');
          }
        });
      } else {
        this.loginScreen.open('#my-login-screen');
      }
    },     
  },
  // App routes
  routes: routes,
  // Enable panel left visibility breakpoint
  panel: {
    leftBreakpoint: 960,
  },
});


// Init/Create main view
var mainView = app.views.create('.view-main', {
  url: '/'
});


// $$('.barcode-scan1').on('click', function () {
     
//   bBackPressed = true;

//   cordova.plugins.barcodeScanner.scan(
//     function (result) {
//         app.methods.findItem(result.text);
//         // app.dialog.alert("We got a barcode\n" +
//         //       "Result: " + result.text + "\n" +
//         //       "Format: " + result.format + "\n" +
//         //       "Cancelled: " + result.cancelled);
//     },
//     function (error) {
//         app.dialog.alert("Scanning failed: " + error);
//     },
//     {
//         preferFrontCamera : false, // iOS and Android
//         showFlipCameraButton : false, // iOS and Android
//         showTorchButton : true, // iOS and Android
//         torchOn: true, // Android, launch with the torch switched on (if available)
//         saveHistory: false, // Android, save scan history (default false)
//         prompt : "Place a barcode inside the scan area", // Android
//         resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
//         formats : "EAN_13,CODE_128,QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
//         orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
//         disableAnimations : true, // iOS
//         disableSuccessBeep: false // iOS and Android
//     }
//   );
// });


/*var ac_share = app.actions.create({
  buttons: [
    {
      text: '<div class="list"><ul><li><div class="item-content">'+
      '<div class="item-media"><img class="material-icons" src="img/whatsapp.png" /></div>'+
      '<div class="item-inner">'+
        '<div class="item-title-row">'+
          '<div class="item-title">Whatsapp</div>'+
        '</div>'+
        '<div class="item-text"></div>'+
      '</div>'+
    '</div></li></ul></div>',
      onClick: function () {
        var msg = 'Ayo beli pulsa dan paket internet murah praktis hanya lewat aplikasi ini!\n\n' +
        'https://play.google.com/store/apps/details?id=com.app.kaori';
        window.plugins.socialsharing.shareViaWhatsApp(msg, null, null, null, function(e){
          app.dialog.alert("Sharing failed with message: " + e, "KAORI");
        })
      }
    },
    {
      text: '<div class="list"><ul><li><div class="item-content">'+
      '<div class="item-media"><img class="material-icons" src="img/telegram.png" /></div>'+
      '<div class="item-inner">'+
        '<div class="item-title-row">'+
          '<div class="item-title">Telegram</div>'+
        '</div>'+
        '<div class="item-text"></div>'+
      '</div>'+
    '</div></li></ul></div>',
      onClick: function () {
        var msg = 'Ayo beli pulsa dan paket internet murah praktis hanya lewat aplikasi ini!\n\n' +
        'https://play.google.com/store/apps/details?id=com.app.kaori';
        window.plugins.socialsharing.shareVia('org.telegram.messenger', msg, null, null, null, null, function(e){
          app.dialog.alert('Sharing failed with message: ' + e, 'KAORI');
        })
      }
    },
    {
      text: '<div class="list"><ul><li><div class="item-content">'+
      '<div class="item-media"><img class="material-icons" src="img/facebook.png" /></div>'+
      '<div class="item-inner">'+
        '<div class="item-title-row">'+
          '<div class="item-title">Facebook</div>'+
        '</div>'+
        '<div class="item-text"></div>'+
      '</div>'+
    '</div></li></ul></div>',
      onClick: function () {
        var msg = 'Ayo beli pulsa dan paket internet murah praktis hanya lewat aplikasi ini!\n\n' +
        'https://play.google.com/store/apps/details?id=com.app.kaori';
        window.plugins.socialsharing.shareViaFacebook(msg, null, null, null, function(e){
          app.dialog.alert("Sharing failed with message: " + e, "KAORI");
        })
      }
    },
    {
      text: '<div class="list"><ul><li><div class="item-content">'+
      '<div class="item-media"></div>'+
      '<div class="item-inner">'+
        '<div class="item-title-row">'+
          '<div class="item-title" style="color: red">Cancel</div>'+
        '</div>'+
        '<div class="item-text"></div>'+
      '</div>'+
    '</div></li></ul></div>',
      color: 'red',
    },
  ]
});*/

// $$('.ac-share').on('click', function () {
//   ac_share.open();
// });

// Login Screen
$$('#my-login-screen .login-button').on('click', function () {
  
  // var mbrid = $$('#my-login-screen [name="mbrid"]').val();
  // if (mbrid === '') {
  //     app.dialog.alert('Masukkan ID member anda.', 'Login Member');
  //     return;
  // }
  
  var nohpx = $$('#my-login-screen [name="identity"]').val();
  if (nohpx === '') {
      app.dialog.alert('Masukkan nomor handphone anda.', 'Login Member');
      return;
  }

  var rgx_nohp = /[08][0-9]{9,}/;
  var nohp = nohpx.trim().match(rgx_nohp);
  if (!nohp) {
      app.dialog.alert('Input data nomor handphone belum benar.', 'Login Member');
      return;
  }

  var pin = $$('#my-login-screen [name="password"]').val();
  if (pin === '') {
      app.dialog.alert('Masukkan nomor PIN/password anda.', 'Login Member');
      return;
  }
  
  app.preloader.show();

  var formData = app.form.convertToData('.login-form');

  var regId = localStorage.getItem('RegId');
  formData.gcmid = regId;

  
  // http://212.24.111.23/
  app.request.post(app.data.endpoint + 'api/v1/auth/login', formData, function (res) {
    
    app.preloader.hide();
    
    var data = JSON.parse(res);

    if (data.status) {
    
      localStorage.setItem('mbrid', mbrid);
      localStorage.setItem('nohp', nohp);
      localStorage.setItem('pin', pin);

      app.loginScreen.close('#my-login-screen');
      
      app.data.bLogedIn = true;
      app.data.mbrid = mbrid;
      app.data.nohp  = nohp;
      app.data.pin   = pin;
      app.data.token = data.token;
      
      // kosongkan isian nomor pin
      $$('#my-login-screen [name="pin"]').val('');
      
      app.request.get(app.data.endpoint + 'api/v1/member/saldo/'+mbrid, function (res) {
          
        var data = JSON.parse(res);
    
        if (data.status) {
          $$('.saldo').text(parseInt(data.saldo).toLocaleString('ID'));
          app.data.saldo = parseInt(data.saldo);
          app.data.bonus = parseInt(data.bonus);
        } else {
          app.dialog.alert(data.message, 'Akun Saya');
        }
      });

    } else {
      app.dialog.alert(data.message, 'Login Member');
    }
  });
});

$$('a.label-register').on('click', function () {
  // Close login screen
  app.loginScreen.close('#my-login-screen');
  app.loginScreen.open('#my-reg-screen');
});


// Registrasi member
$$('#my-reg-screen .register-button').on('click', function () {
  
  var nama = $$('#my-reg-screen [name="nama"]').val();
  if (nama === '') {
      app.dialog.alert('Masukkan nama lengkap anda.', 'Registrasi Member');
      return;
  }
  
  var rgx_nama = /^[a-zA-Z]'?([a-zA-Z]|\,|\.| |-)+$/;
  var namax = nama.trim().match(rgx_nama);
  if (!namax) {
    app.dialog.alert('Input data nama belum benar.', 'Registrasi Member');
    return;
  }

  var nohpx = $$('#my-reg-screen [name="nohp"]').val();
  if (nohpx === '') {
      app.dialog.alert('Masukkan nomor handphone.', 'Registrasi Member');
      return;
  }

  var rgx_nohp = /[08][0-9]{9,}/;
  var nohp = nohpx.trim().match(rgx_nohp);
  if (!nohp) {
    app.dialog.alert('Input data nomor handphone belum benar.', 'Registrasi Member');
    return;
  }

  app.preloader.show();
  
  var regId = localStorage.getItem('RegId');
  var formData = app.form.convertToData('.register-form');

  // formData.mbrid = 1; cause wrong result
  formData.gcmid = regId;

  app.request.post(app.data.endpoint + 'api/v1/member', formData, function (res) {
    
    app.preloader.hide();
    
    var data = JSON.parse(res);

    if (data.status) {
      
      // simpan data nomor handphone
      localStorage.setItem('mbrid', data.mbrid);
      localStorage.setItem('nohp', nohp);
      localStorage.setItem('pin', '1234');

      app.data.mbrid = data.mbrid;
      app.data.nohp = data.nohp;

      // set data ke form login
      // $$('#my-login-screen [name="mbrid"]').val(data.mbrid);
      $$('#my-login-screen [name="identity"]').val(nohp);

      app.loginScreen.close('#my-reg-screen');
      app.loginScreen.open('#my-login-screen');
    
      // setTimeout(function () {
        app.dialog.alert(data.message, 'Registrasi Member');
      // }, 2000);

    } else {
      app.dialog.alert(data.message, 'Registrasi Member');
    }
  });
});

$$('a.label-login').on('click', function () {
  // Close register screen
  app.loginScreen.close('#my-reg-screen');
  app.loginScreen.open('#my-login-screen');
});

$$('#my-login-screen').on('loginscreen:opened', function (e, loginScreen) {
  // set data ke form login
  // $$('#my-login-screen [name="mbrid"]').val(localStorage.getItem('mbrid'));
  $$('#my-login-screen [name="identity"]').val(localStorage.getItem('nohp'));
});


$$(document).on('backbutton', function (e) {

  e.preventDefault();

  // for example, based on what and where view you have
  var leftp  = app.panel.left && app.panel.left.opened;
  var rightp = app.panel.right && app.panel.right.opened;
  
  if (leftp || rightp) {

      app.panel.close();
      return false;
  } else
  // if ($$('.modal-in').length > 0) {

  //     app.dialog.close();
  //     app.popup.close();
  //     return false;
  // } else
  
  if (app.views.main.router.url == '/') {
    
    /*if (!bBackPressed) {
      
      bBackPressed = true;

      // show toast
      var toast = app.toast.create({
        text: 'Press back once again to exit.',
        closeTimeout: 2000,
        on: {
          close: function () {
            // app.dialog.alert('Toast closed');
            bBackPressed = false;
          },
        }
      });
      toast.open();
      
    } else {*/
      
      if (app.data.bLogedIn) {
        app.request.get( app.data.endpoint + 'api/v1/auth/logout', function(res) {});
      }

      navigator.app.exitApp();
      // console.log('navigator.app.exitApp();')
    // }
  } else
  
  if (app.views.main.router.url == '/login/' && mainView.router.history.length == 1)
  {
    app.router.navigate('/', { reloadCurrent: true });
  }
  else
  {
    // console.log('url => '+app.views.main.router.url)
    var view = app.views.current;
    if (view.history.length > 4) {
      view.router.back(view.history[0], { force: true });
    } else {
      mainView.router.back();
    }
    // var view = app.views.current;
    // view.router.back();
  }

});


app.on('pageInit', function (page) {

  $$('input').on('focus', function () {
    
    $$('.kb').css('height', '280px');
    //var limit = $$(window).height() - 280;

    if ($$(this).offset().top > 280) {
      $$('.page-content').scrollTop($$(this).offset().top-168);
    }
  });

  $$('input').on('blur', function () {
    $$('.kb').css('height', '0px');
  });


  // $$('div.item-title.menu.login').on('click', function (e) {
  $$('a.list-button.item-link.popover-close.logout').on('click', function (e) {
    
    e.preventDefault();
    console.log('do logout!')
    /*if ($$(this).text() == 'Login') {

      app.router.navigate('/login/', {
        reloadCurrent: true,
        ignoreCache: true,
      });

    } else {*/
      

      // if (app.data.bLogedIn) {
          
        // app.data.bLogedIn = false;
        // app.data.mbrid = null;
        // app.data.total_items = 0;
        // $$('.badge').text('');
        // $$('.badge').css("display", "none");
  
        app.request.get( app.data.endpoint + 'api/v1/auth/logout', function(res) {
          
          app.data.bLogedIn = false;
          app.data.mbrid = null;
          app.data.total_items = 0;
          localStorage.setItem('mbrid', '');
          localStorage.setItem('nohp', '');
          app.loginScreen.open('#my-login-screen');
        });
      // }
    // }
  });


  $$('#order-display').on('popup:opened', function (e, popup) {
    $$('#order-display .ordernum').text(app.data.ordernum);
  });
  

  $$('#order-display .btnContinue').on('click', function (e) {

    e.preventDefault();

    // app.popup.close($$('.page[data-name="transfer-bonus"]').parents(".popup"));
    app.popup.close('#order-display', false);
    
    // back to main page
    var view = app.views.current;
    view.router.back(view.history[0], { force: true });    
  });
});
