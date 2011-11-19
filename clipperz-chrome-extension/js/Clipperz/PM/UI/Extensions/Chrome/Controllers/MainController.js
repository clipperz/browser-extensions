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

Clipperz.PM.UI.Extensions.Chrome.Controllers.MainController = function(args) {
	this._args = args;
    this._user = null;
    this._logining = false;
	
	return this;
}

MochiKit.Base.update(Clipperz.PM.UI.Extensions.Chrome.Controllers.MainController.prototype, {

	'toString': function() {
		return "Clipperz.PM.UI.Extensions.Chrome.Controllers.MainController";
	},

	'args': function () {
		return this._args;
	},

    'user': function () {
        return this._user;
    },

    'logining': function () {
        return this._logining;
    },
    
    'popup': function () {
        var popups = chrome.extension.getViews({type: "popup"});
        if (popups.length != 0) {
          return popups[0];
        }
        return null;
    },

	//-----------------------------------------------------------------------------

	'run': function() {
        var username = localStorage['username'];
        var passphrase = localStorage['passphrase'];
        if (username && passphrase && !this._user) {
            this._logining = true;
            var getPopup = this.popup;
            var getPassphrase = MochiKit.Base.partial(MochiKit.Async.succeed, passphrase);
            var user = new Clipperz.PM.DataModel.User({'username':username, 'getPassphraseFunction':getPassphrase});
            var deferredResult = new Clipperz.Async.Deferred("MainController.doLogin", {trace:false});
            deferredResult.addMethod(Clipperz.Crypto.PRNG.defaultRandomGenerator(), 'deferredEntropyCollection');
            deferredResult.addMethod(user, 'login');
            deferredResult.addMethod(this, 'handleLoggedIn', {user: user});
            deferredResult.addCallback(function () {
                var popup = getPopup();
                if (popup) {
                    popup.MochiKit.Signal.signal(popup.Clipperz.PM.RunTime.popupController.loginController(), 'userLoggedIn', {user: user});
                }
            });
            deferredResult.addErrback(function () {
                this._logining = false;
                var popup = getPopup();
                if (popup) {
                    popup.MochiKit.Signal.signal(popup.Clipperz.PM.RunTime.popupController.headerComponent(), 'logout');
                }
            });
            deferredResult.callback();
        }
	},

    //-------------------------------------------------------------------------

    'handleLoggedIn': function(anEvent) {
        this._logining = false;
        this._user = anEvent['user'];
    },

	//-----------------------------------------------------------------------------

	'handleLogout': function(anEvent) {
		this._user = null;
	},

	//-----------------------------------------------------------------------------
	__syntaxFix__: "syntax fix"
});
