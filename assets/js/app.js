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

	// definir casas decimais
	
	Math.decimals = function(number, nOfDecimals){
		return (Math.round(number*(10**nOfDecimals)))/(10**nOfDecimals);
	};

	// codigo para funcionamento dos videos
	var $videos = $('.video').eq(0);

	$videos.length > 0 ? 
	$videos.each(function(index, el) {
		var $thisVideo = $(el); //Esse container
		var $videoTag = $thisVideo.find('video'); // O video
		var videoHTML = $videoTag[0]; // O html root do video, importante para manipular o video de forma geral
		var $btPlayPause = $thisVideo.find('.bt-play-pause');
		var $svgPlayPause = $btPlayPause.find('svg');
		var $progressInput = $thisVideo.find('.view-container'); // container da barra de progresso E input acessivel
		var $visualProgress = $thisVideo.find('.progress-view'); // barra branca do progresso
		var inputMaxValue = parseFloat($progressInput.attr('aria-valuemax')); // Valor maximo do input
		var inputStep = parseInt($progressInput.attr('step')); // Qtde de 'pulo' do input
		var attProgresso; // Loop RAF que atualiza a barra de progresso de acordo com o progresso do video
		var loopPodeContinuar = true; // O loop RAF pode ser bloqueado para alterações manuais no visual; Só quando essa alteração acontecer que o loop pode continuar novamente.
		var tempoAtual = 0; // Armazena o tempo atual do video, varia de 0 a 1 (porcentagem!)
		var videoDuration = 0; // Armazena o tempo total do video em segundos
		var funcionamentoAtivado = false; 
		var progressIsClicked = false; // Verifica se a barra de progresso foi clicada para os eventos de mouseup no body
		var checkWait; // Qnd o video emite o 'waiting', esse checkwait espera uma fração de segundo para colocar a animação de 'buffering', devido à grnade qtde de emissoes desse evento.
		var spacePos = {
			left: $progressInput.offset().left,
			right: $progressInput.offset().left + $progressInput.width()
		} // armazenando o tamanho da barra de progresso para calculo de tamanho da barra e area de clique.


		// Pegando os paths do svg def e clonando nos botoes de cada player.
		var playPauseClones = $('#playpausedefs').find('path').clone();
		$svgPlayPause.append(playPauseClones);

		// Verificar se os videos carregaram a cada 0.5 seg. Pior metodo de todos, mas é o que tem pra hoje...
		var videoLoadChecker = setInterval(function(){
			if (videoHTML.readyState > 0) {
				funcionamentoVideos();
			}
		}, 500);

		// enfim fazer os videos funcionarem depois de carregados.
		var funcionamentoVideos = function(){
			if (funcionamentoAtivado === false) {

				funcionamentoAtivado = true;
				clearInterval(videoLoadChecker);


				$thisVideo.addClass('loaded');
				var transitionTime = 200;
				videoDuration = videoHTML.duration;
				var dPlay = $svgPlayPause.find('path.play').attr('d');
				var dPause = $svgPlayPause.find('path.pause').attr('d');


				// metodo que atualiza o tempo atual, o tamanho da barra de progresso, o valor do input e o progresso numerico
				var atualizarProgresso = function(percentage, atualizacaoManual){				
					var porcentagemProgresso = Math.decimals(percentage, 3);
					var valueInput = Math.round(porcentagemProgresso*inputMaxValue);
	  				$visualProgress.css('width', (porcentagemProgresso*100)+'%');
	  				$progressInput.attr({
	  					'aria-valuenow': valueInput
	  				});
	  				// tempoAtual = porcentagemProgresso;
	  				// console.log('atualizando progresso visual, novo tempo atual:', tempoAtual);
	  				if (atualizacaoManual ===  true) {
	  					loopPodeContinuar = true;
	  				}
				};

				// metodo que é chamado atraves de um RAF para atualizar o progresso automaticamente enquanto o video está tocando.
				var progressoAutomatico = function(){
					if (loopPodeContinuar) {
						var calcAutoProgresso = videoHTML.currentTime/videoDuration;
						atualizarProgresso(calcAutoProgresso);
		  				console.log('atualização automatica do progresso visual');

					}				
					attProgresso = requestAnimationFrame(progressoAutomatico);
				}

				// metodo que muda "manualmente" o tempo do video. É chamado quando o usuario interage com a barra de progresso.
				var atualizarTempoVideo = function(percentage){
					loopPodeContinuar = false;
					tempoAtual = Math.decimals(percentage, 2);
					console.log('Tempo do vídeo ajustado para', (tempoAtual*100),'%');
					videoHTML.currentTime = Math.decimals(percentage*videoDuration, 2);
					atualizarProgresso(percentage, true);
				}


				// Abaixo, escutando os eventos do video:

				// 1. Se o video entrar em espera, espera um pequeno tempo; se passar esse tempo e ainda estiver em espera, ativa animação de buffering.
				$videoTag.on('waiting', function(event) {
					checkWait = setTimeout(function(){$thisVideo.addClass('buffering')},500);
				});	

				// 2. Se o video é tocavel novamente, remover animação de buffering.
				$videoTag.on('canplay', function(event) {
					$thisVideo.removeClass('buffering');
					clearTimeout(checkWait);
				});	

				// 3. Quando o video vier a tocar, receber o devido status: Muda o botao de play para pause, muda title, ativa o RAF loop.
				$videoTag.on('playing', function(event) {
					console.log('Video está tocando');
					$thisVideo.addClass('playing');
					$btPlayPause.attr('title', $btPlayPause.attr('data-title-pause'));
					attProgresso = requestAnimationFrame(progressoAutomatico);
					$svgPlayPause.find('path.pause').attr('d', dPlay);
					d3
					.select($svgPlayPause.find('path.pause')[0])
					.interrupt()
					.transition()
					.duration(transitionTime)
					.attr('d', dPause);
				});	

				// 4. Quando o video for pausado, receber o devido status: Muda o botao de de pause p/ play, muda title, cancela o RAF loop.
				$videoTag.on('pause', function(event) {
					console.log('Video está pausado');
					$thisVideo.removeClass('playing');
					$btPlayPause.attr('title', $btPlayPause.attr('data-title-play'));
					cancelAnimationFrame(attProgresso);
					$svgPlayPause.find('path.play').attr('d', dPause);
					d3
					.select($svgPlayPause.find('path.play')[0])
					.interrupt()
					.transition()
					.duration(transitionTime)
					.attr('d', dPlay);
				});

				// Botao de play/pause. Possui o efeito esperado. Eventos esperados desse clique estao nos listeners acima.
				$btPlayPause.on('click', function(event) {
					$(this).trigger('blur');
					if ($thisVideo.hasClass('playing')) {
						videoHTML.pause();
					} else{
						videoHTML.play();
					}
				});

				// Ao clicar na barra de progresso, arrastar a barra de acordo com a posição do cursor. 
				// O cursor pode sair da area da barra sem problemas, por isso que o body recebe o 'mousemove' ao inves do input.
				// O tempo do video é ajustado apenas quando o botao do mouse é solto (mouseup). Nesse evento, existe apenas o ajuste do tamanho da barra e do tempo numerico.
				$progressInput.on('mousedown', function(event) {
					event.preventDefault();
					progressIsClicked = true;
					spacePos = {
						left: $progressInput.offset().left,
						right: $progressInput.offset().left + $progressInput.width()
					};

					cancelAnimationFrame(attProgresso);
					atualizarProgresso((event.pageX - spacePos.left)/(spacePos.right - spacePos.left));

					console.log('Começou-se um clique na barra de progresso.',
						
						'\nProgresso  atualizado para ',(event.pageX - spacePos.left)/(spacePos.right - spacePos.left),'%');

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

						console.log('Movendo mouse, novo tempo: ', newProgressValue);
						tempoAtual = newProgressValue;
						atualizarProgresso(newProgressValue);
					});
				});

				// O evento que muda o tempo do video para o tempo escolhido. Como é um evento tão global, existe uma variavel impedindo de ativa-lo SEMPRE que houve um mouseup no body.
				$('body').on('mouseup', function(event) {
					if (progressIsClicked === true) {
						console.log('Terminado o ajuste com o mouse do progresso.')

						$(this).off('mousemove');
						atualizarTempoVideo(tempoAtual);
						progressIsClicked = false;
					}
				});

				// Quando o input estiver focado, as teclas direita e esquerda avançam ou retrocedem no tempo do video baseado no step definido no input.
				$progressInput.on('keydown', function(event) {
					var incremento;
					var teclasCorretas = false;
					switch(event.which){
						case 37: teclasCorretas = true; incremento = -inputStep; break;
						case 39: teclasCorretas = true; incremento = inputStep; break;
					}

					if (teclasCorretas) {
						var newPercentage = (parseInt($(this).attr('aria-valuenow'))+incremento)/inputMaxValue;

						if (newPercentage < 0) {
							newPercentage = 0;
						} else if (newPercentage > 1){
							newPercentage = 1;
						}
						atualizarTempoVideo(newPercentage);
					}
				});
			}
		}
	}) : null;
	



});