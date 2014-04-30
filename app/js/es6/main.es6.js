/* global google:true */
/* jshint unused:false, camelcase:false */
/* global AmCharts: true */
/* global _:true */

(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    initMap(36, 36, 4);
    $('#add').click(get);
  }

  function get(){
    var location = $('#location').val();
    showPosition(location);
    makeChart();
  }

  var map;
  function initMap(lat, lng, zoom){    //creates map
    let mapOptions = {center: new google.maps.LatLng(lat, lng), zoom: zoom, mapTypeId: google.maps.MapTypeId.ROADMAP};    //SATELLITE or HYBRID can also be used
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }

  function showPosition(location){    //grabs your position
    let geocoder = new google.maps.Geocoder();    //allows you to change something from a place into a lat. and long.

    geocoder.geocode({address: location}, (results, status)=>{    //anonymous function => arrow function
      let name = results[0].formatted_address;
      let lat = results[0].geometry.location.lat();
      let lng = results[0].geometry.location.lng();
      addMarker(lat,lng,name);

      let latLng = new google.maps.LatLng(lat, lng);
      map.setCenter(latLng);    //centers the map on the lat. and long. that the user calls for
      map.setZoom(15); //zoom down on something

      addTenDayForecast(lat,lng);
    });
  }

  function addMarker(lat,lng,name){
    let latLng = new google.maps.LatLng(lat, lng);
    new google.maps.Marker({map: map, position: latLng, title: name});    //tells the api which map to add the marker to
  }

  function addTenDayForecast(lat,lng){
    var url = 'http://api.wunderground.com/api/e8dcaa06f5ec42ae/forecast10day/q/'+lat+','+lng+'.json?callback=?';
    $.getJSON(url, callWeatherData);
  }

  function callWeatherData(data){
    // let forecastDay = data.forecast.simpleforecast.forecastday;
    // let highTemp = data.forecast.simpleforecast.forecastday.high.fahrenheit;
    // let lowTemp = data.forecast.simpleforecast.forecastday.low.fahrenheit;
    // let dayOfTheWeek = data.forecast.simpleforecast.forecastday.date.weekday;

    // for(let i = 0; i < 10; i++){
    //
    //   chart.dataProvider.push({date: dayOfTheWeek(forecastDay[i]),
    //                         lows: lowTemp(forecastDay[i]),
    //                         highs: highTemp(forecastDay[i])
    //                         });
    // }
    // console.log(dataProvider);

    data.forecast.simpleforecast.forecastday.forEach(t=>chart.dataProvider.push({high:t.high.fahrenheit, low:t.low.fahrenheit, date:t.date.weekday_short}));
    chart.validateData();

 // chartData.push({
 //            date: newDate,
 //            visits: visits,
 //            hits: hits,
 //            views: views
 //        });
    // data.forecast.simpleforecast.forecastday.forEach(t=>chart.dataProvider.push({date:t.dayOfTheWeek(), lows:t.lowTemp(), highs:t.highTemp()}));
    //title is the x axis, critics is y axis (1) and audience is y axis (2)
    //{title:"Rio 2", audience:53, critics: 22}  <---example of an object you would push into the array
      //need to use this so that your graph updates
  }

  function highTemp(input){
    return input.high.fahrenheit;
  }

  function lowTemp(input){
    return input.low.fahrenheit;
  }

  function dayOfTheWeek(input){
    return input.date.weekday;
  }

var chart;
function makeChart(){
    chart = AmCharts.makeChart('chartdiv', {
        'type': 'serial',
        'theme': 'none',
        'pathToImages': 'http://www.amcharts.com/lib/3/images/',
        'legend': {
            'useGraphSettings': true
        },
        'dataProvider': [],
        'valueAxes': [{
            'id':'v1',
            'minimum': 0,    //added to the properties; otherwise it would scale automataically
            'maximum': 100,
            'axisColor': '#FF6600',
            'axisThickness': 2,
            'gridAlpha': 0,
            'axisAlpha': 1,
            'position': 'left'
        }],
        'graphs': [{
              'valueAxis': 'v1',    //y axis
              'lineColor': '#FF6600',
              'bullet': 'round',
              'bulletBorderThickness': 1,
              'hideBulletsCount': 30,
              'title': 'high temp',
              'valueField': 'high',
      		'fillAlphas': 0
        }, {
            'valueAxis': 'v1',    //y axis
            'lineColor': '#FCD202',
            'bullet': 'square',
            'bulletBorderThickness': 1,
            'hideBulletsCount': 30,
            'title': 'low temp',
            'valueField': 'low',
    		'fillAlphas': 0
        }],
        'chartScrollbar': {},
        'chartCursor': {
            'cursorPosition': 'mouse'
        },
        'categoryField': 'date',    //this is the x axis
        'categoryAxis': {
            'axisColor': '#DADADA',
            'minorGridEnabled': true
        }
    });
}

})();




// function getWeather(zip){
//   let url = weather underground url
//   $.getJSON(url, data=>
//     $('#graphs').append(`<div class = graph data-zip=${zip}></div>`);
//     initGraph(zip);
//   )
// }
//
// function initGraph(zip){
//   let graph = $(`graph[data-zip=${zip}]`[0]);
//   charts[zip]= AmCharts...
// }
