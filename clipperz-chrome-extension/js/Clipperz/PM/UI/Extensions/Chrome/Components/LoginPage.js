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

Clipperz.Base.module('Clipperz.PM.UI.Extensions.Chrome.Components');

Clipperz.PM.UI.Extensions.Chrome.Components.LoginPage = function(args) {
	args = args || {};

	Clipperz.PM.UI.Extensions.Chrome.Components.LoginPage.superclass.constructor.apply(this, arguments);

	this._slots = {
		'loginForm':	this.getId('loginBoxSlot')
	};

	return this;
}

//=============================================================================

Clipperz.Base.extend(Clipperz.PM.UI.Extensions.Chrome.Components.LoginPage, Clipperz.PM.UI.Common.Components.BaseComponent, {

	//-------------------------------------------------------------------------

	'toString': function () {
		return "Clipperz.PM.UI.Extensions.Chrome.Components.LoginPage component";
	},

	//-------------------------------------------------------------------------

	'renderSelf': function(/*aContainer, aPosition*/) {
		this.append(this.element(), [
			{tag:'div', id:this.getId('loginBoxSlot')}
		]);
	},

	//-------------------------------------------------------------------------

	__syntaxFix__: "syntax fix"
});
