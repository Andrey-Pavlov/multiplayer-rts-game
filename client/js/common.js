(function() {
    var namespace = app.namespace('game');

    var common = {
        // Finds the angle between two objects in terms of a direction (where 0 <= angle < directions)
        findAngle: function(object, unit, directions) {

            var dy = (object.y) - (unit.y);
            var dx = (object.x) - (unit.x);

            var angle = common.wrapDirection(directions/2 - (Math.atan2(dx, dy) * directions / (2 * Math.PI)), directions);

            return angle;

            // returns the smallest difference (value ranging between -directions/2 to +directions/2) 
            //between two angles(where 0 <= angle < directions)
        },

        angleDiff: function(angle1, angle2, directions) {
            var diff;

            if (angle1 >= directions / 2) {
                angle1 = angle1 - directions;
            }

            if (angle2 >= directions / 2) {
                angle2 = angle2 - directions;
            }

            diff = angle2 - angle1;

            if (diff < -directions / 2) {
                diff += directions;
            }

            if (diff > directions / 2) {
                diff -= directions;
            }

            return diff;
        },

        // Wrap value of direction so that it lies between 0 and directions-1
        wrapDirection: function(direction, directions) {

            if (direction < 0) {
                direction += directions;
            }

            if (direction >= directions) {
                direction -= directions;
            }

            return direction;
        }
    };

    namespace.common = common;
}())