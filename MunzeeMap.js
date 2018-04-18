// ==UserScript==
// @name        MunzeeMap
// @namespace   MunzeeMap
// @include     http*://www.munzee.com/map*
// @version     2.0.6
// @grant       none
// @description Munzee filter map script
// ==/UserScript==

jQuery(document).ready(function ($) {
	var img_url = 'https://dl.dropboxusercontent.com/u/3657753/munzee/';
			
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga3');

  ga3('create', 'UA-3267689-27', 'auto');
  ga3('send', 'pageview');

	var icons = [];
	var perFilter = [];
	var filterOn = false;
	var n = 0;
	var i = 0;
	var kiek = [];
    var geoLink;
	$('body').css('position', 'relative').append('<div style="padding: 10px; border-radius: 5px; border: 1px solid #dedede;position: fixed; z-index: 2000; bottom:10px; left: 10px; background: white;" id="filterIcons"></div>');
	$(document).ajaxSuccess(function (event, xhr, settings) {
		kiek = [];
		$.each(allmarkers, function (key, data) {
			var caps = data.number_of_captures;
			//console.log(data.icon.url);
			var patt = new RegExp("motel\.svg");
var res = patt.test(data.icon.url);
			if (res  && caps < 5) {
				data.icon.url = img_url+'motel' + caps + '.png';

			}
			var patt = new RegExp("hotel\.svg");
var res = patt.test(data.icon.url);
			if (res  && caps < 10) {


				data.icon.url = img_url+'munzee_hotel'+caps+'.png';

			}
			
		var patt = new RegExp("virtual\.svg");
var res = patt.test(data.icon.url);
			if (res) {

				data.icon.url = img_url+'virtual.png';

			}
			if (kiek[data.icon.url] == undefined) {
				kiek[data.icon.url] = 0;
			}

			kiek[data.icon.url]++;

			if (data.getMap() != null) {

				// add new icon to list
				if ($.inArray(data.icon.url, icons) == -1) {
					icons[i++] = data.icon.url;
				}
				// hide icon if in filter list
				if ($.inArray(data.icon.url, perFilter) != -1) {
					data.setMap(null);
				}
			}
		});

		// ICONS list
		var iconsList = '';
		var style = '';
		var clase = '';
		$.each(icons.sort(), function (key, data) {

			if ($.inArray(data, perFilter) != -1) {
				style = 'opacity:0.4; background: red; border:3px red solid;';
				clase = 'ico_hide';
			} else {
				style = 'background: white; border:3px white solid;';
				clase = 'ico_show';
			}
			if (kiek[data] == undefined) {
				kiek[data] = 0;
			}
			iconsList += '<div style="padding: 0 5px 0 0;float:left;">';
			iconsList += '<div style="text-align: center; font-size: 10px">' + kiek[data] + '</div>';
			iconsList += '<img style="' + style + 'cursor:pointer; border-radius: 500px" class="haideris ' + clase + '" height="32px" src="' + data + '" title="Right mouse click\nto hide other icons" />';
			//	iconsList += '<div class="only_this" style="cursor:pointer;text-align: center; font-size: 10px" data-icon="' +data+ '" >ONLY</div>';
			iconsList += '</div>';
		});
		$('#filterIcons').html(iconsList +
			'<div style="float: right">'+
			'<form target="_blank" method="post" action="https://www.paypal.com/cgi-bin/webscr" style="padding-left: 15px" title="Like this script?\nBuy me a beer!">' +
			'<input type="hidden" value="_s-xclick" name="cmd">' +
			'<input type="hidden" value="EVCE68LXNRUU4" name="hosted_button_id">' +
			'<input border="0" type="image" alt="Like this script? Buy me a beer!" name="submit" src="'+img_url+'donate_beer.gif">' +
			'<img border="0" width="1" height="1" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" alt="">' +
			'</form>' +
			'</div>'+
			'<div style="float: right">' +
            '<a id="geoReload" href="'+geoLink+'" title="Get link to this map position"><i class="fa fa-external-link"></i></a><br />' +
            '<a href="'+geoLink+'" title="Reload map"><i class="fa fa-refresh"></i></a>' +
            '</div>'+

			'<div style="clear:both;height: 1px; overflow: hidden"></div>');

	});
// hide
	$(document).on('click', '.ico_show.haideris', function () {
		filterOn = true;
		$(this).removeClass('ico_show').addClass('ico_hide').css('opacity', '0.4').css('background', 'red').css('border', '3px red solid');
		var curr = $(this).attr('src');
		perFilter[n++] = curr;
		$.each(allmarkers, function (key, data) {
			if (data.icon.url == curr) {
				data.setMap(null);
			}
		});
	});
// show
	$(document).on('click', '.ico_hide.haideris', function () {
		filterOn = true;
		$(this).removeClass('ico_hide').addClass('ico_show').css('opacity', '1').css('background', 'white').css('border', '3px white solid');
		var curr = $(this).attr('src');

		perFilter[$.inArray(curr, perFilter)] = null;
		$.each(allmarkers, function (key, data) {
			if (data.icon.url == curr) {
				data.setMap(the_map);
			}
		});
	});
	$(document).on('contextmenu', '.haideris', function (e) {
		filterOn = true;
		$('.haideris').removeClass('ico_show').addClass('ico_hide').css('opacity', '0.4').css('background', 'red').css('border', '3px red solid');
		var curr = $(this).attr('src');
		var tempFilter = [];
		var t = 0;
		$.each(icons, function (key, data) {
			if (curr != data) {
				tempFilter[t++] = data;
			}

		});
		perFilter = tempFilter;
		perFilter[$.inArray(curr, perFilter)] = null;
		$.each(allmarkers, function (key, data) {
			if (data.icon.url != curr) {
				data.setMap(null);
			}
		});

		$(this).removeClass('ico_hide').addClass('ico_show').css('opacity', '1').css('background', 'white').css('border', '3px white solid');

		perFilter[$.inArray(curr, perFilter)] = null;
		$.each(allmarkers, function (key, data) {
			if (data.icon.url == curr) {
				data.setMap(the_map);
			}
		});
		e.preventDefault();
	});
    // GEO
    google.maps.event.addListener(the_map, 'idle', function() {
        var mapCenter = the_map.getCenter();
        var mapZoom = the_map.getZoom();
        var lat = mapCenter.lat();
        var lon = mapCenter.lng();
        var code = geohash.encode( lat, lon, 9 );
        geoLink = 'https://www.munzee.com/map/'+code+'/'+mapZoom;
        $('#geoReload').attr('href',geoLink);

       // console.log(geoLink);
    });
    $(document).on('click','#geoReload', function(){
        window.prompt("                   Copy to clipboard: Ctrl+C, Enter                    ", geoLink);
        return false;
    });

});

