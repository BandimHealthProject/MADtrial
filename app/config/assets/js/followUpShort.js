/**
 * Responsible for rendering children to visit follow-up
 */
'use strict';
/* global odkTables, util, odkCommon, odkData */

var tabzList, children, date;
// note that persons are the MIFs
function display() {
    console.log("Persons list loading");
    date = util.getQueryParameter('date');

    console.log(date);
    // Set the background to be a picture.
    //var body = $('body').first();
    //body.css('background', 'url(img/form_logo.png) fixed');
    
}

// Get masterlList from CSV
$.ajax({
    url: 'TABZ.csv',
    dataType: ' ',
}).done(getTabzList);

function getTabzList(data) {
    tabzList = [];
    var allRows = data.split(/\r?\n|\r/);
    for (var row = 1; row < allRows.length; row++) {  // start at row = 1 to skip header
            allRows[row] = allRows[row].replace(/"/g,""); // remove quotes from strings
            var rowValues = allRows[row].split(",");
            var p = {bairroName: rowValues[0], bairro: rowValues[1], tabzName: rowValues[2], tabz: rowValues[3]};
            if (p.bairro != undefined) { // only push rows with reg number
                tabzList.push(p);
            }
    }
    console.log("tabzList", tabzList);
    loadChildren();
}


function loadChildren() {
    // SQL to get children
    
    var varNames = "i.NUMEST, i._id, i.DATINC, i.ID, i.INC, i.NOMECRI, i.NOMEMAE, i.SEX, i.TELEMOVEL1, i.TELEMOVEL2, i.TELEMOVEL3, i.TELEINF1, i.TELEINF2, i.TELEINF3, i.OUBAIRRO, DATASAI, FOLLOWUP, LASTFUSUC, CHAMADA11, CHAMADA12, CHAMADA13, CHAMADA21, CHAMADA22, CHAMADA23, CHAMADA31, CHAMADA32, CHAMADA33, DATSEGUI1, DATSEGUI2, DATSEGUI3, MADTRIAL_FU_SHORT._id AS FUrowId "
    var sql = "SELECT " + varNames + ", i.DOB, i.IDADEANO, i.IDADEMES " +
        " FROM MADTRIAL_INC AS i " +
        " LEFT JOIN MADTRIAL_FU_SHORT ON i._id = MADTRIAL_FU_SHORT.IDINC " +
        " WHERE i.INC = 1 " +
        " GROUP BY i._id HAVING MAX(FOLLOWUP) OR FOLLOWUP IS NULL " +
        " ORDER BY i.NOMECRI ASC";
    children = [];
    console.log("Querying database for included children...");
    console.log(sql);
    var successFn = function( result ) {
        console.log("Found " + result.getCount() + " children");
        for (var row = 0; row < result.getCount(); row++) {
            var NUMEST = result.getData(row,"NUMEST");
            var rowId = result.getData(row,"_id").slice(5); // tablet ID from INC
            var FUrowId = result.getData(row,"FUrowId"); // tablet ID from FU_Phone
            
            var DATINC = result.getData(row,"DATINC");
            var DOB = result.getData(row,"DOB");
            var ID = result.getData(row,"ID");
            var IDADEANO = result.getData(row,"IDADEANO");
            var IDADEMES = result.getData(row,"IDADEMES");
            var INC = result.getData(row,"INC");
            var NOMECRI = titleCase(result.getData(row,"NOMECRI"));
            var NOMEMAE = titleCase(result.getData(row,"NOMEMAE"));
            var SEX = result.getData(row,"SEX");
            var TELEMOVEL1 = result.getData(row,"TELEMOVEL1");
            var TELEMOVEL2 = result.getData(row,"TELEMOVEL2");
            var TELEMOVEL3 = result.getData(row,"TELEMOVEL3");
            var TELEINF1 = result.getData(row,"TELEINF1");
            var TELEINF2 = result.getData(row,"TELEINF2");
            var TELEINF3 = result.getData(row,"TELEINF3");
            var OUBAIRRO = result.getData(row,"OUBAIRRO");
            var DATASAI = result.getData(row,"DATASAI");
            var FOLLOWUP = Number(result.getData(row,"FOLLOWUP")); // variable for follow-up - made into integer
            var LASTFUSUC = result.getData(row,"LASTFUSUC");
            var CHAMADA11 = result.getData(row,"CHAMADA11");
            var CHAMADA12 = result.getData(row,"CHAMADA12");
            var CHAMADA13 = result.getData(row,"CHAMADA13");
            var CHAMADA21 = result.getData(row,"CHAMADA21");
            var CHAMADA22 = result.getData(row,"CHAMADA22");
            var CHAMADA23 = result.getData(row,"CHAMADA23");
            var CHAMADA31 = result.getData(row,"CHAMADA31");
            var CHAMADA32 = result.getData(row,"CHAMADA32");
            var CHAMADA33 = result.getData(row,"CHAMADA33");
            var DATSEGUI1 = result.getData(row,"DATSEGUI1");
            var DATSEGUI2 = result.getData(row,"DATSEGUI2");
            var DATSEGUI3 = result.getData(row,"DATSEGUI3");
            var p = { type: 'child', NUMEST, rowId, FUrowId, DATINC, DOB, ID, IDADEANO, IDADEMES, INC, NOMECRI, NOMEMAE, SEX, TELEMOVEL1, TELEMOVEL2, TELEMOVEL3, TELEINF1, TELEINF2, TELEINF3, OUBAIRRO, DATASAI, FOLLOWUP, LASTFUSUC, CHAMADA11, CHAMADA12, CHAMADA13, CHAMADA21, CHAMADA22, CHAMADA23, CHAMADA31, CHAMADA32, CHAMADA33, DATSEGUI1, DATSEGUI2, DATSEGUI3 };
            //console.log(p);
            children.push(p);
        }
        console.log("loadChildren:", children)
        populateView();
        return;
    }
    var failureFn = function( errorMsg ) {
        console.error('Failed to get children from database: ' + errorMsg);
        console.error('Trying to execute the following SQL:');
        console.error(sql);
        alert("Program error Unable to look up persons.");
    }

    odkData.arbitraryQuery('MADTRIAL_INC', sql, null, null, null, successFn, failureFn);
}


function populateView() {
    console.log("CHILDREN:", children);
    var today = new Date(date);
    var todayAdate = setTodayAdate();
    console.log("adate",todayAdate); 

    children.forEach(function(child) {
        var visitedToday;
        if (child.DATSEGUI1 == todayAdate | child.DATSEGUI2 == todayAdate) {
            visitedToday = true;
        }

        // Visits
        if (child.FOLLOWUP == 0) {
            child['FU'] = 1;
        } else if (child.FOLLOWUP == 1 & ((child.CHAMADA13 == null & child.CHAMADA23 == null & child.CHAMADA33 == null) | visitedToday == true)) {
            child['FU'] = 1;
        } else if (child.FOLLOWUP == 1 & (child.CHAMADA13 != null | child.CHAMADA23 != null | child.CHAMADA33 != null)) {
            child['FU'] = 2;
        } else if (child.FOLLOWUP == 2 & ((child.CHAMADA13 == null & child.CHAMADA23 == null & child.CHAMADA33 == null) | visitedToday == true)) {
            child['FU'] = 2;
        }
        // Inclusion date and constrains on FU
        var incD = Number(child.DATINC.slice(2, child.DATINC.search("M")-1));
        var incM = child.DATINC.slice(child.DATINC.search("M")+2, child.DATINC.search("Y")-1);
        var incY = child.DATINC.slice(child.DATINC.search("Y")+2);  
        var dateInc = new Date(incY, incM-1, incD);
        var diffInDays = (today.getTime() - dateInc.getTime())/(1000*3600*24);
        console.log("diff", diffInDays);
        // Move up to FU2 if 14 or more days
        // This sets the upper bounds and other "exclusion criteria"
        if (child.FU == 1 & diffInDays >= 14) {
            child['FU'] = 2;
        } if (child.FU == 2 & diffInDays > 21) {
            child['FU'] = null;
        } if (child.DATASAI != null) {
            // Exclude dead children
            child['FU'] = null
        }
    });
    console.log("CHILDREN - FU sortet:", children);
    var ul1 = $('#fu1');
    var ul2 = $('#fu2');

    // Follow-up list
    $.each(children, function() {
        //console.log(this);
        var that = this;      
        
        // Check if visited today
        var visited = '';
        if (this.DATSEGUI1 == todayAdate | this.DATSEGUI2 == todayAdate) {
            visited = "visited";
        };

        // Set date/time contraint
        // Lower bounds - Inclusive
        var incD = this.DATINC.slice(2, this.DATINC.search("M")-1);
        var incM = this.DATINC.slice(this.DATINC.search("M")+2, this.DATINC.search("Y")-1);
        var incY = this.DATINC.slice(this.DATINC.search("Y")+2);
        var FuDate; 
        var incDate = new Date(incY, incM-1, incD);
        if (this.FU == 1) {
            FuDate = new Date(incDate.getTime() + (7 * 24 * 60 * 60 * 1000));
        } else if (this.FU == 2) {
            FuDate = new Date(incDate.getTime() + (14 * 24 * 60 * 60 * 1000));
        }

        // set text to display
        var displayText = setDisplayText(that);
        console.log(FuDate)
        console.log(incD)
        console.log(incM)
        console.log(this.DATINC)
        
        if (this.FU == 1 & FuDate <= today) {
            ul1.append($("<li />").append($("<button />").attr('id',this.rowId).attr('class', visited + ' btn ' + this.type + this.SEX).append(displayText)));
            console.log("FU", this.FU);
            console.log("FuDate", FuDate);
        }
        if (this.FU == 2 & FuDate <= today) {
            ul2.append($("<li />").append($("<button />").attr('id',this.rowId).attr('class', visited + ' btn ' + this.type + this.SEX).append(displayText)));
            console.log("FU", this.FU);
            console.log("FuDate", FuDate);
        }

        // Buttons
        var btn1 = ul1.find('#' + this.rowId);
        btn1.on("click", function() {
            openForm(that);
        })        
        var btn2 = ul2.find('#' + this.rowId);
        btn2.on("click", function() {
            openForm(that);
        })                
    });
}

function setTodayAdate() {
    var today = new Date(date);

    // Set today's date as adate for easy comparing
    var d = today.getDate();
    var m = today.getMonth()+1;
    var y = today.getFullYear();
    return "D:" + d + ",M:" + m + ",Y:" + y;
}

function setDisplayText(child) {
    var idade;
    if (child.DOB == "D:NS,M:NS,Y:NS") {
        idade = "Idade: " + Number(child.IDADEANO) + " ano(s), " + Number(child.IDADEMES) + " mes(es)";
    } else {
        var d = child.DOB.slice(2, child.DOB.search("M")-1);
        var m = child.DOB.slice(child.DOB.search("M")+2, child.DOB.search("Y")-1);
        var y = child.DOB.slice(child.DOB.search("Y")+2);   
        idade = "Nascimento: " + d + "/" + m + "/" + y;
    }

    var displayText = "Nome: " + child.NOMECRI + "<br />" + 
        idade + "<br />" + 
        "Mãe: " + child.NOMEMAE;
    return displayText
}

function openForm(child) {
    console.log("Preparing form for ", child);
    var rowId = child.FUrowId;
    var tableId = 'MADTRIAL_FU_SHORT';
    var formId = 'MADTRIAL_FU_SHORT';
    var todayAdate = setTodayAdate();

    if (child.DATSEGUI1 == todayAdate | child.DATSEGUI2 == todayAdate) {
        var defaults = {};
        defaults['editvisit'] = "true"
        console.log("Opening FU for edit", defaults);
        odkTables.editRowWithSurvey(
            null,
            tableId,
            rowId,
            formId,
            null,);
    } 

    if (child.FU != child.FOLLOWUP) {
        // new FU
        var defaults = getDefaults(child);
        defaults['LASTFUSUC'] = setLastSucces(child);
        defaults['FOLLOWUP'] = child.FU;
        console.log("Opening first try next FU:", defaults);
        odkTables.addRowWithSurvey(
            null,
            tableId,
            formId,
            null,
            defaults);
    } else {
        // next try if we haven't tried a third time yet
        console.log("Opening next try FU:", rowId);
        odkTables.editRowWithSurvey(
            null,
            tableId,
            rowId,
            formId,
            null,);
    }
}

function setLastSucces(child) {
    var lastDate;
    if (child.FOLLOWUP > 0) {
        if (child.DATSEGUI2 != null) {
            lastDate = child.DATSEGUI2;
        } else if (child.DATSEGUI1 != null) {
            lastDate = child.DATSEGUI1;
        } else {
            lastDate = child.LASTFUSUC;
        }
    } else {
        lastDate = child.DATINC;
    }
    return lastDate;
}


function getDefaults(child) {
    var defaults = {};
    defaults['DATINC'] = child.DATINC;
    defaults['DOB'] = child.DOB;
    defaults['FOLLOWUP'] = child.FOLLOWUP;
    defaults['IDADEANO'] = child.IDADEANO;
    defaults['IDADEMES'] = child.IDADEMES;
    defaults['IDINC'] = "uuid:" + child.rowId;
    defaults['NOMECRI'] = child.NOMECRI;
    defaults['NOMEMAE'] = child.NOMEMAE;
    defaults['NUMEST'] = child.NUMEST;
    defaults['SEX'] = child.SEX;
    defaults['TELEINF1'] = child.TELEINF1;
    defaults['TELEINF2'] = child.TELEINF2;
    defaults['TELEINF3'] = child.TELEINF3;
    defaults['TELEMOVEL1'] = child.TELEMOVEL1;
    defaults['TELEMOVEL2'] = child.TELEMOVEL2;
    defaults['TELEMOVEL3'] = child.TELEMOVEL3;
    
    // status on phone numbers - 4: incorrect number
    if (child.CHAMADA11 == 4 | child.CHAMADA12 == 4 | child.CHAMADA13 == 4) {
        defaults['chamada1'] = 4
    }
    if (child.CHAMADA21 == 4 | child.CHAMADA22 == 4 | child.CHAMADA23 == 4) {
        defaults['chamada2'] = 4
    }
    if (child.CHAMADA31 == 4 | child.CHAMADA32 == 4 | child.CHAMADA33 == 4) {
        defaults['chamada3'] = 4
    }
    return defaults;
}

function titleCase(str) {
    if (!str) return str;
    return str.toLowerCase().split(' ').map(function(word) {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
  }