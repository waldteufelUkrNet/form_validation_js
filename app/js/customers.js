var storeg        = $('#tableMarker').val(); // коли таблиць багато, щоб вони не користувалися одними змінними
var btnFilters    = document.getElementById('option-panel-filters');
var btnColumns    = document.getElementById('option-panel-columns');
var filtersPanel  = document.getElementById('filters-wrapper');
var columnsPanel  = document.getElementById('columns-wrapper');
var columnsSelect = document.querySelectorAll('.column-label-wrapper input[type="checkbox"]');
var tableTh       = document.querySelectorAll('.customers-table th');
var tableTd       = document.querySelectorAll('.customers-table tr');

/* ↓↓↓ OPEN/CLOSE PANELS ↓↓↓ */
var columnsPanelIsClose = true;
btnColumns.onclick = function(){
  if (columnsPanelIsClose) {
    columnsPanel.style.transition = 'height 0.3s';
    columnsPanel.style.height = '140px';
      columnsPanelIsClose = false;
    return;
  } else {
    columnsPanel.style.height = '0px';
      columnsPanelIsClose = true;
  }
}

var filtersPanelIsClose = true;
btnFilters.onclick = function(){
  if (filtersPanelIsClose) {
    filtersPanel.style.transition = 'height 0.3s';
    filtersPanel.style.height = '274px';
      filtersPanelIsClose = false;
    return;
  } else {
    filtersPanel.style.height = '0px';
      filtersPanelIsClose = true;
  }
}
/* ↑↑↑ OPEN/CLOSE PANELS ↑↑↑ */

/* ↓↓↓ WORK WITH LOCALSTORAGE ↓↓↓ */
// COLUMNS
// пробігтися по localStorage - відновити старі налаштування
for (var i = 0; i < columnsSelect.length; i++) {
  var temp = 'isVisible' + storeg + 'TableColumn' + (i + 1);
  if (localStorage.getItem(temp) === 'false') {
    tableTh[i+1].style.display = 'none';
    columnsSelect[i].checked = true;

    for (var j = 1; j < tableTd.length; j++) {
      tableTd[j].querySelectorAll('td')[i+1].style.display = 'none';
    }
  }
}

// onclick через цикл - навішування обробника на усі кнопки
for (var i = 0; i < columnsSelect.length; i++) {
  (function(n){
    columnsSelect[n].onclick = function() {
      toggleColumns(n);
    };
  }(i));
}

// FILTERS
var filterMemory = {};

// пробігтися по localStorage - відновити старі налаштування
if (localStorage.filterMemory) {
  // localStorage -> object
  filterMemory = JSON.parse(localStorage.filterMemory);

  for (var key in filterMemory) {
    var tempId = '#' + key;
    var tempNo = filterMemory[key];
    $($(tempId)[0][tempNo]).attr('selected','true');

    var innerText = $($(tempId)[0][tempNo]).text();
    var parentID = $($(tempId)[0][tempNo]).parent().attr('id');
    if (innerText != 'Все' && innerText != '5') {
      addFilterMarker(innerText,parentID);
    } else {
      delete filterMemory[key];
      localStorage.filterMemory = JSON.stringify(filterMemory);
    }
  }
}

if (localStorage.filterMemory_employer) {
  $('#employerSelect + input').val(localStorage.filterMemory_employer);
  $('#filter-markers-panel').css({'display':'block'});
  addFilterMarker(localStorage.filterMemory_employer, 'employer');
}

if (localStorage.filterMemory_dateStart) {
  $('#date-start').val(localStorage.filterMemory_dateStart);
  addFilterMarker(localStorage.filterMemory_dateStart, 'dateStart', 'start');
}

if (localStorage.filterMemory_dateEnd) {
  $('#date-end').val(localStorage.filterMemory_dateEnd);
  addFilterMarker(localStorage.filterMemory_dateEnd, 'dateEnd', 'end');
}

if ( $('.filter-marker').length >= 2 ) toggleClearFiltersBtn ('on');


$('.filters-label-wrapper label select option').click(function() {
  var parentArr = $(this).parent()[0];
  for ( var i = 0; i < parentArr.length; i++) {
    if (parentArr[i] == this) {
      // {key:value} to object
      filterMemory[$(this).parent().attr('id')] = i;
      // object -> string -> localStorage
      localStorage.filterMemory = JSON.stringify(filterMemory);

      var innerText = $(parentArr[i]).text();
      var parentID = $($(parentArr[i]).parent()[0]).attr('id');
      var selector = '.filter-marker[data-parent-id=' + parentID +']';

      if ($(selector).length != 0) {
        $(selector).remove();
      }
      if (innerText != 'Все' && innerText != '5') {
        addFilterMarker(innerText,parentID);
      } else {
        delete filterMemory[parentID];
        localStorage.filterMemory = JSON.stringify(filterMemory);
        controlFiltersAmount();
      }
      if ($('.filter-marker').length >= 2) toggleClearFiltersBtn ('on');
      return;
    }
  }
});

