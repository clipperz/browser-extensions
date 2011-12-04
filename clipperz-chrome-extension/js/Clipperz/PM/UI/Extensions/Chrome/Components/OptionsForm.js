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

Clipperz.PM.UI.Extensions.Chrome.Components.OptionsForm = function(args) {
	args = args || {};
	
	this._autocomplete = args.autocomplete || 'off';

	Clipperz.PM.UI.Extensions.Chrome.Components.OptionsForm.superclass.constructor.apply(this, arguments);

	return this;
}

//=============================================================================

Clipperz.Base.extend(Clipperz.PM.UI.Extensions.Chrome.Components.OptionsForm, Clipperz.PM.UI.Common.Components.BaseComponent, {

	//-------------------------------------------------------------------------

	'toString': function () {
		return "Clipperz.PM.UI.Extensions.Chrome.Components.OptionsForm component";
	},

	'autocomplete': function () {
		return this._autocomplete;
	},

	//-------------------------------------------------------------------------

	'renderSelf': function() {
		this.append(this.element(), {tag:'div', id:'optionsBox', children:[
			{tag:'div', cls:'header', children:[
			    {tag:'h1', html:chrome.i18n.getMessage('options_page_title')}
			]},
			{tag:'div', cls:'body', id:this.getId('body'), children:[
                {tag:'form', id:this.getId('form'), cls:'optionsForm', children:[
                    {tag:'input', id:this.getId('saveCredentialsCheckbox'), type:'checkbox', cls:'checkbox'},
                    {tag:'label', html:chrome.i18n.getMessage('options_page_save_credentials_label'), 'for':this.getId('saveCredentialsCheckbox'), cls:'checkbox'},

                    {tag:'label', html:chrome.i18n.getMessage('options_page_username'), 'for':this.getId('usernameField')},
                    {tag:'input', id:this.getId('usernameField'), type:'text', cls:'username'/*, value:'joe'*/},

                    {tag:'label', html:chrome.i18n.getMessage('options_page_passphrase'), 'for':this.getId('passphraseField')},
                    {tag:'input', id:this.getId('passphraseField'), type:'password', cls:'password'/*, value:'clipperz'*/},

                    {tag:'label', html:chrome.i18n.getMessage('options_page_tree_separator'), 'for':this.getId('treeSeparatorField')},
                    {tag:'input', id:this.getId('treeSeparatorField'), type:'text', cls:'treeSeparator'},
                    
                    {tag:'input', id:this.getId('submitButton'), type:'submit', value:chrome.i18n.getMessage('options_page_save'), cls:'submit'},
                    {tag:'div', id:'confirmation', html:chrome.i18n.getMessage('options_page_confirmation')}
                ]}
			]},
			{tag:'div', cls:'footer'}
		]});

		if (this.autocomplete() == 'off') {
			MochiKit.DOM.updateNodeAttributes(this.getElement('form'), {autocomplete:'off'});
		}
		
		this.getElement('saveCredentialsCheckbox').focus();

		MochiKit.Signal.connect(this.getElement('saveCredentialsCheckbox'), 'onclick', this, 'onSaveCredentialsCheckboxClick');
        MochiKit.Signal.connect(this.getElement('body'), 'onsubmit', this, 'saveOptionsEventHandler');
	},
	
	'initFields': function(args) {
	        this.getElement('treeSeparatorField').value = args.treeSeparator;
            this.getElement('saveCredentialsCheckbox').checked = args.shouldSaveCredentials;
            var elUsernameField = this.getElement('usernameField');
            var elPassphraseField = this.getElement('passphraseField');
            elUsernameField.disabled = !args.shouldSaveCredentials;
            elPassphraseField.disabled = !args.shouldSaveCredentials;
            if (args.shouldSaveCredentials) {
                elUsernameField.value = args.username;
                elPassphraseField.value = args.passphrase;
            }
	},

    //-----------------------------------------------------------------------------

    'saveOptionsEventHandler': function(anEvent) {
        anEvent.preventDefault();

        var signalArguments = {
            shouldSaveCredentials: this.getElement('saveCredentialsCheckbox').checked,
            username: this.getElement('usernameField').value,
            passphrase: this.getElement('passphraseField').value,
            treeSeparator: this.getElement('treeSeparatorField').value
        };

        MochiKit.Signal.signal(this, 'saveOptions', signalArguments);
        var el = this.element();
        MochiKit.DOM.addElementClass(el, 'saved');
        setTimeout(function(){MochiKit.DOM.removeElementClass(el, 'saved')}, 1000);
    },
    
    'onSaveCredentialsCheckboxClick': function(anEvent) {
        var shouldSaveCredentials = this.getElement('saveCredentialsCheckbox').checked;
        var elUsernameField = this.getElement('usernameField');
        var elPassphraseField = this.getElement('passphraseField');
        elUsernameField.disabled = !shouldSaveCredentials;
        elPassphraseField.disabled = !shouldSaveCredentials;
        elUsernameField.value = "";
        elPassphraseField.value = "";
    },

	//-------------------------------------------------------------------------

	__syntaxFix__: "syntax fix"
});
