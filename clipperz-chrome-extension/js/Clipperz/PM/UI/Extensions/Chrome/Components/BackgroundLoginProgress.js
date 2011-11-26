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

Clipperz.PM.UI.Extensions.Chrome.Components.BackgroundLoginProgress = function(args) {
    this._callback = args.callback;
	this._completedPercentage = 0;
    this._inProgress = false;
    this._canBeCancelled = false;
    this._errorOccurred = false;
    this._lastError = null;
	return this;
};

//=============================================================================

MochiKit.Base.update(Clipperz.PM.UI.Extensions.Chrome.Components.BackgroundLoginProgress.prototype, {

	//-------------------------------------------------------------------------

	'toString': function () {
		return "Clipperz.PM.UI.Extensions.Chrome.Components.BackgroundLoginProgress component";
	},

	//-------------------------------------------------------------------------

    'completedPercentage': function() {
        return this._completedPercentage;
    },

    'inProgress': function() {
        return this._inProgress;
    },

    'canBeCancelled': function() {
        return this._canBeCancelled;
    },

    'errorOccurred': function() {
        return this._errorOccurred;
    },

    'lastError': function() {
        return this._lastError;
    },

	//-------------------------------------------------------------------------

	'start': function(steps) {
        this._completedPercentage = 0;
        this._inProgress = true;
        this._canBeCancelled = true;
        this._errorOccurred = false;
        this._lastError = null;
        this._callback(this, 'start');
	},

	//-------------------------------------------------------------------------

	'cancelLogin': function() {
        this._completedPercentage = 0;
        this._inProgress = false;
        this._canBeCancelled = false;
        this._errorOccurred = false;
        this._lastError = null;
		MochiKit.Signal.signal(this, 'cancelEvent');
        this._callback(this, 'cancelLogin');
	},

	//-------------------------------------------------------------------------

	'disableCancel': function() {
        this._canBeCancelled = false;
        this._callback(this, 'disableCancel');
	},

	//-------------------------------------------------------------------------

	'updateProgressHandler': function (anEvent) {
		this._completedPercentage = anEvent;
        this._callback(this, 'updateProgressHandler');
	},

	//-------------------------------------------------------------------------

	'stop': function(error) {
        this._completedPercentage = 0;
        this._inProgress = false;
        this._canBeCancelled = false;
        this._errorOccurred = !!error;
        this._lastError = error;
        this._callback(this, 'stop');
	},

	//-------------------------------------------------------------------------

	__syntaxFix__: "syntax fix"
});
