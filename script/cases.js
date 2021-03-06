/* Case
 * Encapsulates each test case into an atomic unit.
 * @param model         A string or array of BlackBerry models that the case should be run on.
 *                      A model number is four digits. A string type can contain a single 4 digit model,
 *                      or a range with the use of a '-' between two model numbers. An array of model strings
 *                      follows the same rule as a string but you can specify multiple models or model ranges.
 * @param os            A string or array of BlackBerry operating system versions that the case should be run on.
 *                      Follows the same string/array rules as the model parameter above.
 * @param description   A string describing the test case, what causes it and what results from it.
 * @param test          A callback function taking one parameter. The callback should contain the
 *                      logic to perform that makes up the test case. The parameter to this function is a DOM
 *                      element that the test case can use to inject manipulate the DOM.
 **/
function Case(model, os, description, test) {
    this.model = model;
    this.os = os;
    this.description = description;
    this.test = test;
};
Case.prototype = {
    matches:function(model, os) {
        if (!this.matchesTo('model', model) || !this.matchesTo('os', os)) return false;
        return true;
    },
    matchesTo:function(prop, val) {
        if (typeof this[prop] == 'object' && this[prop] instanceof Array) {
            for (var i = 0, l = this[prop].length; i < l; i++) {
                if (!this.isMatch(this[prop][i], val)) return false;
            }
            return true;
        } else {
            return this.isMatch(this[prop], val);
        }
    },
    isOS:function(str) {
        if (str.indexOf('.') > -1) return true;
        else return false;
    },
    isRange:function(str) {
        if (str.indexOf('-') > -1) return true;
        else return false;
    },
    inRange:function(val, range) {
        var spread = range.split('-'),
            isOS = this.isOS(range[0]),
            min = (isOS?range[0]:parseInt(range[0])),
            max = (isOS?range[1]:parseInt(range[1]));
        if (typeof val == 'string' && val.indexOf('.') == -1) val = parseInt(val);
        if (!isOS) { 
            if (val >= min && val <= max) return true;
        } else {
            var mins = min.split('.'),
                maxs = max.split('.'),
                vals = val.split('.');
            for (var i = 0, l = mins.length; i < l; i++) {
                if (vals[i] > maxs[i] || vals[i] < mins[i]) return false;
            }
            return true;
        }
        return false;
    },
    isMatch:function(one, two) {
        if (one == 'all' || two == 'all') return true;
        if (this.isRange(one)) return this.inRange(one, two);
        else {
            if (this.isOS(one)) {
                var o = one.split('.'),
                    t = two.split('.');
                for (var i = 0, l = t.length; i < l; i++) {
                    if (parseInt(o[i]) != parseInt(t[i])) return false;
                }
                return true;     
            } else {
                if (parseInt(two) == parseInt(one)) return true;
                else return false;
            }
        }
    }
};
var cases = [
    new Case('9800',
        'all',
        'Torch users: set an image to percentage width or height, crash your browser.', 
        function(container) {
            var img = '<img src="style/images/brokeberry-coming-soon.png" style="height:20%;" />';
            alert('Your browser is gonna blow up now.');
            container.innerHTML = img;
    })
];