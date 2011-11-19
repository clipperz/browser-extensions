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

Clipperz.PM.UI.Extensions.Chrome.Components.LoginForm = function(args) {
	args = args || {};

	this._autocomplete = args.autocomplete || 'off';

	Clipperz.PM.UI.Extensions.Chrome.Components.LoginForm.superclass.constructor.apply(this, arguments);

	this._slots = {
		'passphraseEntropy':	this.getId('passphraseEntropy')
	};

	return this;
}

//=============================================================================

Clipperz.Base.extend(Clipperz.PM.UI.Extensions.Chrome.Components.LoginForm, Clipperz.PM.UI.Common.Components.BaseComponent, {

	//-------------------------------------------------------------------------

	'toString': function () {
		return "Clipperz.PM.UI.Extensions.Chrome.Components.LoginForm component";
	},

	'autocomplete': function () {
		return this._autocomplete;
	},

	//-------------------------------------------------------------------------

	'renderSelf': function() {
		this.append(this.element(), {tag:'div', id:'loginBox', children:[
			{tag:'div', cls:'header'},
			{tag:'div', cls:'body', id:this.getId('body'), children:[
				{tag:'div', id:this.getId('loginForm'), children:[
					{tag:'div', children:[
						{tag:'h4', html:chrome.i18n.getMessage('popup_page_login_form_title')},
//						{tag:'form', cls:'loginForm', autocomplete:this.autocomplete(), children:[
						{tag:'form', id:this.getId('form'), cls:'loginForm', children:[
							{tag:'label', html:chrome.i18n.getMessage('popup_page_login_form_username_label'), 'for':this.getId('usernameField')},
							{tag:'input', id:this.getId('usernameField'), type:'text', cls:'username'/*, value:'joe'*/},
							{tag:'ul', id:this.getId('passwordOptions'), children:[
								{tag:'li', id:this.getId('passphraseOption'), children:[
									{tag:'label', html:chrome.i18n.getMessage('popup_page_login_form_passphrase_label'), 'for':this.getId('passphraseField')},
									{tag:'input', id:this.getId('passphraseField'), type:'password', cls:'password'/*, value:'clipperz'*/}
								]}	//	,
/*
								{tag:'li', id:this.getId('otpOption'), children:[
									{tag:'label', html:'one-time password', 'for':this.getId('otpField_1')},
									{tag:'input', id:this.getId('otpField_1'), type:'text', cls:'otp', value:'abcd-efgh'},
									{tag:'input', id:this.getId('otpField_2'), type:'text', cls:'otp', value:'abcd-efgh'},
									{tag:'input', id:this.getId('otpField_3'), type:'text', cls:'otp', value:'abcd-efgh'},
									{tag:'input', id:this.getId('otpField_4'), type:'text', cls:'otp', value:'abcd-efgh'}
								]}
*/
							]},
//							{tag:'input', id:this.getId('otpCheckbox'), type:'checkbox', cls:'checkbox'},
//							{tag:'label', html:'use a one-time passphrase', 'for':this.getId('otpCheckbox'), cls:'checkbox'},

							{tag:'input', id:this.getId('submitButton'), type:'submit', value:chrome.i18n.getMessage('popup_page_login_form_login_button_text'), cls:'submit'}
						]}
					]}
				]}
			]},
			{tag:'div', cls:'footer'}
		]});

		if (this.autocomplete() == 'off') {
			MochiKit.DOM.updateNodeAttributes(this.getElement('form'), {autocomplete:'off'});
		}

		this.getElement('usernameField').focus();

		MochiKit.Signal.connect(this.getElement('loginForm'), 'onsubmit', this, 'loginEventHandler');
	},

	//-----------------------------------------------------------------------------

	'focusOnPassphraseField': function () {
		this.getElement('passphraseField').focus();
		this.getElement('passphraseField').select();
	},

	//-----------------------------------------------------------------------------
/*
	'showOTPFields': function() {
		this.hideElement('passphraseOption');
		this.showElement('otpOption');
	},
*/
	//-------------------------------------------------------------------------
	
	'loginEventHandler': function(anEvent) {
		var	username;
		var passphrase;
//		var shouldUseOTP;
//		var otp;
		var signalArguments;

		anEvent.preventDefault();

		username = this.getElement('usernameField').value;
		passphrase = this.getElement('passphraseField').value;
//		otp =	this.getElement('otpField_1').value +
//				this.getElement('otpField_2').value +
//				this.getElement('otpField_3').value +
//				this.getElement('otpField_4').value;
//		shouldUseOTP = this.getElement('otpCheckbox').checked;

		signalArguments = {username:username};

//		if (shouldUseOTP) {
//			signalArguments.otp = otp;
//		} else {
			signalArguments.passphrase = passphrase;
//		}

		MochiKit.Signal.signal(this, 'doLogin', signalArguments);
	},

	//-------------------------------------------------------------------------

	'submitButtonElement': function() {
		return this.getElement('submitButton');
	},

	//-------------------------------------------------------------------------

	__syntaxFix__: "syntax fix"
});
