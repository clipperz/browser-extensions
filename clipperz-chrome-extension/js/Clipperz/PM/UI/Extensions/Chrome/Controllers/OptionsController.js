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

Clipperz.PM.UI.Extensions.Chrome.Controllers.OptionsController = function(args) {
    this._optionsPage = null;
    return this;
}

MochiKit.Base.update(Clipperz.PM.UI.Extensions.Chrome.Controllers.OptionsController.prototype, {

    'toString' : function() {
        return "Clipperz.PM.UI.Extensions.Chrome.Controllers.OptionsController";
    },

    //-----------------------------------------------------------------------------

    'optionsPage': function() {
        if (this._optionsPage == null) {
            this._optionsPage = new Clipperz.PM.UI.Extensions.Chrome.Components.OptionsPage({element:MochiKit.DOM.getElement('mainDiv')});
        }
        
        return this._optionsPage;
    },
    
    //-----------------------------------------------------------------------------

    'run' : function(args) {
        var optionsForm = new Clipperz.PM.UI.Extensions.Chrome.Components.OptionsForm();

        this.optionsPage().render();
        this.optionsPage().slotNamed('optionsForm').setContent(optionsForm);
        
        var treeSeparator = localStorage['treeSeparator'];
        if (!treeSeparator) {
            treeSeparator = "";
        }
        var initialValues = {treeSeparator: treeSeparator };
        var username = localStorage['username'];
        var passphrase = localStorage['passphrase'];
        if (username && passphrase) {
            initialValues.shouldSaveCredentials = true;
            initialValues.username = username;
            initialValues.passphrase = passphrase;
        } else {
            initialValues.shouldSaveCredentials = false;
        }
        optionsForm.initFields(initialValues);

        MochiKit.Signal.connect(optionsForm, 'saveOptions', MochiKit.Base.method(this, 'handleSaveOptions', optionsForm));
        MochiKit.Signal.connect(Clipperz.Signal.NotificationCenter, 'saveOptions', MochiKit.Base.method(this, 'handleSaveOptions', optionsForm));
    },
    //=============================================================================
    
    'handleSaveOptions' : function(aOptionsForm, anEvent) {
        localStorage['treeSeparator'] = anEvent.treeSeparator;
        if (anEvent.shouldSaveCredentials) {
            var oldUsername = localStorage['username'];
            var oldPassphrase = localStorage['passphrase'];
            localStorage['username'] = anEvent.username;
            localStorage['passphrase'] = anEvent.passphrase;
            if (anEvent.username != oldUsername || anEvent.passphrase != oldPassphrase) {
                Clipperz.PM.RunTime.mainController.run();
            }
        } else {
            delete localStorage['username'];
            delete localStorage['passphrase'];
        }

    },
    
    //=============================================================================
    __syntaxFix__ : "syntax fix"
});
