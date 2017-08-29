jQuery(document).ready(function($) {

	var SvgsParaInjetar = $('img.injetar');
	SVGInjector(SvgsParaInjetar);
	
	var secoesBt = $('.sessao.texto-video .deslizar');

	secoesBt.on('click', function(event) {
		$(this).closest('.texto-video').toggleClass('video-destacado');
	});

	var slidersTxt = $('.slider-txt');
	slidersTxt.each(function(index, el) {
		var esseSlider = $(el);
		var slideAtual = 1;
		var botoes = esseSlider.find('button');
		var inputRange = esseSlider.find('input[type="range"]');
		var contagemSlide = esseSlider.find('p.contagem > span');
		var textosSlides = esseSlider.find('.slider-items > p');
		var contTexto = esseSlider.find('p.cont-texto');

		console.log(textosSlides.length);

		function alterarSlide(indexNewSlide){
			
			if (indexNewSlide === 1) {
				botoes.filter('.anterior').attr('disabled', 'disabled');
			} else if(indexNewSlide === textosSlides.length){
				botoes.filter('.proximo').attr('disabled', 'disabled');
			} else{
				botoes.removeAttr('disabled');
			}

			contagemSlide.text(indexNewSlide);

			contTexto
			.html(
				textosSlides.eq(indexNewSlide-1).html()
			)
			.css('opacity', '0')
			.stop().animate({'opacity': '1'}, 200);

			inputRange.attr({
				'value': indexNewSlide,
				'aria-valuenow': indexNewSlide,
				'aria-valuetext': 'Item '+indexNewSlide
			}).val(indexNewSlide);

			slideAtual = indexNewSlide;
		}


		botoes.on('click', function(event) {

			var antOuProx;
			if ($(this).hasClass('proximo') && slideAtual < textosSlides.length) {
				antOuProx = parseInt(slideAtual+1);
			} else if($(this).hasClass('anterior') && slideAtual > 1){
				antOuProx = parseInt(slideAtual-1);
			}

			alterarSlide(antOuProx);

		});

		inputRange.on('input', function(event) {
			var novoValor = parseInt($(this).val());
			alterarSlide(novoValor);

		});

	});

});