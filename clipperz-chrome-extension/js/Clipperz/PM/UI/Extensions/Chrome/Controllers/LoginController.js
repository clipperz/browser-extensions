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
		var slot = args.slot;
		var loginForm =	new Clipperz.PM.UI.Extensions.Chrome.Components.LoginForm({'autocomplete': this.args()['autocomplete']});
		slot.setContent(this.loginPage());
		this.loginPage().slotNamed('loginForm').setContent(loginForm);

        var loginProgress = new Clipperz.PM.UI.Extensions.Chrome.Components.LoginProgress();
        var self = this;
        var loginProgressListener = {
            'loginProgressChanged': function(backgroundLoginProgress, event) {
                if (event == 'start') {
                    var deferred1 = new Clipperz.Async.Deferred("LoginController.showProgress", {trace:false});
                    deferred1.addMethod(loginProgress, 'deferredShowModal', {deferredObject:deferred1, openFromElement:loginForm.submitButtonElement()});
                    deferred1.addCallback(function () {
                        MochiKit.Signal.connect(loginProgress, 'cancelEvent', backgroundLoginProgress, 'cancelLogin');
                        MochiKit.Signal.signal(Clipperz.PM.UI.Common.Controllers.ProgressBarController.defaultController, 'updateProgress', backgroundLoginProgress.completedPercentage());
                    });
                    deferred1.callback();
                    if (!backgroundLoginProgress.canBeCancelled()) {
                        loginProgress.disableCancel();
                    }

                } else if (event == 'stop') {
                    if (backgroundLoginProgress.errorOccurred()) {
                        loginProgress.showErrorMessage(backgroundLoginProgress.lastError());
                    } else {
                        var deferred2 = new Clipperz.Async.Deferred("LoginController.hideProgress", {trace:false});
                        deferred2.addMethod(loginProgress, 'deferredHideModalAndRemove', {closeToElement:loginForm.submitButtonElement()});
                        deferred2.callback();
                        MochiKit.Signal.signal(self, 'userLoggedIn');
                    }
                } else if (event == 'disableCancel') {
                    loginProgress.disableCancel();
                } else if (event == 'updateProgressHandler') {
                    MochiKit.Signal.signal(Clipperz.PM.UI.Common.Controllers.ProgressBarController.defaultController, 'updateProgress', backgroundLoginProgress.completedPercentage());
                } else if (event == 'cancelLogin') {
                    var deferred3 = new Clipperz.Async.Deferred("LoginController.hideProgress", {trace:false});
                    deferred3.addMethod(loginProgress, 'deferredHideModalAndRemove', {closeToElement:loginForm.submitButtonElement()});
                    deferred3.callback();
                }
            }
        };

        var backgroundLoginController = Clipperz.PM.RunTime.mainController.loginController();
        if (backgroundLoginController.inProgress()) {
            backgroundLoginController.setProgressListener(loginProgressListener);
        }

        var doLogin = function(anEvent) {
            Clipperz.PM.RunTime.mainController.login({username:anEvent.username, passphrase:anEvent.passphrase, progressListener:loginProgressListener});
        };

        MochiKit.Signal.connect(loginForm, 'doLogin', doLogin);
        MochiKit.Signal.connect(Clipperz.Signal.NotificationCenter, 'doLogin', doLogin);
	},

	//-----------------------------------------------------------------------------
	__syntaxFix__: "syntax fix"
});
