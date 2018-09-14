// made by waldteufel@ukr.net

// .forvalJs
// data-forvalJs-minLength='number'
// data-forvalJs-maxLength='number'
// data-forvalJs-type='email'           : x@x.x
// data-forvalJs-type='price'           : number.number / number
// data-forvalJs-type='password'        : number + symbol (length)
// data-forvalJs-type='confirmPassword' : password = password
// data-forvalJs-type='btn'???
// data-forvalJs-type='prompting'

$(document).ready(function(){
  /* ↓↓↓ GLOBAL VARIABLES ↓↓↓ */
  var minLengthController = true;
  /* ↑↑↑ /GLOBAL VARIABLES ↑↑↑ */
  // вимкнення стандартної валідації форм
  $('form.forvalJs').attr('novalidate','true');


  $("input.forvalJs").bind("blur keyup", function(event) {
    var tempTypeAttr      = $(this).attr('data-forvalJs-type'),
        tempMinLengthAttr = +$(this).attr('data-forvalJs-minLength'),
        tempMaxLengthAttr = +$(this).attr('data-forvalJs-maxLength'),
        tempValue         = $(this).val();

    if ( event.type == 'blur' ) {
      validateController(this, tempMinLengthAttr, tempMaxLengthAttr, tempTypeAttr, tempValue);
    } else if ( event.type == 'keyup' ) {
      if ( $(this).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0] || ($(this).next().next().next().next('.forvalJs[data-forvalJs-type="prompting"]')[0] && tempTypeAttr == 'password' ) ) {
        validateController(this, tempMinLengthAttr, tempMaxLengthAttr, tempTypeAttr, tempValue);
      }
    }
  });

  $('button.forvalJs').click(function(){ alert(1);
//       e.preventDefault();
  });

  /* ↓↓↓ FUNCTION DECLARATIONS ↓↓↓ */
  function validateController (elem, tempMinLengthAttr, tempMaxLengthAttr, tempTypeAttr, tempValue) {

    if ( isNumeric(tempMinLengthAttr) ) {
      // дії за наявності мінімальної довжини
      validateSimple(elem,tempMinLengthAttr,tempValue, tempTypeAttr);
      if ( minLengthController == false ) return
    }

    if ( isNumeric(tempMaxLengthAttr) ) {
      // дії за наявності максимальної довжини
    }

    if ( tempTypeAttr == 'email' ) {
      validateEmail(elem, tempValue);
    }

    if ( tempTypeAttr == 'price' ) {
      validatePrice(elem, tempValue);
    }

    if ( tempTypeAttr == 'password' ) {
      validatePassword(elem, tempValue);
    }

    if (tempTypeAttr == 'confirmPassword' ) {
      validateConfirmPassword(elem, tempValue);
    }
  }

  function validateSimple(elem, tempMinLengthAttr, tempValue, tempTypeAttr) {
    if ( tempMinLengthAttr == 0 && tempValue == '' ) {
      if ( $(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0] ) {
        $( $(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0] )
                  .text('this field can not be empty');
        return
      }
      minLengthController = false;
      drawPromptingElem(elem, 'this field can not be empty');
      return
    }
    if ( tempMinLengthAttr != 0 && (tempValue.length < tempMinLengthAttr) ) {
      if ( $(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0] ) {
        $( $(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0] )
                  .text('The length of the field is at least ' + tempMinLengthAttr + ' symbols');
        return
      }
      minLengthController = false;
      drawPromptingElem(elem, 'The length of the field is at least ' + tempMinLengthAttr + ' symbols');
      return
    }
    minLengthController = true;

    if (tempTypeAttr != 'email'&&
        tempTypeAttr != 'price' &&
        tempTypeAttr != 'password' &&
        tempTypeAttr != 'confirmPassword' ) {
    removePromptingElem ($(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0])
    }
  }

  function validateEmail(elem, tempValue) {
    if (tempValue.length == 0) return

    var charAmount = calculateCharsInStr(tempValue, '@');
    if (charAmount != 1) {
      if ($(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0]) {
        $($(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0]).text('must be a @-character (but only one)');
        return
      }
      drawPromptingElem(elem, 'must be a @-character (but only one)');
      return
    }
    var tempArr = tempValue.split('@');
    if(tempArr[0].length < 1 || tempArr[1].length < 1) {
      if ($(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0]) {
        $($(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0]).text('mail can not begin or end with a @-character');
        return
      }
      drawPromptingElem(elem, 'mail can not begin or end with a @-character');
      return
    }
    charAmount = calculateCharsInStr(tempArr[1], '.');
    if (charAmount != 1) {
      if ($(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0]) {
        $($(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0]).text('incorrect domain name');
        return
      }
      drawPromptingElem(elem, 'incorrect domain name');
      return
    }
    tempArr = tempArr[1].split('.');
    if(tempArr[0].length < 1 || tempArr[1].length < 1) {
      if ($(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0]) {
        $($(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0]).text('incorrect domain name');
        return
      }
      drawPromptingElem(elem, 'incorrect domain name');
      return
    }

    if ( minLengthController == false ) {
      return
    } else {
      removePromptingElem ($(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0])
    }
  }

  function validatePrice(elem, tempValue) {

    if (tempValue.length == 0) return

    if (calculateCharsInStr(tempValue, ' ') != 0) {
      if ($(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0]) {
        $($(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0]).text('the price should be a number (can only contain numbers and a dot)');
        return
      }
      drawPromptingElem(elem, 'the price should be a number (can only contain numbers and a dot)');
      return
    }

    var charAmount = calculateCharsInStr(tempValue, '.');

    if (charAmount < 1) {
      if(!isNumeric(tempValue)) {
        if ($(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0]) {
          $($(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0]).text('the price should be a number (can only contain numbers and a dot)');
          return
        }
        drawPromptingElem(elem, 'the price should be a number (can only contain numbers and a dot)');
        return
      }
    }

    if (charAmount > 1) {
      if ($(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0]) {
        $($(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0]).text('maybe only one point');
        return
      }
      drawPromptingElem(elem, 'maybe only one point');
      return
    }

    if (charAmount == 1) {
      var tempArr = tempValue.split('.');
      if(tempArr[0].length < 1 || tempArr[1].length < 1) {
        if ($(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0]) {
          $($(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0]).text('price can not begin or end with a point');
          return
        }
        drawPromptingElem(elem, 'price can not begin or end with a point');
        return
      }
      if(!isNumeric(tempArr[0]) || !isNumeric(tempArr[1])) {
        if ($(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0]) {
          $($(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0]).text('the price should be a number (can only contain numbers and a dot)');
          return
        }
        drawPromptingElem(elem, 'the price should be a number (can only contain numbers and a dot)');
        return
      }
    }
    if ( minLengthController == false ) {
      return
    } else {
      removePromptingElem ($(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0])
    }
  }

  function validatePassword(elem, tempValue) {
    console.log("validatePassword");

    if (tempValue.length == 0) return

    var hasNumber = hasSymbol = false;

    var tempArr = tempValue.split('');
    for (var i = 0; i < tempArr.length; i++) {
      if (isNumeric(tempArr[i])) {
        hasNumber = true;
      }
      if (!isNumeric(tempArr[i])) {
        hasSymbol = true;
      }
    }
    if (!hasSymbol || !hasNumber) {
      if ($(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0]) {
        $($(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0]).text('password must contain at least one digit and at least one character');
        return
      }
      drawPromptingElem(elem, 'password must contain at least one digit and at least one character');
      return
    }

// console.log("start");
    var tempSibling = $(elem).siblings('.forvalJs[data-forvalJs-type="confirmPassword"]')[0];
    var tempSiblingValue = $(tempSibling).val();
    if ( tempSiblingValue.length != 0 ) {
      if (tempSiblingValue != tempValue) {
// console.log("tempValue", tempValue);
// console.log("tempSiblingValue", tempSiblingValue);
        if ( $(tempSibling).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0] ) {
          $( $(tempSibling).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0] ).text('passwords do not match');
          return
        }
        drawPromptingElem(tempSibling, 'passwords do not match');
        return
      }
// console.log("end");
      removePromptingElem ($(tempSibling).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0])
    }

    if ( minLengthController == false ) {
      return
    } else {
      removePromptingElem ($(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0])
    }
  }

  function validateConfirmPassword(elem, tempValue) {
    console.log("validateConfirmPassword");
    var tempSiblingValue = $($(elem).siblings('.forvalJs[data-forvalJs-type="password"]')[0]).val();
    if (tempSiblingValue != tempValue) {
      if ( $(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0] ) {
        $( $(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0] ).text('passwords do not match');
        return
      }
      drawPromptingElem(elem, 'passwords do not match');
      return
    }
    if ( minLengthController == false ) {
      return
    } else {
      removePromptingElem ($(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0])
    }
  }

  function drawPromptingElem(elem, text) {
    var tempElHeight = getCoords(elem).height;

    $(elem).after('<span></span><div class="forvalJs" data-forvalJs-type="prompting"></div>');

    $(elem).next()
           .next('.forvalJs[data-forvalJs-type="prompting"]')
           .css({'height'        : tempElHeight,
                 'margin-bottom' : '15px'})
           .text(text);
    $(elem).css({'transition'    :'margin-bottom .5s',
                 'margin-bottom' : '2px'});
  }

  function removePromptingElem (elem) {
    $(elem).css({'height'        : 0,
                 'margin-bottom' : 0});
    $(elem).prev()
           .prev()
           .css({'margin-bottom':'15px'});
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

  function sleep(ms) {
    ms += new Date().getTime();
    while (new Date() < ms){}
  }

  function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n)
  }
  /* ↑↑↑ /FUNCTION DECLARATIONS ↑↑↑ */
})



    // if ( $(this).attr('data-forvalJs-minLength') ) {
    //   // дії за наявності мінімальної довжини
    //   if ($(this).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0]) {
    //     validateSimple(this, tempMinLengthAttr, tempValue);
    //   }
    // }

    // if ( isNumeric(tempMaxLengthAttr) ) {
    //   // дії за наявності максимальної довжини
    // }

    // if ( tempTypeAttr == 'email' ) {
    //   if ($(this).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0]) {
    //     validateEmail(this, tempValue);
    //   }
    // }

    // if ( tempTypeAttr == 'price' ) {
    //   if ($(this).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0]) {
    //     validatePrice(this, tempValue);
    //   }
    // }