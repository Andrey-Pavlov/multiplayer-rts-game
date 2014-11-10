(function() {
    var namespace = app.namespace('game.entities');
    var loader = app.common.loader,
        game = null,
        bullets = null;

    namespace.init = function() {
        bullets = namespace.bullets;
        
        game = app.game.base;
        
        namespace.aircraft.init();
        namespace.vehicles.init();
        namespace.bullets.init();
        namespace.buildings.init();
    }
    
    function CombatUnit() {}
        // Common Functions related to combat
    CombatUnit.prototype.isValidTarget = function(item) {
        return item.team != this.team && (this.canAttackLand && (item.type == "buildings" || item.type == "vehicles") || (this.canAttackAir && (item.type == "aircraft")));
    }
    CombatUnit.prototype.findTargetsInSight = function(increment) {
        if (!increment) {
            increment = 0;
        }
        
        var targets = [];
        for (var i = game.items.length - 1; i >= 0; i--) {
            var item = game.items[i];
            if (this.isValidTarget(item)) {
                if (Math.pow(item.x - this.x, 2) + Math.pow(item.y - this.y, 2) < Math.pow(this.sight + increment, 2)) {
                    targets.push(item);
                }
            }
        };
        
        // Sort targets based on distance from attacker
        var attacker = this;
        targets.sort(function(a, b) {
            return (Math.pow(a.x - attacker.x, 2) + Math.pow(a.y - attacker.y, 2)) - (Math.pow(b.x - attacker.x, 2) + Math.pow(b.y - attacker.y, 2));
        });
        
        return targets;
    }
    
    function Entity() {}
    Entity.prototype.load = function(name) {
        var item = this.list[name];
        
        // if the item sprite array has already been loaded then no need to do it again
        if (item.spriteArray) {
            return;
        }
        
        item.spriteSheet = loader.loadImage('/images/' + this.defaults.type + '/' + name + '.png');
        item.spriteArray = [];
        item.spriteCount = 0;
        for (var i = 0; i < item.spriteImages.length; i++) {
            
            var constructImageCount = item.spriteImages[i].count;
            var constructDirectionCount = item.spriteImages[i].directions;
            
            var constructImageName = null;
            
            if (constructDirectionCount) {
                for (var j = 0; j < constructDirectionCount; j++) {
                    constructImageName = item.spriteImages[i].name + "-" + j;
                    item.spriteArray[constructImageName] = {
                        name: constructImageName,
                        count: constructImageCount,
                        offset: item.spriteCount
                    };
                    item.spriteCount += constructImageCount;
                };
            }
            else {
                constructImageName = item.spriteImages[i].name;
                
                item.spriteArray[constructImageName] = {
                    name: constructImageName,
                    count: constructImageCount,
                    offset: item.spriteCount
                };
                
                item.spriteCount += constructImageCount;
            }
        }
        
        // Load the weapon if item has one
        if(item.weaponType){
            bullets.load(item.weaponType);
        }
    };
    Entity.prototype.add = function(details) {
        var item = {};
        var name = details.name;
        $.extend(item, this.defaults);
        $.extend(item, this.list[name]);
        item.life = item.hitPoints;
        $.extend(item, details);
        return item;
    };
    
    namespace.Entity = Entity;
    namespace.CombatUnit = CombatUnit;
}());