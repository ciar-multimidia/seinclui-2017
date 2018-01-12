jQuery(document).ready(function($) {

	
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
				imgSlides.each(function(index, el) {
					if ($(el).find('video').length > 0) {
						$(el).find('video')[0].pause();					
					}
				});
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

	// codigo para funcionamento dos videos
	var $videos = $('.video').eq(0);

	$videos.length > 0 ? 
	$videos.each(function(index, el) {
		var $thisVideo = $(el);
		var $videoTag = $thisVideo.find('video');
		var videoHTML = $videoTag[0];
		var $btPlayPause = $thisVideo.find('.bt-play-pause');
		var $svgPlayPause = $btPlayPause.find('svg');
		var $progressSpace = $thisVideo.find('.view-container');
		var $visualProgress = $thisVideo.find('.progress-view');
		var $progressInput = $thisVideo.find('.progress-slider');
		var inputMaxValue = parseFloat($progressInput.attr('max'));
		var attProgresso;
		var videoDuration = 0;
		var funcionamentoAtivado = false;
		var progressIsClicked = false;
		var spacePos = {
			left: $progressSpace.offset().left,
			right: $progressSpace.offset().left + $progressSpace.width()
		}

		var playPauseClones = $('#playpausedefs').find('path').clone();
		$svgPlayPause.append(playPauseClones);


		var videoLoadChecker = setInterval(function(){
			if (videoHTML.readyState > 0) {
				funcionamentoVideos();
			}
		}, 500);


		var funcionamentoVideos = function(){
			if (funcionamentoAtivado === false) {
				funcionamentoAtivado = true;
				clearInterval(videoLoadChecker);
				$thisVideo.addClass('loaded');

				var transitionTime = 200;
				var dPlay = $svgPlayPause.find('path.play').attr('d');
				var dPause = $svgPlayPause.find('path.pause').attr('d');
				videoDuration = videoHTML.duration;



				var atualizarProgresso = function(percentage){
					
					var porcentagemProgresso = (Math.round(percentage*10000))/10000;
					var valueInput = porcentagemProgresso*inputMaxValue;
	  				$visualProgress.css('width', (porcentagemProgresso*100)+'%');
	  				$progressInput.attr({
	  					'value': 			valueInput,
	  					'data-valuenow': 	valueInput
	  				})
	  				.val(valueInput);

	  				// console.log('novo valor do input: ',$progressInput.val());
				};

				var progressoAutomatico = function(){
					
					var calcAutoProgresso = videoHTML.currentTime/videoDuration;
					atualizarProgresso(calcAutoProgresso);
					attProgresso = requestAnimationFrame(progressoAutomatico);
				}

				$videoTag.on('waiting', function(event) {
					$thisVideo.addClass('buffering');
				});	

				$videoTag.on('canplay', function(event) {
					$thisVideo.removeClass('buffering');
				});	

				$videoTag.on('playing', function(event) {
					$thisVideo.addClass('playing');
					attProgresso = requestAnimationFrame(progressoAutomatico);
					$svgPlayPause.find('path.pause').attr('d', dPlay);
					d3
					.select($svgPlayPause.find('path.pause')[0])
					.interrupt()
					.transition()
					.duration(transitionTime)
					.attr('d', dPause);
				});	

				$videoTag.on('pause', function(event) {
					$thisVideo.removeClass('playing');
					cancelAnimationFrame(attProgresso);
					$svgPlayPause.find('path.play').attr('d', dPause);
					d3
					.select($svgPlayPause.find('path.play')[0])
					.interrupt()
					.transition()
					.duration(transitionTime)
					.attr('d', dPlay);
				});

				$progressSpace.on('mousedown', function(event) {
					event.preventDefault();
					progressIsClicked = true;


					spacePos = {
						left: $progressSpace.offset().left,
						right: $progressSpace.offset().left + $progressSpace.width()
					}
					atualizarProgresso((event.pageX - spacePos.left)/(spacePos.right - spacePos.left));

					cancelAnimationFrame(attProgresso);

					$('body').on('mousemove', function(event) {
						var newProgressValue;
						if (event.pageX <= spacePos.left) {
							newProgressValue = 0;
						} else if (event.pageX >= spacePos.right) {
							newProgressValue = 1;
						}
						else{
							newProgressValue = (event.pageX - spacePos.left)/(spacePos.right - spacePos.left);
						}
						
						atualizarProgresso(newProgressValue);
						
					});
				});


				$('body').on('mouseup', function(event) {
					if (progressIsClicked === true) {
						$(this).off('mousemove');
						var newCurrentTimePerc = (Math.floor((($progressInput.val()/inputMaxValue))*1000))/1000;
						console.log('novo tempo calculado: ',newCurrentTimePerc);
						videoHTML.currentTime = newCurrentTimePerc*videoDuration;
						console.log('novo tempo APLICADO: ',videoHTML.currentTime);
						attProgresso = requestAnimationFrame(progressoAutomatico);
						progressIsClicked = false;
					}
					
					
				});



				// $progressInput.on('input', function(event) {
				// 	atualizarProgresso(isSeeking = true);
				// 	cancelAnimationFrame(attProgresso);
				// });

				// $progressInput.on('change', function(event) {
				// 	var newCurrentTime = (parseFloat($(this).val())/parseFloat($(this).attr('max')))*videoDuration;
				// 	videoHTML.currentTime = newCurrentTime;
				// 	attProgresso = requestAnimationFrame(atualizarProgresso);
					
				// });

				$btPlayPause.on('click', function(event) {
					if ($thisVideo.hasClass('playing')) {
						videoHTML.pause();
					} else{
						videoHTML.play();
					}

				});
			}
		}
	}) : null;
	



});