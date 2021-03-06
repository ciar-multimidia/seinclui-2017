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
		var sliderControls = esseSlider.children('.controls');
		var botoes = sliderControls.find('button');
		var inputRange = sliderControls.find('input[type="range"]');
		var pContagem = sliderControls.find('p.contagem');
		var contagemSlide = pContagem.children('span.span-contagem');
		var containerSlides = esseSlider.find('.slider-items');
		var textosSlides = containerSlides.children('div.scroller').children('p');
		// var contTexto = esseSlider.find('p.cont-texto');
		var imgSlides = containerSlides.children('div.scroller').children('figure');

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
	var $videos = $('.video');

	$videos.length > 0 ? 
	$videos.each(function(index, el) {
		var minWidthControls = 768;
		var $thisVideo = $(el); //Esse container
		var $videoTag = $thisVideo.find('video'); // O video
		var videoHTML = $videoTag[0]; // O html root do video, importante para manipular o video de forma geral
		var $youtubeLink = $thisVideo.find('a.youtube-link'); // botao que leva para o respectivo video no youtube
		var $btPlayPause = $thisVideo.find('.bt-play-pause'); // Botão de play/pause
		var $svgPlayPause = $btPlayPause.find('svg'); //SVG dentro do botão
		var $numberCurrentTime = $thisVideo.find('p.currentTime'); // Numeros indicando o tempo atual do video
		var $numberTotalTime = $thisVideo.find('p.totalTime'); // Numeros indicando o tempo total do video
		var $btMuteVolume = $thisVideo.find('.volume-container > .mute-button'); // Botao de mute
		var $volumeInput = $thisVideo.find('.volume-container > .volume-slider'); // Slider de volume
		var $volumeHandle = $volumeInput.find('.progress-handle'); //bolinha que indica melhor o volume
		var $volumeVisual = $volumeInput.find('.progress-view'); // barra branca do volume
		var $progressInput = $thisVideo.find('.progress-slider'); // container da barra de progresso E input acessivel
		var $progressHandle = $progressInput.find('.progress-handle'); //bolinha que indica melhor o fim do input do progresso
		var $visualProgress = $progressInput.find('.progress-view'); // barra branca do progresso
		var elUsingMouseEvents = ''; //variavel que verifica se existe algum elemento interagindo com o disparo de mousedown e mousemove global
 		var progressInputMaxValue = parseFloat($progressInput.attr('aria-valuemax')); // Valor maximo do input
		var ProgressInputStep = parseInt($progressInput.attr('step')); // Qtde de 'pulo' do input
		var volumeInputStep = parseInt($volumeInput.attr('step')); // Qtde de pulo do volume
		var attProgresso; // Loop RAF que atualiza a barra de progresso de acordo com o progresso do video
		var loopPodeContinuar = true; // O loop RAF pode ser bloqueado para alterações manuais no visual; Só quando essa alteração acontecer que o loop pode continuar novamente.
		var tempoAtual = 0; // Armazena o tempo atual do video, varia de 0 a 1 (porcentagem!)
		var volumeAtual = videoHTML.volume; //Armazena o o volume atual do video.
		var volumeAntesMute = 1;
		var volumeAntesAjuste;
		var videoDuration = 0; // Armazena o tempo total do video em segundos
		var funcionamentoAtivado = false; 
		var checkWait; // Qnd o video emite o 'waiting', esse checkwait espera uma fração de segundo para colocar a animação de 'buffering', devido à grnade qtde de emissoes desse evento.
		var positionProgress = {
			left: $progressInput.offset().left,
			right: $progressInput.offset().left + $progressInput.width()

		} // armazenando o tamanho da barra de progresso para calculo de tamanho da barra e area de clique.

		if ($btMuteVolume.length > 0) {
			var positionVolume = {
				left: $volumeInput.offset().left,
				right: $volumeInput.offset().left + $volumeInput.width()
			}; // armazenando o tamanho da barra de volume para calculo de tamanho da barra e area de clique.	
		}

		// Pegando os paths do svg def e clonando nos botoes de cada player.
		var playPauseClones = $('#svg-definitions').find('#play-pause-icons').find('path').clone();
		$svgPlayPause.append(playPauseClones);

		// Pegando o svg do icone de volume no svg def e colocando no botao.

		if ($btMuteVolume.length > 0) {
			var muteClone = $('#svg-definitions').find('#volume-icon').children().clone();
			$btMuteVolume.children('svg').append(muteClone);	
		}

		videoHTML.load();

		var definirControles = function(){
			// console.log($('body').width(), minWidthControls);

			if ($('body').width() > minWidthControls) {
				// console.log('controle custom pros videos');
				videoHTML.controls = false;
			} else{
				// console.log('controle padrao pros videos');
				videoHTML.controls = true;
			}	
		};

		definirControles();

		$(window).on('resize', definirControles);

		// Verificar se os videos carregaram a cada 0.5 seg. Pior metodo de todos, mas é o que tem pra hoje...
		var videoLoadChecker = setInterval(function(){
			// console.log('verificando se carregou', videoHTML.readyState);
			if (videoHTML.readyState > 0) {
				funcionamentoVideos();
			}
		}, 500);

		// enfim fazer os videos funcionarem depois de carregados.
		var funcionamentoVideos = function(){
			if (funcionamentoAtivado === false) {

				// console.log('nome do vídeo: ',videoHTML.src, '\nduração do vídeo: ', videoHTML.duration);

				funcionamentoAtivado = true;
				clearInterval(videoLoadChecker);

				// var events = ['abort','canplay','canplaythrough','durationchange','emptied','encrypted','ended','error','interruptbegin','interruptend','loadeddata','loadedmetadata','loadstart','mozaudioavailable','pause','play','playing','progress','ratechange','seeked','seeking','stalled','suspend','volumechange','waiting'];

				// for (var i = 0; i < events.length; i++) {
				// 	$videoTag.on( events[i], function(event) {
				// 		console.log(event['type']);
				// 	});
				// };

				// função que transforma segundos em minutos
				var secondsToMinutes = function(seconds){
					var minutos = Math.floor(seconds/60);
					var segundos = Math.floor(seconds)%60;
					return minutos.toString() + ':' + (segundos < 10 ? '0' : '') + segundos.toString();
				};

				// função que retorna uma string em portugues com informações de minuto e segundo
				var labelTimeMinutes = function(seconds){
					var minutos = Math.floor(seconds/60);
					var segundos = Math.floor(seconds)%60;
					var txtMinutos;
					var txtSegundos;
					var txtJuncao = minutos > 0 && segundos > 0 ? ' e ' : '';

					if (minutos > 0) {
						txtMinutos = minutos.toString()+' minuto'+(minutos > 1 ? 's' : '');
					} else{
						txtMinutos = '';
					}

					if (segundos > 0) {
						txtSegundos = segundos.toString()+' segundo'+(segundos > 1 ? 's' : '');
					} else{
						txtSegundos = '';
					}

					return txtMinutos + txtJuncao + txtSegundos;
				};

				$thisVideo.addClass('loaded');
				var transitionTime = 200;
				videoDuration = videoHTML.duration;
				var dPlay = $svgPlayPause.find('path.play').attr('d');
				var dPause = $svgPlayPause.find('path.pause').attr('d');
				$numberTotalTime
					.text(secondsToMinutes(videoDuration))
					.attr('aria-label', $numberTotalTime.attr('data-texto-padrao') + ' ' + labelTimeMinutes(videoDuration));


				// metodo que atualiza o tempo atual, o tamanho da barra de progresso, o valor do input e o progresso numerico
				var atualizarProgresso = function(percentage, atualizacaoManual){				
					var porcentagemProgresso = Math.decimals(percentage, 3);
					var valueInput = Math.round(porcentagemProgresso*progressInputMaxValue);
	  				$visualProgress.css('width', (porcentagemProgresso*100)+'%');
	  				$progressHandle.css('left', (porcentagemProgresso*100)+'%');
	  				$progressInput.attr({
	  					'aria-valuenow': valueInput,
	  					'aria-valuetext': ($progressInput.attr('data-texto-padrao')+' '+Math.round(porcentagemProgresso*100)+'%')
	  				});
	  				$numberCurrentTime
	  					.text(secondsToMinutes(videoDuration*porcentagemProgresso))
	  					.attr('aria-label', $numberCurrentTime.attr('data-texto-padrao') + ' ' + labelTimeMinutes(videoDuration*porcentagemProgresso));
	  				tempoAtual = porcentagemProgresso;

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
		  				// console.log('atualização automatica do progresso visual');

					}				
					attProgresso = requestAnimationFrame(progressoAutomatico);
				};

				// metodo que muda "manualmente" o tempo do video. É chamado quando o usuario interage com a barra de progresso.
				var atualizarTempoVideo = function(percentage){
					loopPodeContinuar = false;
					tempoAtual = Math.decimals(percentage, 2);
					// console.log('Tempo do vídeo ajustado para', (tempoAtual*100),'%');
					videoHTML.currentTime = Math.decimals(percentage*videoDuration, 2);
					atualizarProgresso(percentage, true);
				};


				// metodo para ajustar o slider do volume
				var ajustarVolume = function(percentagem){
					var arredondado = Math.decimals(percentagem, 2);
					$volumeVisual.css('width', (arredondado*100)+'%');
					$volumeHandle.css('left', (arredondado*100)+'%');
					if (arredondado === 0) {
						$btMuteVolume.addClass('volume-mudo').removeClass('volume-baixo').attr({'title': $btMuteVolume.attr('data-title-mute')});
					}

					else if (arredondado > 0) {
						$btMuteVolume.attr({'title': $btMuteVolume.attr('data-title-nomute')});
						if (arredondado <= 0.5) {
							$btMuteVolume.addClass('volume-baixo').removeClass('volume-mudo');
						}

						else if (arredondado > 0.5){
							$btMuteVolume.removeClass('volume-mudo volume-baixo');
						}
					}

					$volumeInput.attr('aria-valuetext', $volumeInput.attr('data-texto-padrao')+' '+Math.round(arredondado * 100)+'%');
					

					videoHTML.volume = arredondado;
					volumeAtual = videoHTML.volume;
				};


				// Abaixo, escutando os eventos do video:

				// 1. Se o video entrar em espera, espera um pequeno tempo; se passar esse tempo e ainda estiver em espera, ativa animação de buffering.
				$videoTag.on('waiting', function(event) {
					checkWait = setTimeout(function(){$thisVideo.addClass('buffering')},500);
				});	

				// 2. Se o video é tocavel novamente, remover animação de buffering.
				$videoTag.on('canplay canplaythrough', function(event) {
					$thisVideo.removeClass('buffering');
					clearTimeout(checkWait);
				});	

				// 3. Quando o video vier a tocar, receber o devido status: Muda o botao de play para pause, muda title, ativa o RAF loop.
				$videoTag.on('playing', function(event) {
					// console.log('Video está tocando');

					$btPlayPause.attr('title', $btPlayPause.attr('data-title-pause'));
					attProgresso = requestAnimationFrame(progressoAutomatico);

					if (!$thisVideo.hasClass('playing')) {
						$thisVideo.addClass('playing');
						$svgPlayPause.find('path.pause').attr('d', dPlay);
						d3
						.select($svgPlayPause.find('path.pause')[0])
						.interrupt()
						.transition()
						.duration(transitionTime)
						.attr('d', dPause);	
					}
				});	

				// 4. Quando o video for pausado, receber o devido status: Muda o botao de de pause p/ play, muda title, cancela o RAF loop.
				$videoTag.on('pause', function(event) {
					// console.log('Video está pausado');

					$btPlayPause.attr('title', $btPlayPause.attr('data-title-play'));
					cancelAnimationFrame(attProgresso);

					if ($thisVideo.hasClass('playing')) {
						$thisVideo.removeClass('playing');
						$svgPlayPause.find('path.play').attr('d', dPause);
						d3
						.select($svgPlayPause.find('path.play')[0])
						.interrupt()
						.transition()
						.duration(transitionTime)
						.attr('d', dPlay);
					}
				});

				// 5. Quando o usuário estiver buscando no video, para a atualização automatica do progresso
				$videoTag.on('seeking', function(event) {
					cancelAnimationFrame(attProgresso);
					atualizarProgresso(tempoAtual);
				});


				// 6. Quando o vídeo dar erro, re-carregar o video
				$videoTag.on('error abort', function(event) {
					videoHTML.load();
				});

				

				// Botao de play/pause. Possui o efeito esperado. Eventos esperados desse clique estao nos listeners acima.
				$btPlayPause.on('click', function(event) {
					$(this).trigger('blur');
					if (videoHTML.paused === true) {
						videoHTML.play();
					} else{
						videoHTML.pause();
					}
				});

				// Botao de mutar o volume
				$btMuteVolume.on('click', function(event){
					if (volumeAtual > 0) {
						// console.log('mutou');
						volumeAntesMute = volumeAtual;
						ajustarVolume(0);
					}

					else if(volumeAtual === 0){
						// console.log('des-mutou');
						ajustarVolume(volumeAntesMute);
						volumeAntesAjuste = 0;
						volumeAntesMute = 0;
					}
				});


				// Ao abrir o video no Youtube, pausar o video no ebook
				$youtubeLink.on('click', function(event) {
					videoHTML.pause();
				});

				// Ao clicar na barra de progresso, arrastar a barra de acordo com a posição do cursor. 
				// O cursor pode sair da area da barra sem problemas, por isso que o body recebe o 'mousemove' ao inves do input.
				// O tempo do video é ajustado apenas quando o botao do mouse é solto (mouseup). Nesse evento, existe apenas o ajuste do tamanho da barra e do tempo numerico.
				$progressInput.on('mousedown', function(event) {
					$(this).trigger('focus');
					event.preventDefault();
					elUsingMouseEvents = 'progressBar';
					positionProgress = {
						left: $progressInput.offset().left,
						right: $progressInput.offset().left + $progressInput.width()
					};

					var newProgressValue;
					if (event.pageX <= positionProgress.left) {
						newProgressValue = 0;
					} else if (event.pageX >= positionProgress.right) {
						newProgressValue = 1;
					}
					else{
						newProgressValue = (event.pageX - positionProgress.left)/(positionProgress.right - positionProgress.left);
					}
					tempoAtual = newProgressValue;
					$videoTag.trigger('seeking');
					
					// console.log('Começou-se um clique na barra de progresso.',
					// '\nProgresso  atualizado para ',(event.pageX - positionProgress.left)/(positionProgress.right - positionProgress.left),'%');
				});


				$volumeInput.on('mousedown', function(event) {
					$(this).trigger('focus');
					event.preventDefault();
					volumeAntesAjuste = volumeAtual;
					// console.log('Volume antes desse ajuste: ',volumeAntesAjuste);
					elUsingMouseEvents = 'volumeBar';
					positionVolume = {
						left: $volumeInput.offset().left,
						right: $volumeInput.offset().left + $volumeInput.width()
					};


					var newVolumeValue;
					if (event.pageX <= positionVolume.left) {
						newVolumeValue = 0;
					} else if (event.pageX >= positionVolume.right) {
						newVolumeValue = 1;
					}
					else{
						newVolumeValue = (event.pageX - positionVolume.left)/(positionVolume.right - positionVolume.left);
					}
					ajustarVolume(newVolumeValue);


				});

				$('body').on('mousemove', function(event) {

					if (elUsingMouseEvents === 'progressBar') {
						var newProgressValue;
						if (event.pageX <= positionProgress.left) {
							newProgressValue = 0;
						} else if (event.pageX >= positionProgress.right) {
							newProgressValue = 1;
						}
						else{
							newProgressValue = (event.pageX - positionProgress.left)/(positionProgress.right - positionProgress.left);
						}
						tempoAtual = newProgressValue;
						$videoTag.trigger('seeking');
					} else if (elUsingMouseEvents === 'volumeBar') {

						var newVolumeValue;
						if (event.pageX <= positionVolume.left) {
							newVolumeValue = 0;
						} else if (event.pageX >= positionVolume.right) {
							newVolumeValue = 1;
						}
						else{
							newVolumeValue = (event.pageX - positionVolume.left)/(positionVolume.right - positionVolume.left);
						}
						ajustarVolume(newVolumeValue);
					}
					
					

					
				});

				// O evento que muda o tempo do video para o tempo escolhido. Como é um evento tão global, existe uma variavel impedindo de ativa-lo SEMPRE que houve um mouseup no body.
				$('body').on('mouseup', function(event) {
					if (elUsingMouseEvents === 'progressBar') {
						atualizarTempoVideo(tempoAtual);
					} else if(elUsingMouseEvents === 'volumeBar'){
						if (volumeAtual === 0) {
							// console.log('mutou o volume pela barra!');
							volumeAntesMute = volumeAntesAjuste;
						}
					}
					elUsingMouseEvents = '';

				});

				

				// Quando o input estiver focado, as teclas direita e esquerda avançam ou retrocedem no tempo do video baseado no step definido no input.
				$progressInput.on('keydown', function(event) {
					var incremento;
					var teclasCorretas = false;
					switch(event.which){
						case 37: teclasCorretas = true; incremento = -ProgressInputStep; break;
						case 39: teclasCorretas = true; incremento = ProgressInputStep; break;
					}

					if (teclasCorretas) {
						var newPercentage = (parseInt($(this).attr('aria-valuenow'))+incremento)/progressInputMaxValue;

						if (newPercentage < 0) {
							newPercentage = 0;
						} else if (newPercentage > 1){
							newPercentage = 1;
						}
						
						tempoAtual = newPercentage;
						atualizarTempoVideo(tempoAtual);
					}
				});

				$volumeInput.on('keydown', function(event) {
					volumeAntesAjuste = volumeAtual
					var incremento;
					var teclasCorretas = false;
					switch(event.which){
						case 37: teclasCorretas = true; incremento = -volumeInputStep; break;
						case 39: teclasCorretas = true; incremento = volumeInputStep; break;
					}

					if (teclasCorretas) {
						var newVolume = (videoHTML.volume+(incremento/100));

						if (newVolume < 0) {
							newVolume = 0;
						} else if (newVolume > 1){
							newVolume = 1;
						}

						if (newVolume === 0) {
							volumeAntesMute = volumeAntesAjuste;
						}
						
						ajustarVolume(newVolume);
					}
				});
			}
		}
	}) : null;
});