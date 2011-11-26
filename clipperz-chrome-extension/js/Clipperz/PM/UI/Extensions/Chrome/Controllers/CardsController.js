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
	return this;
};

MochiKit.Base.update(Clipperz.PM.UI.Extensions.Chrome.Controllers.CardsController.prototype, {

	'toString': function() {
		return "Clipperz.PM.UI.Extensions.Chrome.Controllers.CardsController";
	},

    //-----------------------------------------------------------------------------

    'run': function(args) {
        this._tree = args.tree;
        cr.ui.Tree.decorate(this._tree);
        this.displayTreeItems();
    },

    //-----------------------------------------------------------------------------

    'displayTreeItems': function () {
        const separator = localStorage['treeSeparator'];
        var cards = Clipperz.PM.RunTime.mainController.cards();
        var findTreeItem = function(items, label) {
            for (i in items) {
                var item = items[i];
                if (item.label == label) {
                    return item;
                }
            }
            return null;
        };
        for (var c in cards) {
            var card = cards[c];
            var title = card.title;
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
                    if (n == lastIndex) {
                        item.icon = card.favicon;
                        var directLogins = card.directLogins;
                        for (var d in directLogins) {
                            var directLogin = directLogins[d];
                            var directLoginItem = new cr.ui.TreeItem();
                            directLoginItem.label = directLogin.label + " [direct login]"; //TODO: replace hardcoded string with some hint or icon
                            directLoginItem.icon = directLogin.favicon;
                            item.add(directLoginItem);
                            MochiKit.Signal.connect(directLoginItem.labelElement, 'onclick', MochiKit.Base.method(this, 'handleDirectLoginClick', directLogin.reference));
                        }
                        //TODO: add some other actions for the card right into the tree under the card node
                        //TODO: such as copy fields (URL/login/password/...) to clipboard - it would be convenient when direct login doesn't work
                        //TODO: such items as edit/delete also could be placed right into the tree under subnode with name "more" or "operations"
                    }
                    current.add(item);
                }
                current = item;
            }
        }
    },

    'handleDirectLoginClick': function (aDirectLoginRef, anEvent) {
        anEvent.preventDefault();
        Clipperz.PM.RunTime.mainController.handleDirectLogin(aDirectLoginRef);
    },

	//=============================================================================
	__syntaxFix__: "syntax fix"
});
