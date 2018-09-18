// form validation js v 20180918-1
// made by waldteufel@ukr.net

// CLASS NAME:
// .forvalJs

// LANGUAGE SUPPORT - form attribute
// data-forvalJs-lang='ua/ru/en'

// INPUT DATA-ATTRIBUTES:
// data-forvalJs-minLength='number'     : min length
// data-forvalJs-type='notEmpty'        : for "not empty"-prompting use data-forvalJs-minLength attribute
// data-forvalJs-type='email'           : x@x.x
// data-forvalJs-type='price'           : number.number / number
// data-forvalJs-type='password'        : number + symbol (length)
// data-forvalJs-type='confirmPassword' : password = password
// data-forvalJs-type='prompting'       : type for prompting

// BUTTON TYPES
// type='submit'
// type='reset'

$(document).ready(function(){
  /* ↓↓↓ GLOBAL VARIABLES ↓↓↓ */
  var minLengthController = true,
      maxLengthController = true,
      lang                = $('form.forvalJs').attr('data-forvalJs-lang'),
      tempText;
  /* ↑↑↑ /GLOBAL VARIABLES ↑↑↑ */
  // вимкнення стандартної валідації форм
  $('form.forvalJs').attr('novalidate','true');

  // language switch
  if ( lang == 'ua' ) {
    $('input.forvalJs[data-forvalJs-type="notEmpty"]').attr('placeholder','поле не пусте!');
    $('input.forvalJs[data-forvalJs-type="email"]').attr('placeholder','введіть Вашу пошту');
    $('input.forvalJs[data-forvalJs-type="price"]').attr('placeholder','введіть ціну');
    $('input.forvalJs[data-forvalJs-type="password"]').attr('placeholder','введіть пароль');
    $('input.forvalJs[data-forvalJs-type="confirmPassword"]').attr('placeholder','підтвердіть пароль');
    $('button.forvalJs[type="submit"]').text('відправити');
    $('button.forvalJs[type="reset"]').text('скинути');
  } else if ( lang == 'ru' ) {
    $('input.forvalJs[data-forvalJs-type="notEmpty"]').attr('placeholder','поле не пустое!');
    $('input.forvalJs[data-forvalJs-type="email"]').attr('placeholder','введите Вашу почту');
    $('input.forvalJs[data-forvalJs-type="price"]').attr('placeholder','введите цену');
    $('input.forvalJs[data-forvalJs-type="password"]').attr('placeholder','введите пароль');
    $('input.forvalJs[data-forvalJs-type="confirmPassword"]').attr('placeholder','подтвердите пароль');
    $('button.forvalJs[type="submit"]').text('отправить');
    $('button.forvalJs[type="reset"]').text('сбросить');
  } else {
    $('input.forvalJs[data-forvalJs-type="notEmpty"]').attr('placeholder','not empty');
    $('input.forvalJs[data-forvalJs-type="email"]').attr('placeholder','enter your email');
    $('input.forvalJs[data-forvalJs-type="price"]').attr('placeholder','enter your price');
    $('input.forvalJs[data-forvalJs-type="password"]').attr('placeholder','enter your password');
    $('input.forvalJs[data-forvalJs-type="confirmPassword"]').attr('placeholder','confirm your password');
  }

  $("input.forvalJs").bind("blur keyup", function(event) {
    var tempTypeAttr      = $(this).attr('data-forvalJs-type'),
        tempMinLengthAttr = +$(this).attr('data-forvalJs-minLength'),
        tempMaxLengthAttr = +$(this).attr('data-forvalJs-maxLength'),
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

  $('button.forvalJs').click(function(event){
    var tempTypeAttr = $(this).attr('type'),
        tempArr      = $('input.forvalJs');

    if ( tempTypeAttr == 'submit' ) {
      if ( $('.forvalJs[data-forvalJs-type="prompting"]').length != 0 ) {
        event.preventDefault();
      }
      for (var i = 0; i < tempArr.length; i++) {
        if ( $(tempArr[i]).attr('data-forvalJs-minLength') && $(tempArr[i]).val().length == 0 ) {
          event.preventDefault();
          if ( $(tempArr[i]).next().next('.forvalJs[data-forvalJs-type="prompting"]').length == 0 ) {
            if ( lang == 'ua' ) {
              tempText = 'це поле не може бути пустим';
            } else if ( lang == 'ru' ) {
              tempText = 'это поле не может быть пустым';
            } else {
              tempText = 'this field can not be empty';
            }
            drawPromptingElem(tempArr[i], tempText);
          }
        }
      }
    }

    if ( tempTypeAttr == 'reset' ) {
      var tempPromptingArr = $('.forvalJs[data-forvalJs-type="prompting"]');
      for (var i = 0; i < tempPromptingArr.length; i++) {
        removePromptingElem (tempPromptingArr[i])
      }
    }
  });

  /* ↓↓↓ FUNCTION DECLARATIONS ↓↓↓ */
  function validateController (elem, tempMinLengthAttr, tempMaxLengthAttr, tempTypeAttr, tempValue) {

    if ( isNumeric(tempMinLengthAttr) ) {
      // дії за наявності мінімальної довжини
      validateSimple(elem, tempMinLengthAttr, tempMaxLengthAttr, tempValue, tempTypeAttr);
      if ( minLengthController == false ) return
    }

    if ( isNumeric(tempMaxLengthAttr) ) {
      // дії за наявності максимальної довжини
      validateSimple(elem, tempMinLengthAttr, tempMaxLengthAttr, tempValue, tempTypeAttr);
      if ( maxLengthController == false ) return
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

  function validateSimple(elem, tempMinLengthAttr, tempMaxLengthAttr, tempValue, tempTypeAttr) {

    if ( isNumeric(tempMinLengthAttr) ) {
      if ( tempMinLengthAttr == 0 && tempValue == '' ) {
        if ( $(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0] ) {
          if ( lang == 'ua' ) {
            tempText = 'це поле не може бути пустим';
          } else if ( lang == 'ru' ) {
            tempText = 'это поле не может быть пустым';
          } else {
            tempText = 'this field can not be empty';
          }
          $( $(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0] )
                    .text(tempText);
          return
        }
        minLengthController = false;
          if ( lang == 'ua' ) {
            tempText = 'це поле не може бути пустим';
          } else if ( lang == 'ru' ) {
            tempText = 'это поле не может быть пустым';
          } else {
            tempText = 'this field can not be empty';
          }
        drawPromptingElem(elem, tempText);
        return
      }
      if ( tempMinLengthAttr != 0 && (tempValue.length < tempMinLengthAttr) ) {
        if ( $(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0] ) {
          if ( lang == 'ua' ) {
            tempText = 'довжина поля мінімум ' + tempMinLengthAttr + ' символи (-ів)'
          } else if ( lang == 'ru' ) {
            tempText = 'длинна поля минимум ' + tempMinLengthAttr + ' символов'
          } else {
            tempText = 'The length of the field is at least ' + tempMinLengthAttr + ' symbols'
          }
          $( $(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0] )
                    .text(tempText);
          return
        }
        minLengthController = false;
        if ( lang == 'ua' ) {
          tempText = 'довжина поля мінімум ' + tempMinLengthAttr + ' символи (-ів)'
        } else if ( lang == 'ru' ) {
          tempText = 'длинна поля минимум ' + tempMinLengthAttr + ' символов'
        } else {
          tempText = 'The length of the field is at least ' + tempMinLengthAttr + ' symbols'
        }
        drawPromptingElem(elem, tempText);
        return
      }
      minLengthController = true;
    }

    if ( isNumeric(tempMaxLengthAttr) ) {
      if ( tempValue.length > tempMaxLengthAttr ) {
        if ( $(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0] ) {
          if ( lang == 'ua' ) {
            tempText = 'довжина поля максимум ' + tempMaxLengthAttr + ' символи (-ів)'
          } else if ( lang == 'ru' ) {
            tempText = 'длинна поля максимум ' + tempMaxLengthAttr + ' символов'
          } else {
            tempText = 'the length of the field can not exceed ' + tempMaxLengthAttr + ' characters'
          }
          $( $(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0] )
                    .text(tempText);
          return
        }
        maxLengthController = false;
        if ( lang == 'ua' ) {
          tempText = 'довжина поля максимум ' + tempMaxLengthAttr + ' символи (-ів)'
        } else if ( lang == 'ru' ) {
          tempText = 'длинна поля максимум ' + tempMaxLengthAttr + ' символов'
        } else {
          tempText = 'the length of the field can not exceed ' + tempMaxLengthAttr + ' characters'
        }
        drawPromptingElem(elem, tempText);
        return
      }
      maxLengthController = true;
    }

    if ( tempTypeAttr == 'email' ||
         tempTypeAttr == 'price' ||
         tempTypeAttr == 'password' ||
         tempTypeAttr == 'confirmPassword') {

      if ( tempMinLengthAttr != 0 && (tempValue.length < tempMinLengthAttr) ) { console.log(2);
        minLengthController = false;
        return
      }
    }

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
        if ( lang == 'ua' ) {
          tempText = 'повинен бути символ @ (але тільки один)'
        } else if ( lang == 'ru' ) {
          tempText = 'должен быть символ @ (но только один)'
        } else {
          tempText = 'must be a @-character (but only one)'
        }
        $($(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0]).text(tempText);
        return
      }
      if ( lang == 'ua' ) {
        tempText = 'повинен бути символ @ (але тільки один)'
      } else if ( lang == 'ru' ) {
        tempText = 'должен быть символ @ (но только один)'
      } else {
        tempText = 'must be a @-character (but only one)'
      }
      drawPromptingElem(elem, tempText);
      return
    }
    var tempArr = tempValue.split('@');
    if(tempArr[0].length < 1 || tempArr[1].length < 1) {
      if ($(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0]) {
        if ( lang == 'ua' ) {
          tempText = 'пошта не може починатися або закінчуватися символом @'
        } else if ( lang == 'ru' ) {
          tempText = 'почта не может начинаться или заканчиваться символом @'
        } else {
          tempText = 'mail can not begin or end with a @-character'
        }
        $($(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0]).text(tempText);
        return
      }
      if ( lang == 'ua' ) {
        tempText = 'пошта не може починатися або закінчуватися символом @'
      } else if ( lang == 'ru' ) {
        tempText = 'почта не может начинаться или заканчиваться символом @'
      } else {
        tempText = 'mail can not begin or end with a @-character'
      }
      drawPromptingElem(elem, tempText);
      return
    }
    charAmount = calculateCharsInStr(tempArr[1], '.');
    if (charAmount != 1) {
      if ($(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0]) {
        if ( lang == 'ua' ) {
          tempText = "некоректне доменне ім'я"
        } else if ( lang == 'ru' ) {
          tempText = 'некорректное доменное имя'
        } else {
          tempText = 'incorrect domain name'
        }
        $($(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0]).text(tempText);
        return
      }
      if ( lang == 'ua' ) {
        tempText = "некоректне доменне ім'я"
      } else if ( lang == 'ru' ) {
        tempText = 'некорректное доменное имя'
      } else {
        tempText = 'incorrect domain name'
      }
      drawPromptingElem(elem, tempText);
      return
    }
    tempArr = tempArr[1].split('.');
    if(tempArr[0].length < 1 || tempArr[1].length < 1) {
      if ($(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0]) {
        if ( lang == 'ua' ) {
          tempText = "некоректне доменне ім'я"
        } else if ( lang == 'ru' ) {
          tempText = 'некорректное доменное имя'
        } else {
          tempText = 'incorrect domain name'
        }
        $($(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0]).text(tempText);
        return
      }
      if ( lang == 'ua' ) {
        tempText = "некоректне доменне ім'я"
      } else if ( lang == 'ru' ) {
        tempText = 'некорректное доменное имя'
      } else {
        tempText = 'incorrect domain name'
      }
      drawPromptingElem(elem, tempText);
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
        if ( lang == 'ua' ) {
          tempText = 'ціна повинна бути числом (може мати тільки цифри та крапку)'
        } else if ( lang == 'ru' ) {
          tempText = 'цена должна быть числом (может содержать только цифры и точку)'
        } else {
          tempText = 'the price should be a number (can only contain numbers and a dot)'
        }
        $($(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0]).text(tempText);
        return
      }
      if ( lang == 'ua' ) {
        tempText = 'ціна повинна бути числом (може мати тільки цифри та крапку)'
      } else if ( lang == 'ru' ) {
        tempText = 'цена должна быть числом (может содержать только цифры и точку)'
      } else {
        tempText = 'the price should be a number (can only contain numbers and a dot)'
      }
      drawPromptingElem(elem, tempText);
      return
    }

    var charAmount = calculateCharsInStr(tempValue, '.');

    if (charAmount < 1) {
      if(!isNumeric(tempValue)) {
        if ($(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0]) {
          if ( lang == 'ua' ) {
            tempText = 'ціна повинна бути числом (може мати тільки цифри та крапку)'
          } else if ( lang == 'ru' ) {
            tempText = 'цена должна быть числом (может содержать только цифры и точку)'
          } else {
            tempText = 'the price should be a number (can only contain numbers and a dot)'
          }
          $($(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0]).text(tempText);
          return
        }
        if ( lang == 'ua' ) {
          tempText = 'ціна повинна бути числом (може мати тільки цифри та крапку)'
        } else if ( lang == 'ru' ) {
          tempText = 'цена должна быть числом (может содержать только цифры и точку)'
        } else {
          tempText = 'the price should be a number (can only contain numbers and a dot)'
        }
        drawPromptingElem(elem, tempText);
        return
      }
    }

    if (charAmount > 1) {
      if ($(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0]) {
        if ( lang == 'ua' ) {
          tempText = 'може бути тыльки одна крапка'
        } else if ( lang == 'ru' ) {
          tempText = 'может быть только одна точка'
        } else {
          tempText = 'maybe only one point'
        }
        $($(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0]).text(tempText);
        return
      }
      if ( lang == 'ua' ) {
        tempText = 'може бути тыльки одна крапка'
      } else if ( lang == 'ru' ) {
        tempText = 'может быть только одна точка'
      } else {
        tempText = 'maybe only one point'
      }
      drawPromptingElem(elem, tempText);
      return
    }

    if (charAmount == 1) {
      var tempArr = tempValue.split('.');
      if(tempArr[0].length < 1 || tempArr[1].length < 1) {
        if ($(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0]) {
          if ( lang == 'ua' ) {
            tempText = 'ціна не може починатися або закінчуватися крапкою'
          } else if ( lang == 'ru' ) {
            tempText = 'цена не может начинаться или заканчиваться точкой'
          } else {
            tempText = 'price can not begin or end with a point'
          }
          $($(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0]).text(tempText);
          return
        }
        if ( lang == 'ua' ) {
          tempText = 'ціна не може починатися або закінчуватися крапкою'
        } else if ( lang == 'ru' ) {
          tempText = 'цена не может начинаться или заканчиваться точкой'
        } else {
          tempText = 'price can not begin or end with a point'
        }
        drawPromptingElem(elem, tempText);
        return
      }
      if(!isNumeric(tempArr[0]) || !isNumeric(tempArr[1])) {
        if ($(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0]) {
          if ( lang == 'ua' ) {
            tempText = 'ціна повинна бути числом (може мати тільки цифри та крапку)'
          } else if ( lang == 'ru' ) {
            tempText = 'цена должна быть числом (может содержать только цифры и точку)'
          } else {
            tempText = 'the price should be a number (can only contain numbers and a dot)'
          }
          $($(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0]).text(tempText);
          return
        }
        if ( lang == 'ua' ) {
          tempText = 'ціна повинна бути числом (може мати тільки цифри та крапку)'
        } else if ( lang == 'ru' ) {
          tempText = 'цена должна быть числом (может содержать только цифры и точку)'
        } else {
          tempText = 'the price should be a number (can only contain numbers and a dot)'
        }
        drawPromptingElem(elem, tempText);
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
        if ( lang == 'ua' ) {
          tempText = 'пароль повинен мати мінімум одну цифру і один символ'
        } else if ( lang == 'ru' ) {
          tempText = 'пароль должен иметь минимум одну цифру и один символ'
        } else {
          tempText = 'password must contain at least one digit and at least one character'
        }
        $($(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0]).text(tempText);
        return
      }
      if ( lang == 'ua' ) {
        tempText = 'пароль повини мати мінімум одну цифру і символ'
      } else if ( lang == 'ru' ) {
        tempText = 'пароль должен иметь минимум одну цифру и один символ'
      } else {
        tempText = 'password must contain at least one digit and at least one character'
      }
      drawPromptingElem(elem, tempText);
      return
    }

    var tempSibling = $(elem).siblings('.forvalJs[data-forvalJs-type="confirmPassword"]')[0];
    var tempSiblingValue = $(tempSibling).val();
    if ( tempSiblingValue.length != 0 ) {
      if (tempSiblingValue != tempValue) {
        if ( $(tempSibling).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0] ) {
          if ( lang == 'ua' ) {
            tempText = 'паролі не співпадають'
          } else if ( lang == 'ru' ) {
            tempText = 'пароли не совпадают'
          } else {
            tempText = 'passwords do not match'
          }
          $( $(tempSibling).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0] ).text(tempText);
          return
        }
        if ( lang == 'ua' ) {
          tempText = 'паролі не співпадають'
        } else if ( lang == 'ru' ) {
          tempText = 'пароли не совпадают'
        } else {
          tempText = 'passwords do not match'
        }
        drawPromptingElem(tempSibling, tempText);
        return
      }
      removePromptingElem ($(tempSibling).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0])
    }

    if ( minLengthController == false ) {
      return
    } else {
      removePromptingElem ($(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0])
    }
  }

  function validateConfirmPassword(elem, tempValue) {
    var tempSiblingValue = $($(elem).siblings('.forvalJs[data-forvalJs-type="password"]')[0]).val();
    if (tempSiblingValue != tempValue) {
      if ( $(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0] ) {
        if ( lang == 'ua' ) {
          tempText = 'паролі не співпадають'
        } else if ( lang == 'ru' ) {
          tempText = 'пароли не совпадают'
        } else {
          tempText = 'passwords do not match'
        }
        $( $(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0] ).text(tempText);
        return
      }
      if ( lang == 'ua' ) {
        tempText = 'паролі не співпадають'
      } else if ( lang == 'ru' ) {
        tempText = 'пароли не совпадают'
      } else {
        tempText = 'passwords do not match'
      }
      drawPromptingElem(elem, tempText);
      return
    }
    if ( minLengthController == false ) {
      return
    } else {
      removePromptingElem ($(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0])
    }
  }

  function drawPromptingElem(elem, text) {

    $(elem).after('<span></span><div class="forvalJs" data-forvalJs-type="prompting"></div>');
    var promptingElem = $(elem).next().next('.forvalJs[data-forvalJs-type="prompting"]')[0];
    $(promptingElem).css({'height' : 'auto'}).text(text);
    var tempElHeight = getCoords(promptingElem).height;
    $(promptingElem).prev().remove();
    $(promptingElem).remove();

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

// ПОКРАЩЕННЯ НА МАЙБУТНЄ

// data-forvalJs-maxLength='number'     : max length - dont work
// зробити більше фільтрів (напр. телефон , дата, ім'я, прізвище тощо')
// зробити довільний фільтр по паттернах [AaЇї+8]
// price + minLength - якщо є крапка неможливо вибрати розмірністьчисла