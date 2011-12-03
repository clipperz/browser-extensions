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

Clipperz.PM.UI.Extensions.Chrome.Controllers.PopupController = function(args) {
	this._args = args;

    //  controllers
    this._loginController = null;
    this._appController =   null;

    //  components
    this._headerComponent = null;
    this._pageComponent =   null;

	return this;
}

MochiKit.Base.update(Clipperz.PM.UI.Extensions.Chrome.Controllers.PopupController.prototype, {

	'toString': function() {
		return "Clipperz.PM.UI.Extensions.Chrome.Controllers.PopupController";
	},

	'args': function () {
		return this._args;
	},

    //-----------------------------------------------------------------------------

    'headerComponent': function() {
        if (this._headerComponent == null) {
            this._headerComponent = new Clipperz.PM.UI.Extensions.Chrome.Components.PageHeader();
            MochiKit.Signal.connect(this._headerComponent, 'logout', Clipperz.PM.RunTime.mainController, 'handleLogout');
            MochiKit.Signal.connect(this._headerComponent, 'logout', this, 'handleLogout');
            MochiKit.Signal.connect(this._headerComponent, 'reload', Clipperz.PM.RunTime.mainController, 'handleLogout');
            MochiKit.Signal.connect(this._headerComponent, 'reload', this, 'handleReload');
        }
        return this._headerComponent;
    },

    //-----------------------------------------------------------------------------

    'pageComponent': function() {
        if (this._pageComponent == null) {
            this._pageComponent = new Clipperz.PM.UI.Extensions.Chrome.Components.Page({element:MochiKit.DOM.getElement('mainDiv')});
        }
        return this._pageComponent;
    },

    //-----------------------------------------------------------------------------

    'loginController': function() {
        if (this._loginController == null) {
            this._loginController = new Clipperz.PM.UI.Extensions.Chrome.Controllers.LoginController(this.args());
            MochiKit.Signal.connect(this._loginController, 'userLoggedIn', this, 'handleLoggedIn');
        }
        return this._loginController;
    },

    'appController': function() {
        if (this._appController == null) {
            this._appController = new Clipperz.PM.UI.Extensions.Chrome.Controllers.AppController();
        }
        return this._appController;
    },

    //-----------------------------------------------------------------------------

	'run': function() {
        this.pageComponent().slotNamed('header').setContent(this.headerComponent());
        this.pageComponent().render();
        if (Clipperz.PM.RunTime.mainController.cards()) {
            MochiKit.Signal.signal(this.loginController(), 'userLoggedIn');
        } else {
            this.loginController().run({slot:this.pageComponent().slotNamed('body')});
        }
	},

    //-----------------------------------------------------------------------------

    'handleLoggedIn': function() {
        this.headerComponent().switchToLoggedMode();
        this.appController().run({slot:this.pageComponent().slotNamed('body')});
    },

    //-----------------------------------------------------------------------------

    'handleLogout': function(anEvent) {
        this.loginController().run({slot:this.pageComponent().slotNamed('body')});
    },

    'handleReload': function(anEvent) {
        delete localStorage['cards'];
        Clipperz.PM.RunTime.mainController.run();
        this.loginController().run({slot:this.pageComponent().slotNamed('body')});
    },

    //-----------------------------------------------------------------------------
	__syntaxFix__: "syntax fix"
});
