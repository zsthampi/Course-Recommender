(function(w,d,undefined){
	
	"use strict";
	
	var toggleElm = d.getElementById('ncstate-utility-bar-toggle-link'),
		toggleView = d.getElementsByClassName('ncstate-utility-bar-links')[0],
		searchForm = d.getElementsByClassName('ncstate-utility-bar-search-form')[0],
		searchField = d.getElementsByClassName('ncstate-utility-bar-search-field')[0],
		classPattern = /\bis-hidden\b/g,
		firstLink = d.getElementById('ncstate-utility-bar-first-link'),
		toggleState = 'hidden';

	// Define Event Handlers

	var toggleLinks = function() {

		if(toggleState === 'hidden'){
			toggleView.style.display = "block";
			toggleElm.nextElementSibling.style.display = "block";
			setTimeout(function(){toggleView.className = toggleView.className.replace(classPattern,'');}, 10);
			toggleState = 'visible';
		} else {
			toggleElm.nextElementSibling.style.display = "none";
			toggleView.className = toggleView.className + 'is-hidden';
			toggleState = 'hidden';
		}

	};
	
	var handleToggleElement = function(e){
		
		e.preventDefault();
		toggleLinks();
			
	};

	var handleTabbedNavigation = function(e){

		var key = e.which || e.keyCode;

		if (key === 13) {
			e.preventDefault();
			toggleLinks();
		}

		if (toggleState === 'visible') {
			e.preventDefault();
			firstLink.focus();
		} else {
			toggleElm.focus();
		}
	};
	
	var handleSearchSubmit = function(e){
		
		var style = w.getComputedStyle(searchField),
			display = style.getPropertyValue('display');
		
		if(display === "none"){
			e.preventDefault();
			searchField.style.display = 'block';
		}

	};

	var handleTransitionEnd = function(){
		
		if(toggleState === 'hidden'){
			toggleView.style.display = "none";
		}

	};
	
	// Bind Event Handlers

	toggleElm.addEventListener('click', handleToggleElement, false);
	toggleElm.addEventListener('keydown', handleTabbedNavigation, false);
	toggleView.addEventListener('transitionend', handleTransitionEnd, false);
	searchForm.addEventListener('submit', handleSearchSubmit, false);
	
	
})(window,document);