
	scrollEffect = {

	// detect if IE : from http://stackoverflow.com/a/16657946
	ie : (function(){
		var undef,rv = -1; // Return value assumes failure.
		var ua = window.navigator.userAgent;
		var msie = ua.indexOf('MSIE ');
		var trident = ua.indexOf('Trident/');

		if (msie > 0) {
			// IE 10 or older => return version number
			rv = parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
		} else if (trident > 0) {
			// IE 11 (or newer) => return version number
			var rvNum = ua.indexOf('rv:');
			rv = parseInt(ua.substring(rvNum + 3, ua.indexOf('.', rvNum)), 10);
		}

		return ((rv > -1) ? rv : undef);
	}()),


	// disable/enable scroll (mousewheel and keys) from http://stackoverflow.com/a/4770179
	// left: 37, up: 38, right: 39, down: 40,
	// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
	keys : [32, 37, 38, 39, 40], wheelIter : 0,

	preventDefault: function(e) {
		e = e || window.event;
		if (e.preventDefault)
		e.preventDefault();
		e.returnValue = false;
	},

	keydown: function(e) {
		for (var i = keys.length; i--;) {
			if (e.keyCode === keys[i]) {
				scrollEffect.preventDefault(e);
				return;
			}
		}
	},

	touchmove : function(e) {
		scrollEffect.preventDefault(e);
		if (scrollEffect.isRevealed) {
			// console.log('asd')
		} else {
			scrollEffect.toggle( 'reveal' );
		}
	},

	wheel : function(e) {
		// if( scrollEffect.ie ) {
		// 	scrollEffect.preventDefault(e);
		// }
	},

	disable_scroll : function () {
		window.onmousewheel = document.onmousewheel = scrollEffect.wheel;
		document.onkeydown = scrollEffect.keydown;
		document.body.ontouchmove = scrollEffect.touchmove;
	},

	enable_scroll : function() {
		window.onmousewheel = document.onmousewheel = document.onkeydown = document.body.ontouchmove = null;
	},

	docElem : window.document.documentElement,
	scrollVal : true,
	isRevealed : false,
	noscroll : true,
	isAnimating : false,
	container : document.body,
	trigger : document.body.querySelector( 'a.cta-scroll' ),

	scrollY : function() {
		return window.pageYOffset || scrollEffect.docElem.scrollTop;
	},

	scrollPage : function() {
		scrollEffect.scrollVal = scrollEffect.scrollY();

		if( scrollEffect.noscroll  ) {
			if( scrollEffect.scrollVal < 0 ) return false;
			// keep it that way
			window.scrollTo( 0, 0 );
		}

		if( classie.has( document.body, 'notrans' ) ) {
			classie.remove( document.body, 'notrans' );
			return false;
		}

		if( scrollEffect.isAnimating ) {
			return false;
		}

		if( scrollEffect.scrollVal <= 0 && scrollEffect.isRevealed ) {
			scrollEffect.toggle(0);
		}
		else if( scrollEffect.scrollVal > 0 && !scrollEffect.isRevealed ){
			scrollEffect.toggle(1);
		}
	},

	toggle : function( reveal ) {
		scrollEffect.isAnimating = true;

		if( reveal ) {
			classie.add( document.body, 'scrolled' );
		}
		else {
			scrollEffect.noscroll = true;
			scrollEffect.disable_scroll();
			classie.remove( document.body, 'scrolled' );
		}

		// simulating the end of the transition:
		setTimeout( function() {
			scrollEffect.isRevealed = !scrollEffect.isRevealed;
			scrollEffect.isAnimating = false;
			if( reveal ) {
				scrollEffect.noscroll = false;
				scrollEffect.enable_scroll();
			}
		}, 1200 );
	},

	refresh: function(){// refreshing the page...
		scrollEffect.pageScroll = scrollEffect.scrollY();
		scrollEffect.noscroll = scrollEffect.pageScroll === 0;

		scrollEffect.disable_scroll();

		if( scrollEffect.pageScroll ) {
			scrollEffect.isRevealed = true;
			classie.add( document.body, 'notrans' );
			classie.add( document.body, 'modify' );
		}
	},

	init: function(){
		$(window).bind('scroll touchend', scrollEffect.scrollPage );
            if(scrollEffect.trigger)
            scrollEffect.trigger.addEventListener( 'click', function() {
            	scrollEffect.toggle( 'reveal' );
            } );
	}
}