$('#employerSelect + input').blur(function() {
	if ($('#employerSelect + input').val() != '' && $('#employerSelect + input').val() != 'Все') {
    localStorage.filterMemory_employer = $('#employerSelect + input').val();
    $('.filter-marker[data-parent-id=employer]').remove();
    addFilterMarker(localStorage.filterMemory_employer, 'employer');
  } else {
  	localStorage.removeItem('filterMemory_employer');
  	$('.filter-marker[data-parent-id=employer]').remove();
  }
  if ($('.filter-marker').length >= 2) toggleClearFiltersBtn ('on');
});

$('#date-end').blur(function(){
  setTimeout(function(){
    $('.filter-marker[data-filter-time="true"]').remove();
    localStorage.filterMemory_dateEnd = $('#date-end').val();
    if ( $('#date-end').val() != '' ) {
      addFilterMarker(localStorage.filterMemory_dateEnd, 'dateEnd', 'end');
      if ( $('.filter-marker').length >= 2 ) toggleClearFiltersBtn ('on');
    }
  },1000);

});

$('#date-start').blur(function(){
  setTimeout(function(){
    $('.filter-marker[data-filter-time="true"]').remove();
    localStorage.filterMemory_dateStart = $('#date-start').val();
    if ( $('#date-start').val() != '' ) {
      addFilterMarker(localStorage.filterMemory_dateStart, 'dateStart', 'start');
      if ( $('.filter-marker').length >= 2 ) toggleClearFiltersBtn ('on');
    }
  },1000);

});

$('#clear-filters-btn').click(function(){
  filterMemory = {};
  localStorage.removeItem('filterMemory');
  localStorage.removeItem('filterMemory_employer');
  localStorage.removeItem('filterMemory_dateStart');
  localStorage.removeItem('filterMemory_dateEnd');

  toggleClearFiltersBtn ('off');

  $('#filter-markers-panel').css({'display':'none'});
  $('.filter-marker').remove();
  $($('#employerSelect + input')[0]).val('');
  $('#date-start').val('');
  $('#date-end').val('');

  $('.filters-label-wrapper select option').attr('selected','').removeAttr('selected');
});

/* ↑↑↑ /WORK WITH LOCALSTORAGE ↑↑↑ */

/* ↓↓↓ THUMB BEHAVIOR ↓↓↓ */
//first thumb
var thumbArea        = document.getElementById('thumbArea');
var thumbElem        = document.getElementById('thumb');
var thumbLeftLine    = document.getElementById('thumbLeftLine');
var thumbRightLine   = document.getElementById('thumbRightLine');
var thumbObj         = document.getElementById('thumbObj');

//second thumb
var thumbArea2       = document.getElementById('thumbArea2');
var thumbElem2       = document.getElementById('thumb2');
var thumbLeftLine2   = document.getElementById('thumbLeftLine2');
var thumbRightLine2  = document.getElementById('thumbRightLine2');

thumbElem.onmousedown = function(e) {

  // визначаємо метрики елементів
  var thumbAreaWidth = thumbArea.offsetWidth;
  var thumbElemWidth = thumbElem.offsetWidth;
  var thumbObjWidth  = thumbObj.offsetWidth;

  // визначаємо координати елементів
  var thumbAreaCoords = getCoords(thumbArea);
  var thumbCoords     = getCoords(thumbElem);

  // призначаємо ширину полосок
  thumbLeftLine.style.width  = thumbObjWidth + 'px';
  thumbRightLine.style.width = thumbObjWidth + 'px';

  thumbLeftLine2.style.width  = thumbObjWidth + 'px';
  thumbRightLine2.style.width = thumbObjWidth + 'px';

  // задаємо початкове положення лівої полоски
  thumbLeftLine.style.left  = -thumbObjWidth + 'px';
  thumbLeftLine2.style.left  = -thumbObjWidth + 'px';

  // визначаємо зсув курсору відносно елементу
  var shiftX = e.pageX - thumbCoords.left;

  document.onmousemove = function(e) {
    // розраховуємо нову координату повзунка
    var newLeft = e.pageX - shiftX - thumbAreaCoords.left;

    if (newLeft < 0) {
      newLeft = 0;
    }
    // крайнє положення, де може бути повзунок
    var rightEdge = thumbAreaWidth - thumbElemWidth;
    if (newLeft > rightEdge) {
      newLeft = rightEdge;
    }

    thumbElem.style.left = newLeft + 'px';
    thumbLeftLine.style.left = newLeft - thumbObjWidth + thumbElemWidth + 'px';
    thumbRightLine.style.left = newLeft + 'px';

    var mult = newLeft*100/rightEdge;
    thumbObj.style.marginLeft = -((thumbObjWidth-thumbAreaWidth)*mult/100) + 'px';

    thumbElem2.style.left = newLeft + 'px';
    thumbLeftLine2.style.left = newLeft - thumbObjWidth + thumbElemWidth + 'px';
    thumbRightLine2.style.left = newLeft + 'px';
  }

  document.onmouseup = function() {
    document.onmousemove = document.onmouseup = null;
  };

  return false; // disable selection start (cursor change)
};

