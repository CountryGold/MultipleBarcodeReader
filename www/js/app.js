angular.module('MyApp', ['ionic','ngCordova'])
  .controller('MyCtrl', function($scope,$ionicModal,$cordovaSQLite,$ionicPlatform,$window,$timeout,$http,$ionicLoading) {
	 $ionicPlatform.ready(function() {
	$scope.login = window.localStorage.getItem('login');
	if($scope.login!=1) {
		
		document.getElementById('bb1').style.display='none';
		document.getElementById('bb2').style.display='none';
		document.getElementById('bb3').style.display='none';
		document.getElementById('bb4').style.display='none';
		document.getElementById('b1').style.display='none';
		document.getElementById('b2').style.display='none';
		document.getElementById('list').style.display='block';
		
	}	
	var db = window.openDatabase("code", "1.0", "Test DB", 1000000);
	db.transaction(populateDB, errorCB, successCB);
	//$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS offers (id integer primary key, code text, offer text)");
	//$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS codes (id integer primary key, code text)");
		
	
	 function populateDB(tx) {
		
        tx.executeSql('CREATE TABLE IF NOT EXISTS offers (id unique, code text, offer text)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS codes (id unique, code text)');
		
    }
	
	function errorCB(err) {
        //alert("Error processing SQL: "+err.code);
    }
	function successCB(tx, results) {
        //alert("Last inserted row ID = " + results.insertId);
    }
	
    $scope.locations = [];
	
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM codes', [], function (tx1, results) {
             var len = results.rows.length;
             for (var i = 0; i < len; ++i) {
                var obj = results.rows.item(i);
				var cd = obj['code'].trim();
				
				var offr = 'None';
				tx1.executeSql('SELECT * FROM offers WHERE code="'+cd+'"', [], function (tx3,result) {
					var len2 = result.rows.length;
					
					if(len2>0) {
						var offr = result.rows.item(0)['offer'];
						$scope.locations.push({ ID: obj['code'], Nome: offr});
					} else {
						var offr = 'Not Available';
						$scope.locations.push({ ID: obj['code'], Nome: offr});
					}
				},errorCB, successCB)
                
              }
          });
	});
		
	$scope.offers = [];
	
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM offers', [], function (tx, results) {
             var len = results.rows.length;
             for (var i = 0; i < len; ++i) {
                var obj = results.rows.item(i);
                $scope.offers.push({ code: obj['code'], offer: obj['offer']});
              }
          });
	});

    $scope.showLocationsModal = function() {
      $scope.openLocationsModal();
    }

    $ionicModal.fromTemplateUrl('modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.locationsModal = modal;
    });

    $scope.openLocationsModal = function() {
		
    $scope.locations = [];
	
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM codes', [], function (tx1, results) {
             var len = results.rows.length;
             for (var i = 0; i < len; ++i) {
                var obj = results.rows.item(i);
				var cd = obj['code'].trim();
				
				var offr = 'None';
				
				db.transaction(makeHandler(cd));
				
				
				//alert('out: '+cd+' - '+offr);
				
                
              }
          });
	});		
		
      $scope.locationsModal.show();
    };
	
	function makeHandler(j) {
		return function (tx){
			tx.executeSql('SELECT * FROM offers WHERE code="'+j+'"', [], function (tx,result) {
					var len2 = result.rows.length;
					
					if(len2>0) {
						var offr = result.rows.item(0)['offer'];
						
						//alert(cd+' - '+offr);
						$scope.locations.push({ ID: j, Nome: offr});
					} else {
						var offr = 'Not Available';
						
						//alert(cd+' - '+offr);
						$scope.locations.push({ ID: j, Nome: offr});
						
					}
				});
		};
	}

    $scope.closeLocationsModal = function() {
      $scope.locationsModal.hide();
    };

    $scope.$on('$destroy', function() {
      $scope.locationsModal.remove();
    });

    $scope.$on('locationsModal.hidden', function() {
      // Execute action
    });

    $scope.$on('locationsModal.removed', function() {
      // Execute action
    });
    
    $scope.clickLocationItem = function(id) {
      //alert('selected item id: ' + id);
      //$scope.closeLocationsModal();
    }
	
	$scope.add_code = function(code) {
		//alert(code);
		db.transaction(function (tx) {
			tx.executeSql("INSERT into codes (code) VALUES('"+code+"')");
			
		});
	}
	
	$scope.reset_all = function() {
		//alert(code);
		db.transaction(function (tx) {
			tx.executeSql("DELETE * from codes");
			$scope.locations = [];
		});
	}
	
	
    $scope.showLocationsModal2 = function() {
		$scope.openLocationsModal2();
    }	
	
	$ionicModal.fromTemplateUrl('offers.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.locationsModal2 = modal;
    });
	
    $scope.openLocationsModal2 = function() {
      $scope.locationsModal2.show();
    };
	
    $scope.closeLocationsModal2 = function() {
      $scope.locationsModal2.hide();
    };
	

	
	function querySuccess(tx, results) {
		//alert("Last inserted row ID = " + results.insertId);
	}
	
	

	
	$scope.add_offer = function() {
		var bar = document.getElementById('add_barcode').value;
		var off = document.getElementById('add_offer').value;
		//alert(bar+off);
		db.transaction(function (tx) {
			tx.executeSql("INSERT into offers (code, offer) VALUES('"+bar+"','"+off+"')");
			$scope.offers.push({ code: bar, offer: off});
		});
	}
	
	
	$scope.send_otp = function () {
		$ionicLoading.show({
		  template: 'Sending OTP...'
		});
		var rand = Math.floor(1000 + Math.random() * 9000);
		var num = document.getElementById('box1').value;
		document.getElementById('rndotp').value = rand;
		$http.get('http://sms.mbdrecharge.com/sendsms.jsp?user=pgprojt&password=pgprojt&mobiles='+num+'&sms='+rand+'&senderid=MBDRCH').then(function(response){
			document.getElementById('box1').style.display='none';
			document.getElementById('box2').style.display='block';
			document.getElementById('bt1').style.display='none';
			document.getElementById('bt2').style.display='block';
			$ionicLoading.hide();
		}, function(error){
			$ionicLoading.hide();
		});
	}
	
	$scope.verify_otp = function () {

		var num = document.getElementById('box2').value;
		var rand = document.getElementById('rndotp').value;
		if(num==rand){
			document.getElementById('list').style.display='none';
			document.getElementById('bb1').style.display='block';
			document.getElementById('bb2').style.display='block';
			document.getElementById('bb3').style.display='block';
			document.getElementById('bb4').style.display='block';
			document.getElementById('b1').style.display='block';
			document.getElementById('b2').style.display='block';
			window.localStorage.setItem('login', '1');
		} else {
			alert('Invalid OTP');
		}
	}
	
	
	 });
  });