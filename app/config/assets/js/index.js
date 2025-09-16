/**
 * Responsible for rendering the select region/sector/tabanca screen.
 */
'use strict';
/* global odkTables, util, odkCommon, odkData */

function display() {
    
    // Set the background to be a picture.
    //var body = $('body').first();
    //body.css('background', 'url(img/form_logo.png) fixed');
    doSanityCheck();
    initButtons();

}

var adatePath = '../../system/survey/js/adateHelpers.js';
$.ajax({
    url: adatePath,
    method: 'GET',
    cache: true,
    dataType: 'text'
}).done(function() {
$('body').append(`
<footer id="fixFooter" style="position:fixed;bottom:10px;right:10px;background:#e0ffe0;padding:8px 16px;border-radius:8px;box-shadow:0 2px 6px rgba(0,0,0,0.1);font-size:16px;display:flex;align-items:center;z-index:100;">
    <span style="color:green;font-size:20px;margin-right:8px;">&#10003;</span>
    <span>adate fixed</span>
</footer>
`);
}).fail(function() {
$('body').append(`
<footer id="fixFooter" style="position:fixed;bottom:10px;right:10px;background:#ffe0e0;padding:8px 16px;border-radius:8px;box-shadow:0 2px 6px rgba(0,0,0,0.1);font-size:16px;display:flex;align-items:center;z-index:100;">
    <span style="color:red;font-size:20px;margin-right:8px;">&#128500;</span>
    <span>adate not fixed</span>
</footer>`)
});

function doSanityCheck() {
    console.log("Checking things");
    console.log(odkData);
}

function initButtons() {
    // New inclusion
    var btnCrianca = $('#btnCrianca');
    btnCrianca.on("click", function() {
        odkTables.addRowWithSurvey(
            null,
            'MADTRIAL_INC',
            'MADTRIAL_INC',
            null,
            null);
    });
    // Follow-up
    var btnFU = $('#btnFU');
    btnFU.on("click", function() {
        odkTables.launchHTML(null, 'config/assets/followUp.html');
    });
    // Edit ID or TABZ
    var btnEdit = $('#btnEdit');
    btnEdit.on("click", function() {
        odkTables.launchHTML(null, 'config/assets/IDTabz.html');
    });
    // List of included children
    var btnInc = $('#btnInc');
    btnInc.on("click", function() {
        odkTables.launchHTML(null, 'config/assets/listInc.html');
    });
    // Sync
    var btnSync = $('#btnSync');
    btnSync.on("click", function() {
        odkCommon.doAction(null, "org.opendatakit.services.sync.actions.activities.SyncActivity", {"componentPackage": "org.opendatakit.services", "componentActivity": "org.opendatakit.services.sync.actions.activities.SyncActivity"});   
    });
}