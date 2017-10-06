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

	var nomeHtml = $('body').attr('data-numero');
	var slidersAll = $('.slider-txt, .slider-img');
	slidersAll.each(function(index, el) {
		var esseSlider = $(el);
		var botoes = esseSlider.find('button');
		var inputRange = esseSlider.find('input[type="range"]');
		var pContagem = esseSlider.find('p.contagem');
		var contagemSlide = esseSlider.find('p.contagem > span.span-contagem');
		var containerSlides = esseSlider.find('.slider-items');
		var textosSlides = esseSlider.find('.slider-items > div.scroller > p');
		// var contTexto = esseSlider.find('p.cont-texto');
		var imgSlides = esseSlider.find('.slider-items > div.scroller > figure');
		var slideAtual = 1;
		var qtdeItens = textosSlides.length > 0 ? textosSlides.length : imgSlides.length > 0 ? imgSlides.length : undefined;
		var nomeStorage = nomeHtml+'_'+index;

		inputRange.attr({
				'value': 1,
				'aria-valuenow': 1,
				'aria-valuetext': 'Item '+1
			}).val(1);
		
		
		function alterarSlide(indexNewSlide, mudarAriaLive){

			if (mudarAriaLive === true) {
				pContagem.attr('aria-live', 'polite');
				containerSlides.attr('aria-live', 'polite');
			}
			
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

			sessionStorage.setItem(nomeStorage, indexNewSlide);
			slideAtual = indexNewSlide;
		}

		if (sessionStorage.getItem(nomeStorage)) {
			alterarSlide(parseInt(sessionStorage.getItem(nomeStorage)), false);
		}


		botoes.on('click', function(event) {

			var antOuProx;
			if ($(this).hasClass('proximo') && slideAtual < qtdeItens) {
				antOuProx = parseInt(slideAtual+1);
			} else if($(this).hasClass('anterior') && slideAtual > 0){
				antOuProx = parseInt(slideAtual-1);
			}

			alterarSlide(antOuProx, true);

		});

		inputRange.on('input', function(event) {
			var novoValor = parseInt($(this).val());
			alterarSlide(novoValor, true);

		});

	});

	var janela = $(window);

	var sliderimg = $('.slider-img');

	if (sliderimg.length > 0) {
		var contagem_sl_img = sliderimg.find('p.contagem');
		var ajuste_altura = sliderimg.find('.ajuste-altura');

		var slider_top = sliderimg.offset().top - 10;
		var limite_rolagem = slider_top + sliderimg.height() - janela.height()*0.4;

		var ajustarAlturas = function(){
			slider_top = sliderimg.offset().top - 10;
			ajuste_altura.css('height', contagem_sl_img.height()+'px');
			limite_rolagem = slider_top + sliderimg.height() - janela.height()*0.4;
			
		}

		ajustarAlturas();

		janela.on('resize', function(event) {
			ajustarAlturas();
		});

		var scrollAtual = janela.scrollTop();

		janela.on('scroll', function(event) {
			var thisScrollTop = $(this).scrollTop();
			if (thisScrollTop >= slider_top && thisScrollTop <= limite_rolagem) {
				ajuste_altura.addClass('ativo');
				contagem_sl_img.addClass('fixo');

			} else{
				ajuste_altura.removeClass('ativo');
				contagem_sl_img.removeClass('fixo');
			}
			scrollAtual = thisScrollTop;
		});
	}
	



});