thumbElem.ondragstart = function() {
  return false;
};

thumbElem2.onmousedown = function(e) {

  // визначаємо метрики елементів
  var thumbAreaWidth2 = thumbArea2.offsetWidth;
  var thumbElemWidth2 = thumbElem2.offsetWidth;
  var thumbObjWidth  = thumbObj.offsetWidth;

  // визначаємо координати елементів
  var thumbAreaCoords2 = getCoords(thumbArea2);
  var thumbCoords2     = getCoords(thumbElem2);

  // призначаємо ширину полосок
  thumbLeftLine2.style.width  = thumbObjWidth + 'px';
  thumbRightLine2.style.width = thumbObjWidth + 'px';

  thumbLeftLine.style.width  = thumbObjWidth + 'px';
  thumbRightLine.style.width = thumbObjWidth + 'px';

  // задаємо початкове положення лівої полоски
  thumbLeftLine.style.left  = -thumbObjWidth + 'px';
  thumbLeftLine2.style.left  = -thumbObjWidth + 'px';

  // визначаємо зсув курсору відносно елементу
  var shiftX = e.pageX - thumbCoords2.left;

  document.onmousemove = function(e) {
    // розраховуємо нову координату повзунка
    var newLeft = e.pageX - shiftX - thumbAreaCoords2.left;

    if (newLeft < 0) {
      newLeft = 0;
    }
    // крайнє положення, де може бути повзунок
    var rightEdge = thumbAreaWidth2 - thumbElemWidth2;
    if (newLeft > rightEdge) {
      newLeft = rightEdge;
    }

    thumbElem2.style.left = newLeft + 'px';
    thumbLeftLine2.style.left = newLeft - thumbObjWidth + thumbElemWidth2 + 'px';
    thumbRightLine2.style.left = newLeft + 'px';

    var mult = newLeft*100/rightEdge;
    thumbObj.style.marginLeft = -((thumbObjWidth-thumbAreaWidth2)*mult/100) + 'px';

    thumbElem.style.left = newLeft + 'px';
    thumbLeftLine.style.left = newLeft - thumbObjWidth + thumbElemWidth2 + 'px';
    thumbRightLine.style.left = newLeft + 'px';
  }

  document.onmouseup = function() {
    document.onmousemove = document.onmouseup = null;
  };

  return false; // disable selection start (cursor change)
};

thumbElem2.ondragstart = function() {
  return false;
};
/* ↑↑↑ /THUMB BEHAVIOR ↑↑↑ */

/* ↓↓↓ THUMBAREA BEHAVIOR ↓↓↓ */
var headerHeight      = document.querySelector('.header').offsetHeight;
var tableHeaderHeight = document.getElementById('customers-table-tr').offsetHeight;
var thumbAreaHeight   = thumbArea.offsetHeight;

window.onscroll = function () {
  var tableTop     = document.querySelector('.table-wrapper').getBoundingClientRect().top;
  var tableBottom  = document.querySelector('.table-wrapper').getBoundingClientRect().bottom;
  var tableHeight  = document.querySelector('.table-wrapper').offsetHeight;
  var windowTop    = 0;
  var windowBottom = document.documentElement.clientHeight;

  // ширина полос повзунків збивається при fixed
  var thumbAreaWidth = thumbArea.offsetWidth;

  // перша полоса
  if (tableTop - headerHeight <= windowTop && tableTop - headerHeight >= -tableHeight + thumbAreaHeight*2 + tableHeaderHeight*3) {
    // прикріпити до верху області видимості
    thumbArea.style.position = "fixed";
    thumbArea.style.top = headerHeight + "px";
    thumbArea.style.width = thumbAreaWidth + "px";
    document.getElementById('thumbArea-buffer').style.display = "block";
  } else {
    // відкріпити від верху області видимості
    thumbArea.style.position = "relative";
    thumbArea.style.top = "0px";
    document.getElementById('thumbArea-buffer').style.display = "none";
  }

  // друга полоса
  if (tableBottom >= windowBottom && tableBottom <= windowBottom + tableHeight - thumbAreaHeight*2 - tableHeaderHeight*3) {
    // прикріпити до низу області видимості
    thumbArea2.style.position = "fixed";
    thumbArea2.style.top = windowBottom - thumbArea2.offsetHeight + "px";
    thumbArea2.style.width = thumbAreaWidth + "px";
  } else {
    // відкріпити від низу області видимості
    thumbArea2.style.position = "relative";
    thumbArea2.style.top = "0px";
  }
}
/* ↑↑↑ /THUMBAREA BEHAVIOR ↑↑↑ */

