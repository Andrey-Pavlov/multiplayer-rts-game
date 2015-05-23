(function() {
    var namespace = app.namespace('game'),
        game = null;

    function Fog() {
        var _self = this;

        _self.grid = {};
        _self.defaultFogGrid = [];

        _self.canvas = document.createElement('canvas');

        _self.initLevel = function(){
            game = app.game.base;

// Set fog canvas to the size of the map
            _self.canvas.width = game.currentLevel.mapGridWidth*game.gridSize;
            _self.canvas.height = game.currentLevel.mapGridHeight*game.gridSize;
            _self.context = _self.canvas.getContext('2d');

// Set the fog grid for the player to array with all values set to 1
            _self.defaultFogGrid = [];

            for (var i=0; i < game.currentLevel.mapGridHeight; i++) {
                _self.defaultFogGrid[i] = [];

                for (var j=0; j < game.currentLevel.mapGridWidth; j++) {
                    _self.defaultFogGrid[i][j] = 1;
                };
            };
        };

        _self.isPointOverFog = function(x,y){
// If the point is outside the map bounds consider it fogged
            if(y<0 || y/game.gridSize >= game.currentLevel.mapGridHeight || x<0 || x/game.gridSize >= game.currentLevel.mapGridWidth ){
                return true;
            }
// If not, return value based on the player's fog grid
            return _self.grid[game.team][Math.floor(y/game.gridSize)][Math.floor(x/game.gridSize)] == 1;
        };

        _self.animate = function(){

// Fill fog with semi solid black color over the map
            _self.context.drawImage(game.currentMapImage,0,0)
            _self.context.fillStyle = 'rgba(0,0,0,0.8)';
            _self.context.fillRect(0,0,_self.canvas.width,_self.canvas.height);

// Initialize the players fog grid
            _self.grid[game.team] = _self.defaultFogGrid.slice();

// Clear all areas of the fog where a player item has vision
            _self.context.globalCompositeOperation = "destination-out";
            for (var i = game.items.length - 1; i >= 0; i--){
                var item = game.items[i];
                var team = game.team;
                if (item.team == team && !item.keepFogged){
                    var x = Math.floor(item.x);
                    var y = Math.floor(item.y);
                    var x0 = Math.max(0,x-item.sight+1);
                    var y0 = Math.max(0,y-item.sight+1);
                    var x1 = Math.min(game.currentLevel.mapGridWidth-1, x+item.sight-1+(item.type=="buildings" ? item.baseWidth/game.gridSize : 0));
                    var y1 = Math.min(game.currentLevel.mapGridHeight-1, y+item.sight-1+(item.type=="buildings" ? item.baseHeight/game.gridSize : 0));
                    for (var j=x0; j <= x1; j++) {
                        for (var k=y0; k <= y1; k++) {
                            if ((j>x0 && j<x1) || (k>y0 && k<y1)){
                                if(_self.grid[team][k][j] === 0){
                                    _self.context.fillStyle = 'rgba(100,0,0,0.9)';
                                    _self.context.beginPath();
                                    _self.context.arc(j*game.gridSize+12, k*game.gridSize+12, 16, 0, 2*Math.PI, false);
                                    _self.context.fill();
                                    _self.context.fillStyle = 'rgba(100,0,0,0.7)';
                                    _self.context.beginPath();
                                    _self.context.arc(j*game.gridSize+12, k*game.gridSize+12,18, 0, 2*Math.PI, false);
                                    _self.context.fill();
                                    _self.context.fillStyle = 'rgba(100,0,0,0.5)';
                                    _self.context.beginPath();
                                    _self.context.arc(j*game.gridSize+12, k*game.gridSize+12, 24, 0, 2*Math.PI, false);
                                    _self.context.fill();
                                }
                                _self.grid[team][k][j] = 0;
                            }
                        };
                    };
                }
            };
            _self.context.globalCompositeOperation = "source-over";
        };

        _self.draw = function(){
            game.foregroundContext.drawImage(_self.canvas, game.offsetX, game.offsetY, game.canvasWidth, game.canvasHeight, 0, 0, game.canvasWidth, game.canvasHeight);
        };
    };

    namespace.fog = new Fog();
}());