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
	this._cards = null;
    this._cardRows = null;
    this._loginController = new Clipperz.PM.UI.Extensions.Chrome.Controllers.BackgroundLoginController();
	return this;
};

MochiKit.Base.update(Clipperz.PM.UI.Extensions.Chrome.Controllers.MainController.prototype, {

	'toString': function() {
		return "Clipperz.PM.UI.Extensions.Chrome.Controllers.MainController";
	},

    'cards': function () {
        return this._cards;
    },

    'setCards': function (cards) {
        this._cards = cards;
    },

    'setCardRows': function (cardRows) {
        this._cardRows = cardRows;
    },

    'setUser': function (user) {
        this._user = user;
    },

    'loginController': function () {
        return this._loginController;
    },

	//-----------------------------------------------------------------------------

	'run': function() {
        var username = localStorage['username'];
        var passphrase = localStorage['passphrase'];
        if (username && passphrase) {
            this._loginController.login({username:username, passphrase:passphrase});
        }
	},

    'login': function(parameters) {
        this._loginController.login({username:parameters.username, passphrase:parameters.passphrase, progressListener:parameters.progressListener});
    },

	//-----------------------------------------------------------------------------

	'handleLogout': function(anEvent) {
        this._user.logout();
        this._user = null;
        this._cards = null;
        this._cardRows = null;
    },

	//-----------------------------------------------------------------------------

    'handleDirectLogin': function (aDirectLoginRef) {
        for (var r in this._cardRows) {
            var directLogins = this._cardRows[r]['Cards.directLogins'];
            for (var d in directLogins) {
                var directLogin = directLogins[d];
                if (aDirectLoginRef == directLogin['_reference']) {
                    Clipperz.PM.UI.Common.Controllers.DirectLoginRunner.openDirectLogin(directLogin['_rowObject']);
                    break;
                }
            }
        }
    },

	//-----------------------------------------------------------------------------
	__syntaxFix__: "syntax fix"
});
