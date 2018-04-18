// ==UserScript==
// @name           MunzeeZoomMap
// @name:cs        MunzeeZoomMap
// @namespace      Jakuje.Greasemonkey.Munzee
// @description    Enables you to zoom a Munzee map into a larger scale.
// @description:cs Umožňuje zoomovat munzee mapu do většího měřítka.
// @include        https://www.munzee.com/map*
// @version        2.0.0
// @grant          none
// @require        https://code.jquery.com/jquery-3.3.1.min.js
// ==/UserScript==

(function() {
  // original values:
  //  12 for "only vacant rooms"
  //  15 for "show circle"
  //  13 for everything else
  var newMinZoom = 8;

  window.eval("_minZoom = " + newMinZoom);  // override default
  window.eval("the_map.setOptions({minZoom: " + newMinZoom + "});"); // make it happen

  window.eval("$('#check_vacant').change(function() { the_map.setOptions({minZoom: "+newMinZoom+"}); });");
  window.eval("$('#check_circles').change(function(){ the_map.setOptions({minZoom: "+newMinZoom+"}); });");
})();