/* ↓↓↓ DATEPICKER ↓↓↓ */
$('#date-start').datepicker({
  firstDay: 1,
  dateFormat: "dd.mm.yy"});
$('#date-end').datepicker({
  firstDay: 1,
  dateFormat: "dd.mm.yy"});
/* ↑↑↑ DATEPICKER ↑↑↑ */

/* ↓↓↓ FUNCTIONS DECLARATIONS ↓↓↓ */
function getCoords(elem) {
  var box = elem.getBoundingClientRect();
  return {
    top    : box.top + pageYOffset,
    bottom : box.bottom + pageYOffset,
    left   : box.left + pageXOffset,
    right  : box.right + pageXOffset,
    height : box.bottom - box.top
  };
}

function removeParent(THIS){

	var tempAttr = $($($(THIS)[0]).parent()[0]).attr('data-parent-id') || $($(THIS)[0]).attr('data-parent-id');

	if (tempAttr == 'employer') {
		$($('#employerSelect + input')[0]).val('');
		localStorage.removeItem('filterMemory_employer');
	} else if (tempAttr == 'dateEnd' || tempAttr == 'dateStart') {
    localStorage.removeItem('filterMemory_dateStart');
    localStorage.removeItem('filterMemory_dateEnd');
    $('#date-end').val('');
    $('#date-start').val('');
	} else {
		var tempSelector = '.filters-label-wrapper select#' + tempAttr + ' option'
		$(tempSelector).attr('selected','').removeAttr('selected');
	  delete filterMemory[tempAttr];
	  localStorage.filterMemory = JSON.stringify(filterMemory);
	}

  $(THIS).parent().remove();
  controlFiltersAmount();
}

function toggleColumns(arg) {
  // вкл/викл колонку, записати зміни в localStorage
  var temp = 'isVisible' + storeg + 'TableColumn' + (arg + 1);
  var i;
  if(columnsSelect[arg].checked) {
    localStorage.setItem(temp,'false');
    tableTh[arg+1].style.display = 'none';
    for (i = 1; i < tableTd.length; i++) {
      tableTd[i].querySelectorAll('td')[arg+1].style.display = 'none';
    }
  } else {
    localStorage.setItem(temp,'true');
    tableTh[arg+1].style.display = '';
    for (i = 1; i < tableTd.length; i++) {
      tableTd[i].querySelectorAll('td')[arg+1].style.display = '';
    }
  }
}

function addFilterMarker(innerText, parentID) {
  var innerText = innerText,
      parentID  = parentID,
      dataAttr  = false;

  if (arguments[2] == 'start') {
    if (localStorage.filterMemory_dateEnd) {
      // видалити старий запис
      if($('span.filter-marker[data-filter-time=true]')) $('.filter-marker[data-filter-time=true]').remove();

      innerText = 'c ' + innerText + ' по ' + localStorage.filterMemory_dateEnd;
    } else {
      innerText = 'c ' + innerText;
    }
    dataAttr = true;
  }
  if (arguments[2] == 'end') {
    if (localStorage.filterMemory_dateStart) {
      // видалити старий запис
      if($('span.filter-marker[data-filter-time=true]')) $('.filter-marker[data-filter-time=true]').remove();

      innerText = 'c ' + localStorage.filterMemory_dateStart + ' по ' + innerText;
    } else {
      innerText = 'по ' + innerText;
    }
    dataAttr = true;
  }

  $('#filter-markers-panel').css({'display':'block'});
  $('#filter-markers-panel').append('<span class="filter-marker" data-parent-ID="' + parentID + '" data-filter-time="' + dataAttr + '">' + innerText + '<span class="filter-marker-close-btn" onclick=removeParent(this)><i class="fas fa-times"></i></span></span>');
}

function toggleClearFiltersBtn (arg) {
  var pos = '-190px';
  if (arg == 'on') pos = '3px';
  if (arg == 'off') {
    $('#clear-filters-btn').css({'display':'none'});
  }
  setTimeout(function(){
    $('#clear-filters-btn').css({'right':pos, 'display':'block'});
  },500);
}

function controlFiltersAmount() {
	if ($('.filter-marker').length < 2) {
		toggleClearFiltersBtn('off');
	}
	if ($('.filter-marker').length < 1) {
		$('#filter-markers-panel').css({'display':'none'});
	}
}
/* ↑↑↑ FUNCTIONS DECLARATIONS ↑↑↑ */