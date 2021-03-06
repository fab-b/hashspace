
/*
 * Copyright 2012 Amadeus s.a.s.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// This module contains the text node
var klass = require("hsp/klass"), doc = require("hsp/document"), TNode = require("hsp/rt/tnode").TNode, TExpAtt = require("hsp/rt/tnode").TExpAtt;

var $TextNode = klass({
    $extends : TNode,

    /**
     * Text node generator ex: Hello {person.name}!
     * @param {Map<Expression>|int} exps the map of the variables used by the node. 0 is passed if no expression is
     * used
     * @param {Array} textcfg array of the different text chunks that compose the text node e.g. ["Hello ",0,"!"] odd
     * elements are text fragments and even element are variable ids corresponding to t
     */
    $constructor : function (exps, textcfg) {
        TNode.$constructor.call(this, exps);

        this.textcfg = textcfg;
        if (this.isStatic) {
            // ensure textcfg is not null
            if (!textcfg)
                this.textcfg = [""];
        }
    },

    /**
     * Create the DOM node element and attach it to the parent
     */
    createNode : function () {
        this.node = doc.createTextNode(this.getContent());
    },

    /**
     * Calculates the text content: resolve all variables and concatenate the cfg values
     * @return {string} the text content associated to the node
     */
    getContent : function () {
        var tcfg = this.textcfg;
        if (this.isStatic)
            return tcfg[0]; // return fast on simple case
        else {
            return TExpAtt.getValue.call(this, this.eh, this.vscope, "");
        }
    },

    /**
     * Refresh the text node if its properties have changed
     */
    refresh : function () {
        if (this.adirty) {
            this.node.nodeValue = this.getContent();
            this.adirty = false;
        }
    }
});

module.exports = $TextNode;