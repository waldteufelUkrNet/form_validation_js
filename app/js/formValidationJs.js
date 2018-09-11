// made by waldteufel@ukr.net

// .forvalJs-notEmpty


$(document).ready(function(){

  $('.forvalJs-notEmpty').blur(function(){
    if ($(this).val().length < 5) {
      if ($(this).next().next('.forvalJs-prompting')[0]) return;
      drawPromptingElem(this, 'The length of the field is at least 5 symbols');
    }
  });

  $('.forvalJs-notEmpty').keyup(function(){
    if ($(this).val().length >= 5) {
      if ($(this).next().next('.forvalJs-prompting')[0]) {
        removePromptingElem($(this).next().next('.forvalJs-prompting')[0]);
      }
    }
  });

  $('.forvalJs-email').blur(function(){
    validateEmail(this)
  });

  $('.forvalJs-email').keyup(function(){
    //validateEmail(this);
  });

});

function validateEmail(elem) {
  var tempVal = $(elem).val();
  var charAmount = calculateCharsInStr(tempVal, '@');
  if (charAmount != 1) {
    if ($(elem).next().next('.forvalJs-prompting')[0]) {
      return
    }
    drawPromptingElem(elem, 'must be a @-character (but only one)');
    return
  }
  var tempArr = tempVal.split('@');
  if(tempArr[0].length < 1 || tempArr[1].length < 1) {
    if ($(elem).next().next('.forvalJs-prompting')[0]) {
      return
    }
    drawPromptingElem(elem, 'mail can not begin and end with a @-character');
    return
  }
  charAmount = calculateCharsInStr(tempArr[1], '.');
  if (charAmount != 1) {
    if ($(elem).next().next('.forvalJs-prompting')[0]) {
      return
    }
    drawPromptingElem(elem, 'incorrect domain name');
    return
  }
  tempArr = tempArr[1].split('.');
  if(tempArr[0].length < 1 || tempArr[1].length < 1) {
    if ($(elem).next().next('.forvalJs-prompting')[0]) {
      return
    }
    drawPromptingElem(elem, 'incorrect domain name');
    return
  }

}

function drawPromptingElem(elem, text) {
  var tempEl       = elem;
  var tempElHeight = getCoords(tempEl).height;

  $(tempEl).after("<span></span><div class='forvalJs-prompting'></div>");

  $(tempEl).next().next('.forvalJs-prompting').css({'height'           : 0,
                                                    'overflow'         : 'hidden',
                                                    'background-color' : 'rgba(255,0,0,.2)',
                                                    'border-left'      : '3px solid red',
                                                    'box-sizing'       : 'border-box',
                                                    'padding-left'     : '6px',
                                                    'display'          : 'block',
                                                    'transition'       : 'height .5s, margin-bottom .5s'
                                                  })
                                              .text(text)
                                              .css({'height'        : tempElHeight,
                                                    'margin-bottom' : '15px'
                                                  });
  $(tempEl).css({'transition':'margin-bottom .5s', 'margin-bottom' : '2px'});
}

function removePromptingElem (elem) {
  $(elem).css({'height'        : 0,
               'margin-bottom' : 0
             });
  $(elem).prev().prev().css({'margin-bottom':'15px'});
  setTimeout(function(){
    $(elem).prev().remove();
    $(elem).remove();
  },500);
}

function getCoords(elem) {
  var box = elem.getBoundingClientRect();
  return {
    top    : box.top + pageYOffset,
    bottom : box.bottom + pageYOffset,
    left   : box.left + pageXOffset,
    right  : box.right + pageXOffset,
    height : box.bottom - box.top,
    width  : box.right - box.left
  };
}

function calculateCharsInStr(str, char) {
  var pos = count = 0;
  while(true) {
    var foundPos = str.indexOf(char, pos);
    if (foundPos == -1) break;
    count++;
    pos = foundPos + 1;
  }
  return count;
}

