jQuery(document).ready(function($) {

	var SvgsParaInjetar = $('img.injetar');
	SVGInjector(SvgsParaInjetar);
	
	var secoesBt = $('.sessao.texto-video .deslizar');

	secoesBt.on('click', function(event) {
		$(this).closest('.texto-video').toggleClass('video-destacado');
	});

	var slidersAll = $('.slider-txt, .slider-img');
	slidersAll.each(function(index, el) {
		var esseSlider = $(el);
		var botoes = esseSlider.find('button');
		var inputRange = esseSlider.find('input[type="range"]');
		var contagemSlide = esseSlider.find('p.contagem > span');
		var textosSlides = esseSlider.find('.slider-items > p');
		var contTexto = esseSlider.find('p.cont-texto');
		var imgSlides = esseSlider.find('.imagens > figure');
		var slideAtual = 1;
		// var slideAtual = parseInt(contagemSlide.text());


		function alterarSlide(indexNewSlide){
			
			if (indexNewSlide === 1) {
				botoes.filter('.anterior').attr('disabled', 'disabled');
			} else if(indexNewSlide === textosSlides.length){
				botoes.filter('.proximo').attr('disabled', 'disabled');
			} else{
				botoes.removeAttr('disabled');
			}

			contagemSlide.text(indexNewSlide);

			inputRange.attr({
				'value': indexNewSlide,
				'aria-valuenow': indexNewSlide,
				'aria-valuetext': 'Item '+indexNewSlide
			}).val(indexNewSlide);

			if (contTexto.length > 0 && textosSlides.length > 0) {
				contTexto
				.html(
					textosSlides.eq(indexNewSlide-1).html()
				)
				.css('opacity', '0')
				.stop().animate({'opacity': '1'}, 200);
			}

			if (imgSlides.length > 0) {
				imgSlides
				.removeClass('ativo')
				.eq(indexNewSlide-1)
				.addClass('ativo')
				.css('opacity', '0')
				.stop().animate({'opacity': '1'}, 200);

			}

			slideAtual = indexNewSlide;
		}


		botoes.on('click', function(event) {

			var antOuProx;
			if ($(this).hasClass('proximo')) {
				antOuProx = parseInt(slideAtual+1);
			} else if($(this).hasClass('anterior')){
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