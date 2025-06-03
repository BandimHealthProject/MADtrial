/**
 * Responsible for rendering follow-up screen
 */
'use strict';
/* global odkTables, util, odkCommon, odkData */

var selDay, selMon, selYea;
function display() {
    console.log("Follow-up screen is loading");
    selDay = $('#selDateDay');
    selMon = $('#selDateMonth');
    selYea = $('#selDateYear');
    
    // Set the background to be a picture.
    //var body = $('body').first();
    //body.css('background', 'url(img/form_logo.png) fixed');
    initDrops();
}

function initDrops() {
    // Date dropdown
    // Set default date
    var today = new Date();
    var defaultDay = today.getDate();
    var defaultMon = today.getMonth()+1;
    var defaultYea = today.getFullYear();

    // List of date, months, years
    var days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
    var months = [1,2,3,4,5,6,7,8,9,10,11,12];
    var years = [defaultYea-1, defaultYea, defaultYea+1];

    $.each(days, function() {
        if (this == defaultDay) {
            selDay.append($("<option />").val(this).text(this).attr("selected",true));
        } else {
            selDay.append($("<option />").val(this).text(this));
        }
    })

    $.each(months, function() {
        if (this == defaultMon) {
            selMon.append($("<option />").val(this).text(this).attr("selected",true));
        } else {
            selMon.append($("<option />").val(this).text(this));
        }
    })

    $.each(years, function() {
        if (this == defaultYea) {
            selYea.append($("<option />").val(this).text(this).attr("selected",true));
        } else {
            selYea.append($("<option />").val(this).text(this));
        }
    })

    // Follow-up buttons
    var date = {};
    var queryParams = {};

    var btnShort = $('#btnShort');
    btnShort.on("click", function() {
        date = new Date(selYea.val(), selMon.val()-1, selDay.val());
        queryParams = util.setQuerystringParams(null, null, null, null, date);
        odkTables.launchHTML(null, 'config/assets/followUpShort.html' + queryParams);
        console.log(queryParams);
        console.log(date);
    });
    
    var btnLong = $('#btnLong');
    btnLong.on("click", function() {
        date = new Date(selYea.val(), selMon.val()-1, selDay.val());
        queryParams = util.setQuerystringParams(null, null, null, null, date);
        odkTables.launchHTML(null, 'config/assets/followUpLong.html' + queryParams);
        console.log(queryParams);
        console.log(date);
    });

}