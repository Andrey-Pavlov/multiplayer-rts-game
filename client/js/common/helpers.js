//Inheritance
Function.prototype.inherit = function(Parent) {
    var F = function() {};

    F.prototype = Parent.prototype;

    this.prototype = new F();

    this.prototype.constructor = this;

    this.superclass = Parent.prototype;
};

//Random
function randomIntFromInterval(min, max) {
    return ~~(Math.random() * (max - min + 1) + min);
}

function randomDoubleFromInterval(min, max) {
    return Math.random() * (max - min + 1);
}

function randomFromValues() {
    if (arguments.length > 1) {
        var number = randomIntFromInterval(0, arguments.length - 1)

        return arguments[number];
    }
    else if (arguments.length == 1) {
        var arrayOrObject = arguments[0];
        if (Array.isArray(arrayOrObject)) {
            return arrayOrObject[randomIntFromInterval(0, arrayOrObject.length - 1)];
        }
        else {
            var names = Object.keys(arrayOrObject);

            return arrayOrObject[randomIntFromInterval(0, names.length - 1)]
        }
    }
}