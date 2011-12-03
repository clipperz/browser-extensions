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
    this._cards = null;
    this._directLoginMap = null;
    this._lastActRef = null;
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
        localStorage['cards'] = JSON.stringify(cards);
    },

    'setDirectLoginMap': function (directLoginMap) {
        this._directLoginMap = directLoginMap;
    },

    'lastActRef': function () {
        return this._lastActRef;
    },

    'setLastActRef': function (ref) {
        this._lastActRef = ref;
    },

    'loginController': function () {
        return this._loginController;
    },

    //-----------------------------------------------------------------------------

    'run': function() {
        var cards = localStorage['cards'];
        if (cards) {
            try {
                this._cards = JSON.parse(cards);
            } catch(e) {
                //ignore
            }
        }
        if (this._cards) {
            this._directLoginMap = {};
            for (var c in this._cards) {
                var card = this._cards[c];
                for (var d in card.directLogins) {
                    var directLogin = card.directLogins[d];
                    this._directLoginMap[directLogin.reference] = new Clipperz.PM.DataModel.DirectLoginPlainWrapper(directLogin);
                }
            }
        } else {
            var username = localStorage['username'];
            var passphrase = localStorage['passphrase'];
            if (username && passphrase) {
                this._loginController.login({username:username, passphrase:passphrase});
            }
        }
    },

    'login': function(parameters) {
        this._loginController.login({username:parameters.username, passphrase:parameters.passphrase, progressListener:parameters.progressListener});
    },

    //-----------------------------------------------------------------------------

    'handleLogout': function(anEvent) {
        this._cards = null;
        this._directLoginMap = null;
        this._lastActRef = null;
    },

    //-----------------------------------------------------------------------------

    'handleDirectLogin': function (aDirectLoginRef) {
        var directLogin = this._directLoginMap[aDirectLoginRef];
        if (directLogin) {
            Clipperz.PM.UI.Common.Controllers.DirectLoginRunner.openDirectLogin(directLogin);
        }
    },

    'handleCopy': function (value) {
        var bg = chrome.extension.getBackgroundPage();
        var clipboardholder = bg.document.getElementById("clipboardholder");
        clipboardholder.style.display = "block";
        clipboardholder.value = value;
        clipboardholder.select();
        bg.document.execCommand("copy");
        clipboardholder.style.display = "none";
    },

    //-----------------------------------------------------------------------------
    __syntaxFix__: "syntax fix"
});
