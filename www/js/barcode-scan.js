(function() {
  angular.module('myApp').directive('barcodeScan', ['$log', 'barcodeService',
    function($log, barcodeService) {
      return {
        restrict: 'AE',
        replace: true,
        scope: {
          barcodes: '='
        },
        template: "<button ng-click='doScan()' >Scan Barcode</button>",
        link: function(scope, element, attrs) {
          scope.barcodes = scope.barcodes || [];
          
          scope.doScan = function() {
            barcodeService.scanBarcode()
              .then(function(barcode) {
                if(scope.barcodes.indexOf(barcode) == -1){
                  scope.barcodes.push(barcode);
                }
                $log.info('Barcode scan succeeded with result: ' + barcode);
              }, function(error) {
                $log.error('Barcode scan failed with error: ' + error);
              });
          };
        }
      };
    }
  ]);
}());