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

Clipperz.PM.UI.Extensions.Chrome.Controllers.BackgroundLoginController = function() {
    this._progressListener = null;
    this._inProgress = false;
    this._loginProgress = null;
    return this;
};

MochiKit.Base.update(Clipperz.PM.UI.Extensions.Chrome.Controllers.BackgroundLoginController.prototype, {

    'toString': function() {
        return "Clipperz.PM.UI.Extensions.Chrome.Controllers.BackgroundLoginController";
    },

    'inProgress': function() {
        return this._inProgress;
    },

    //-----------------------------------------------------------------------------

    'login': function(parameters) {
        if (this._inProgress || Clipperz.PM.RunTime.mainController.cards()) {
            throw "Already logged in";
        }
        this._inProgress = true;
        this._progressListener = parameters.progressListener;
        const trace = true;
        var getPassphrase = MochiKit.Base.partial(MochiKit.Async.succeed, parameters.passphrase);
        var user = new Clipperz.PM.DataModel.User({'username':parameters.username, 'getPassphraseFunction':getPassphrase});
        var self = this;
        var loginProgress = new Clipperz.PM.UI.Extensions.Chrome.Components.BackgroundLoginProgress({callback:function (loginProgress, event) {
            if (self._progressListener) {
                self._progressListener.loginProgressChanged(loginProgress, event);
            }
        }});
        this._loginProgress = loginProgress;
        MochiKit.Signal.connect(Clipperz.PM.UI.Common.Controllers.ProgressBarController.defaultController, 'updateProgress', loginProgress, 'updateProgressHandler')
        var deferredResult = new Clipperz.Async.Deferred("BackgroundLoginController.doLogin", {trace:trace});
        var initProgressSteps = 4;
        deferredResult.addCallbackPass(MochiKit.Signal.signal, Clipperz.Signal.NotificationCenter, 'initProgress', {'steps':initProgressSteps});
        deferredResult.addMethod(loginProgress, 'start', initProgressSteps);
        deferredResult.addMethod(Clipperz.Crypto.PRNG.defaultRandomGenerator(), 'deferredEntropyCollection');
        deferredResult.addMethod(user, 'login');
        var objectCollectResultsConfiguration = {
            '_rowObject':           MochiKit.Async.succeed,
            '_reference':           MochiKit.Base.methodcaller('reference'),
            '_searchableContent':   MochiKit.Base.methodcaller('searchableContent'),
            'Cards.favicon':        MochiKit.Base.methodcaller('favicon'),
            'Cards.title':          MochiKit.Base.methodcaller('label'),
            'Cards.directLogins':   MochiKit.Base.methodcaller('directLoginReferences'),
            'Cards.notes':          MochiKit.Base.methodcaller('notes'),
            'Cards.fields':         MochiKit.Base.methodcaller(
                                        function(){
                                            return Clipperz.Async.callbacks("Record.fieldReferences", [
                                                MochiKit.Base.method(this, 'fields'),
                                                MochiKit.Base.values,
                                                function (someFields) {
                                                    var result = [];
                                                    var c = someFields.length;
                                                    for (var i=0; i<c; i++) {
                                                        result.push(Clipperz.Async.collectResults("Record.fieldReferences - collectResults", {
                                                            '_reference': MochiKit.Base.methodcaller('reference'),
                                                            'label': MochiKit.Base.methodcaller('label'),
                                                            'value': MochiKit.Base.methodcaller('value'),
                                                            'actionType': MochiKit.Base.methodcaller('actionType'),
                                                            'isHidden': MochiKit.Base.methodcaller('isHidden')
                                                        }, {trace:false})(someFields[i]));
                                                    }
                                                    return result;
                                                },
                                                Clipperz.Async.collectAll
                                            ], {trace:false});
                                        })
        };
        deferredResult.addMethod(user, 'getRecords');
        deferredResult.addCallback(MochiKit.Base.map, Clipperz.Async.collectResults("BackgroundLoginController.doLogin - collectResults", objectCollectResultsConfiguration, {trace:trace}));
        deferredResult.addCallback(Clipperz.Async.collectAll);
        deferredResult.addCallback(MochiKit.Base.bind(function (someRows) {
            someRows.sort(function(a, b) {
                return a['Cards.title'].localeCompare(b['Cards.title']);
            });
            var cards = [];
            var directLoginMap = {};
            for (var r in someRows) {
                var row = someRows[r];
                var card = {directLogins:[], notes:[], fields:[]};
                card.title = row['Cards.title'];
                var defaultIcon = '/images/webpage.png';
                card.favicon = row['Cards.favicon'] ? row['Cards.favicon'] : defaultIcon;
                var directLogins = row['Cards.directLogins'];
                for (var d in directLogins) {
                    var directLogin = directLogins[d];
                    card.directLogins[d] = {label:directLogin['label']};
                    card.directLogins[d].favicon = directLogin['favicon'] ? directLogin['favicon'] : defaultIcon;
                    var directLoginRef = directLogin['_reference'];
                    card.directLogins[d].reference = directLoginRef;
                    directLoginMap[directLoginRef] = directLogin['_rowObject'];
                }
                card.notes = row['Cards.notes'];
                var fields = row['Cards.fields'];
                var fieldNumber = 0;
                for (var f in fields) {
                    var field = fields[f];
                    card.fields[fieldNumber++] = {
                        label:field.label,
                        value:field.value,
                        actionType:field.actionType,
                        isHidden:field.isHidden,
                        reference:field.reference
                    };
                }
                cards[r] = card;
            }
            Clipperz.PM.RunTime.mainController.setCards(cards);
            Clipperz.PM.RunTime.mainController.setDirectLoginMap(directLoginMap);
            return someRows;
        }, this));
        deferredResult.addCallback(function(aLoginProgress, res) {
            aLoginProgress.disableCancel();
            return res;
        }, loginProgress);
        deferredResult.addCallback(function () {
            Clipperz.PM.RunTime.mainController.setUser(user);
            loginProgress.stop();
            self._inProgress = false;
            self._loginProgress = null;
        });
        deferredResult.addErrback(MochiKit.Base.method(this, 'handleFailedLogin', loginProgress));
        MochiKit.Signal.connect(loginProgress, 'cancelEvent', deferredResult, 'cancel');
        deferredResult.callback();
        return deferredResult;
    },

    'setProgressListener' : function(progressListener) {
        this._progressListener = progressListener;
        if (this._inProgress) {
            this._progressListener.loginProgressChanged(this._loginProgress, 'start');
        }
    },

    //=========================================================================

    'handleFailedLogin': function(aLoginProgress, anError) {
        this._inProgress = false;
        this._loginProgress = null;
        var result;
//console.log("anError", anError);
        if (anError instanceof MochiKit.Async.CancelledError) {
            result = anError;
        } else {
            MochiKit.Logging.logError("## MainController - FAILED LOGIN: " + anError);
            var deferredResult = new MochiKit.Async.Deferred();
            aLoginProgress.stop(chrome.i18n.getMessage('popup_page_login_controller_error_message'));
//			Clipperz.NotificationCenter.register(loginProgress, 'cancelEvent', deferredResult, 'callback');
            MochiKit.Signal.connect(aLoginProgress, 'cancelEvent', deferredResult, 'callback');
            deferredResult.addCallback(MochiKit.Async.fail, anError)
            result = deferredResult;
        }
        return result;
    },

    'handleGenericError': function(anError) {
        var result;
        if (anError instanceof MochiKit.Async.CancelledError) {
            result = anError;
        } else {
            MochiKit.Logging.logError("## MainController - GENERIC ERROR" + "\n" + "==>> " + anError + " <<==\n" + anError.stack);
//console.log(anError);
            result = new MochiKit.Async.CancelledError(anError);
        }
        return result;
    },

    //-----------------------------------------------------------------------------
    __syntaxFix__: "syntax fix"
});
