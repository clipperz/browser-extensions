/*

Copyright 2008-2011 Clipperz Srl

This file is part of Clipperz Community Edition.
Clipperz Community Edition is an online password manager.
For further information about its features and functionalities please
refer to http://www.clipperz.com.

* Clipperz Community Edition is free software: you can redistribute
  it and/or modify it under the terms of the GNU Affero General Public
  License as published by the Free Software Foundation, either version
  3 of the License, or (at your option) any later version.

* Clipperz Community Edition is distributed in the hope that it will
  be useful, but WITHOUT ANY WARRANTY; without even the implied
  warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
  See the GNU Affero General Public License for more details.

* You should have received a copy of the GNU Affero General Public
  License along with Clipperz Community Edition.  If not, see
  <http://www.gnu.org/licenses/>.

*/

Clipperz.Base.module('Clipperz.PM.UI.Extensions.Chrome.Controllers');

Clipperz.PM.UI.Extensions.Chrome.Controllers.LoginController = function(args) {
	this._args = args || {};

	this._loginPage = null;

	return this;
}

MochiKit.Base.update(Clipperz.PM.UI.Extensions.Chrome.Controllers.LoginController.prototype, {

	'toString': function() {
		return "Clipperz.PM.UI.Extensions.Chrome.Controllers.LoginController";
	},

	'args': function () {
		return this._args;
	},

	//-----------------------------------------------------------------------------

	'loginPage': function() {
		if (this._loginPage == null) {
			this._loginPage = new Clipperz.PM.UI.Extensions.Chrome.Components.LoginPage();
		}
		
		return this._loginPage;
	},

	//-----------------------------------------------------------------------------

	'run': function(args) {
		var	slot;
		var	loginPage;
		var	loginForm;

		slot = args.slot;

		loginForm =	new Clipperz.PM.UI.Extensions.Chrome.Components.LoginForm({'autocomplete': this.args()['autocomplete']});

		slot.setContent(this.loginPage());
		this.loginPage().slotNamed('loginForm').setContent(loginForm);

		MochiKit.Signal.connect(loginForm, 'doLogin', MochiKit.Base.method(this, 'doLogin', loginForm));
		MochiKit.Signal.connect(Clipperz.Signal.NotificationCenter, 'doLogin', MochiKit.Base.method(this, 'doLogin', loginForm));
	},

	//-----------------------------------------------------------------------------

	'doLogin': function(aLoginForm, anEvent) {
		var deferredResult;
		var	parameters;
//		var	shouldUseOTP;
		var loginProgress;
		var	user;
		var getPassphraseDelegate;

		parameters = anEvent;
//		shouldUseOTP = (typeof(parameters.passphrase) == 'undefined');

		getPassphraseDelegate = MochiKit.Base.partial(MochiKit.Async.succeed, parameters.passphrase);
		user = new Clipperz.PM.DataModel.User({'username':parameters.username, 'getPassphraseFunction':MochiKit.Base.method(Clipperz.PM.RunTime.popupController, 'getPassphrase')});

		loginProgress = new Clipperz.PM.UI.Extensions.Chrome.Components.LoginProgress();

		deferredResult = new Clipperz.Async.Deferred("LoginController.doLogin", {trace:false});
		deferredResult.addCallbackPass(MochiKit.Signal.signal, Clipperz.Signal.NotificationCenter, 'initProgress', {'steps':4});
		deferredResult.addMethod(Clipperz.PM.RunTime.popupController, 'setPassphraseDelegate', getPassphraseDelegate);
		deferredResult.addMethod(loginProgress, 'deferredShowModal', {deferredObject:deferredResult, openFromElement:aLoginForm.submitButtonElement()});
		deferredResult.addMethod(Clipperz.Crypto.PRNG.defaultRandomGenerator(), 'deferredEntropyCollection');
//		if (shouldUseOTP == false) {
			deferredResult.addMethod(user, 'login');
//		} else {
//			deferredResult.addMethod(user, 'loginUsingOTP', parameters.username, parameters.otp);
//		}
		deferredResult.addCallback(function(aLoginProgress, res) {
			aLoginProgress.disableCancel();
			return res;
		}, loginProgress);
		deferredResult.addCallback(function () {
			MochiKit.Signal.connect(Clipperz.Signal.NotificationCenter, 'CARDS_CONTROLLER_DID_RUN',	MochiKit.Base.method(loginProgress, 'deferredHideModalAndRemove', {closeToElement:MochiKit.DOM.currentDocument().body}));
		});
		deferredResult.addMethod(this, 'userLoggedIn', user, loginProgress, aLoginForm);
		deferredResult.addErrback (MochiKit.Base.method(this, 'handleFailedLogin', loginProgress));

		deferredResult.addErrback (MochiKit.Base.method(loginProgress, 'deferredHideModalAndRemove', {closeToElement:aLoginForm.submitButtonElement()}));
		deferredResult.addErrbackPass (MochiKit.Base.method(aLoginForm, 'focusOnPassphraseField'));
		deferredResult.addBoth(MochiKit.Base.method(Clipperz.PM.RunTime.popupController, 'removePassphraseDelegate', getPassphraseDelegate));
		deferredResult.callback();

		MochiKit.Signal.connect(loginProgress, 'cancelEvent', deferredResult, 'cancel');

		return deferredResult;
	},

	//-----------------------------------------------------------------------------

	'userLoggedIn': function(aUser) {
//Clipperz.log(">>> LoginController.userLoggedIn");
		MochiKit.Signal.signal(this, 'userLoggedIn', {user: aUser});
//Clipperz.log("<<< LoginController.userLoggedIn");
	},

	//=========================================================================

	'handleFailedLogin': function(aLoginProgress, anError) {
		var result;

//console.log("anError", anError);
		if (anError instanceof MochiKit.Async.CancelledError) {
			result = anError;
		} else {
			var deferredResult;
			
MochiKit.Logging.logError("## MainController - FAILED LOGIN: " + anError);
			deferredResult = new MochiKit.Async.Deferred();

			aLoginProgress.showErrorMessage(chrome.i18n.getMessage('popup_page_login_controller_error_message'));
//			Clipperz.NotificationCenter.register(loginProgress, 'cancelEvent', deferredResult, 'callback');
			MochiKit.Signal.connect(aLoginProgress, 'cancelEvent', deferredResult, 'callback');
			deferredResult.addCallback(MochiKit.Async.fail, anError)
			result = deferredResult;
		}
	
		return result;
	},

	'handleGenericError': function(anError) {
		var result;
		
		if (anError instanceof MochiKit.Async.CancelledError) {
			result = anError;
		} else {
MochiKit.Logging.logError("## MainController - GENERIC ERROR" + "\n" + "==>> " + anError + " <<==\n" + anError.stack);
//console.log(anError);
			result = new MochiKit.Async.CancelledError(anError);
		}
	
		return result;
	},

	//-----------------------------------------------------------------------------
	__syntaxFix__: "syntax fix"
});