// function redrawPromptingElems() {
//   var arrOfPromptingElems = $('.forvalJs-prompting');

//   for (var i = 0; i < arrOfPromptingElems.length; i++) {

//     var tempElTop  = getCoords(arrOfPromptingElems[i]).top;

//     $(arrOfPromptingElems[i]).css({'top'  : tempElTop + 30 })
//   }
// }


// $("input[id='form-email']").width();
// console.log($("input[id='form-email']").outerWidth());

// $(document).ready(function(){

//   /* ↓↓↓ form validation ↓↓↓ */
//   $('button[type="submit"]').click(function(e){

//     if ($('#select-country').val() == 0) {
//       e.preventDefault();
//       $('#select-info').css({'transition':'height .5s','height':'30px'});
//     }


//     if ($('#input-password').val() == 0) {
//       e.preventDefault();
//       $('#input-password-info').text('Введите пароль!').css({'transition':'height .5s','height':'30px'});
//     }
//     if ($('#input-password').val() !== $('#input-confirm-pass').val()) {
//       e.preventDefault();
//       $('#input-password-info').text('Пароли не совпадают!').css({'transition':'height .5s','height':'30px'});
//     }


//     if ($('#input-country-code').val() == 0) {
//       e.preventDefault();
//       $('#input-phone-info').css({'transition':'height .5s','height':'30px'});
//     }
//     if ($('#input-company-code').val() == 0) {
//       e.preventDefault();
//       $('#input-phone-info').css({'transition':'height .5s','height':'30px'});
//     }
//     if ($('#input-company-code').val() == 0 || $('#input-phone').val().length < 7) {
//       e.preventDefault();
//       $('#input-phone').css({'transition':'height .5s','height':'30px'});
//     }


//     var temp = $('#input-email').val();
//     if (temp.indexOf('@') <= 0 || temp.indexOf('@') > temp.lastIndexOf('.')) {
//       e.preventDefault();
//       $('#input-email-info').css({'transition':'height .5s','height':'30px'});
//     }


//     if ($('#input-firstName').val() == 0) {
//       e.preventDefault();
//       $('#input-firstName-info').css({'transition':'height .5s','height':'30px'});
//     }

//     if ($('#input-lastName').val() == 0) {
//       e.preventDefault();
//       $('#input-lastName-info').css({'transition':'height .5s','height':'30px'});
//     }

//   });



//   $('#input-password').change(function(){
//     if ($(this).val() === $('#input-confirm-pass').val()) {
//       $('#input-password-info').css({'transition':'height .5s','height':'0px'});
//     }
//   });
//   $('#input-confirm-pass').change(function(){
//     if ($(this).val() === $('#input-password').val()) {
//       $('#input-password-info').css({'transition':'height .5s','height':'0px'});
//     }
//   });


//   $('#input-country-code, #input-company-code, #input-phone').change(function(){
//     if ($('#input-country-code').val() != 0 && $('#input-company-code').val() != 0 && $('#input-phone').val() != 0 && ($('#input-phone').val().length >= 7)) {
//      $('#input-phone-info').css({'transition':'height .5s','height':'0px'});
//     }
//   });


//   $('#input-email').change(function(e){
//     var temp = $('#input-email').val();
//     if (temp.indexOf('@') > 0 && temp.indexOf('@') < temp.lastIndexOf('.')) {
//       $('#input-email-info').css({'transition':'height .5s','height':'0px'});
//     }
//   });


//   $('#input-firstName').change(function(e){
//     if ($('#input-firstName').val() != 0 ) {
//       $('#input-firstName-info').css({'transition':'height .5s','height':'0px'});
//     }
//   });


//   $('#input-lastName').change(function(e){
//     if ($('#input-lastName').val() != 0 ) {
//       $('#input-lastName-info').css({'transition':'height .5s','height':'0px'});
//     }
//   });
//   /* ↑↑↑ /form validation ↑↑↑ */

// });