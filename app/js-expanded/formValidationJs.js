// made by waldteufel@ukr.net

// .forvalJs-notEmpty + data-forvalJs-notEmpty='number'
// .forvalJs-email                                                           : x@x.x
// .forvalJs-price                                                           : number.number / number
// .forvalJs-password (.forvalJs-notEmpty + data-forvalJs-notEmpty='number') : number + symbol (length)
// .forvalJs-confirmPassword                                                 : password = password

$(document).ready(function(){

  $('.forvalJs-notEmpty').blur(function(){
    validateNotEmpty (this);
  });

  $('.forvalJs-notEmpty').keyup(function(){
    if ($(this).next().next('.forvalJs-prompting')[0]) {
      validateNotEmpty (this);
    }
  });

  $('.forvalJs-email').blur(function(){
    validateEmail(this)
  });

  $('.forvalJs-email').keyup(function(){
    if ($(this).next().next('.forvalJs-prompting')[0]) {
      validateEmail (this);
    }
  });

  $('.forvalJs-price').blur(function(){
    validatePrice(this)
  });

  $('.forvalJs-price').keyup(function(){
    if ($(this).next().next('.forvalJs-prompting')[0]) {
      validatePrice (this);
    }
  });

  $('.forvalJs-password').blur(function(){
    validatePassword(this)
  });

  $('.forvalJs-password').keyup(function(){
    if ($(this).next().next('.forvalJs-prompting')[0]) {
      validatePassword (this);
    }
  });

  $('.forvalJs-confirmPassword').blur(function(){
    validateConfirmPassword(this)
  });

  $('.forvalJs-confirmPassword').keyup(function(){
    if ($(this).next().next('.forvalJs-prompting')[0]) {
      validateConfirmPassword (this);
    }
  });

});

function validateNotEmpty (elem) {
  var tempDataVal = +$(elem).attr('data-forvalJs-notEmpty') || 0;
  var tempVal = $(elem).val();

  if (tempDataVal == 0 && tempVal == '' ) {
    if ($(elem).next().next('.forvalJs-prompting')[0]) {
      $($(elem).next().next('.forvalJs-prompting')[0]).text('this field can not be empty');
      return
    }
    drawPromptingElem(elem, 'this field can not be empty');
    return
  }
  if (tempDataVal != 0 && $(elem).val().length < tempDataVal) {
    if ($(elem).next().next('.forvalJs-prompting')[0]) {
      $($(elem).next().next('.forvalJs-prompting')[0]).text('The length of the field is at least ' + tempDataVal + ' symbols');
      return
    }
    drawPromptingElem(elem, 'The length of the field is at least ' + tempDataVal + ' symbols');
    return
  }
  removePromptingElem($(elem).next().next('.forvalJs-prompting')[0]);
}

function validateEmail(elem) {
  var tempVal = $(elem).val();

  if (tempVal.length == 0) return

  var charAmount = calculateCharsInStr(tempVal, '@');
  if (charAmount != 1) {
    if ($(elem).next().next('.forvalJs-prompting')[0]) {
      $($(elem).next().next('.forvalJs-prompting')[0]).text('must be a @-character (but only one)');
      return
    }
    drawPromptingElem(elem, 'must be a @-character (but only one)');
    return
  }
  var tempArr = tempVal.split('@');
  if(tempArr[0].length < 1 || tempArr[1].length < 1) {
    if ($(elem).next().next('.forvalJs-prompting')[0]) {
      $($(elem).next().next('.forvalJs-prompting')[0]).text('mail can not begin or end with a @-character');
      return
    }
    drawPromptingElem(elem, 'mail can not begin or end with a @-character');
    return
  }
  charAmount = calculateCharsInStr(tempArr[1], '.');
  if (charAmount != 1) {
    if ($(elem).next().next('.forvalJs-prompting')[0]) {
      $($(elem).next().next('.forvalJs-prompting')[0]).text('incorrect domain name');
      return
    }
    drawPromptingElem(elem, 'incorrect domain name');
    return
  }
  tempArr = tempArr[1].split('.');
  if(tempArr[0].length < 1 || tempArr[1].length < 1) {
    if ($(elem).next().next('.forvalJs-prompting')[0]) {
      $($(elem).next().next('.forvalJs-prompting')[0]).text('incorrect domain name');
      return
    }
    drawPromptingElem(elem, 'incorrect domain name');
    return
  }
  removePromptingElem ($(elem).next().next('.forvalJs-prompting')[0])
}

