(function() {
    var namespace = app.namespace('game.entities'),
        Entity = app.game.entities.Entity;

    Vehicles.inherit(Entity);
    var vehicles = new Vehicles();

    namespace.vehicles = vehicles;

    function Vehicles() {
        this.list = {
            "transport": {
                name: "transport",
                pixelWidth: 31,
                pixelHeight: 30,
                pixelOffsetX: 15,
                pixelOffsetY: 15,
                radius: 15,
                speed: 15,
                sight: 3,
                cost: 400,
                hitPoints: 100,
                turnSpeed: 2,
                spriteImages: [{
                    name: "stand",
                    count: 1,
                    directions: 8
                }],
                passableGrid: [
                    [1]
                ]
            },
            "harvester": {
                name: "harvester",
                pixelWidth: 21,
                pixelHeight: 20,
                pixelOffsetX: 10,
                pixelOffsetY: 10,
                radius: 10,
                speed: 10,
                sight: 3,
                cost: 1600,
                hitPoints: 50,
                turnSpeed: 2,
                spriteImages: [{
                    name: "stand",
                    count: 1,
                    directions: 8
                }],
                passableGrid: [
                    [1]
                ]
            },
            "scout-tank": {
                name: "scout-tank",
                canAttack: true,
                canAttackLand: true,
                canAttackAir: false,
                weaponType: "bullet",
                pixelWidth: 21,
                pixelHeight: 21,
                pixelOffsetX: 10,
                pixelOffsetY: 10,
                radius: 11,
                speed: 20,
                sight: 4,
                cost: 500,
                hitPoints: 50,
                turnSpeed: 4,
                spriteImages: [{
                    name: "stand",
                    count: 1,
                    directions: 8
                }],
                passableGrid: [
                    [1]
                ]
            },
            "heavy-tank": {
                name: "heavy-tank",
                canAttack: true,
                canAttackLand: true,
                canAttackAir: false,
                weaponType: "cannon-ball",
                pixelWidth: 30,
                pixelHeight: 30,
                pixelOffsetX: 15,
                pixelOffsetY: 15,
                radius: 13,
                speed: 15,
                sight: 5,
                cost: 1200,
                hitPoints: 50,
                turnSpeed: 4,
                spriteImages: [{
                    name: "stand",
                    count: 1,
                    directions: 8
                }],
                passableGrid: [
                    [1]
                ]
            }
        };

        this.defaults = {
            type: "vehicles",
            animationIndex: 0,
            direction: 0,
            action: "stand",
            orders: {
                type: "stand"
            },
            selected: false,
            selectable: true,
            directions: 8,
            nextStp: null,
            animate: function() {
                var gameBase = app.game.base;
                var common = app.game.common;
                
                var direction = null;
                
                // Consider an item healthy if it has more than 40% life
                if (this.life > this.hitPoints * 0.4) {
                    this.lifeCode = "healthy";
                }
                else if (this.life <= 0) {
                    this.lifeCode = "dead";
                    gameBase.remove(this);
                    return;
                }
                else {
                    this.lifeCode = "damaged";
                }
                switch (this.action) {
                    case "stand":
                        direction = common.wrapDirection(Math.round(this.direction), this.directions);
                        this.imageList = this.spriteArray["stand-" + direction];
                        this.imageOffset = this.imageList.offset + this.animationIndex;
                        this.animationIndex++;
                        if (this.animationIndex >= this.imageList.count) {
                            this.animationIndex = 0;
                        }
                        break;
                        case "teleport":
                            direction = common.wrapDirection(Math.round(this.direction), this.directions);
                            this.imageList = this.spriteArray["stand-" + direction];
                            this.imageOffset = this.imageList.offset + this.animationIndex;
                            this.animationIndex++;
                            if (this.animationIndex >= this.imageList.count) {
                                this.animationIndex = 0;
                            }
                            if (!this.brightness) {
                                this.brightness = 1;
                            }
                            this.brightness -= 0.03;
                            if (this.brightness <= 0) {
                                this.brightness = undefined;
                                this.action = "stand";
                            }
                            break;
                }
            },
            draw: function() {
                var gameBase = app.game.base;

                var x = (this.x * gameBase.gridSize) - gameBase.offsetX - this.pixelOffsetX + this.lastMovementX * gameBase.drawingInterpolationFactor * gameBase.gridSize;
                var y = (this.y * gameBase.gridSize) - gameBase.offsetY - this.pixelOffsetY + this.lastMovementY * gameBase.drawingInterpolationFactor * gameBase.gridSize;

                this.drawingX = x;
                this.drawingY = y;
                if (this.selected) {
                    this.drawSelection();
                    this.drawLifeBar();
                }

                var colorIndex = (this.team == "blue") ? 0 : 1;
                var colorOffset = colorIndex * this.pixelHeight;
                gameBase.foregroundContext.drawImage(this.spriteSheet, this.imageOffset * this.pixelWidth,
                    colorOffset, this.pixelWidth, this.pixelHeight, x, y, this.pixelWidth, this.pixelHeight);
                
                if (this.brightness) {
                    gameBase.foregroundContext.beginPath();
                    gameBase.foregroundContext.arc(x + this.pixelOffsetX, y + this.pixelOffsetY,
                        this.radius, 0, Math.PI * 2, false);
                    gameBase.foregroundContext.fillStyle = 'rgba(255,255,255,' + this.brightness + ')';
                    gameBase.foregroundContext.fill();
                }
            },
            drawLifeBar: function() {
                var game = app.game.base;

                var x = this.drawingX;
                var y = this.drawingY - 2 * game.lifeBarHeight;
                game.foregroundContext.fillStyle = (this.lifeCode == "healthy") ? game.
                healthBarHealthyFillColor: game.healthBarDamagedFillColor;
                game.foregroundContext.fillRect(x, y, this.pixelWidth * this.life / this.hitPoints, game.lifeBarHeight)
                game.foregroundContext.strokeStyle = game.healthBarBorderColor;
                game.foregroundContext.lineWidth = 1;
                game.foregroundContext.strokeRect(x, y, this.pixelWidth, game.lifeBarHeight)
            },
            drawSelection: function() {
                var game = app.game.base;

                var x = this.drawingX + this.pixelOffsetX;
                var y = this.drawingY + this.pixelOffsetY;
                game.foregroundContext.strokeStyle = game.selectionBorderColor;
                game.foregroundContext.lineWidth = 1;
                game.foregroundContext.beginPath();
                game.foregroundContext.arc(x, y, this.radius, 0, Math.PI * 2, false);
                game.foregroundContext.fillStyle = game.selectionFillColor;
                game.foregroundContext.fill();
                game.foregroundContext.stroke();
            },
            processOrders: function() {
                var game = app.game.base;
                var common = app.game.common;

                this.lastMovementX = 0;
                this.lastMovementY = 0;

                if (this.orders.isCommand) {
                    this.pathCompleted = false;

                    this.orders.isCommand = false;
                }

                switch (this.orders.type) {
                    case "move":
                        // Move towards destination until distance from destination is less than vehicle radius
                        var distanceFromDestinationSquared = (Math.pow(this.orders.to.x - this.x, 2) + Math.pow(this.orders.to.y - this.y, 2));
                        if (distanceFromDestinationSquared < Math.pow(this.radius / game.gridSize, 2)) {
                            this.stopMoving();
                            return;
                        }
                        else if (this.colliding && (distanceFromDestinationSquared < Math.pow(this.radius * 3 / game.gridSize, 2))) {
                            //Stop when within 3 radius of the destination if colliding with something
                            this.stopMoving();
                            return;
                        }
                        else {
                            if (this.colliding && (Math.pow(this.orders.to.x - this.x, 2) +
                                Math.pow(this.orders.to.y - this.y, 2)) < Math.pow(this.radius * 5 / game.gridSize, 2)) {
                                // Count collsions within 5 radius distance of goal
                                if (!this.orders.collisionCount) {
                                    this.orders.collisionCount = 1;
                                }
                                else {
                                    this.orders.collisionCount = this.orders.collisionCount + 1;
                                }
                                // Stop if more than 10 collisions occur
                                if (this.orders.collisionCount > 30) {
                                    this.stopMoving();
                                    return;
                                }
                            }
                            // Try to move to the destination
                            var moving = this.moveTo(this.orders.to);
                            if (!moving) {
                                // Pathfinding couldn't find a path so stop
                                this.stopMoving();
                                return;
                            }
                        }
                        break;

                    case "deploy":
                        // If oilfield has been used already, then cancel order
                        if (this.orders.to.lifeCode == "dead") {
                            this.orders = {
                                type: "stand"
                            };
                            return;
                        }
                        // Move to middle of oil field
                        var target = {
                            x: this.orders.to.x + 1,
                            y: this.orders.to.y + 0.5,
                            type: "terrain"
                        };
                        var distanceFromTargetSquared = (Math.pow(target.x - this.x, 2) + Math.pow(target.y - this.y, 2));
                        if (distanceFromTargetSquared < Math.pow(this.radius * 2 / game.gridSize, 2)) {
                            // After reaching oil field, turn harvester to point towards left (direction 6)
                            var difference = common.angleDiff(this.direction, 6, this.directions);
                            var turnAmount = this.turnSpeed * game.turnSpeedAdjustmentFactor;
                            if (Math.abs(difference) > turnAmount) {
                                this.direction = common.wrapDirection(this.direction + turnAmount * Math.abs(difference) /
                                    difference, this.directions);
                            }
                            else {
                                // Once it is pointing to the left, remove the harvester and oil field and deploy a                                 harvester building
                                game.remove(this.orders.to);
                                this.orders.to.lifeCode = "dead";
                                game.remove(this);
                                this.lifeCode = "dead";
                                game.add({
                                    type: "buildings",
                                    name: "harvester",
                                    x: this.orders.to.x,
                                    y: this.orders.to.y,
                                    action: "deploy",
                                    team: this.team
                                });
                            }
                        }
                        else {
                            var moving = this.moveTo(target);
                            // Pathfinding couldn't find a path so stop
                            if (!moving) {
                                this.orders = {
                                    type: "stand"
                                };
                            }
                        }
                        break;
                }

            },
            stopMoving: function() {
                this.orders = {
                    type: "stand"
                };
                this.pathCompleted = false;
            },
            moveTo: function(destination) {
                var game = app.game.base;
                var common = app.game.common;

                if (!game.currentMapPassableGrid || !this.pathCompleted) {
                    game.rebuildPassableGrid();
                }

                // First find path to destination
                var start = [Math.floor(this.x), Math.floor(this.y)];
                var end = [Math.floor(destination.x), Math.floor(destination.y)];
                //    var grid = $.extend(true, [], game.currentMapPassableGrid);

                var grid = game.currentMapPassableGrid;

                // Allow destination to be "movable" so that algorithm can find a path
                if (destination.type == "buildings" || destination.type == "terrain") {
                    var y = Math.floor(destination.y);
                    var x = Math.floor(destination.x);
                    var prevCondition = grid[y][x];

                    grid[y][x] = 0;
                }

                var newDirection;
                // if vehicle is outside map bounds, just go straight towards goal
                if (start[1] < 0 || start[1] >= game.currentLevel.mapGridHeight || start[0] < 0 || start[0] >= game.currentLevel.mapGridWidth) {

                    this.orders.path = [this, destination];
                    newDirection = common.findAngle(destination, this, this.directions);
                }
                else {

                    if (!this.pathCompleted) {
                        //Use A* algorithm to try and find a path to the destination
                        this.orders.path = AStar(grid, start, end, 'Euclidean');

                        this.pathCompleted = true;
                        this.nextStp = 1;
                    }

                    if (this.orders.path.length > 1) {
                        if (this.nextStp < this.orders.path.length) {
                            var nextStep = {
                                x: this.orders.path[this.nextStp][0] + 0.5,
                                y: this.orders.path[this.nextStp][1] + 0.5
                            };
                            newDirection = common.findAngle(nextStep, this, this.directions);
                        }
                    }
                    else if (start[0] == end[0] && start[1] == end[1]) {
                        // Reached destination grid;
                        this.orders.path = [this, destination];
                        newDirection = common.findAngle(destination, this, this.directions);

                        this.stopMoving();
                    }
                    else {
                        this.stopMoving();
                        // There is no path
                        return false;
                    }
                }

                // check if moving along current direction might cause collision..
                // If so, change newDirection
                var collisionObjects = checkCollisionObjects.call(this, grid);

                if (prevCondition) {
                    grid[y][x] = prevCondition;
                }

                this.hardCollision = false;

                if (collisionObjects.length > 0) {
                    this.colliding = true;

                    // Create a force vector object that adds up repulsion from all colliding objects
                    var forceVector = {
                        x: 0,
                        y: 0
                    };

                    if (this.nextStp < this.orders.path.length) {
                        // By default, the next step has a mild attraction force
                        collisionObjects.push({
                            collisionType: "attraction",
                            with: {
                                x: this.orders.path[this.nextStp][0] + 0.5,
                                y: this.orders.path[this.nextStp][1] + 0.5
                            }
                        });
                    }

                    for (var i = collisionObjects.length - 1; i >= 0; i--) {
                        var collObject = collisionObjects[i];
                        var objectAngle = common.findAngle(collObject.with, this, this.directions);
                        var objectAngleRadians = -(objectAngle / this.directions) * 2 * Math.PI;
                        var forceMagnitude;
                        switch (collObject.collisionType) {
                            case "hard":
                                forceMagnitude = 2;
                                this.hardCollision = true;
                                break;
                            case "soft":
                                forceMagnitude = 1;
                                break;
                            case "attraction":
                                forceMagnitude = -0.25;
                                break;
                        }
                        forceVector.x += (forceMagnitude * Math.sin(objectAngleRadians));
                        forceVector.y += (forceMagnitude * Math.cos(objectAngleRadians));
                    };

                    // Find a new direction based on the force vector
                    newDirection = common.findAngle(forceVector, {
                        x: 0,
                        y: 0
                    }, this.directions);


                }
                else {
                    this.colliding = false;
                }

                // Calculate turn amount for new direction
                var difference = common.angleDiff(this.direction, newDirection, this.directions);
                var turnAmount = this.turnSpeed * game.turnSpeedAdjustmentFactor;

                if (this.hardCollision) {
                    // In case of hard collision, do not move forward, just turn towards new direction
                    if (Math.abs(difference) > turnAmount) {
                        this.direction = common.wrapDirection(this.direction +
                            turnAmount * Math.abs(difference) / difference, this.directions);
                    }

                    this.hardCollisionCounter = this.hardCollisionCounter ? this.hardCollisionCounter + 1 : 1;
                    if (this.hardCollisionCounter > 10) {
                        this.pathCompleted = false;
                        this.hardCollisionCounter = null;
                    }
                }
                else {
                    // Move forward, but keep turning as needed
                    var movement = this.speed * game.speedAdjustmentFactor;
                    var angleRadians = -(Math.round(this.direction) / this.directions) * 2 * Math.PI;

                    this.lastMovementX = -(movement * Math.sin(angleRadians));
                    this.lastMovementY = -(movement * Math.cos(angleRadians));

                    this.x = (this.x + this.lastMovementX);
                    this.y = (this.y + this.lastMovementY);

                    if (Math.abs(difference) > turnAmount) {
                        this.direction = common.wrapDirection(this.direction + turnAmount * Math.abs(difference) / difference, this.directions);
                    }

                    if (this.nextStp < this.orders.path.length - 1) {
                        if ((Math.abs(this.x - this.orders.path[this.nextStp][0]) < (2 * this.radius / game.gridSize)) && (Math.abs(this.y - this.orders.path[this.nextStp][1]) < (2 * this.radius / game.gridSize))) {
                            this.nextStp = this.nextStp + 1;
                        }
                    }
                }

                return true;
            },
        };
    }

    // Make a list of collisions that the vehicle will have if it goes along present path
    function checkCollisionObjects(grid) {
        var game = app.game.base;

        // Calculate new position on present path
        var movement = this.speed * game.speedAdjustmentFactor;
        var angleRadians = -(Math.round(this.direction) / this.directions) * 2 * Math.PI;
        var newX = this.x - (movement * Math.sin(angleRadians));
        var newY = this.y - (movement * Math.cos(angleRadians));

        // List of objects that will collide after next movement step
        var collisionObjects = [];
        var x1 = Math.max(0, Math.floor(newX) - 3);
        var x2 = Math.min(game.currentLevel.mapGridWidth - 1, Math.floor(newX) + 3);
        var y1 = Math.max(0, Math.floor(newY) - 3);
        var y2 = Math.min(game.currentLevel.mapGridHeight - 1, Math.floor(newY) + 3);

        // Test grid upto 3 squares away
        for (var j = x1; j <= x2; j++) {
            for (var i = y1; i <= y2; i++) {
                if (grid[i][j] == 1) { // grid square is obsutructed
                    if (Math.pow(j + 0.5 - newX, 2) + Math.pow(i + 0.5 - newY, 2) < Math.pow(this.radius / game.gridSize + 0.1, 2)) {

                        // Distance of obstructed grid from vehicle is less than hard collision threshold
                        collisionObjects.push({
                            collisionType: "hard",
                            with: {
                                type: "wall",
                                x: j + 0.5,
                                y: i + 0.5
                            }
                        });
                    }
                    else if (Math.pow(j + 0.5 - newX, 2) + Math.pow(i + 0.5 - newY, 2) < Math.pow(this.radius / game.gridSize + 0.7, 2)) {
                        // Distance of obstructed grid from vehicle is less than soft collision threshold
                        collisionObjects.push({
                            collisionType: "soft",
                            with: {
                                type: "wall",
                                x: j + 0.5,
                                y: i + 0.5
                            }
                        });
                    }
                }
            }
        }

        for (var i = game.vehicles.length - 1; i >= 0; i--) {
            var vehicle = game.vehicles[i];

            // Test vehicles that are less than 3 squares away for collisions
            if (vehicle != this && Math.abs(vehicle.x - this.x) < 3 && Math.abs(vehicle.y - this.y) < 3) {
                if (Math.pow(vehicle.x - newX, 2) + Math.pow(vehicle.y - newY, 2) < Math.pow((this.radius + vehicle.radius) / game.gridSize, 2)) {
                    collisionObjects.push({
                        collisionType: "hard",
                        with: vehicle
                    });
                    // Distance between vehicles is less than hard collision threshold (sum of vehicle radii
                }
                else if (Math.pow(vehicle.x - newX, 2) + Math.pow(vehicle.y - newY, 2) < Math.pow((this.radius * 1.5 + vehicle.radius) / game.gridSize, 2)) {
                    // Distance between vehicles is less than soft collision threshold (1.5 times vehicle radius + colliding vehicle radius)
                    collisionObjects.push({
                        collisionType: "soft",
                        with: vehicle
                    });
                }
            }
        }

        return collisionObjects;
    };

}());