const CLIPPERZ_PREF_PREFIX = "clipperzbutton.";
const CLIPPERZ_PREF_TB_ITEM_INSTALLED = CLIPPERZ_PREF_PREFIX + "toolbariteminstalled";
const CLIPPERZ_TOOLBAR_BUTTON_ID = "clipperz-toolbar-button";

var clipperz_panel = null;
var clipperz_pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
var clipperz_panel_top = "50";
var clipperz_panel_left = "50";
var clipperz_panel_width = "330";
var clipperz_panel_height = "500";

function saveParams(){
	if(clipperz_panel != null){
		if(clipperz_panel.closed){
			clipperz_pref.setCharPref("clipperz.window-opened", "0");
		}
		else{
			clipperz_panel_top = clipperz_panel.screenY;
			clipperz_panel_left = clipperz_panel.screenX;
			clipperz_panel_width = clipperz_panel.innerWidth;
			clipperz_panel_height = clipperz_panel.innerHeight;
			clipperz_pref.setCharPref("clipperz.position-top", clipperz_panel_top);
			clipperz_pref.setCharPref("clipperz.position-left", clipperz_panel_left);
			clipperz_pref.setCharPref("clipperz.position-width", clipperz_panel_width);
			clipperz_pref.setCharPref("clipperz.position-height", clipperz_panel_height);
		}
	}
}

function initClipperz(){
	installClipperzButton();
	clipperz_pref.setCharPref("clipperz.window-opened", "0");
	var modifiers = clipperz_pref.getCharPref("clipperz.shortcut-modifiers"); 
	var letter = clipperz_pref.getCharPref("clipperz.shortcut-letter");
	var shortcut = document.getElementById("open-clipperz");
	shortcut.setAttribute("modifiers", modifiers);
	shortcut.setAttribute("key", letter);
	clipperz_panel_top = clipperz_pref.getCharPref("clipperz.position-top");
	clipperz_panel_left = clipperz_pref.getCharPref("clipperz.position-left");
	clipperz_panel_width = clipperz_pref.getCharPref("clipperz.position-width");
	clipperz_panel_height = clipperz_pref.getCharPref("clipperz.position-height");
	params = setInterval(saveParams, 1000);
	if (navigator.appVersion.indexOf("Mac")!=-1){
		document.getElementById("ctrl").setAttribute("hidden","true");
	}
}

function restartFirefox(){
	a=Components.interfaces.nsIAppStartup,Components.classes["@mozilla.org/toolkit/app-startup;1"].getService(a).quit(a.eRestart | a.eAttemptQuit);
}

function keyChanged(){
	if (confirm("Shortcut changed. Restart Firefox now?"))
		restartFirefox();
}

function modChanged(val){
	if(val != clipperz_pref.getCharPref("clipperz.shortcut-modifiers")){
		if (confirm("Shortcut changed. Restart Firefox now?"))
			restartFirefox();
	}
}

function resetWindow(){
	clipperz_pref.setCharPref("clipperz.position-top", "50");
	clipperz_pref.setCharPref("clipperz.position-left", "50");
	clipperz_pref.setCharPref("clipperz.position-width", "330");
	clipperz_pref.setCharPref("clipperz.position-height", "500");
	clipperz_panel_top = "50";
	clipperz_panel_left = "50";
	clipperz_panel_width = "330";
	clipperz_panel_height = "500";
	
	if (confirm("Window properties resetted. Restart Firefox now?"))
		restartFirefox();
}

//click handler
var clipperzButton = {	
	openPanel: function () {
		if (clipperz_pref.getCharPref("clipperz.window-opened") == "0"){
		    clipperz_panel = window.open("https://www.clipperz.com/beta/index.html?compact", "Clipperz", "toolbar=no,resizable=yes,scrollbars=no,titlebar=yes,location=no,menubar=no,status=no,top="+clipperz_panel_top+",left="+clipperz_panel_left+",width="+clipperz_panel_width+",height="+clipperz_panel_height);
			clipperz_pref.setCharPref("clipperz.window-opened", "1");
		}
		else{
		  	clipperz_panel.blur();
		  	clipperz_panel.focus();
		}
	},
	
	openPreferences : function() {
	  	if (null == this._preferencesWindow || this._preferencesWindow.closed) {
		    let instantApply = Application.prefs.get("browser.preferences.instantApply");
		    let features = "chrome,titlebar,toolbar,centerscreen" + (instantApply.value ? ",dialog=no" : ",modal");
		    this._preferencesWindow = window.openDialog( "chrome://clipperzbutton/content/options.xul", "preferences-window", features);
		}
		this._preferencesWindow.focus();
	}
}

//install button
function installClipperzButton() {
	var prefs = Components.classes["@mozilla.org/preferences;1"].getService(Components.interfaces.nsIPrefService);
	var db = prefs.getBranch(null);

	try {
		if (db.getBoolPref(CLIPPERZ_PREF_TB_ITEM_INSTALLED)) return;
	}
	catch(e) {
	}

	var buttonId = CLIPPERZ_TOOLBAR_BUTTON_ID;
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
	db.setBoolPref(CLIPPERZ_PREF_TB_ITEM_INSTALLED, true);
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

	try {
		BrowserToolboxCustomizeDone(true);
	}
	catch (e) { }
}

window.addEventListener("load", initClipperz, false);