jQuery(document).ready(function($) {

	var SvgsParaInjetar = $('img.injetar');
	SVGInjector(SvgsParaInjetar);
	
	var secoesBt = $('.sessao.texto-video .deslizar');

	secoesBt.on('click', function(event) {
		$(this).closest('.texto-video').toggleClass('video-destacado');
	});

});