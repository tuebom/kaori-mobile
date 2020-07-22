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

      app.request.getJSON( app.data.endpoint + 'api/v1/transactions/defaults', function(res) {

        // Hide Preloader
        app.preloader.hide();

        app.data.min_trf   = res.data.min_transfer;
        app.data.min_trfb  = res.data.min_transferb;
        app.data.min_blj   = res.data.min_belanja;
        app.data.min_topup = res.data.min_topup;
        app.data.min_withdraw = res.data.min_withdraw;
      
        // Resolve route to load page
        resolve(
          {
            componentUrl: './pages/home.html',
          },
          {
            context: {
              banner: res.banner
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

      // Show Preloader
      app.preloader.show();

      app.request.getJSON( app.data.endpoint + 'api/v1/cart', function(res) {

        // Hide Preloader
        app.preloader.hide();

        // Resolve route to load page
        resolve(
          {
            componentUrl: './pages/cart.html',
          },
          {
            context: {
              items: res.items,
              total: res.total
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
      
      app.request.getJSON( app.data.endpoint + 'api/v1/categories', function(res) {
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
          { context: { data: data } }
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
          { context: { data: data } }
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
          { context: { data: data } }
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
          { context: { data: data } }
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
          { context: { data: data } }
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
          formData.nama = app.methods.capital_letter(formData.nama);
          formData.reffid = app.data.mbrid;
          
          app.request.post( app.data.endpoint + 'api/v1/member', formData, function (res) {
            
            app.preloader.hide();
            
            var data = JSON.parse(res);
        
            if (data.status) {
              
              app.dialog.alert(data.message, 'Pendaftaran Member');
              app.router.back();

              // ambil informasi saldo member
              /*app.request.getJSON( app.data.endpoint + 'api/v1/member/saldo', function (res) {
                  
                $$('.saldo').text(res.saldof);
                app.data.saldo = parseInt(res.saldo);
                $$('.bonus').text(res.bonusf);
                app.data.bonus = parseInt(res.bonus);
              });*/

            } else {
              app.dialog.alert(data.message, 'Pendaftaran Member');
            }
          });
        });                  
      }
    }
  },
  {
    path: '/address/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      resolve (
        { componentUrl: './pages/address.html' }
        // { context: { data: data } }
      );
    }
  },
  {
    path: '/checkout/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();
        
      app.request.getJSON( app.data.endpoint + 'api/v1/checkout', function(res) {
          
        app.preloader.hide();

        if (!app.data.bSetAddress) //(!res.order.address)
        {
          resolve (
            { componentUrl: './pages/address.html' },
            { context: { 
              name: app.methods.capital_letter(res.order.first_name),
              address: res.order.address,
              phone: res.order.phone,
              email: res.order.email,
              province: res.order.province,
              regency: res.order.regency,
              district: res.order.district,
              postal_code: res.order.postal_code,
              regencies: res.regencies,
              districts: res.districts
            } }
          );
        }
        else
        {
          app.data.regency = res.order.regency;
          app.data.gtotal  = res.order.gtotal;
          app.data.promo   = res.order.promo_code;

          resolve (
            { componentUrl: './pages/checkout.html' },
            { context: { 
              order: res.order,
              promo: res.promo,
              agents: res.agents
            } }
          );
        }
      });
    }
  },
  {
    path: '/order-info/:num',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;
      var order_id = routeTo.params.num;

      // Show Preloader
      app.preloader.show();

      app.request.getJSON( app.data.endpoint + 'api/v1/bank', function(res) {

        // Hide Preloader
        app.preloader.hide();

        // Resolve route to load page
        resolve(
          {
            componentUrl: './pages/order-info.html',
          },
          {
            context: {
              ordernum: order_id,
              data: res.bank
            }
          }
        );

      });
    },
  },
  {
    path: '/view-detail/:nomor',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;
      var orderid = routeTo.params.nomor;

      // Show Preloader
      app.preloader.show();

      app.request.getJSON( app.data.endpoint + 'api/v1/orders/'+orderid, function(res) {

        app.preloader.hide();

        resolve (
          { componentUrl: './pages/view-detail.html' },
          { context: {
            items: res.items,
            total: res.total
          } }
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
    path: '/akun/',
    url: './pages/akun.html',
    on: {
      pageInit: function (event, page) {
        
        app.request.getJSON( app.data.endpoint + 'api/v1/member/saldo', function (res) {
            
          $$('#saldo').text(res.saldof);
          app.data.saldo = parseInt(res.saldo);

          $$('#bonus').text(res.bonusf);
          app.data.bonus = parseInt(res.bonus);
        });
        
        $$('.cek-id').on('click', function(e){
          
          app.request.getJSON( app.data.endpoint + 'api/v1/member/cek_id', function (res) {
            
            // var data = JSON.parse(res);
            app.dialog.alert(res.message, 'Akun Saya');
          });
        });
      }
    }
  },
  {
    path: '/bank-transfer/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();
        
      app.request.getJSON( app.data.endpoint + 'api/v1/member/bank', function(res) {
          
        app.preloader.hide();

        resolve (
          { componentUrl: './pages/bank-transfer.html' },
          { context: {
            bank: res.bank,
            bank_code: res.bank_code,
            account_number: res.account_number,
            account_name: res.account_name
          } }
        );
      });
    }
  },
  {
    path: '/profil/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();
        
      app.request.getJSON( app.data.endpoint + 'api/v1/member', function(res) {
          
        app.preloader.hide();
        resolve (
          { componentUrl: './pages/profile.html' },
          { context: { data: res } }
        );
      });
    }
  },
  {
    path: '/konfirmasi/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;
        
      if (!app.data.currentDate) {
      
        var now = new Date();
        
        var day = ("0" + now.getDate()).slice(-2);
        var month = ("0" + (now.getMonth() + 1)).slice(-2);
        
        var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
        app.data.currentDate = today;
      }

      // Show Preloader
      app.preloader.show();
        
      app.request.getJSON( app.data.endpoint + 'api/v1/transactions/confirm', function(res) {
          
        app.preloader.hide();

        /*if (!res.status)
        {
          app.dialog.alert(res.message);
          reject();
          return;
        }*/

        resolve (
          { componentUrl: './pages/konfirmasi.html' },
          { context: {
            trx_exists: res.status,
            orders: res.orders,
            bank2: res.bank2,
            bank_code: res.bank.bank_code,
            account_number: res.bank.account_number,
            account_name: res.bank.account_name,
            amount: res.status ? res.orders[0].gtotal : ''
          } }
        );
      });
    }
  },
  {
    path: '/notifikasi/',
    componentUrl: './pages/notifications.html',
  },
  {
    path: '/order-status/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();
      
      app.request.getJSON( app.data.endpoint + 'api/v1/orders/status', function(res) {
        app.preloader.hide();

        resolve(
          { componentUrl: './pages/order-status.html' },
          { context: { data: res.data } }
        );
      });
    },
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
      
      var formData = {};

      formData.tgltrx = app.data.currentDate;
      
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
            app.dialog.alert('Masukkan nomor PIN atau password anda.', 'Pulsa HP');
            return;
          }
        
          // app.preloader.show();
          $$(this).prop("disabled", true);

          var formData = app.form.convertToData('.trxpulsa');
          
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
            app.dialog.alert('Masukkan nomor PIN atau password anda.', 'Paket Data');
            return;
          }
          
          // app.preloader.show();
          $$(this).prop("disabled", true);

          var formData = app.form.convertToData('.trxdata');
          
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
            app.dialog.alert('Masukkan nomor PIN atau password anda.', 'Token PLN');
            return;
          }
          
          // app.preloader.show();
          $$(this).prop("disabled", true);

          var formData = app.form.convertToData('.trxpln');
          
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
              app.dialog.alert('Masukkan data nomor handphone tujuan.', 'Paket Nelpon');
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
            
          var pin = $$('#pin').val();
          if (pin === '') {
            app.dialog.alert('Masukkan nomor PIN atau password anda.', 'Paket Nelpon');
            return;
          }
          
          // app.preloader.show();
          $$(this).prop("disabled", true);

          var formData = app.form.convertToData('.trxtelpon');
          
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
            
          var pin = $$('#pin').val();
          if (pin === '') {
            app.dialog.alert('Masukkan nomor PIN atau password anda.', 'Topup GOPAY');
            return;
          }
          
          // app.preloader.show();
          $$(this).prop("disabled", true);

          var formData = app.form.convertToData('.trxtopup');
          
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
            
          var pin = $$('#pin').val();
          if (pin === '') {
            app.dialog.alert('Masukkan nomor PIN atau password anda.', 'Topup OVO');
            return;
          }
          
          // app.preloader.show();
          $$(this).prop("disabled", true);

          var formData = app.form.convertToData('.trxtopup');
          
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
            
          var pin = $$('#pin').val();
          if (pin === '') {
            app.dialog.alert('Masukkan nomor PIN atau password anda.', 'Topup DANA');
            return;
          }
          
          // app.preloader.show();
          $$(this).prop("disabled", true);

          var formData = app.form.convertToData('.trxtopup');
          
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
              app.dialog.alert('Masukkan data nomor handphone tujuan.', 'Paket HINET');
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
            
          var pin = $$('#pin').val();
          if (pin === '') {
            app.dialog.alert('Masukkan nomor PIN atau password anda.', 'Pulsa HINET');
            return;
          }
          
          // app.preloader.show();
          $$(this).prop("disabled", true);

          var formData = app.form.convertToData('.trxhinet');
          
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
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      app.request.getJSON( app.data.endpoint + 'api/v1/bank', function(res) {

        // Hide Preloader
        app.preloader.hide();

        // console.log(res)
        // var data = JSON.parse(res)

        // Resolve route to load page
        resolve(
          {
            componentUrl: './pages/topup-saldo.html',
          },
          {
            context: {
              data: res.bank
            }
          }
        );

      });
    },
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

      app.request.getJSON( app.data.endpoint + 'api/v1/category/'+id+'/'+page, function(res) {
          
        // var data = JSON.parse(res);

        resolve(
          { componentUrl: './pages/category.html' },
          { context: { data: res.data, title: nama } }
        );
        app.preloader.hide();
      });
    },
    on: {
      pageBeforeIn: function (event, page) {
        
        if (app.data.total_items > 0) {
          $$('.badge.cart').text(app.data.total_items);
          $$('.badge.cart').css("display", "block");
        } else {
          $$('.badge.cart').css("display", "none");
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
        var pages = {};

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

        app.data.bSetAddress = false;

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
