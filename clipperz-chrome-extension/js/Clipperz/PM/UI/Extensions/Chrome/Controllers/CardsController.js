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

Clipperz.PM.UI.Extensions.Chrome.Controllers.CardsController = function () {
    this._tree = null;
    return this;
};

MochiKit.Base.update(Clipperz.PM.UI.Extensions.Chrome.Controllers.CardsController.prototype, {

    'toString':function () {
        return "Clipperz.PM.UI.Extensions.Chrome.Controllers.CardsController";
    },

    //-----------------------------------------------------------------------------

    'run':function (args) {
        this._tree = args.tree;
        cr.ui.Tree.decorate(this._tree);
        this.displayTreeItems();
    },

    //-----------------------------------------------------------------------------

    'displayTreeItems':function () {
        const separator = localStorage['treeSeparator'];
        var cards = Clipperz.PM.RunTime.mainController.cards();
        var lastActRef = Clipperz.PM.RunTime.mainController.lastActRef();
        var lastActItem = null;
        var findTreeItem = function (items, label) {
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
            var nodeLabels = title.split(separator);
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
                        if (card.notes) {
                            item.rowElement.title = card.notes;
                        }
                        for (var d in card.directLogins) {
                            var directLogin = card.directLogins[d];
                            var directLoginItem = new cr.ui.TreeItem();
                            directLoginItem.label = directLogin.label;
                            directLoginItem.icon = directLogin.favicon;
                            directLoginItem.labelElement.className += " directLogin";
                            item.add(directLoginItem);
                            MochiKit.Signal.connect(directLoginItem.labelElement, 'onclick', MochiKit.Base.method(this, 'handleDirectLoginClick', directLogin.reference));
                            if (directLogin.reference == lastActRef) {
                                lastActItem = directLoginItem;
                            }
                        }
                        for (var f in card.fields) {
                            var field = card.fields[f];
                            var fieldsItem = new cr.ui.TreeItem();
                            fieldsItem.label = field.label;
                            fieldsItem.labelElement.className += (" " + field.actionType);
                            if (!field.isHidden) {
                                fieldsItem.labelElement.title = field.value;
                            }
                            if (field.actionType == "URL") {
                                MochiKit.Signal.connect(fieldsItem.labelElement, 'onclick', MochiKit.Base.method(this, 'handleUrlFieldClick', field.value, field.reference));
                            } else {
                                MochiKit.Signal.connect(fieldsItem.labelElement, 'onclick', MochiKit.Base.method(this, 'handleCopyFieldClick', field.value, field.reference));
                            }
                            item.add(fieldsItem);
                            if (field.reference == lastActRef) {
                                lastActItem = fieldsItem;
                            }
                        }

                        //TODO: such items as edit/delete also could be placed right into the tree under subnode with name "more" or "operations"

                    }
                    current.add(item);
                }
                current = item;
            }
        }
        if (lastActItem) {
            lastActItem.reveal();
        }
    },

    'handleDirectLoginClick':function (aDirectLoginRef, anEvent) {
        anEvent.preventDefault();
        Clipperz.PM.RunTime.mainController.setLastActRef(aDirectLoginRef);
        Clipperz.PM.RunTime.mainController.handleDirectLogin(aDirectLoginRef);
    },

    'handleUrlFieldClick':function (value, ref, anEvent) {
        anEvent.preventDefault();
        Clipperz.PM.RunTime.mainController.setLastActRef(ref);
        if (value.indexOf('://') < 0) {
            value = "http://" + value;
        }
        window.open(value);
    },

    'handleCopyFieldClick':function (value, ref, anEvent) {
        anEvent.preventDefault();
        Clipperz.PM.RunTime.mainController.setLastActRef(ref);
        Clipperz.PM.RunTime.mainController.handleCopy(value);
        window.close();
    },

    //=============================================================================
    __syntaxFix__:"syntax fix"
});
