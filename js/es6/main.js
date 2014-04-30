(function() {
  'use strict';
  $(document).ready(init);
  function init() {
    initMap(36, 36, 4);
    $('#add').click(get);
  }
  function get() {
    var location = $('#location').val();
    showPosition(location);
    makeChart();
  }
  var map;
  function initMap(lat, lng, zoom) {
    var mapOptions = {
      center: new google.maps.LatLng(lat, lng),
      zoom: zoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }
  function showPosition(location) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({address: location}, (function(results, status) {
      var name = results[0].formatted_address;
      var lat = results[0].geometry.location.lat();
      var lng = results[0].geometry.location.lng();
      addMarker(lat, lng, name);
      var latLng = new google.maps.LatLng(lat, lng);
      map.setCenter(latLng);
      map.setZoom(15);
      addTenDayForecast(lat, lng);
    }));
  }
  function addMarker(lat, lng, name) {
    var latLng = new google.maps.LatLng(lat, lng);
    new google.maps.Marker({
      map: map,
      position: latLng,
      title: name
    });
  }
  function addTenDayForecast(lat, lng) {
    var url = 'http://api.wunderground.com/api/e8dcaa06f5ec42ae/forecast10day/q/' + lat + ',' + lng + '.json?callback=?';
    $.getJSON(url, callWeatherData);
  }
  function callWeatherData(data) {
    data.forecast.simpleforecast.forecastday.forEach((function(t) {
      return chart.dataProvider.push({
        high: t.high.fahrenheit,
        low: t.low.fahrenheit,
        date: t.date.weekday_short
      });
    }));
    chart.validateData();
  }
  function highTemp(input) {
    return input.high.fahrenheit;
  }
  function lowTemp(input) {
    return input.low.fahrenheit;
  }
  function dayOfTheWeek(input) {
    return input.date.weekday;
  }
  var chart;
  function makeChart() {
    chart = AmCharts.makeChart('chartdiv', {
      'type': 'serial',
      'theme': 'none',
      'pathToImages': 'http://www.amcharts.com/lib/3/images/',
      'legend': {'useGraphSettings': true},
      'dataProvider': [],
      'valueAxes': [{
        'id': 'v1',
        'minimum': 0,
        'maximum': 100,
        'axisColor': '#FF6600',
        'axisThickness': 2,
        'gridAlpha': 0,
        'axisAlpha': 1,
        'position': 'left'
      }],
      'graphs': [{
        'valueAxis': 'v1',
        'lineColor': '#FF6600',
        'bullet': 'round',
        'bulletBorderThickness': 1,
        'hideBulletsCount': 30,
        'title': 'high temp',
        'valueField': 'high',
        'fillAlphas': 0
      }, {
        'valueAxis': 'v1',
        'lineColor': '#FCD202',
        'bullet': 'square',
        'bulletBorderThickness': 1,
        'hideBulletsCount': 30,
        'title': 'low temp',
        'valueField': 'low',
        'fillAlphas': 0
      }],
      'chartScrollbar': {},
      'chartCursor': {'cursorPosition': 'mouse'},
      'categoryField': 'date',
      'categoryAxis': {
        'axisColor': '#DADADA',
        'minorGridEnabled': true
      }
    });
  }
})();

//# sourceMappingURL=main.map
