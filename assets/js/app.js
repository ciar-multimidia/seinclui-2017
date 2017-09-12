jQuery(document).ready(function($) {

	var SvgsParaInjetar = $('img.injetar');
	SVGInjector(SvgsParaInjetar);
	
	var secoesBt = $('.sessao.texto-video .deslizar');

	secoesBt.on('click', function(event) {
		$(this).closest('.texto-video').toggleClass('video-destacado');
		if ($(this).attr('aria-label') === $(this).attr('data-txt-expand')) {
			$(this).attr('aria-label', $(this).attr('data-txt-collapse'));
		}else if ($(this).attr('aria-label') === $(this).attr('data-txt-collapse')) {
			$(this).attr('aria-label', $(this).attr('data-txt-expand'));
		}
	});

	var crossBrowserTransform = function(valor){
		return {
			'-webkit-transform': valor,
			    '-ms-transform': valor,
			        'transform': valor
		};
	}

	var slidersAll = $('.slider-txt, .slider-img');
	slidersAll.each(function(index, el) {
		var esseSlider = $(el);
		var botoes = esseSlider.find('button');
		var inputRange = esseSlider.find('input[type="range"]');
		var contagemSlide = esseSlider.find('p.contagem > span');
		var textosSlides = esseSlider.find('.slider-items > div.scroller > p');
		// var contTexto = esseSlider.find('p.cont-texto');
		var imgSlides = esseSlider.find('.slider-items > div.scroller > figure');
		var slideAtual = 1;
		var qtdeItens = textosSlides.length > 0 ? textosSlides.length : imgSlides.length > 0 ? imgSlides.length : undefined;
		
		
		function alterarSlide(indexNewSlide){
			
			if (indexNewSlide === 1) {
				botoes.filter('.anterior').attr('disabled', 'disabled');
			} else if(indexNewSlide === qtdeItens){
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

			// if (contTexto.length > 0 && textosSlides.length > 0) {
			// 	contTexto
			// 	.html(
			// 		textosSlides.eq(indexNewSlide-1).html()
			// 	)
			// 	.css('opacity', '0')
			// 	.stop().animate({'opacity': '1'}, 200);
			// }

			if (textosSlides.length > 0) {


				textosSlides
				.attr('aria-hidden', 'true')
				.eq(indexNewSlide-1)
				.removeAttr('aria-hidden')
				.end()
				.parent()
				.css(crossBrowserTransform('translateX(-'+100*(indexNewSlide-1)+'%)'));
				
			}

			if (imgSlides.length > 0) {
				imgSlides
				.attr('aria-hidden', 'true')
				.eq(indexNewSlide-1)
				.removeAttr('aria-hidden')
				.end()
				.parent()
				.css(crossBrowserTransform('translateX(-'+100*(indexNewSlide-1)+'%)'));

			}

			slideAtual = indexNewSlide;
		}


		botoes.on('click', function(event) {

			var antOuProx;
			if ($(this).hasClass('proximo') && slideAtual < qtdeItens) {
				antOuProx = parseInt(slideAtual+1);
			} else if($(this).hasClass('anterior') && slideAtual > 0){
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