function validatePrice(elem) {
  var tempVal = $(elem).val();

  if (tempVal.length == 0) return

  if (calculateCharsInStr(tempVal, ' ') != 0) {
    if ($(elem).next().next('.forvalJs-prompting')[0]) {
      $($(elem).next().next('.forvalJs-prompting')[0]).text('the price should be a number (can only contain numbers and a dot)');
      return
    }
    drawPromptingElem(elem, 'the price should be a number (can only contain numbers and a dot)');
    return
  }

  var charAmount = calculateCharsInStr(tempVal, '.');

  if (charAmount < 1) {
    if(!isNumeric(tempVal)) {
      if ($(elem).next().next('.forvalJs-prompting')[0]) {
        $($(elem).next().next('.forvalJs-prompting')[0]).text('the price should be a number (can only contain numbers and a dot)');
        return
      }
      drawPromptingElem(elem, 'the price should be a number (can only contain numbers and a dot)');
      return
    }
  }

  if (charAmount > 1) {
    if ($(elem).next().next('.forvalJs-prompting')[0]) {
      $($(elem).next().next('.forvalJs-prompting')[0]).text('maybe only one point');
      return
    }
    drawPromptingElem(elem, 'maybe only one point');
    return
  }

  if (charAmount == 1) {
    var tempArr = tempVal.split('.');
    if(tempArr[0].length < 1 || tempArr[1].length < 1) {
      if ($(elem).next().next('.forvalJs-prompting')[0]) {
        $($(elem).next().next('.forvalJs-prompting')[0]).text('price can not begin or end with a point');
        return
      }
      drawPromptingElem(elem, 'price can not begin or end with a point');
      return
    }
    if(!isNumeric(tempArr[0]) || !isNumeric(tempArr[1])) {
      if ($(elem).next().next('.forvalJs-prompting')[0]) {
        $($(elem).next().next('.forvalJs-prompting')[0]).text('the price should be a number (can only contain numbers and a dot)');
        return
      }
      drawPromptingElem(elem, 'the price should be a number (can only contain numbers and a dot)');
      return
    }
  }
  removePromptingElem ($(elem).next().next('.forvalJs-prompting')[0])
}

function validatePassword(elem) {
  var tempVal   = $(elem).val();
  var hasNumber = hasSymbol = false;
  var tempArr   = tempVal.split('');
  for (var i = 0; i < tempArr.length; i++) {
    if (isNumeric(tempArr[i])) {
      hasNumber = true;
    }
    if (!isNumeric(tempArr[i])) {
      hasSymbol = true;
    }
  }
  if (!hasSymbol || !hasNumber) {
    if ($(elem).next().next('.forvalJs-prompting')[0]) {
      $($(elem).next().next('.forvalJs-prompting')[0]).text('The password must contain at least one digit and at least one character');
      return
    }
    drawPromptingElem(elem, 'password must contain at least one digit and at least one character');
    return
  }
}

function validateConfirmPassword(elem) {
  var tempVal        = $(elem).val();
  console.log("tempVal", tempVal);
  var tempSiblingVal = $($(elem).siblings('.forvalJs-password')[0]).val();
  console.log("tempSiblingVal", tempSiblingVal);
  if (tempSiblingVal != tempVal) {
    if ($(elem).next().next('.forvalJs-prompting')[0]) {
      $($(elem).next().next('.forvalJs-prompting')[0]).text('passwords do not match');
      return
    }
    drawPromptingElem(elem, 'passwords do not match');
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
                                                    'user-select'      : 'none',
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

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}

//   /* ↓↓↓ form validation ↓↓↓ */
//   $('button[type="submit"]').click(function(e){

//     var temp = $('#input-email').val();
//     if (temp.indexOf('@') <= 0 || temp.indexOf('@') > temp.lastIndexOf('.')) {
//       e.preventDefault();
//       $('#input-email-info').css({'transition':'height .5s','height':'30px'});
//     }
//   });


//   $('#input-email').change(function(e){
//     var temp = $('#input-email').val();
//     if (temp.indexOf('@') > 0 && temp.indexOf('@') < temp.lastIndexOf('.')) {
//       $('#input-email-info').css({'transition':'height .5s','height':'0px'});
//     }
//   });