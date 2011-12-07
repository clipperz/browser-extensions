const DISCOTHEQUE_PREF_PREFIX = "discothequebutton.";
const DISCOTHEQUE_PREF_TB_ITEM_INSTALLED = DISCOTHEQUE_PREF_PREFIX + "toolbariteminstalled";
const DISCOTHEQUE_TOOLBAR_BUTTON_ID = "discotheque-toolbar-button";

var refresh = setInterval("CheckLocation()", 1000);
var last_url = "";

//al click del pulsante apre la home di discotheque
var discothequeButton = {	
	loadBookmarklet: function () {
		var address = getBrowser().contentWindow.location.href; // current page url
		window.top.getBrowser().selectedTab = window.top.getBrowser().addTab("http://www.discotheque.me");
	}
}

//controlla a polling l'url corrente e se è cambiato esegue un controllo per vedere se è un video youtube
function CheckLocation(event){
	var url = "" + window._content.document.location;
	if (url != last_url && url.search("youtube.com/watch?") > -1) {
		var xhr = new XMLHttpRequest();
		xhr.open("GET", "http://www.discotheque.me/services/visit/youtube/?url=" + escape(url), true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				last_url = url;
			}
		}
		xhr.send();
	}
}

/*
 * Monster hack to auto-add hootsuite to FF toolbar
 */
function installDiscothequeToolbarItem() {
	var prefs = Components.classes["@mozilla.org/preferences;1"].getService(Components.interfaces.nsIPrefService);
	var db = prefs.getBranch(null);
	dump("in installToolbarItem");
	
	try {
		if (db.getBoolPref(DISCOTHEQUE_PREF_TB_ITEM_INSTALLED)) return;
	}
	catch(e) {
	}
  
	var buttonId = DISCOTHEQUE_TOOLBAR_BUTTON_ID;
	var afterId;
	var toolbarId;
	
	// check toolbar
	
	toolbarId = "nav-bar";	
	var tb = document.getElementById(toolbarId);
	if (tb) {
		afterId = "home-button";
	} else {
		toolbarId = "mail-bar";
		tb = document.getElementById(toolbarId);
		if (tb) {
			afterId = "button-stop";
		} else {
			toolbarId = "composeToolbar";
			tb = document.getElementById(toolbarId);
			if (tb) {
				afterId = "button-save";
			} else {
				return;
			}
		}
	}
  
	// check button
  
	var currentSet = tb.getAttribute(tb.hasAttribute("currentset") ? "currentset" : "defaultset");
	if (!currentSet) return;
	db.setBoolPref(DISCOTHEQUE_PREF_TB_ITEM_INSTALLED, true);
	var ids = currentSet.split(",");
	var len = ids.length;
	var j = -1;
	for (var i = 0; i < len; i++) {
		if (ids[i] == buttonId) return;
		if (ids[i] == afterId) j = i;
	}
  
	// not found - add
  
	var newSet;
	if (j == -1) {
		newSet =  currentSet + "," + buttonId;
	} else {
		var k = 0;
		for (var n = 0; n <= j ; n++) {
			k = currentSet.indexOf(",", k) + 1;
		}
		newSet =  currentSet.slice(0, k) + buttonId + "," + currentSet.slice(k);
	}
	tb.setAttribute("currentset", newSet);
	tb.currentSet = newSet;
	document.persist(toolbarId, "currentset");
  
	// see http://developer.mozilla.org/en/docs/Code_snippets:Toolbar
	try {
		BrowserToolboxCustomizeDone(true);
	}
	catch (e) { }
}

window.addEventListener("load", installDiscothequeToolbarItem, false);