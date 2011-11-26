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

Clipperz.PM.UI.Extensions.Chrome.Controllers.CardsController = function() {

    this._tree = null;
    this._user = null;

    this._cachedObjects = null;

	return this;
}

MochiKit.Base.update(Clipperz.PM.UI.Extensions.Chrome.Controllers.CardsController.prototype, {

	'toString': function() {
		return "Clipperz.PM.UI.Extensions.Chrome.Controllers.CardsController";
	},

    //-----------------------------------------------------------------------------

    'run': function(args) {
        this._tree = args.tree;
        this._user = args.user;
        cr.ui.Tree.decorate(this._tree);
//        this.displayTreeItems();
/*        var self = this;
        setTimeout(function(){
            self._displayTreeItems([
                {'Cards.title': "zzz - xxx - ccc"},
                {'Cards.title': "xxx - bbb - qqq"},
                {'Cards.title': "zzz - xxx - aaa"},
                {'Cards.title': "zzz - aaa - bbb"},
                {'Cards.title': "ddd - xxx"},
                {'Cards.title': "bbb"},
            ]);
        }, 3000);
*/        

        var self = this;
        setTimeout(function(){
            self.displayTreeItems();
        }, 3000);
        
    },

    //-----------------------------------------------------------------------------

    'displayTreeItems': function () {
        return Clipperz.Async.callbacks("CardsController.displayTreeItems", [
            MochiKit.Base.method(this, 'getCards'),
            MochiKit.Base.method(this, '_displayTreeItems')
        ], {trace:false});
    },

    //-----------------------------------------------------------------------------
    
    'getCards': function () {

        var deferredResult;
        var cards = Clipperz.PM.RunTime.mainController.cards();
        if (cards) {
            deferredResult = MochiKit.Async.succeed(cards);
        } else {
            deferredResult = new Clipperz.Async.Deferred("CardsController.getCards", {trace:true});
            deferredResult.addMethod(this, 'retriveCards');
            deferredResult.callback();
        }
        return deferredResult;
    },

    //-----------------------------------------------------------------------------

    'retriveCards': function () {

        var objectCollectResultsConfiguration = {
            '_rowObject':           MochiKit.Async.succeed,
            '_reference':           MochiKit.Base.methodcaller('reference'),
            '_searchableContent':   MochiKit.Base.methodcaller('searchableContent'),
            'Cards.favicon':        MochiKit.Base.methodcaller('favicon'),
            'Cards.title':          MochiKit.Base.methodcaller('label'),
            'Cards.directLogins':   MochiKit.Base.methodcaller('directLoginReferences')
        };

        var deferredResult = new Clipperz.Async.Deferred("CardsController.retriveCards", {trace:true});
        deferredResult.addMethod(this._user, 'getRecords');
        deferredResult.addCallback(MochiKit.Base.map, Clipperz.Async.collectResults("CardsController.retriveCards - collectResults", objectCollectResultsConfiguration, {trace:true}));
        deferredResult.addCallback(Clipperz.Async.collectAll);
        deferredResult.addCallback(MochiKit.Base.bind(function (someRows) {
            Clipperz.PM.RunTime.mainController.setCards(someRows);
            return someRows;
        }, this));
        deferredResult.callback();
        
        return deferredResult;
    },

    //-----------------------------------------------------------------------------

    '_displayTreeItems': function (someRows) {

        const separator = localStorage['treeSeparator'];
        
        someRows.sort(function(a, b) {
            return a['Cards.title'].localeCompare(b['Cards.title']);
        });
        
        var findTreeItem = function(items, label) {
            for (i in items) {
                var item = items[i];
                if (item.label == label) {
                    return item;
                }
            }
            return null;
        }

        for (var r in someRows) {
            var row = someRows[r];
            var title = row['Cards.title'];
            var nodeLabels;
            if (separator && separator.length > 0) {
                nodeLabels = title.split(separator);
            } else {
                nodeLabels = [title];
            }
            var current = this._tree;
            var lastIndex = nodeLabels.length - 1;
            for (var n in nodeLabels) {
                var label = nodeLabels[n];
                var item = findTreeItem(current.items, label);
                if (item == null) {
                    item = new cr.ui.TreeItem();
                    item.label = label;
                    var favicon = row['Cards.favicon'];
                    if (n == lastIndex) {
                        item.icon = favicon ? favicon : '/images/webpage.png';
                        var directLogins = row['Cards.directLogins'];
                        for (var d in directLogins) {
                            var directLogin = directLogins[d];
                            var directLoginItem = new cr.ui.TreeItem();
                            directLoginItem.label = directLogin['label'] + " [direct login]"; //TODO
                            var favicon = directLogin['favicon'];
                            directLoginItem.icon = favicon ? favicon : '/images/webpage.png';
                            item.add(directLoginItem);
                            MochiKit.Signal.connect(directLoginItem.labelElement, 'onclick', MochiKit.Base.method(this, 'handleDirectLoginClick', directLogin['_rowObject']));
                        }
                    }
                    current.add(item);
                }
                current = item;
            }
        }
    },
    
    'handleDirectLoginClick': function (aDirectLogin, anEvent) {
        anEvent.preventDefault();
//      aDirectLogin.runDirectLogin();
        Clipperz.PM.UI.Common.Controllers.DirectLoginRunner.openDirectLogin(aDirectLogin);
    },

	//=============================================================================
	__syntaxFix__: "syntax fix"
});
