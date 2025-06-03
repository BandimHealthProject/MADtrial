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
    
    var varNames = "i.NUMEST AS NUMEST, i._id AS _id, i.DATINC AS DATINC, i.ID AS ID, i.INC AS INC, i.NOMECRI AS NOMECRI, i.NOMEMAE AS NOMEMAE, i.SEX AS SEX, i.TELEMOVEL1 AS TELEMOVEL1, i.TELEMOVEL2 AS TELEMOVEL2, i.TELEMOVEL3 AS TELEMOVEL3, i.OUBAIRRO AS OUBAIRRO, DATASAI, DATSEGUI1, DATSEGUI2, DATSEGUI3, ESTADOCRI, FOLLOWUP, LASTFUSUC, SUCCEED1, SUCCEED2, SUCCEED3, BCG, FEBAMAREL, PCV1, PCV2, PCV3, PENTA1, PENTA2, PENTA3, POLIO1, POLIO2, POLIO3, POLIONAS, ROX1, ROX2, SARAMPO1, VACOU1, VACOU1TIPO, VACOU2, VACOU2TIPO, VACOU3, VACOU3TIPO, VACOU4, VACOU4TIPO, VACOU5, VACOU5TIPO, VPI, MADTRIAL_FU_VIS._id AS FUrowId "
    var sql = "SELECT " + varNames + ", i.CAMO AS CAMO, i.CAMOONDE AS CAMOONDE, i.CNO AS CNO, i.TABZ AS TABZ, i.DOB AS DOB, i.IDADEANO AS IDADEANO, i.IDADEMES AS IDADEMES " +
        " FROM MADTRIAL_INC AS i " +
        " LEFT JOIN MADTRIAL_FU_VIS ON i._id = MADTRIAL_FU_VIS.IDINC " + // join on tablet generated IDs
        " WHERE i.INC = 1 AND i.TABZ IS NOT NULL AND FOLLOWUP IS NULL " +
        " UNION " + 
        " SELECT " + varNames + ", MADTRIAL_FU_VIS.CAMO AS CAMO, MADTRIAL_FU_VIS.CAMOONDE AS CAMOONDE, MADTRIAL_FU_VIS.CNO AS CNO, MADTRIAL_FU_VIS.TABZ AS TABZ, MADTRIAL_FU_VIS.DOB AS DOB, MADTRIAL_FU_VIS.IDADEANO AS IDADEANO, MADTRIAL_FU_VIS.IDADEMES AS IDADEMES " +
        " FROM MADTRIAL_INC AS i " +
        " LEFT JOIN MADTRIAL_FU_VIS ON i._id = MADTRIAL_FU_VIS.IDINC " + // join on tablet generated IDs
        " WHERE i.INC = 1 AND i.TABZ IS NOT NULL AND FOLLOWUP IS NOT NULL " +
        " GROUP BY i._id HAVING MAX(FOLLOWUP) OR FOLLOWUP IS NULL " + // This makes sure the most recent follup up is shown
        " ORDER BY TABZ ASC, CAMO ASC, i.NOMECRI ASC";
    children = [];
    console.log("Querying database for included children...");
    console.log(sql);
    var successFn = function( result ) {
        console.log("Found " + result.getCount() + " children");
        for (var row = 0; row < result.getCount(); row++) {
            var NUMEST = result.getData(row,"NUMEST");
            var rowId = result.getData(row,"_id").slice(5); // tablet ID from INC
            var FUrowId = result.getData(row,"FUrowId"); // tablet ID from FU_Phone
            
            var CAMO = result.getData(row,"CAMO");
            var CAMOONDE = result.getData(row,"CAMOONDE");
            var CNO = result.getData(row,"CNO");
            var DATINC = result.getData(row,"DATINC");
            var DOB = result.getData(row,"DOB");
            var ID = result.getData(row,"ID");
            var IDADEANO = result.getData(row,"IDADEANO");
            var IDADEMES = result.getData(row,"IDADEMES");
            var INC = result.getData(row,"INC");
            var NOMECRI = titleCase(result.getData(row,"NOMECRI"));
            var NOMEMAE = titleCase(result.getData(row,"NOMEMAE"));
            var SEX = result.getData(row,"SEX");
            var TABZ = result.getData(row,"TABZ");
            var TELEMOVEL1 = result.getData(row,"TELEMOVEL1");
            var TELEMOVEL2 = result.getData(row,"TELEMOVEL2");
            var TELEMOVEL3 = result.getData(row,"TELEMOVEL3");
            var OUBAIRRO = result.getData(row,"OUBAIRRO");
            var DATASAI = result.getData(row,"DATASAI");
            var DATSEGUI1 = result.getData(row,"DATSEGUI1");
            var DATSEGUI2 = result.getData(row,"DATSEGUI2");
            var DATSEGUI3 = result.getData(row,"DATSEGUI3");
            var ESTADOCRI = result.getData(row,"ESTADOCRI");
            var FOLLOWUP = Number(result.getData(row,"FOLLOWUP")); // variabel for followup - made into integer
            var LASTFUSUC = result.getData(row,"LASTFUSUC");
            var SUCCEED1 = result.getData(row,"SUCCEED1");
            var SUCCEED2 = result.getData(row,"SUCCEED2");
            var SUCCEED3 = result.getData(row,"SUCCEED3");

            var BCG = result.getData(row,"BCG");
            var FEBAMAREL = result.getData(row,"FEBAMAREL");
            var PCV1 = result.getData(row,"PCV1");
            var PCV2 = result.getData(row,"PCV2");
            var PCV3 = result.getData(row,"PCV3");
            var PENTA1 = result.getData(row,"PENTA1");
            var PENTA2 = result.getData(row,"PENTA2");
            var PENTA3 = result.getData(row,"PENTA3");
            var POLIO1 = result.getData(row,"POLIO1");
            var POLIO2 = result.getData(row,"POLIO2");
            var POLIO3 = result.getData(row,"POLIO3");
            var POLIONAS = result.getData(row,"POLIONAS");
            var ROX1 = result.getData(row,"ROX1");
            var ROX2 = result.getData(row,"ROX2");
            var SARAMPO1 = result.getData(row,"SARAMPO1");
            var VACOU1 = result.getData(row,"VACOU1");
            var VACOU1TIPO = result.getData(row,"VACOU1TIPO");
            var VACOU2 = result.getData(row,"VACOU2");
            var VACOU2TIPO = result.getData(row,"VACOU2TIPO");
            var VACOU3 = result.getData(row,"VACOU3");
            var VACOU3TIPO = result.getData(row,"VACOU3TIPO");
            var VACOU4 = result.getData(row,"VACOU4");
            var VACOU4TIPO = result.getData(row,"VACOU4TIPO");
            var VACOU5 = result.getData(row,"VACOU5");
            var VACOU5TIPO = result.getData(row,"VACOU5TIPO");
            var VPI = result.getData(row,"VPI");

            var p = { type: 'child', NUMEST, rowId, FUrowId, CAMO, CAMOONDE, CNO, DATINC, DOB, ID, IDADEANO, IDADEMES, INC, NOMECRI, NOMEMAE, SEX, TABZ, TELEMOVEL1, TELEMOVEL2, TELEMOVEL3, OUBAIRRO, DATASAI, DATSEGUI1, DATSEGUI2, DATSEGUI3, ESTADOCRI, FOLLOWUP, LASTFUSUC, SUCCEED1, SUCCEED2, SUCCEED3, BCG, FEBAMAREL, PCV1, PCV2, PCV3, PENTA1, PENTA2, PENTA3, POLIO1, POLIO2, POLIO3, POLIONAS, ROX1, ROX2, SARAMPO1, VACOU1, VACOU1TIPO, VACOU2, VACOU2TIPO, VACOU3, VACOU3TIPO, VACOU4, VACOU4TIPO, VACOU5, VACOU5TIPO, VPI };
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

    // merge tabzList
    children.forEach(function(child) {
        var result = tabzList.filter(function(tabz) {
            return tabz.tabz === child.TABZ;
        });
        child.TABZNAME = (result[0] !== undefined) ? result[0].tabzName : null; 
        child.BAIRRO = (result[0] !== undefined) ? result[0].bairro : null; 
        child. BAIRRONAME = (result[0] !== undefined) ? result[0].bairroName : null; 
    });
    
    // sort according to tabz name
    children.sort((a,b) => (a.TABZNAME > b.TABZNAME) ? 1 : ((b.TABZNAME > a.TABZNAME) ? -1 : 0))

    children.forEach(function(child) {
        var visitedToday;
        if (child.DATSEGUI1 == todayAdate | child.DATSEGUI2 == todayAdate | child.DATSEGUI3 == todayAdate) {
            visitedToday = true;
        }

        if (child.FOLLOWUP == 0 & child.DATASAI == null) {
            child['FU'] = 1;
        } else if (child.FOLLOWUP == 1 & ((child.ESTADOCRI == null & child.SUCCEED2 == null & child.DATASAI == null) | visitedToday == true)) {
            child['FU'] = 1;
        } else if (child.FOLLOWUP == 1 & (child.ESTADOCRI != null | child.SUCCEED2 != null) & child.DATASAI == null) {
            child['FU'] = 2;
        } else if (child.FOLLOWUP == 2 & ((child.ESTADOCRI == null & child.SUCCEED3 == null & child.DATASAI == null) | visitedToday == true)) {
            child['FU'] = 2;
        } else if (child.FOLLOWUP == 2 & (child.ESTADOCRI != null | child.SUCCEED3 != null) & child.DATASAI == null) {
            child['FU'] = 3;
        } else if (child.FOLLOWUP == 3 & ((child.ESTADOCRI == null & child.SUCCEED3 == null & child.DATASAI == null) | visitedToday == true)) {
            child['FU'] = 3;
        } else if (child.FOLLOWUP == 3 & (child.ESTADOCRI != null | child.SUCCEED3 != null) & child.DATASAI == null) {
            child['FU'] = 4;
        } else if (child.FOLLOWUP == 4 & ((child.ESTADOCRI == null & child.SUCCEED3 == null & child.DATASAI == null) | visitedToday == true)) {
            child['FU'] = 4;
        }

        // Inclusion date and constrains on FU
        var incD = Number(child.DATINC.slice(2, child.DATINC.search("M")-1));
        var incM = child.DATINC.slice(child.DATINC.search("M")+2, child.DATINC.search("Y")-1);
        var incY = child.DATINC.slice(child.DATINC.search("Y")+2);  
        var dateInc = new Date(incY, incM-1, incD);
        var diffInDays = (today.getTime() - dateInc.getTime())/(1000*3600*24);
        // console.log("diff", diffInDays);
        if (child.FU == 1 & diffInDays >= 4) {
            child['FU'] = 2;
        }
        if (child.FU == 2 & diffInDays >= 7) {
            child['FU'] = 3;
        }
        if (child.FU == 3 & diffInDays >= 14) {
            child['FU'] = 4;
        }
    });
    console.log("CHILDREN - FU sortet:", children);
    var ul1 = $('#fu1');
    var ul2 = $('#fu2');
    var ul3 = $('#fu3');
    var ul4 = $('#fu4');
    var ul5 = $('#fu5');

    // Follow-up list
    $.each(children, function() {
        //console.log(this);
        var that = this;      
        
        // Check if visited today
        var visited = '';
        if (this.DATSEGUI1 == todayAdate | this.DATSEGUI2 == todayAdate | this.DATSEGUI3 == todayAdate) {
            visited = "visited";
        };
        
        // Set date/time contraint
        var FuDate; 
        var incD = Number(this.DATINC.slice(2, this.DATINC.search("M")-1));
        var incM = this.DATINC.slice(this.DATINC.search("M")+2, this.DATINC.search("Y")-1);
        var incY = this.DATINC.slice(this.DATINC.search("Y")+2);
        if (this.FU == 1) {
            FuDate = new Date(incY, incM-1, incD + 2);
        } else if (this.FU == 2) {
            FuDate = new Date(incY, incM-1, incD + 4);
        } else if (this.FU == 3) {
            FuDate = new Date(incY, incM-1, incD + 7);
        } else if (this.FU == 4) {
            FuDate = new Date(incY, incM-1, incD + 14);
        }

        // set text to display
        var displayText = setDisplayText(that);

        // list
        if (((this.TABZ > 10 & this.TABZ < 29) | this.TABZ == 177 | this.TABZ == 277) & FuDate <= today) {
            ul1.append($("<li />").append($("<button />").attr('id',this.rowId).attr('class', visited + ' btn ' + this.type + this.SEX + " FU" + this.FU).append(displayText)));
        }
        if (((this.TABZ > 30 & this.TABZ < 36) | this.TABZ == 377) & FuDate <= today) {
            ul2.append($("<li />").append($("<button />").attr('id',this.rowId).attr('class', visited + ' btn ' + this.type + this.SEX + " FU" + this.FU).append(displayText)));
        }
        if (((this.TABZ > 41 & this.TABZ < 45) | this.TABZ == 477) & FuDate <= today) {
            ul3.append($("<li />").append($("<button />").attr('id',this.rowId).attr('class', visited + ' btn ' + this.type + this.SEX + " FU" + this.FU).append(displayText)));
         }
        if (((this.TABZ > 70 & this.TABZ < 80) | (this.TABZ > 90 & this.TABZ < 95) | this.TABZ == 777 | this.TABZ == 977) & FuDate <= today) {
            ul4.append($("<li />").append($("<button />").attr('id',this.rowId).attr('class', visited + ' btn ' + this.type + this.SEX + " FU" + this.FU).append(displayText)));
        }
        if (this.BAIRRO == 77 & FuDate <= today) {
            ul5.append($("<li />").append($("<button />").attr('id',this.rowId).attr('class', visited + ' btn ' + this.type + this.SEX + " FU" + this.FU).append(displayText)));
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
        var btn3 = ul3.find('#' + this.rowId);
        btn3.on("click", function() {
            openForm(that);
        })
        var btn4 = ul4.find('#' + this.rowId);
        btn4.on("click", function() {
            openForm(that);
        })
        var btn5 = ul5.find('#' + this.rowId);
        btn5.on("click", function() {
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
    var address;
    if (child.BAIRRO == 77) {
        if (child.TABZ == 7777) {
            address = "Bairro: " + "<b>" + child.TABZNAME + "</b>" + "<br />" + 
            "Obs: " + child.OUBAIRRO;
        } else {
            address = "Bairro: " + "<b>" + child.TABZNAME + "</b>" + "<br />" + 
            "Obs: " + child.CAMOONDE;
        }
    } else if (child.CAMO == 9999) {
        address = "TABZ: " + child.TABZNAME + "<br />" + 
        "Obs: " + child.CAMOONDE;
    } else {
        address = "TABZ: " + child.TABZ + "; CAMO: " + child.CAMO;
    }

    var idade;
    if (child.DOB == "D:NS,M:NS,Y:NS") {
        idade = "Idade: " + Number(child.IDADEANO) + " ano(s), " + Number(child.IDADEMES) + " mes(es)";
    } else {
        var d = child.DOB.slice(2, child.DOB.search("M")-1);
        var m = child.DOB.slice(child.DOB.search("M")+2, child.DOB.search("Y")-1);
        var y = child.DOB.slice(child.DOB.search("Y")+2);   
        idade = "Nascimento: " + d + "/" + m + "/" + y;
    }

    var phonenumber = "Telemovel: Não tem";
    if (child.TELEMOVEL1 != 999999999 & child.TELEMOVEL1 != undefined) {
        phonenumber = "Telemovel: " + child.TELEMOVEL1;
        if (child.TELEMOVEL2 != 999999999 & child.TELEMOVEL2 != undefined) {
            phonenumber = phonenumber + ", " + child.TELEMOVEL2;
            if (child.TELEMOVEL3 != 999999999 & child.TELEMOVEL3 != undefined) {
                phonenumber = phonenumber + ", " + child.TELEMOVEL3;
            }
        }
    }

    var displayText = address + "<br />" + 
        "Nome: " + child.NOMECRI + "<br />" + 
        idade + "<br />" + 
        "Mãe: " + child.NOMEMAE + "<br />" + 
        phonenumber;
    return displayText
}

function openForm(child) {
    console.log("Preparing form for ", child);
    var rowId = child.FUrowId;
    var tableId = 'MADTRIAL_FU_VIS';
    var formId = 'MADTRIAL_FU_VIS';
    var todayAdate = setTodayAdate();

    if (child.DATSEGUI1 == todayAdate | child.DATSEGUI2 == todayAdate | child.DATSEGUI3 == todayAdate) {
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
    // set lastdate we completed af follow-up visit
    var lastDate = [];
    if (child.FOLLOWUP > 0) {
        if (child.SUCCEED3 == 1) {
            lastDate = child.DATSEGUI3;
        } else if (child.SUCCEED2 == 1) {
            lastDate = child.DATSEGUI2;
        } else if (child.SUCCEED1 == 1) {
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
    defaults['CAMO'] = child.CAMO;
    defaults['CAMOONDE'] = child.CAMOONDE;
    defaults['CNO'] = child.CNO;
    defaults['DATINC'] = child.DATINC;
    defaults['DOB'] = child.DOB;
    defaults['FOLLOWUP'] = child.FOLLOWUP;
    defaults['ID'] = child.ID;
    defaults['IDADEANO'] = child.IDADEANO;
    defaults['IDADEMES'] = child.IDADEMES;
    defaults['IDINC'] = "uuid:" + child.rowId;
    defaults['NOMECRI'] = child.NOMECRI;
    defaults['NOMEMAE'] = child.NOMEMAE;
    defaults['NUMEST'] = child.NUMEST;
    defaults['SEX'] = child.SEX;
    defaults['TABZ'] = child.TABZ;
    
    defaults['BCG'] = child.BCG;
    defaults['FEBAMAREL'] = child.FEBAMAREL;
    defaults['PCV1'] = child.PCV1;
    defaults['PCV2'] = child.PCV2;
    defaults['PCV3'] = child.PCV3;
    defaults['PENTA1'] = child.PENTA1;
    defaults['PENTA2'] = child.PENTA2;
    defaults['PENTA3'] = child.PENTA3;
    defaults['POLIO1'] = child.POLIO1;
    defaults['POLIO2'] = child.POLIO2;
    defaults['POLIO3'] = child.POLIO3;
    defaults['POLIONAS'] = child.POLIONAS;
    defaults['ROX1'] = child.ROX1;
    defaults['ROX2'] = child.ROX2;
    defaults['SARAMPO1'] = child.SARAMPO1;
    defaults['VACOU1'] = child.VACOU1;
    defaults['VACOU1TIPO'] = child.VACOU1TIPO;
    defaults['VACOU2'] = child.VACOU2;
    defaults['VACOU2TIPO'] = child.VACOU2TIPO;
    defaults['VACOU3'] = child.VACOU3;
    defaults['VACOU3TIPO'] = child.VACOU3TIPO;
    defaults['VACOU4'] = child.VACOU4;
    defaults['VACOU4TIPO'] = child.VACOU4TIPO;
    defaults['VACOU5'] = child.VACOU5;
    defaults['VACOU5TIPO'] = child.VACOU5TIPO;
    defaults['VPI'] = child.VPI;
    
    return defaults;
}

function titleCase(str) {
    if (!str) return str;
    return str.toLowerCase().split(' ').map(function(word) {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
  }