$('.popup__btn_cls').click(function(){
  $($(this).parents('.popup')[0]).css({'display':'none'});
  $('.popup__wrapper').css({'display':'none'});
});