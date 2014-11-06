(function() {
    var namespace = app.namespace('game.entities');
    var loader = app.common.loader;

    function Entity() {
        
    }
    
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
}());