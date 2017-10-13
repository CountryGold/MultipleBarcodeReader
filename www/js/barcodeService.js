(function() {
  angular.module('myApp')
    .factory('barcodeService', ['$q', '$timeout', '$window',
      function($q, $timeout, $window) {
        var scanTimeout = 1000

        return {
          scanBarcode: scanBarcode
        };

        function scanBarcode() {
          var deferred = $q.defer();

          var rejectByTimeout = $timeout(function() {
            deferred.reject('timeout rejection');
          }, scanTimeout, false);

          $window.cordova.plugins.barcodeScanner.scan(
            function(result) {
              deferred.resolve(result);
            },
            function(error) {
              deferred.reject(error);
            });

          return deferred.promise;
        }
      }
    ]);
}());