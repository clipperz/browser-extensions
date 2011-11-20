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

Clipperz.PM.UI.Extensions.Chrome.Controllers.AppController = function(args) {

	this._user = null;
	this._tabSlotNames = {
		//tabName:		 slotName
		'cards':		'cardTree',
	};
	
	//controllers
	this._cardsController	= null;
	
	return this;
}

MochiKit.Base.update(Clipperz.PM.UI.Extensions.Chrome.Controllers.AppController.prototype, {

	'toString': function() {
		return "Clipperz.PM.UI.Extensions.Chrome.Controllers.AppController";
	},

	//-----------------------------------------------------------------------------
	
	'setUser': function(anUser) {
		this._user = anUser;
	},
	
	'user': function() {
		return this._user;
	},

	//-----------------------------------------------------------------------------

	'slotNameForTab': function(aTabName) {
		return this._tabSlotNames[aTabName];
	},
	
	'hideAllAppPageTabSlots': function() {
		var aTabName;
		
		for (aTabName in this._tabSlotNames) {
			this.appPage().hideSlot(this.slotNameForTab(aTabName));
		}
	},
	
	//-----------------------------------------------------------------------------

	'appPage': function() {
		if (this._appPage == null) {
			this._appPage = new Clipperz.PM.UI.Extensions.Chrome.Components.AppPage();
		}
		
		return this._appPage;
	},
	
	'cardsController': function() {
		if (this._cardsController == null) {
			this._cardsController = new Clipperz.PM.UI.Extensions.Chrome.Controllers.CardsController();
		}
		
		return this._cardsController;
	},
	
	//-----------------------------------------------------------------------------

	'run': function(args) {
		var deferredResult;
		var	slot;
		var	page;
		var user;
		
		slot = args.slot;
		user = args.user;

		this.setUser(user);
		
		slot.setContent(this.appPage());

		this.hideAllAppPageTabSlots();
		this.appPage().showSlot(this.slotNameForTab('cards'));
		
		deferredResult = new Clipperz.Async.Deferred("AppController.run", {trace:false});

		deferredResult.addMethod(this.cardsController(),        'run', {slot:this.appPage().slotNamed('cardTree'), tree:this.appPage().getElement('tree'), user:user});
		deferredResult.addCallback(MochiKit.Signal.signal, Clipperz.Signal.NotificationCenter, 'CARDS_CONTROLLER_DID_RUN');
		deferredResult.callback();
	},

	//=============================================================================

	'handleLogout': function(anEvent) {
		var deferredResult;

		deferredResult = new Clipperz.Async.Deferred("AppController.handleLogout", {trace:false});
		deferredResult.addMethod(this.user(), 'logout');
		deferredResult.addCallback(MochiKit.Signal.signal, this, 'logout');
		deferredResult.callback();
		
		return deferredResult;
	},

	//=============================================================================
	__syntaxFix__: "syntax fix"
});
