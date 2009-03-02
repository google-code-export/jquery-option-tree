/*
 * jQuery optionTree Plugin
 * version: 1.0
 * @requires jQuery v1.2 or later
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * @version $Id$
 * @author  Krzysztof Kotowicz <kkotowicz at gmail dot com>
 */

/**
 * Converts passed JSON option tree into dynamically created <select> elements allowing you to
 * choose nested options.
 *
 * @param String tree options tree
 * @param array options additional options (optional)
 */
(function($){
$.fn.optionTree = function(tree, options) {

    options = $.extend({
        choose: 'Choose...',
        preselect: {},
        select_class: '',
        leaf_class: 'final',
        empty_value: ''
    }, options || {});

    var cleanName = function (name) {
        return name.replace(/_*$/, '');
    };

    var removeNested = function (name) {
        $("select[name^='"+ name + "']").remove();
    };

    var setValue = function(name, value) {
        $("input[name='" + cleanName(name) + "']").val(value).change();
    }

    return this.each(function() {

        var name = $(this).attr('name') + "_";

        // remove all dynamic options of lower levels
        removeNested(name);

        if (typeof tree == "object") { // many options exists for current nesting level

            // create select element with all the options
            // and bind onchange event to recursively call this function

            var $select = $("<select>").attr('name',name)
            .change(function() {
                if (this.options[this.selectedIndex].value != '') {
                        $(this).optionTree(tree[this.options[this.selectedIndex].value], options);
                } else {
                       removeNested(name + '_');
                       setValue(name, options.empty_value);
                }
            });

            if ($(this).is('input'))
                $select.insertBefore(this);
            else
                $select.insertAfter(this);

            if (options.select_class)
                $select.addClass(options.select_class);

            $("<option>").html(options.choose).val('').appendTo($select);
            $.each(tree, function(k, v) {
                var o = $("<option>").html(k)
                    .attr('value', k);
                    if (options.leaf_class && typeof v != 'object') // this option is a leaf node
                        o.addClass(options.leaf_class);

                    o.appendTo($select);

                    if (options.preselect && options.preselect[name] && options.preselect[name] == k) {
                        o.get(0).selected = true;
                        $select.change();
                    }
            });

        } else { // single option is selected by the user (function called via onchange event())
            setValue(name, tree);
        }
    });

}
})(jQuery);