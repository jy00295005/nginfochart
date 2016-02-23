
var myApp = angular.module('myApp', ['infoChart.d3','infoChart.highcharts','infoChart.google','infoChart.help'], function($interpolateProvider) {
    $interpolateProvider.startSymbol('<%');
    $interpolateProvider.endSymbol('%>');
});

myApp.factory('ajaxCall', function($http) {
  return {
    getChartData: function(api_url) {
      return $http.get(api_url)
      .then(function(result) {
        return result.data;
			});
    }
  }
});


