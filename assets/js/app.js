jQuery(document).ready(function($) {

	var SvgsParaInjetar = $('img.injetar');
	SVGInjector(SvgsParaInjetar);
	
	var secoesBt = $('.sessao.texto-video .deslizar');

	secoesBt.on('click', function(event) {
		$(this).closest('.texto-video').toggleClass('video-destacado');
	});

	var slidersTxt = $('.slider-txt');
	slidersTxt.each(function(index, el) {
		var esseSlider = $(this);
		var slideAtual = 1;
		var botoes = esseSlider.find('button');
		var inputRange = esseSlider.find('input[type="range"]');
		var contagemSlide = esseSlider.find('p.contagem > span');
		var textosSlides = esseSlider.find('.slider-items > p');
		var contTexto = esseSlider.find('p.cont-texto');

		function alterarSlide(indexNewSlide){
			var indexNewSlideInt = parseInt(indexNewSlide);
			if (indexNewSlideInt === 1) {
				botoes.filter('.anterior').attr('disabled', 'disabled');
			} else if(indexNewSlideInt === textosSlides.length){
				botoes.filter('.proximo').attr('disabled', 'disabled');
			} else{
				botoes.removeAttr('disabled');
			}

			contagemSlide.text(indexNewSlideInt);

			contTexto
			.html(
				textosSlides.eq(indexNewSlideInt-1).html()
			)
			.css('opacity', '0')
			.stop().animate({'opacity': '1'}, 200);

			inputRange.attr({
				'value': indexNewSlideInt,
				'aria-valuenow': indexNewSlideInt,
				'aria-valuetext': 'Item '+indexNewSlideInt
			}).val(indexNewSlideInt);

			slideAtual = indexNewSlideInt;
		}


		botoes.on('click', function(event) {

			var antOuProx;
			if ($(this).hasClass('proximo') && slideAtual < textosSlides.length) {
				antOuProx = slideAtual+1;
			} else if($(this).hasClass('anterior') && slideAtual > 1){
				antOuProx = slideAtual-1;
			}

			alterarSlide(antOuProx);

		});

		inputRange.on('input', function(event) {
			var novoValor = $(this).val();
			alterarSlide(novoValor);

		});

	});

});