routes = [
  {
    path: '/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      app.request.getJSON( app.data.endpoint + 'api/v1/dashboard', function(res) {

        // Hide Preloader
        app.preloader.hide();

        // console.log(res)
        // var data = JSON.parse(res)
        
        // Resolve route to load page
        resolve(
          {
            componentUrl: './pages/home.html',
          },
          {
            context: {
              banner: res.banner
              // data: res.categories,
            }
          }
        );
      });
    }
  },
  {
    path: '/search/',
    componentUrl: './pages/search.html',
  },
  {
    path: '/forget/',
    componentUrl: './pages/forget.html',
  },
  {
    path: '/login/',
    componentUrl: './pages/login.html',
  },
  {
    path: '/register/',
    url: './pages/register.html',
    on: {
      
      pageInit: function (event, page) {
        
        $$('i.icon.icon-back').on('click', function () {
          var view = app.views.current;
          view.router.back(view.history[0], { force: true });
        });
        
        $$('.register-button').on('click', function () {
  
          var first_name = $$('#first_name').val();
          if (first_name == '') {
              app.dialog.alert('Masukkan nama depan anda.', 'Pendaftaran');
              return;
          }
          
          var rgx_nama = /^[a-zA-Z]'?([a-zA-Z]|\,|\.| |-)+$/;
          var namax = first_name.trim().match(rgx_nama);
          if (!namax) {
            app.dialog.alert('Input data nama belum benar.', 'Pendaftaran');
            return;
          }
          
          // var last_name = $$('#last_name').val();
          // if (last_name == '') {
          //     app.dialog.alert('Masukkan nama belakang anda.', 'Pendaftaran');
          //     return;
          // }
        
          var email = $$('#email-reg').val();
          if (email == '') {
              app.dialog.alert('Masukkan email anda.', 'Pendaftaran');
              return;
          }
        
          var phone = $$('#phone').val();
          if (phone == '') {
              app.dialog.alert('Masukkan nomor handphone anda.', 'Pendaftaran');
              return;
          }
        
          var password = $$('#password-reg').val();
          if (password == '') {
            app.dialog.alert('Masukkan password anda.', 'Pendaftaran');
            return;
          }
        
          var pconfirm = $$('#password_confirm').val();
          if (pconfirm == '') {
            app.dialog.alert('Masukkan konfirmasi password anda.', 'Pendaftaran');
            return;
          }

          if (password !== pconfirm) {
            app.dialog.alert('Input password tidak sama.', 'Pendaftaran');
            return;
          }

          app.preloader.show();
          
          // var regId = localStorage.getItem('RegId');
          var formData = app.form.convertToData('.register-form');
        
          // formData.gcmid = regId;
          
          app.request.post( app.data.endpoint + 'api/v1/register', formData, function (res) {
            
            app.preloader.hide();
            
            var data = JSON.parse(res);
        
            if (data.status) {
              
              // simpan data nomor handphone
              localStorage.setItem('email', email);
              // localStorage.setItem('phone', phone);
              localStorage.setItem('password', password);
        
          
              // setTimeout(function () {
                app.dialog.alert(data.message, 'Pendaftaran');
              // }, 2000);
              
              // redirect to login
              app.router.navigate('/login/', {
                reloadCurrent: true,
                ignoreCache: true,
              });

            } else {
              app.dialog.alert(data.message, 'Pendaftaran');
            }
          }, function (xhr) {
            
            console.log(xhr)
          });
        });

        $$('.login-button').on('click', function () {
  
          var view = app.views.current;
          view.router.back(view.history[0], { force: true });
        });
        
      }
    }
  },
  {
    path: '/cust-svc/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      app.request.get( app.data.endpoint + 'api/v1/cust-svc', function(res) {

        // Hide Preloader
        app.preloader.hide();

        // console.log(res)
        var data = JSON.parse(res)

        // Resolve route to load page
        resolve(
          {
            componentUrl: './pages/cust-service.html',
          },
          {
            context: {
              data: data.cust_svc
            }
          }
        );

      });
    },
  },
  {
    path: '/cart/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;
      
      if (app.data.total_items == 0) {
        app.dialog.alert('Keranjang belanja anda masih kosong!');
        reject();
        return;
      }

      if (!app.data.bLogedIn) {
        
        app.data.lastURL = app.views.main.router.url;

        resolve(
          {
            componentUrl: './pages/login.html',
          }
        );
        return;
      }

      // Show Preloader
      app.preloader.show();

      app.request.get( app.data.endpoint + 'api/v1/cart', function(res) {

        // Hide Preloader
        app.preloader.hide();

        // console.log(res)
        var data = JSON.parse(res)
        
        app.data.tot_equipment = data.total_equipment;
        app.data.tot_utensil   = data.total_utensil;
        // $$('#spangt').text(app.data.gtotal.toLocaleString());

        // Resolve route to load page
        resolve(
          {
            componentUrl: './pages/cart.html',
          },
          {
            context: {
              equipment: data.equipment,
              utensil: data.utensil,
            }
          }
        );

      });
    },
  },
  {
    path: '/cek-harga/',
    url: './pages/cek-harga.html',
  },
  {
    path: '/cek-harga-kaori/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();
      // var mbrid = routeTo.params.id;
      
      app.request.getJSON( app.data.endpoint + 'api/v1/categories', function(res) {
        // var data = JSON.parse(res.data);
        // console.log(data)
        app.preloader.hide();
        resolve(
          { componentUrl: './pages/categories2.html' },
          { context: { data: res.data } }
        );
      });
    }
  },
  {
    path: '/cek-harga-pulsa/',
    url: './pages/cek-harga-pulsa.html',
  },
  {
    path: '/cek-harga-data/',
    url: './pages/cek-harga-data.html',
  },
  {
    path: '/cek-harga-topup/',
    url: './pages/cek-harga-topup.html',
  },
  {
    path: '/cek-harga-telpon/',
    url: './pages/cek-harga-telpon.html',
  },
  {
    path: '/cek-harga-sms/',
    url: './pages/cek-harga-sms.html',
  },
  {
    path: '/cek-harga-brg/:id',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // kode operator
      var id = routeTo.params.id;

      // Simulate Ajax Request
      app.request.json( app.data.endpoint + 'api/v1/category/'+id, function(json) {
          
        var data = { title: 'Harga ' +json.title, list: json.data };

        resolve(
          { componentUrl: './pages/daftar-harga.html' },
          { context: { data: data, } }
        );
        app.preloader.hide();
      });
    }
  },
  {
    path: '/cek-harga-hinet/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // kode operator
      //var opr = routeTo.params.opr;

      // Simulate Ajax Request
      app.request.json( app.data.endpoint + 'api/v1/hinet/cekharga', function(json) {
          
        var data = { title: 'Harga Paket HINET', list: json };

        resolve(
          { componentUrl: './pages/daftar-harga.html' },
          { context: { data: data, } }
        );
        app.preloader.hide();
      });
    }
  },
  {
    path: '/harga-pulsa/:opr/:nama',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // kode operator
      var opr = routeTo.params.opr;
      var nama = routeTo.params.nama;

      app.request.json( app.data.endpoint + 'api/v1/pulsa/cekharga/'+opr, function(json) {
          
        var data = { title: 'Harga Pulsa ' + nama, list: json };

        resolve(
          { componentUrl: './pages/daftar-harga.html' },
          { context: { data: data } }
        );
        app.preloader.hide();
      });
    }
  },
  {
    path: '/harga-data/:opr/:nama',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // kode operator
      var opr = routeTo.params.opr;
      var nama = routeTo.params.nama;

      app.request.json( app.data.endpoint + 'api/v1/data/cekharga/'+opr, function(json) {
          
        var data = { title: 'Harga Paket Data ' + nama, list: json };

        resolve(
          { componentUrl: './pages/daftar-harga.html' },
          { context: { data: data, } }
        );
        app.preloader.hide();
      });
    }
  },
  {
    path: '/harga-topup/:opr',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // kode operator
      var opr = routeTo.params.opr;

      app.request.json( app.data.endpoint + 'api/v1/topup/cekharga/'+opr, function(json) {
          
        var data = { title: 'Harga Topup ' + opr, list: json };

        resolve(
          { componentUrl: './pages/daftar-harga.html' },
          { context: { data: data } }
        );
        app.preloader.hide();
      });
    }
  },
  {
    path: '/harga-telpon/:opr/:nama',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // kode operator
      var opr = routeTo.params.opr;
      var nama = routeTo.params.nama;

      app.request.json( app.data.endpoint + 'api/v1/telpon/cekharga/'+opr, function(json) {
          
        var data = { title: 'Harga Paket Nelpon ' + nama, list: json };

        resolve(
          { componentUrl: './pages/daftar-harga.html' },
          { context: { data: data, } }
        );
        app.preloader.hide();
      });
    }
  },
  {
    path: '/harga-sms/:opr/:nama',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // kode operator
      var opr = routeTo.params.opr;
      var nama = routeTo.params.nama;

      app.request.json( app.data.endpoint + 'api/v1/sms/cekharga/'+opr, function(json) {
          
        var data = { title: 'Harga Paket SMS ' + nama, list: json };

        resolve(
          { componentUrl: './pages/daftar-harga.html' },
          { context: { data: data, } }
        );
        app.preloader.hide();
      });
    }
  },
  {
    path: '/harga-pln/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // kode operator
      //var opr = routeTo.params.opr;

      // Simulate Ajax Request
      app.request.json( app.data.endpoint + 'api/v1/pln/cekharga', function(json) {
          
        var data = { title: 'Harga Token PLN', list: json };

        resolve(
          { componentUrl: './pages/daftar-harga.html' },
          { context: { data: data, } }
        );
        app.preloader.hide();
      });
    }
  },
  {
    path: '/daftar/',
    url: './pages/pendaftaran.html',
    on: {
      pageInit: function (event, page) {
        
        $$('.contact').on('click', function(e){
     
          navigator.contacts.pickContact(function(contact){
              //console.log('The following contact has been selected:' + JSON.stringify(contact));
              var nomor = contact.phoneNumbers[0].value;
              $$('#nohp').val(nomor.replace('+62','0').replace(/-/g,'').replace(/ /g,''));
              // $$('#nama').val(contact.name.givenName);
          },function(err){
              //console.log('Error: ' + err);
              // alert('Error: ' + err);
          });
        });
        
        $$('.btnKirim').on('click', function(e){
          //e.preventDefault();

          // if (app.data.saldo == 0) {
          //   app.dialog.alert('Saldo anda kosong. Silahkan topup saldo anda terlebih dahulu.', 'Pendaftaran Member');
          //   return;
          // } else
          // if (app.data.saldo < 100000) {
          //   app.dialog.alert('Jumlah minimum saldo agar anda bisa mendaftarkan anggota adalah 100.000', 'Pendaftaran Member');
          //   return;
          // }

          var nohp = $$('#nohp').val();
          if (nohp === '') {
            app.dialog.alert('Masukkan data nomor handphone.', 'Pendaftaran Member');
            return;
          }

          var rgx_nohp = /[08][0-9]{9,}/;
          var nohpx = nohp.trim().match(rgx_nohp);
          if (!nohpx) {
            app.dialog.alert('Input data nomor handphone belum benar.', 'Pendaftaran Member');
            return;
          }
          
          var nama = $$('#nama').val();
          if (nama == '') {
            app.dialog.alert('Masukkan nama member.', 'Pendaftaran Member');
            return;
          }

          var rgx_nama = /^[a-zA-Z]'?([a-zA-Z]|\,|\.| |-)+$/;
          var namax = nama.trim().match(rgx_nama);
          if (!namax) {
            app.dialog.alert('Input data nama belum benar.', 'Pendaftaran Member');
            return;
          }
        
          app.preloader.show();

          var formData = app.form.convertToData('.pendaftaran');
          formData.mbrid = app.data.mbrid;
          
          app.request.post( app.data.endpoint + 'api/v1/member', formData, function (res) {
            
            app.preloader.hide();
            
            var data = JSON.parse(res);
        
            if (data.status) {
              
              app.dialog.alert(data.message, 'Registrasi Member');
              app.router.back();

              // ambil informasi saldo member
              app.request.get( app.data.endpoint + 'api/v1/member/saldo/'+app.data.mbrid, function (res) {
                  
                var data = JSON.parse(res);
            
                if (data.status) {
                  $$('.saldo').text(parseInt(data.saldo).toLocaleString('ID'));
                  app.data.saldo = parseInt(data.saldo);
                  $$('.bonus').text(parseInt(data.bonus).toLocaleString('ID'));
                  app.data.bonus = parseInt(data.bonus);
                } else {
                  app.dialog.alert(data.message);
                }
              });

            } else {
              app.dialog.alert(data.message, 'Pendaftaran Member');
            }
          });
        });                  
      }
    }
  },
  {
    path: '/checkout/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      if (!app.data.bLogedIn) {
        
        app.data.lastURL = '/checkout/';

        app.router.navigate('/login/', {
          reloadCurrent: true,
          ignoreCache: true,
        });
      }

      // Show Preloader
      app.preloader.show();
        
      app.request.get( app.data.endpoint + 'api/v1/cart', function(res) {
          
        var data = JSON.parse(res);
        // app.data.tot_equipment = data.total_equipment;
        app.data.tot_utensil   = data.total_utensil;
        // console.log(data.total_utensil)
        // console.log(data.utensil)

        app.preloader.hide();

        resolve (
          { componentUrl: './pages/checkout.html' },
          { context: { data: data } }
        );
      });
    }
  },
  {
    path: '/cek-resi/:nomor',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;
      var order_id = routeTo.params.nomor;

      // Show Preloader
      app.preloader.show();

      app.request.getJSON( app.data.endpoint + 'api/v1/resi/'+order_id, function(res) {

        app.preloader.hide();

        resolve (
          { componentUrl: './pages/cek-resi.html' },
          { context: { data: res } }
        );
      });
    }
  },
  {
    path: '/settings/',
    url: './pages/settings.html',
  },
  {
    path: '/akun/',
    url: './pages/akun.html',
    on: {
      pageInit: function (event, page) {
        
        var mbrid = app.data.mbrid;
        
        app.request.get( app.data.endpoint + 'api/v1/member/saldo/'+mbrid, function (res) {
            
          var data = JSON.parse(res);
        
          if (data.status) {
            $$('#saldo').text(parseInt(data.saldo).toLocaleString('ID'));
            app.data.saldo = parseInt(data.saldo);

            // $$('#poin').text(parseInt(data.poin).toLocaleString('ID'));
            // app.data.poin = parseInt(data.poin);

            $$('#bonus').text(parseInt(data.bonus).toLocaleString('ID'));
            app.data.bonus = parseInt(data.bonus);

          } else {
            app.dialog.alert(data.message, 'Akun Saya');
          }
        });
        
        $$('.cek-id').on('click', function(e){
          
          app.request.get( app.data.endpoint + 'api/v1/member/cek_id/'+ app.data.mbrid, function (res) {
            
            var data = JSON.parse(res);
    
            // if (data.status) {
              app.dialog.alert(data.message, 'Akun Saya');
            // } else {
              // app.dialog.alert(data.message, 'Akun Saya');
            // }
          });
        });
      }
    }
  },
  /*{
    path: '/account/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      if (!app.data.bLogedIn) {
        
        app.data.lastURL = '/account/';

        resolve(
          {
            componentUrl: './pages/login.html',
          }
        );
        return;
      }
      
      resolve(
        {
          componentUrl: './pages/account.html',
        }
      );
      return;
    }
  },
  {
    path: '/wish-list/',
    // componentUrl: './pages/wish-list.html',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();
    
      var db = app.data.db;
      // var items = [];

      if (db) {
      
        db.transaction(function(tx) {
          
          tx.executeSql('select kdbar, kdurl, nama, gambar, hjual, pnj, lbr, tgi from wishlist order by tglinput;', [], function(ignored, res) {
            
            if (res.rows.length === 0) {
              app.preloader.hide();
              return;
            }
            
            var items = [];

            for (var i = 0; i < res.rows.length; i++) {
              
              items.push({
                kdbar: res.rows.item(i).kdbar,
                kdurl: res.rows.item(i).kdurl,
                nama: res.rows.item(i).nama,
                gambar: res.rows.item(i).gambar,
                hjual: res.rows.item(i).hjual,
                pnj: res.rows.item(i).pnj,
                lbr: res.rows.item(i).lbr,
                tgi: res.rows.item(i).tgi,
              });
            }
            
            app.preloader.hide();
      
            resolve(
              { componentUrl: './pages/wish-list.html' },
              { context: { data: items } }
            );
          });
          
        }, function(error) {
          app.preloader.hide();
          app.dialog.alert('select error: ' + error.message);
        });
      }
      else
      {
        app.request.getJSON( app.data.endpoint + 'api/v1/wishlist/'+app.data.mbrid, function(res) {
          app.preloader.hide();
          // var items = [{"kdbar":"AB-106R","kdurl":"AB-106R","nama":"CHEST FREEZER 102 LITER","deskripsi":"Box tempat penyimpanan bahan makanan yang akan dibekukan seperti daging, bakso, nuget, sosis, dsb. Dengan berbagai ukuran yang disesuaikan untuk kebutuhan masing-masing.","hjual":"2,650,000","hpromof":"2,650,000","kriteria":"","pnj":"56.3cm","lbr":"56.2cm","tgi":"84.5cm","master":"N","saldo":"0","gambar":"ab-106r.png"},{"kdbar":"AB-1200TX","kdurl":"AB-1200TX","nama":"CHEST FREEZER 1.050 LITER","deskripsi":"Box tempat penyimpanan bahan makanan yang akan dibekukan seperti daging, bakso, nuget, sosis, dsb. Dengan berbagai ukuran yang disesuaikan untuk kebutuhan masing-masing.\r\n","hjual":"13,000,000","hpromof":"13,000,000","kriteria":"","pnj":"225.0cm","lbr":"82.0cm","tgi":"88.0cm","master":"N","saldo":"0","gambar":"ab12001.png"},{"kdbar":"AB-226R","kdurl":"AB-226R","nama":"CHEST FREEZER 220 LITER","deskripsi":"Box tempat penyimpanan bahan makanan yang akan dibekukan seperti daging, bakso, nuget, sosis, dsb. Dengan berbagai ukuran yang disesuaikan untuk kebutuhan masing-masing.\r\n","hjual":"3,575,000","hpromof":"3,575,000","kriteria":"","pnj":"94.6cm","lbr":"56.2cm","tgi":"84.5cm","master":"N","saldo":"0","gambar":"ab336r.png"}];
          
          resolve(
            { componentUrl: './pages/wish-list.html' },
            { context: { data: res } }
          );
        });
      }
    }
  },*/
  {
    path: '/order-status/',
    // componentUrl: './pages/order-status.html',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // kode item
      var mbrid = app.data.mbrid;
      // var nama = routeTo.params.nama;

      // var db = app.data.db;
      
      app.request.getJSON( app.data.endpoint + 'api/v1/member/order-status/'+mbrid, function(res) {
        // var data = [{"id":"00015","name":"Putu Wirya","tglinput":"30 Sep 2019","address":"Jalan Raya Demak,<br>SURABAYA - JAWA TIMUR 60119","totalamount":"308750","tax":"0","shipcost":"15000","addcost":"11241.25","gtotal":"334991.25","paymentcode":"0","no_resi":null,"delivery":"jne","package":"OKE","status":"Pending"}];
        app.preloader.hide();

        resolve(
          { componentUrl: './pages/order-status.html' },
          { context: { data: res.data } }
        );
      });
    },
  },
  {
    path: '/order-history/',
    // componentUrl: './pages/order-history.html',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // kode item
      var mbrid = app.data.mbrid;
      // var nama = routeTo.params.nama;

      // var db = app.data.db;
      
      app.request.getJSON( app.data.endpoint + 'api/v1/member/order-history/'+mbrid, function(res) {
        
        app.preloader.hide();

        resolve(
          { componentUrl: './pages/order-history.html' },
          { context: { data: res.data } }
        );
      });
    },
  },
  {
    path: '/profile/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      if (!app.data.bLogedIn) {
        
        app.data.lastURL = '/profile/';

        resolve(
          {
            componentUrl: './pages/login.html',
          }
        );
        return;
      }

      // Show Preloader
      app.preloader.show();
        
      app.request.getJSON( app.data.endpoint + 'api/v1/member/'+app.data.mbrid, function(res) {
          
        // var data = JSON.parse(res);

        resolve (
          { componentUrl: './pages/profile.html' },
          { context: { data: res } }
        );
        app.preloader.hide();
      });
    }
  },
  {
    path: '/chat/',
    componentUrl: './pages/chat.html',
  },
  {
    path: '/notifications/',
    componentUrl: './pages/notifications.html',
  },
  {
    path: '/opsi-belanja/',
    url: './pages/opsi-belanja.html',
  },
  {
    path: '/belanja-online/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();
      // var mbrid = routeTo.params.id;
      
      app.request.getJSON( app.data.endpoint + 'api/v1/categories', function(res) {
        // var data = JSON.parse(res.data);
        // console.log(data)
        app.preloader.hide();
        resolve(
          { componentUrl: './pages/categories.html' },
          { context: { data: res.data } }
        );
      });
    }
  },
  {
    path: '/belanja/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      resolve(
        { componentUrl: './pages/belanja.html' },
        { context: { mbrid: null } }
      );
      app.preloader.hide();
    }
  },
  {
    path: '/belanja/:id',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();
      var mbrid = routeTo.params.id;

      resolve(
        { componentUrl: './pages/belanja.html' },
        { context: { mbrid: mbrid } }
      );
      app.preloader.hide();
    }
  },
  {
    path: '/transfer-saldo/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      resolve(
        { componentUrl: './pages/transfer-saldo.html' },
        { context: { mbrid: null } }
      );
      app.preloader.hide();
    }
  },
  {
    path: '/transfer-saldo/:id',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();
      var mbrid = routeTo.params.id;

      resolve(
        { componentUrl: './pages/transfer-saldo.html' },
        { context: { mbrid: mbrid } }
      );
      app.preloader.hide();
    }
  },
  {
    path: '/histori-trx/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();
        
      if (!app.data.currentDate) {
      
        var now = new Date();
        
        var day = ("0" + now.getDate()).slice(-2);
        var month = ("0" + (now.getMonth() + 1)).slice(-2);
        
        var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
        app.data.currentDate = today;
      }
      
      var formData = [];

      formData.tgltrx = app.data.currentDate;
      formData.Authorization = app.data.token;
      
      app.request.post( app.data.endpoint + "api/v1/member/historitrx", formData, function(res) {
          
        var data = JSON.parse(res);

        resolve(
          { componentUrl: './pages/histori-trx.html' },
          { context: { data: data } }
        );
        app.preloader.hide();
      });
    },
    
    on: {
      pageInit: function (event, page) {
        
        $$('#tgltrx').val(app.data.currentDate);
      
        $$('#tgltrx').on('change', function(e){

          app.data.currentDate = $$('#tgltrx').val();
          app.router.navigate('/histori-trx/', {
            reloadCurrent: true,
            ignoreCache: true,
          });
        });
      
      },
      pageAfterOut: function (event, page) {
      
        app.data.currentDate = null;
      }
    },
  },
  {
    path: '/pulsa/',
    url: './pages/pulsa.html',
    on: {
      pageInit: function (event, page) {
        
        function updateList(hlr) {
          app.request.json( app.data.endpoint + 'api/v1/pulsa/'+hlr, function (json) {

            $$('#nominal').html('');
            for (var i = 0; i < json.length; i++) {
              $$('#nominal').append('<option value="'+json[i].kode+'">'+json[i].nominal+'</option>')
            }
    
          });
        }
        
        $$('#tujuan').on('input', function(){
          
          var str = $$(this).val();
          
          if (str.length < 4) {
            $$('#nominal').html('');
          } else
          if (str.length == 4) {
            updateList(str);
          } else {
            var str = $$(this).val().substring(0, 4);
            updateList(str);
          }
        });

        $$('.contact').on('click', function(e){
     
          navigator.contacts.pickContact(function(contact){
              //console.log('The following contact has been selected:' + JSON.stringify(contact));
              var nomor = contact.phoneNumbers[0].value;
              $$('#tujuan').val(nomor.replace('+62','0').replace(/-/g,'').replace(/ /g,''));
              var str = $$('#tujuan').val().substring(0, 4);
              updateList(str);
          },function(err){
              //console.log('Error: ' + err);
              // alert('Error: ' + err);
              $$('#tujuan').val('');
          });
        });
      
        $$('.btnKirim').on('click', function(e){
          //e.preventDefault();
          
          var tujuan = $$('#tujuan').val();
          if (tujuan === '') {
              app.dialog.alert('Masukkan data nomor hp tujuan.', 'Pulsa HP');
              return;
          }

          var rgx_nohp = /[08][0-9]{9,}/;
          var nohp = tujuan.trim().match(rgx_nohp);
          if (!nohp) {
              app.dialog.alert('Input data nomor hp tujuan belum benar.', 'Pulsa HP');
              return;
          }

          var kode = $$('#nominal').val();
          if (kode === '') {
              app.dialog.alert('Pilih nominal pulsa.', 'Pulsa HP');
              return;
          }
          
          if (app.data.saldo === 0) {
            app.dialog.alert('Saldo anda tidak cukup untuk melakukan transaksi pengisian pulsa.', 'Pulsa HP');
            return;
          }
            
          var pin = $$('#pin').val();
          if (pin === '') {
            app.dialog.alert('Masukkan nomor PIN anda.', 'Pulsa HP');
            return;
          }
        
          // app.preloader.show();
          $$(this).prop("disabled", true);

          var formData = app.form.convertToData('.trxpulsa');
          formData.Authorization = app.data.token;
          
          app.request.post( app.data.endpoint + 'api/v1/pulsa', formData, function (res) {
            
            // app.preloader.hide();
            
            var data = JSON.parse(res);
        
            if (data.status) {
              // setTimeout(function () {
                app.router.back();
              // }, 500);
            } else {

              $$(this).prop("disabled", false);
              if (data.message !== '') {
                app.dialog.alert(data.message, 'Pulsa HP');
              }
            }
          });
        });            
      
      }
    }
  },
  {
    path: '/data/',
    url: './pages/data.html',
    on: {
      pageInit: function (event, page) {
        
        function updateList(hlr) {
          app.request.json( app.data.endpoint + 'api/v1/data/'+hlr, function (json) {

            $$('#paket').html('');
            for (var i = 0; i < json.length; i++) {
              $$('#paket').append('<option value="'+json[i].kode+'">'+json[i].nama+'</option>')
            }
          });
        }
        
        $$('#tujuan').on('input', function(){
          
          var str = $$('#tujuan').val();
          
          if (str.length < 4) {
            $$('#nominal').html('');
          } else
          if (str.length == 4) {
            updateList(str);
          } else {
            var str = $$(this).val().substring(0, 4);
            updateList(str);
          }
        });
        
        $$('.contact').on('click', function(e){
     
          navigator.contacts.pickContact(function(contact){
              //console.log('The following contact has been selected:' + JSON.stringify(contact));
              var nomor = contact.phoneNumbers[0].value;
              $$('#tujuan').val(nomor.replace('+62','0').replace(/-/g,'').replace(/ /g,''));
              var str = $$('#tujuan').val().substring(0, 4);
              updateList(str);
          },function(err){
              //console.log('Error: ' + err);
              // alert('Error: ' + err);
              $$('#tujuan').val('');
          });
        });
      
        $$('.btnKirim').on('click', function(e){
          //e.preventDefault();
          
          var tujuan = $$('#tujuan').val();
          if (tujuan == '') {
              app.dialog.alert('Masukkan data nomor hp tujuan.', 'Paket Data');
              return;
          }

          var rgx_nohp = /[08][0-9]{9,}/;
          var nohp = tujuan.trim().match(rgx_nohp);
          if (!nohp) {
              app.dialog.alert('Input data nomor hp tujuan belum benar.', 'Paket Data');
              return;
          }
          
          if (app.data.saldo == 0) {
            app.dialog.alert('Saldo anda tidak cukup untuk melakukan transaksi pembelian paket data.', 'Paket Data');
            return;
          }
            
          var pin = $$('#pin').val();
          if (pin === '') {
            app.dialog.alert('Masukkan nomor PIN anda.', 'Paket Data');
            return;
          }
          
          // app.preloader.show();
          $$(this).prop("disabled", true);

          var formData = app.form.convertToData('.trxdata');
          formData.Authorization = app.data.token;
          
          app.request.post( app.data.endpoint + 'api/v1/data', formData, function (res) {
            
            // app.preloader.hide();
            
            var data = JSON.parse(res);
        
            if (data.status) {
              // setTimeout(function () {
                app.router.back();
              // }, 500);
            } else {

              $$(this).prop("disabled", false);
              if (data.message !== '') {
                app.dialog.alert(data.message, 'Paket Data');
              }
            }
          });
        });            
      
      }
    }
  },
  {
    path: '/token/',
    url: './pages/token.html',
    on: {
      pageInit: function (event, page) {
        
        /*var numpad = app.keypad.create({
          inputEl: '#nopel',
          dotButton: false,
          valueMaxLength: 11,
        }); 
        
        var numpad2 = app.keypad.create({
          inputEl: '#tujuan',
          dotButton: false,
          valueMaxLength: 13,
        });*/
        
        $$('.contact').on('click', function(e){
     
          navigator.contacts.pickContact(function(contact){
              //console.log('The following contact has been selected:' + JSON.stringify(contact));
              var nomor = contact.phoneNumbers[0].value;
              $$('#tujuan').val(nomor.replace('+62','0').replace(/-/g,'').replace(/ /g,''));
          },function(err){
              //console.log('Error: ' + err);
              // alert('Error: ' + err);
              $$('#tujuan').val('');
          });
        });
      
        $$('.btnKirim').on('click', function(e){
          //e.preventDefault();
          
          var nopel = $$('#nopel').val();
          if (nopel == '') {
            app.dialog.alert('Masukkan data nomor pelanggan.', 'Token PLN');
            return;
          }

          var rgx_nopel = /[0-9]{11,}/;
          var noplg = nopel.trim().match(rgx_nopel);
          if (!noplg) {
            app.dialog.alert('Input data nomor pelanggan belum benar.', 'Token PLN');
            return;
          }

          var tujuan = $$('#tujuan').val();
          if (tujuan == '') {
              app.dialog.alert('Masukkan data nomor hp tujuan.', 'Token PLN');
              return;
          }
          
          var rgx_nohp = /[08][0-9]{9,}/;
          var nohp = tujuan.trim().match(rgx_nohp);
          if (!nohp) {
            app.dialog.alert('Input data nomor hp tujuan belum benar.', 'Token PLN');
            return;
          }

          var nominal = $$('#nominal').val();
          if (nominal == '') {
              app.dialog.alert('Pilih nominal token.', 'Token PLN');
              return;
          } else
          if (app.data.saldo == 0) {
            app.dialog.alert('Saldo anda tidak cukup untuk melakukan transaksi pembelian token PLN.', 'Token PLN');
            return;
          }
            
          var pin = $$('#pin').val();
          if (pin === '') {
            app.dialog.alert('Masukkan nomor PIN anda.', 'Token PLN');
            return;
          }
          
          // app.preloader.show();
          $$(this).prop("disabled", true);

          var formData = app.form.convertToData('.trxpln');
          formData.Authorization = app.data.token;
          
          app.request.post( app.data.endpoint + 'api/v1/pln', formData, function (res) {
            
            // app.preloader.hide();
            
            var data = JSON.parse(res);
        
            if (data.status) {
              // setTimeout(function () {
                app.router.back();
              // }, 500);
            } else {

              $$(this).prop("disabled", false);
              if (data.message !== '') {
                app.dialog.alert(data.message, 'Token PLN');
              }
            }
          });
        });            
      
      },
    }
  },
  {
    path: '/telpon/',
    url: './pages/telpon.html',
    on: {
      pageInit: function (event, page) {
        
        /*var numpad = app.keypad.create({
          inputEl: '#tujuan',
          dotButton: false,
          valueMaxLength: 13,
          on: {
            change(keypad, value) {
              // console.log(keypad, value);
              value = value.toString();
              if (value.length === 4) {
                updateList(value);
              }
            }
          }
        });*/
        
        function updateList(hlr) {
          app.request.json( app.data.endpoint + 'api/v1/telpon/'+hlr, function (json) {

            $$('#nominal').html('');
            for (var i = 0; i < json.length; i++) {
              $$('#nominal').append('<option value="'+json[i].kode+'">'+json[i].nominal+'</option>')
            }
    
          });
        }
        
        $$('#tujuan').on('input', function(){
          
          var str = $$('#tujuan').val();
          
          if (str.length < 4) {
            $$('#nominal').html('');
          } else
          if (str.length == 4) {
            updateList(str);
          } else {
            var str = $$(this).val().substring(0, 4);
            updateList(str);
          }
        });

        $$('.contact').on('click', function(e){
     
          navigator.contacts.pickContact(function(contact){
              //console.log('The following contact has been selected:' + JSON.stringify(contact));
              var nomor = contact.phoneNumbers[0].value;
              $$('#tujuan').val(nomor.replace('+62','0').replace(/-/g,'').replace(/ /g,''));
              var str = $$('#tujuan').val().substring(0, 4);
              updateList(str);
          },function(err){
              //console.log('Error: ' + err);
              // alert('Error: ' + err);
              $$('#tujuan').val('');
          });
        });
      
        $$('.btnKirim').on('click', function(e){
          //e.preventDefault();
          
          var tujuan = $$('#tujuan').val();
          if (tujuan == '') {
              app.dialog.alert('Masukkan data nomor hp tujuan.', 'Paket Nelpon');
              return;
          }

          var rgx_nohp = /[08][0-9]{9,}/;
          var nohp = tujuan.trim().match(rgx_nohp);
          if (!nohp) {
              app.dialog.alert('Input data nomor hp tujuan belum benar.', 'Paket Nelpon');
              return;
          }

          var nominal = $$('#nominal').val();
          if (nominal == '') {
              app.dialog.alert('Pilih nominal pakat.', 'Paket Nelpon');
              return;
          }
          
          if (app.data.saldo == 0) {
            app.dialog.alert('Saldo anda tidak cukup untuk melakukan transaksi pembelian paket nelpon.', 'Paket Nelpon');
            return;
          }
          
          // app.preloader.show();
          $$(this).prop("disabled", true);

          var formData = app.form.convertToData('.trxtelpon');
          formData.Authorization = app.data.token;
          
          app.request.post( app.data.endpoint + 'api/v1/telpon', formData, function (res) {
            
            // app.preloader.hide();
            
            var data = JSON.parse(res);
        
            if (data.status) {
              // setTimeout(function () {
                app.router.back();
              // }, 500);
            } else {

              $$(this).prop("disabled", false);
              if (data.message !== '') {
                app.dialog.alert(data.message, 'Paket Nelpon');
              }
            }
          });
        });            
      
      },
    }
  },
  {
    path: '/sms/',
    url: './pages/sms.html',
    on: {
      pageInit: function (event, page) {
        
        /*var numpad = app.keypad.create({
          inputEl: '#tujuan',
          dotButton: false,
          valueMaxLength: 13,
          on: {
            change(keypad, value) {
              // console.log(keypad, value);
              value = value.toString();
              if (value.length === 4) {
                updateList(value);
              }
            }
          }
        });*/
        
        function updateList(hlr) {
          app.request.json( app.data.endpoint + 'api/v1/sms/'+hlr, function (json) {

            $$('#nominal').html('');
            for (var i = 0; i < json.length; i++) {
              $$('#nominal').append('<option value="'+json[i].kode+'">'+json[i].nominal+'</option>')
            }
    
          });
        }
        
        $$('#tujuan').on('input', function(){
          
          var str = $$('#tujuan').val();
          
          if (str.length < 4) {
            $$('#nominal').html('');
          } else
          if (str.length == 4) {
            updateList(str);
          } else {
            var str = $$(this).val().substring(0, 4);
            updateList(str);
          }
        });

        $$('.contact').on('click', function(e){
     
          navigator.contacts.pickContact(function(contact){
              //console.log('The following contact has been selected:' + JSON.stringify(contact));
              var nomor = contact.phoneNumbers[0].value;
              $$('#tujuan').val(nomor.replace('+62','0').replace(/-/g,'').replace(/ /g,''));
              var str = $$('#tujuan').val().substring(0, 4);
              updateList(str);
          },function(err){
              //console.log('Error: ' + err);
              // alert('Error: ' + err);
              $$('#tujuan').val('');
          });
        });
      
        $$('.btnKirim').on('click', function(e){
          //e.preventDefault();
          
          var tujuan = $$('#tujuan').val();
          if (tujuan == '') {
              app.dialog.alert('Masukkan data nomor hp tujuan.', 'Paket SMS');
              return;
          }

          var rgx_nohp = /[08][0-9]{9,}/;
          var nohp = tujuan.trim().match(rgx_nohp);
          if (!nohp) {
              app.dialog.alert('Input data nomor hp tujuan belum benar.', 'Paket SMS');
              return;
          }

          var nominal = $$('#nominal').val();
          if (nominal == '') {
              app.dialog.alert('Pilih nominal paket sms.', 'Paket SMS');
              return;
          }
          
          if (app.data.saldo == 0) {
            app.dialog.alert('Saldo anda tidak cukup untuk melakukan transaksi pembelian paket sms.', 'Paket SMS');
            return;
          }
          
          // app.preloader.show();
          $$(this).prop("disabled", true);

          var formData = app.form.convertToData('.trxsms');
          formData.Authorization = app.data.token;
          
          app.request.post( app.data.endpoint + 'api/v1/sms', formData, function (res) {
            
            // app.preloader.hide();
            
            var data = JSON.parse(res);
        
            if (data.status) {
              // setTimeout(function () {
                app.router.back();
              // }, 500);
            } else {

              $$(this).prop("disabled", false);
              if (data.message !== '') {
                app.dialog.alert(data.message, 'Paket SMS');
              }
            }
          });
        });            
      
      },
    }
  },
  {
    path: '/opsi-topup/',
    url: './pages/opsi-topup.html',
  },
  {
    path: '/gopay/',
    url: './pages/topup-gopay.html',
    on: {
      pageInit: function (event, page) {
        
        $$('.contact').on('click', function(e){
     
          navigator.contacts.pickContact(function(contact){
              var nomor = contact.phoneNumbers[0].value;
              $$('#tujuan').val(nomor.replace('+62','0').replace(/-/g,'').replace(/ /g,''));
              var str = $$('#tujuan').val().substring(0, 4);
              updateList(str);
          },function(err){
              // alert('Error: ' + err);
              $$('#tujuan').val('');
          });
        });
      
        $$('.btnKirim').on('click', function(e){
          //e.preventDefault();
          
          var tujuan = $$('#tujuan').val();
          if (tujuan === '') {
              app.dialog.alert('Masukkan data nomor hp tujuan.', 'Topup GOPAY');
              return;
          }

          var rgx_nohp = /[08][0-9]{9,}/;
          var nohp = tujuan.trim().match(rgx_nohp);
          if (!nohp) {
              app.dialog.alert('Input data nomor hp tujuan belum benar.', 'Topup GOPAY');
              return;
          }

          var kode = $$('#nominal').val();
          if (kode === '') {
              app.dialog.alert('Pilih nominal topup.', 'Topup GOPAY');
              return;
          }
          
          if (app.data.saldo === 0) {
            app.dialog.alert('Saldo anda tidak cukup untuk melakukan transaksi topup GOPAY.', 'Topup GOPAY');
            return;
          }
          
          // app.preloader.show();
          $$(this).prop("disabled", true);

          var formData = app.form.convertToData('.trxtopup');
          formData.Authorization = app.data.token;
          
          app.request.post( app.data.endpoint + 'api/v1/topup', formData, function (res) {
            
            var data = JSON.parse(res);
        
            if (data.status) {
              app.router.back();
            } else {

              $$(this).prop("disabled", false);
              if (data.message !== '') {
                app.dialog.alert(data.message, 'Topup GOPAY');
              }
            }
          });
        });            
      },
    }
  },
  {
    path: '/ovo/',
    url: './pages/topup-ovo.html',
    on: {
      pageInit: function (event, page) {
        
        $$('.contact').on('click', function(e){
     
          navigator.contacts.pickContact(function(contact){
              var nomor = contact.phoneNumbers[0].value;
              $$('#tujuan').val(nomor.replace('+62','0').replace(/-/g,'').replace(/ /g,''));
              var str = $$('#tujuan').val().substring(0, 4);
              updateList(str);
          },function(err){
              // alert('Error: ' + err);
              $$('#tujuan').val('');
          });
        });
      
        $$('.btnKirim').on('click', function(e){
          //e.preventDefault();
          
          var tujuan = $$('#tujuan').val();
          if (tujuan === '') {
              app.dialog.alert('Masukkan data nomor hp tujuan.', 'Topup OVO');
              return;
          }

          var rgx_nohp = /[08][0-9]{9,}/;
          var nohp = tujuan.trim().match(rgx_nohp);
          if (!nohp) {
              app.dialog.alert('Input data nomor hp tujuan belum benar.', 'Topup OVO');
              return;
          }

          var kode = $$('#nominal').val();
          if (kode === '') {
              app.dialog.alert('Pilih nominal topup.', 'Topup OVO');
              return;
          }
          
          if (app.data.saldo === 0) {
            app.dialog.alert('Saldo anda tidak cukup untuk melakukan transaksi topup OVO.', 'Topup OVO');
            return;
          }
          
          // app.preloader.show();
          $$(this).prop("disabled", true);

          var formData = app.form.convertToData('.trxtopup');
          formData.Authorization = app.data.token;
          
          app.request.post( app.data.endpoint + 'api/v1/topup', formData, function (res) {
            
            var data = JSON.parse(res);
        
            if (data.status) {
              app.router.back();
            } else {

              $$(this).prop("disabled", false);
              if (data.message !== '') {
                app.dialog.alert(data.message, 'Topup OVO');
              }
            }
          });
        });            
      },
    }
  },
  {
    path: '/dana/',
    url: './pages/topup-dana.html',
    on: {
      pageInit: function (event, page) {
        
        $$('.contact').on('click', function(e){
     
          navigator.contacts.pickContact(function(contact){
              var nomor = contact.phoneNumbers[0].value;
              $$('#tujuan').val(nomor.replace('+62','0').replace(/-/g,'').replace(/ /g,''));
              var str = $$('#tujuan').val().substring(0, 4);
              updateList(str);
          },function(err){
              // alert('Error: ' + err);
              $$('#tujuan').val('');
          });
        });
      
        $$('.btnKirim').on('click', function(e){
          //e.preventDefault();
          
          var tujuan = $$('#tujuan').val();
          if (tujuan === '') {
              app.dialog.alert('Masukkan data nomor hp tujuan.', 'Topup DANA');
              return;
          }

          var rgx_nohp = /[08][0-9]{9,}/;
          var nohp = tujuan.trim().match(rgx_nohp);
          if (!nohp) {
              app.dialog.alert('Input data nomor hp tujuan belum benar.', 'Topup DANA');
              return;
          }

          var kode = $$('#nominal').val();
          if (kode === '') {
              app.dialog.alert('Pilih nominal topup.', 'Topup DANA');
              return;
          }
          
          if (app.data.saldo === 0) {
            app.dialog.alert('Saldo anda tidak cukup untuk melakukan transaksi topup DANA.', 'Topup DANA');
            return;
          }
          
          // app.preloader.show();
          $$(this).prop("disabled", true);

          var formData = app.form.convertToData('.trxtopup');
          formData.Authorization = app.data.token;
          
          app.request.post( app.data.endpoint + 'api/v1/topup', formData, function (res) {
            
            var data = JSON.parse(res);
        
            if (data.status) {
              app.router.back();
            } else {

              $$(this).prop("disabled", false);
              if (data.message !== '') {
                app.dialog.alert(data.message, 'Topup DANA');
              }
            }
          });
        });            
      },
    }
  },
  {
    path: '/hinet/',
    url: './pages/hinet.html',
    on: {
      pageInit: function (event, page) {
        
        $$('.contact').on('click', function(e){
     
          navigator.contacts.pickContact(function(contact){
              var nomor = contact.phoneNumbers[0].value;
              $$('#tujuan').val(nomor.replace('+62','0').replace(/-/g,'').replace(/ /g,''));
              var str = $$('#tujuan').val().substring(0, 4);
              updateList(str);
          },function(err){
              // alert('Error: ' + err);
              $$('#tujuan').val('');
          });
        });
      
        $$('.btnKirim').on('click', function(e){
          //e.preventDefault();
          
          var tujuan = $$('#tujuan').val();
          if (tujuan === '') {
              app.dialog.alert('Masukkan data nomor hp tujuan.', 'Paket HINET');
              return;
          }

          var rgx_nohp = /[08][0-9]{9,}/;
          var nohp = tujuan.trim().match(rgx_nohp);
          if (!nohp) {
              app.dialog.alert('Input data nomor hp tujuan belum benar.', 'Paket HINET');
              return;
          }

          var kode = $$('#nominal').val();
          if (kode === '') {
              app.dialog.alert('Pilih nominal topup.', 'Paket HINET');
              return;
          }
          
          if (app.data.saldo === 0) {
            app.dialog.alert('Saldo anda tidak cukup untuk melakukan transaksi isi ulang paket HINET.', 'Paket HINET');
            return;
          }
          
          // app.preloader.show();
          $$(this).prop("disabled", true);

          var formData = app.form.convertToData('.trxhinet');
          formData.Authorization = app.data.token;
          
          app.request.post( app.data.endpoint + 'api/v1/hinet', formData, function (res) {
            
            var data = JSON.parse(res);
        
            if (data.status) {
              app.router.back();
            } else {

              $$(this).prop("disabled", false);
              if (data.message !== '') {
                app.dialog.alert(data.message, 'Paket HINET');
              }
            }
          });
        });            
      },
    }
  },
  {
    path: '/topup-saldo/',
    // url: './pages/topup-saldo.html',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      app.request.get( app.data.endpoint + 'api/v1/bank', function(res) {

        // Hide Preloader
        app.preloader.hide();

        // console.log(res)
        var data = JSON.parse(res)

        // Resolve route to load page
        resolve(
          {
            componentUrl: './pages/topup-saldo.html',
          },
          {
            context: {
              data: data.bank
            }
          }
        );

      });
    },
    /*on: {
      pageInit: function (event, page) {
      
        $$('.btnKirim').on('click', function(e){
          //e.preventDefault();
          
          var nominal = $$('#nominal').val();
          
          if (nominal == '') {
              app.dialog.alert('Masukkan jumlah nominal topup saldo.', 'Topup Saldo');
              return;
          } else
          if (nominal < 50000) {
            app.dialog.alert('Jumlah minimal topup saldo sebesar 50.000.', 'Topup Saldo');
            return;
          }
                  
          app.preloader.show();

          var formData = app.form.convertToData('.topup');
          formData.Authorization = app.data.token;
          
          app.request.post( app.data.endpoint + 'api/v1/member/topup', formData, function (res) {
            
            app.preloader.hide();
            
            var data = JSON.parse(res);
        
            if (data.status) {
              app.router.back();
            } else {
              if (data.message !== '') {
                app.dialog.alert(data.message, 'Topup Saldo');
              }
            }
          });
        });            
      
      },
    }*/
  },
  {
    path: '/category/:id/:page',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // kode golongan
      var id   = routeTo.params.id;
      var page = routeTo.params.page;

      app.request.get( app.data.endpoint + 'api/v1/category/'+id+'/'+page, function(res) {
          
        var data = JSON.parse(res);

        resolve(
          { componentUrl: './pages/category.html' },
          { context: { data: data.data, title: nama } }
        );
        app.preloader.hide();
      });
    },
    on: {
      pageBeforeIn: function (event, page) {
        
        if (app.data.total_items > 0) {
          $$('.badge').text(app.data.total_items);
          $$('.badge').css("display", "block");
        } else {
          $$('.badge').css("display", "none");
        }
      }
    }
  },
  {
    path: '/product/:kode/:page',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // kode golongan
      var kode = routeTo.params.kode;
      // var nama = routeTo.params.nama;
      var page = routeTo.params.page;
      var next_page = parseInt(routeTo.params.page)+1;

      app.request.getJSON( app.data.endpoint + 'api/v1/products/'+kode+'?p='+page, function(res) {

        // total rows
        var total = res.total;
        
        // var url = '/product/' + kode + '/' + nama + '/'
        
        var total_page = Math.ceil(total/10)
        var pages = [];

        for (var i=0; i < total_page; i++)
          pages.push({page : i+1, kode: kode, nama: res.title})
        
        resolve(
          { componentUrl: './pages/product.html' },
          { context: { data: res.data, title: res.title, pages: pages, total: total, total_page: total_page, curr_page: page, next_page: next_page, kode: kode } }
        );
        app.preloader.hide();
      });
    },
  },
  {
    path: '/detail/:kode',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // kode item/
      var kode = routeTo.params.kode;
      // var nama = routeTo.params.nama;

      // var db = app.data.db;
      
      app.request.getJSON( app.data.endpoint + 'api/v1/detail/'+kode, function(res) {
        
        app.preloader.hide();

        resolve(
          { componentUrl: './pages/detail.html' },
          { context: { data: res.data } }
        );
      });
    },
  },
  {
    path: '/about-us/',
    url: './pages/about-us.html',
  },
  {
    path: '/term/',
    url: './pages/term.html',
  },
  {
    path: '/faq/',
    url: './pages/faq.html',
  },
  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];
