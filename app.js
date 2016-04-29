/**
 * Uses JSON Proxy to fetch cross origin API call from openweather.map
 * @param  {string}   zipcode  user entered string pattern=[0-9]{5}
 * @param  {Function} callback used to capture data returned from JSON call
 */
var fetchWeather = function(zipcode, callback) {
  var APIKEY = '69b4d7933efbceb618ca503d8fa7821e';
  var baseURL = 'http://api.openweathermap.org/data/2.5/weather?zip=' + zipcode + ',us&appid=' + APIKEY;
  var URL = encodeURIComponent(baseURL);
  $.getJSON('https://jsonp.afeld.me/?callback=?&url=' + URL, callback);
};

/**
 * Takes in raw data object from API call, captures only data of interest and store in wx object
 * @param  {object} data return from API call
 * @return {object}      selected and processed data from API call
 */
var translateWx = function(data) {
  var wx = {};
  wx.loc = data.name;
  wx.temp = Math.round(data.main.temp - 273);
  wx.info = wxCodes[data.weather[0].id].id;
  return wx;
};

/**
 * Returns a wardrobe for this wx condition
 * @param  {object} wx        wx condition object
 * @param  {object} wardrobes all potential wardrobes object
 * @return {object}           wardrobe for this wx condition
 */
var pickWardrobe = function(wx) {
  var wardrobe = {};
  if (wx.temp < -10) {
    wardrobe = fetchWardrobe('freezeing');
  } if (-10 <= wx.temp && wx.temp < 5) {
    wardrobe = fetchWardrobe('cold');
  } if (5 <= wx.temp && wx.temp < 20) {
    wardrobe = fetchWardrobe('warm');
  } if (20 <= wx.temp) {
    wardrobe = fetchWardrobe('hot');
  } 
  return wardrobe;
};

/**
 * Takes base wardrobe and extends articles array of conditional wardrobe
 * @param  {object} wardrobe1 wardrobe specific to a given temperature condition
 * @param  {object} wardrobe2 wardrobe specific to a give weather condidtion
 * @return {object}           merged wardobe
 */
var extendWardrobe = function(wardrobe1, wardrobe2) {
  for (var key in wardrobe1) {
    wardrobe1[key] = wardrobe1[key].concat(wardrobe2[key]);
  }
  return wardrobe1;
};

var modifyWardrobe = function(wx, wardrobe) {
	if (wx.info === 'rain') {
    wardrobe = extendWardrobe(wardrobe, fetchWardrobe('rain'));
  } if (wx.info === 'sun') {
    wardrobe = extendWardrobe(wardrobe, fetchWardrobe('sun'));
  } if (wx.info === 'wind') {
    wardrobe = extendWardrobe(wardrobe, fetchWardrobe('wind'));
  }
  return wardrobe;
};

/**
 * Function that takes in an array and returns a random elemement internally
 * @param  {array} items array of clothing articles
 * @return {string} one random clothing article of given array
 */
var randomElement = function(items) {
  return items[Math.floor(Math.random() * items.length)];
};

/**
 * Selects one article of clothing or removes grouping of articles if empty
 * @param  {object} wardrobe wardrobe object
 * @return {object}          trimmed wardrobe object
 */
var outfitSelect = function(wardrobe) {
  for (var key in wardrobe) {
    var item = randomElement(wardrobe[key]);
    wardrobe[key] = item;
    item === undefined && delete wardrobe[key];
  };
  return wardrobe;
};

var fetchWardrobe = function(key){
  var wardrobes = {
    freezeing: {accessories:['gloves', 'toe warmers', 'mittens'], head: ['hat', 'beanie'], neck:['scarf', 'neck warmer'], top:['ski coat', 'parka', 'winter jacket'], bottom:['snow pants', 'double sweats', 'woolies'], feet:['boots', 'muckluks', 'bean boots', 'galoshes']},
    cold: {accessories:[], head:['gloves', 'hat', 'beanie', 'ear warmer'], neck:['scarf'], top:['blazer', 'flannel', 'shell', 'light coat', 'pattaguicci'], bottom:['sweats', 'trousers'], feet:['cowboy boots', 'boots', 'sneakers']},
    warm: {accessories:[], head:['head band', 'top hat'], neck:[], top:['flannel', 'sweater', 'hoodie', 'sweatshirt', 'long sleeve T'], bottom:['sweats', 'jeans', 'khakis', 'wind pants'], feet:['sneakers', 'dunks', 'nikes', 'running shoes', 'boat shoes']},
    hot: {accessories:[], head:[], neck:[], top:['lax penny', 'white T', 'cutoff T', 'no shirt?'], bottom:['bathing suite', 'swim trunks', 'chubs', 'shorts', 'sweat shorts'], feet:['sandals', 'tevas', 'chacos', 'rainbows', 'mocasins']},
    sun: {accessories:['sun glasses'], head:['baseball cap'], neck:[], top:[], bottom:[], feet:[]},
  	rain: {accessories:['umbrella'], head:[], neck:[], top:['rain coat', 'poncho'], bottom:[], feet:['mud boots', 'rain boots']},
  	wind: {accessories:[], head:['spinny hat'], neck:['scarf'], top:['wind breaker'], bottom:['wind pants'], feet:[]}
  };
  return wardrobes[key];
};

/**
 * Calls required functions for generating recommendation based on wx
 * @param  {object} wx 
 * @return {object}    object containing only and all articles to be recommended for wear
 */
var recommendataion = function(wx) {
  var wardrobe = pickWardrobe(wx);
  var modifiedWardrobe = modifyWardrobe(wx, wardrobe)
  var outfit = outfitSelect(modifiedWardrobe);
  return outfit;
};

/**
 * makes required DOM changes to remove display of previously displayed WX and outfit 
 */
var displayReset = function(){
  $('#rec').children().remove();
  $('#rec').addClass('inactive');
  $('#wxreport').children().remove();
  $('#wxreport').addClass('inactive');
  $('html').removeClass();
  $('#zip').val('');
};

/**
 * Makes required DOM changes to display wx information for given zipcode
 * @param  {object} wx all relevant wx information
 */
var displayWx = function(wx) {
  var $report = $('<p id=report></p>');
  $report.text(wx.info.description + ' and ' + wx.temp + ' degrees C outside today for ' + wx.loc + '!');
  $('#wxreport').append($report);
  $('#rec').removeClass('inactive');
  $('#wxreport').removeClass('inactive');
  if (wx.info === 'rain') {
    $('html').addClass('rain');
  } if (wx.info === 'sun') {
    $('html').addClass('sun');
  } if (wx.info === 'wind') {
    $('html').addClass('wind');
  } if (wx.info === 'snow') {
    $('html').addClass('snow');
  }
};

/**
 * makes required DOM changes to display outfit information for given wx condition
 * @param  {object} outfit object containing only and all articles to be recommended for wear
 */
var displayOutfit = function(outfit) {
  var $recHeader = $('<h3></h3>');
  $recHeader.text('You should wear: ');
  $('#rec').append($recHeader);
  for (var key in outfit) {
    var $p = $('<p class=item></p>');
    $p.text(outfit[key]);
    $('#rec').append($p);
  }
};

/**
 * Main function for website. listen for button clicks, captures zipcode, and executes processing and display
 */
$(document).ready(function() {
  $('#btn').on('click', function() {
    var zipcode = $('#zip').val();
    displayReset();
    fetchWeather(zipcode, function(data) {
      var wx = translateWx(data);
      displayWx(wx);
      displayOutfit(recommendataion(wx));
    });
  });
});