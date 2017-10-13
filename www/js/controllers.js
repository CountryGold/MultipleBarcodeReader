angular.module('starter.controllers', ['ionic', 'starter'])

.controller('AppCtrl', function($scope, $ionicSideMenuDelegate, $timeout) {
console.log('mekey');
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:


  $scope.$on('$ionicView.enter', function(e) {


  });

  $scope.preventFocus = function () {

    ionic.DomUtil.blurAll();

  }
  
  console.log('hey');

})

.controller('GeneralController', function($scope, $ionicScrollDelegate) {

			var code = [];
			
			//localStorageService.set('codes', code);
            // On Windows, the alert function doesn't exist, so we add it.
            window.alert = window.alert !== undefined ? window.alert : function (message) {
                var alertBox = new Windows.UI.Popups.MessageDialog(message);
                alertBox.showAsync();
            };
            var picker;
            $scope.success = function(session) {
                alert("Scanned " + session.newlyRecognizedCodes[0].symbology 
                        + " code: " + session.newlyRecognizedCodes[0].data);
					code.push(session.newlyRecognizedCodes[0].data);
					
					//localStorageService.set('codes', code);
					
            }
            $scope.failure = function(error) {
                alert("Failed: " + error);
            }
            $scope.scan = function() {
				alert('works');
                Scandit.License.setAppKey("SwdCxLebn9MFEXvfULR4QksV+J1fo77pIPCD8niFxnM");
                var settings = new Scandit.ScanSettings();
                settings.setSymbologyEnabled(Scandit.Barcode.Symbology.EAN13, true);
                settings.setSymbologyEnabled(Scandit.Barcode.Symbology.UPC12, true);
                settings.setSymbologyEnabled(Scandit.Barcode.Symbology.EAN8, true);
                settings.codeDuplicateFilter = -1;
                picker = new Scandit.BarcodePicker(settings);
                picker.continuousMode = true;
                picker.getOverlayView().setViewfinderDimension(0.9, 0.2, 0.6, 0.2);
                picker.setMargins(new Scandit.Margins(0, 0, 0, 200), null, 0);
                picker.show(success, null, failure);
                picker.startScanning();
            }
            $scope.stop = function() {
                picker.stopScanning();
                picker.setMargins(new Scandit.Margins(0, 0, 0, 400), null, 0.5);
                picker.getOverlayView().setViewfinderDimension(0.9, 0.1, 0.6, 0.1);
            }
            $scope.start = function() {
                picker.startScanning();
                picker.setMargins(new Scandit.Margins(0, 0, 0, 200), null, 0.5);
                picker.getOverlayView().setViewfinderDimension(0.9, 0.2, 0.6, 0.2);
            }
            $scope.cancel = function() {
                picker.cancel();
            }
			
			$scope.save = function() {
				document.getElementById('cc').innerHTML = code;
                
            }
  
})


