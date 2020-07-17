// Dom7
var $$ = Dom7;
// localStorage.setItem('mbrid', '');
// localStorage.setItem('nohp', '');

var items = [];

var bBackPressed = false;

var destinationType = null;
// var ref = null;

// Framework7 App main instance
var app  = new Framework7({
  root: '#app', // App root element
  id: 'io.framework7.kaori', // App bundle ID
  name: 'KAORI', // App name
  theme: 'md', // Automatic theme detection
  init: true,
  initOnDeviceReady: true,
  
  touch: {
    disableContextMenu: false,
  },
  
  // App root data
  data: function () {
    return {
      // endpoint: 'http://localhost/kaori/',
      endpoint: 'https://kaoribali.com/dev/',
      db: null,

      bSetAddress: false,
      bLogedIn: false,
      mbrid: null,
      pin: null,
      gtotal: 0,      // grand total
      promo: null,
      regency: null,
      total_items: 0, // total item cart
      ordernum: null,
      currentDate: null,

      min_trf: 1000,
      min_blj: 5000,
      min_topup: 50000,

      push: null,
    };
  },
  // App root methods
  methods: {
    
    capital_letter: function (str) 
    {
      str = str.split(" ");

      for (var i = 0, x = str.length; i < x; i++) {
          str[i] = str[i][0].toUpperCase() + str[i].substr(1);
      }

      return str.join(" ");
    }  
  },
  on: {

    init: function () { // sama dengan onDeviceReady
      
      // app.statusbar.hide();

      // if (!this.data.bLogedIn) {
      //   $$('.member-status').css('display', 'none');
      //   $$('.member-edit').css('display', 'none');
      // }
      
      // destinationType = navigator.camera.DestinationType;

      //*
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
        
        var db = app.data.db;
        
        if (db) {
          // app.dialog.alert('db is OK!');
          var now = new Date();
          var date = now.getFullYear()+'/'+(now.getMonth()+1)+'/'+now.getDate();
  
          app.data.db.transaction(function(tx) {
            tx.executeSql('delete from notifikasi where tgl < ?;', [date]);
          }, function(error) {
            app.dialog.alert('delete error: ' + error.message);
          });
        }
      }).catch(function (err) {
        // error! :(
        console.log(err);
      }); //*/
      

      //*
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

          app.request.getJSON( app.data.endpoint + 'api/v1/member/saldo', function (res) {
          
            $$('.saldo').text(res.saldof);
            app.data.saldo = parseInt(res.saldo);
            $$('.bonus').text(res.bonusf);
            app.data.bonus = parseInt(res.bonus);
          });
        }, 300);
      }); //*/

      var nohp = localStorage.getItem('nohp');

      if (nohp) {

        // console.log('Direct login!')
        var pin   = localStorage.getItem('pin');
        var gcmid = localStorage.getItem('RegId');

        var formData = {};
        formData.identity = nohp;
        formData.password = pin;
        formData.gcmid    = gcmid;
  
        this.preloader.show();

        this.request.post(this.data.endpoint + 'api/v1/auth/login', formData, function (res) {
    
          app.preloader.hide();
          app.data.bLogedIn = true;

          var data = JSON.parse(res);
      
          if (data.status) {
            console.log('Direct login sukses!')
            app.request.setup({
              headers: {
                'Token': data.token //Authorization
              }
            });

            app.data.mbrid = data.mbrid;
            
            // ambil informasi saldo member
            app.request.getJSON(app.data.endpoint + 'api/v1/member/saldo', function (res) {
                
              $$('.saldo').text(res.saldof);
              app.data.saldo = parseInt(res.saldo);
            });

          } else {
            // localStorage.setItem('nohp', '');
            app.preloader.hide();
            app.dialog.alert(data.message);
            app.loginScreen.open('#my-login-screen');
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
      app.dialog.alert('Masukkan nomor PIN atau password anda.', 'Login Member');
      return;
  }
  
  app.preloader.show();

  var formData = app.form.convertToData('.login-form');

  var regId = localStorage.getItem('RegId');
  formData.gcmid = regId;

  
  // http://212.24.111.23/
  app.request.post(app.data.endpoint + 'api/v1/auth/login', formData, function (res) {
    
    app.preloader.hide();
    app.data.bLogedIn = true;

    var data = JSON.parse(res);

    if (data.block) {
      app.dialog.alert(data.message, 'Login Member');
      return;
    }

    if (data.status) {
      
      app.request.setup({
        headers: {
          'Token': data.token
        }
      });

      // console.log('login sukses!')
      localStorage.setItem('nohp', nohp);
      localStorage.setItem('pin', pin);
      // localStorage.setItem('mbrid', data.mbrid);

      // tutup & kosongkan isian nomor pin
      app.loginScreen.close('#my-login-screen');
      $$('#my-login-screen [name="password"]').val('');
      
      app.data.mbrid = data.mbrid;
      // console.log(app.data.mbrid)
      
      app.request.getJSON(app.data.endpoint + 'api/v1/member/saldo', function (res) {
          
        $$('.saldo').text(res.saldof);
        app.data.saldo = parseInt(res.saldo);
        app.data.bonus = parseInt(res.bonus);
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
      
      // console.log('Registrasi sukses!')
      // simpan data nomor handphone
      // localStorage.setItem('mbrid', data.mbrid);
      localStorage.setItem('nohp', nohp);

      // app.data.mbrid = data.mbrid;
      // app.data.nohp = data.nohp;

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
  console.log('get nohp: '+localStorage.getItem('nohp'))
  $$('#my-login-screen [name="identity"]').val(localStorage.getItem('nohp'));
});

// transfer bonus
$$('#transfer-bonus .btnTransfer').on('click', function(e){
  //e.preventDefault();
  
  var bonus = parseInt($$('#transfer-bonus [name="nominal"]').val());

  if (bonus === '' || bonus === '0') {
    app.dialog.alert('Masukkan jumlah bonus yang akan ditransfer.', 'Transfer Bonus');
    return;
  } else
  if (app.data.bonus === 0) {
    app.dialog.alert('Jumlah bonus anda masih kosong.', 'Transfer Bonus');
    return;
  } else
  if (bonus < 500) {
    app.dialog.alert('Jumlah minimal transfer bonus sebesar 500.', 'Transfer Bonus');
    $$('#nominal').val(500);
    return;
  } else
  if (app.data.bonus < 500) {
    app.dialog.alert('Jumlah bonus anda belum mencukupi minimal transfer.', 'Transfer Bonus');
    $$('#nominal').val('');
    return;
  } else
  if (bonus > app.data.bonus) {
    app.dialog.alert('Jumlah maksimal bonus yang bisa ditransfer adalah ' + app.data.bonus +'.', 'Transfer Bonus');
    $$('#nominal').val(app.data.bonus);
    return;
  }

  var pin = $$('#transfer-bonus [name="pin"]').val();
  if (pin === '') {
    app.dialog.alert('Masukkan nomor PIN atau password anda.', 'Transfer Bonus');
    return;
  }

  var formData = app.form.convertToData('.trfbonus');
  
  app.request.post( app.data.endpoint + 'api/v1/member/trfbonus', formData, function (res) {
    
    app.preloader.hide();

    var data = JSON.parse(res);

    if (data.status) {
      
      $$('#transfer-bonus [name="nominal"]').val('');
      $$('#transfer-bonus [name="pin"]').val('');
      
      app.popup.close($$('.page[data-name="transfer-bonus"]').parents(".popup"));
      
      app.request.getJSON( app.data.endpoint + 'api/v1/member/saldo', function (res) {
          
        $$('#saldo').text(res.saldof);
        app.data.saldo = parseInt(res.saldo);
        
        $$('#bonus').text(res.bonusf);
        app.data.bonus = parseInt(res.bonus);
      });
    } else {
      $$('#transfer-bonus [name="pin"]').val('');
      app.dialog.alert(data.message, 'Transfer Bonus');
    }
  });
});  

$$('#transfer-bonus').on('popup:closed', function (e, popup) {
  $$('#transfer-bonus [name="nominal"]').val('');
  $$('#transfer-bonus [name="pin"]').val('');
});

// setup bank transfer
$$('#bank-trf .btnBankTrf').on('click', function(e){
  //e.preventDefault();
  
  var bank = $$('#bank-trf [name="bank"]').val();

  if (bank === '') {
    app.dialog.alert('Pilih data nama bank transfer penarikan uang anda.', 'Bank Transfer Withdrawal');
    return;
  }
  
  var norek = $$('#bank-trf [name="norek"]').val();

  if (norek === '') {
    app.dialog.alert('Masukkan data nama nomor rekening bank anda.', 'Bank Transfer Withdrawal');
    return;
  }
  
  var atn = $$('#bank-trf [name="atn"]').val();

  if (atn === '') {
    app.dialog.alert('Masukkan data nama pemilik rekening.', 'Bank Transfer Withdrawal');
    return;
  }

  var pin = $$('#bank-trf [name="pin"]').val();
  if (pin === '') {
    app.dialog.alert('Masukkan nomor PIN atau password anda.', 'Bank Transfer Withdrawal');
    return;
  }

  var formData = app.form.convertToData('.bank-trf');
  
  app.request.post( app.data.endpoint + 'api/v1/member/setbank', formData, function (res) {
    
    app.preloader.hide();

    var data = JSON.parse(res);

    if (data.status) {
      
      $$('#bank-trf [name="bank"]').val('');
      $$('#bank-trf [name="norek"]').val('');
      $$('#bank-trf [name="atn"]').val('');
      $$('#bank-trf [name="pin"]').val('');
      
      app.popup.close($$('.page[data-name="bank-trf"]').parents(".popup"));

    } else {
      $$('#bank-trf [name="pin"]').val('');
      app.dialog.alert(data.message, 'Bank Transfer Withdrawal');
    }
  });
});  

$$('#bank-trf').on('popup:closed', function (e, popup) {
  $$('#bank-trf [name="bank"]').val('');
  $$('#bank-trf [name="norek"]').val('');
  $$('#bank-trf [name="atn"]').val('');
  $$('#bank-trf [name="pin"]').val('');
});

// withdrawal
$$('#withdrawal .btnWithdraw').on('click', function(e){
  //e.preventDefault();
  
  var saldo = parseInt($$('#withdrawal [name="nominal"]').val());

  if (saldo === '' || saldo === '0') {
    app.dialog.alert('Masukkan jumlah saldo yang akan ditarik.', 'Withdrawal');
    return;
  } else
  if (app.data.saldo === 0) {
    app.dialog.alert('Jumlah saldo anda masih kosong.', 'Withdrawal');
    return;
  } else
  if (app.data.saldo < 100000) {
    app.dialog.alert('Jumlah saldo anda belum mencukupi minimal penarikan.', 'Withdrawal');
    $$('#withdrawal [name="nominal"]').val('0');
    return;
  } else
  if (saldo < 100000) {
    app.dialog.alert('Jumlah minimal withdrawal sebesar 100.000.', 'Withdrawal');
    $$('#withdrawal [name="nominal"]').val(100000);
    return;
  } else
  if (saldo > app.data.saldo) {
    app.dialog.alert('Jumlah maksimal saldo yang bisa diwithdraw adalah ' + app.data.saldo +'.', 'Withdrawal');
    $$('#withdrawal [name="nominal"]').val(app.data.saldo);
    return;
  }

  var pin = $$('#withdrawal [name="pin"]').val();
  if (pin === '') {
    app.dialog.alert('Masukkan nomor PIN atau password anda.', 'Withdrawal');
    return;
  }

  var formData = app.form.convertToData('.withdrawal');
  
  app.request.post( app.data.endpoint + 'api/v1/member/withdraw', formData, function (res) {
    
    app.preloader.hide();

    var data = JSON.parse(res);

    if (data.status) {
      
      $$('#withdrawal [name="nominal"]').val('');
      $$('#withdrawal [name="pin"]').val('');
      
      app.popup.close($$('.page[data-name="withdrawal"]').parents(".popup"));
    } else {
      $$('#withdrawal [name="pin"]').val('');
      app.dialog.alert(data.message, 'Withdrawal');
    }
  });
});  

$$('#withdrawal').on('popup:closed', function (e, popup) {
  $$('#withdrawal [name="nominal"]').val('');
  $$('#withdrawal [name="pin"]').val('');
});

// ganti pin
$$('#ganti-pin .btnGanti').on('click', function () {
  
  var pinlama = $$('#ganti-pin [name="pinlama"]').val();
  var pinbaru = $$('#ganti-pin [name="pinbaru"]').val();
  
  if (pinlama == '') {
      app.dialog.alert('Masukkan nomor PIN atau password yang lama.', 'Ganti PIN');
      return;
  } else
  if (pinlama != app.data.pin) {
    app.dialog.alert('Input nomor pin/password yang lama belum benar.', 'Ganti PIN');
    return;
  } else
  if (pinbaru == '') {
      app.dialog.alert('Masukkan nomor PIN atau password yang baru.', 'Ganti PIN');
      return;
  }
  
  app.preloader.show();

  var formData = app.form.convertToData('.ganti-pin');
  
  app.request.post( app.data.endpoint + 'api/v1/member/gantipin', formData, function (res) {
    
    app.preloader.hide();
    
    var data = JSON.parse(res);

    if (data.status) {

      app.request.setup({
        headers: {
          'Token': data.token
        }
      });

      app.data.pin = pinbaru;
      localStorage.setItem('pin', pinbaru);

      $$('#ganti-pin [name="pinlama"]').val('');
      $$('#ganti-pin [name="pinbaru"]').val('');
      
      app.popup.close($$('.page[data-name="ganti-pin"]').parents(".popup"));
    } else {
      app.dialog.alert(data.message, 'Ganti PIN');
    }
  });
});

$$('#ganti-pin').on('popup:closed', function (e, popup) {
  $$('#ganti-pin [name="pinlama"]').val('');
  $$('#ganti-pin [name="pinbaru"]').val('');
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
      
      app.request.get( app.data.endpoint + 'api/v1/auth/logout', function(res) {
        app.data.total_items = 0;
        app.data.bLogedIn = false;
        navigator.app.exitApp();
      });
      
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
      
    app.request.get( app.data.endpoint + 'api/v1/auth/logout', function(res) {
      
      app.data.total_items = 0;
      app.data.bLogedIn = false;
      app.data.mbrid = null;
      // localStorage.setItem('mbrid', '');
      localStorage.setItem('nohp', '');
      app.loginScreen.open('#my-login-screen');
    });
  });


  $$('#order-display').on('popup:opened', function (e, popup) {
    $$('#order-display .ordernum').text(app.data.ordernum);
  });
  

  $$('#order-display .btnContinue').on('click', function (e) {

    e.preventDefault();

    app.popup.close('#order-display', false);
    
    // back to main page
    var view = app.views.current;
    view.router.back(view.history[0], { force: true });    
  });

  $$('.toggle.voucher').on('change', function (e) {
    
    var toggle = e.srcElement; //app.toggle.get('.toggle');

    if (toggle.checked) {
      
      var dialog = app.dialog.prompt('Masukkan kode voucher atau promo:', 'Input Kode Voucher', function (kode) {
        
        var formData = {};
        formData.promo_code = kode;
  
        app.preloader.show();

        app.request.post(app.data.endpoint + 'api/v1/checkout/promo-code', formData, function (res) {
    
          app.preloader.hide();
          var data = JSON.parse(res);
          if (data.status = true)
          {
            
            app.router.navigate('/checkout/', {
              reloadCurrent: true,
              ignoreCache: true,
            });
          }
          else
          {
            app.dialog.alert('Kode promo tidak ditemukan!');
            toggle.checked = false;
          }
        });
      }, function (kode) {
        toggle.checked = false;
      });
      dialog.$el.find('input').focus();
      dialog.$el.find('.item-input-wrap').addClass('voucher');
    }
    else
    {
      if (app.data.promo) {
        app.request.post(app.data.endpoint + 'api/v1/checkout/unset-promo-code', function (res) {
          app.router.navigate('/checkout/', {
            reloadCurrent: true,
            ignoreCache: true,
          });
        });
      }
    }
  });

  // .stepper.cart.stepper-fill.stepper-init
  $$('.stepper.cart').on('stepper:change', function (stepper, el) {
    
    var kode   = $$(stepper.srcElement).attr('item-code');
    var value  = el.value;

    var formData = {};
    formData.kode = kode;
    formData.qty  = value;

    app.request.post(app.data.endpoint + 'api/v1/cart/chg-qty', formData, function (res) {
      app.router.navigate('/cart/', {
        reloadCurrent: true,
        ignoreCache: true,
      });
    });
  });
});

