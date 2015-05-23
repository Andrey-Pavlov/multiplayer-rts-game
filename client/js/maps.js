(function() {
    var namespace = app.namespace('game'),
        game = null,
        aircraft = null,
        vehicles = null,
        singleplayer = null;

    var maps = {
        init: function() {
            game = app.game.base;
            singleplayer = app.game.singleplayer;
            aircraft = app.game.entities.aircraft;
            vehicles = app.game.entities.vehicles;
        },
        singleplayer: [
        {
            "name": "WARNING! ENEMY INVASION!",
            "briefing": "Protect your base and make 20k USD",

            /* Map Details */
            "mapImage": "images/maps/level-one-debug-grid.png",
            "startX": 4,
            "startY": 4,

            /* Entities to be loaded */
            "requirements": {
                "buildings": ["base", "starport","harvester","ground-turret"],
                "vehicles":["transport","harvester","scout-tank","heavy-tank"],
                "aircraft":["chopper","wraith"],
                "terrain":["oilfield","bigrocks","smallrocks"]
            },

            /* Entities to be added */
            "items":[
                {"type":"buildings","name":"base","x":11,"y":14,"team":"blue"},
                {"type":"buildings","name":"starport","x":18,"y":14,"team":"blue"},
                {"type":"vehicles","name":"harvester","x":16,"y":12,"team":"blue","direction":3},
                {"type":"terrain","name":"bigrocks","x":19,"y":6},
                {"type":"terrain","name":"smallrocks","x":8,"y":3},
                
                {"type":"vehicles","name":"scout-tank","x":26,"y":14,"team":"blue","direction":4},
                {"type":"vehicles","name":"heavy-tank","x":26,"y":16,"team":"blue","direction":5},
                
                {"type":"aircraft","name":"chopper","x":20,"y":12,"team":"blue","direction":2},
                {"type":"aircraft","name":"wraith","x":23,"y":12,"team":"blue","direction":3},
                
                {"type":"buildings","name":"ground-turret","x":15,"y":23,"team":"green"},
                {"type":"buildings","name":"ground-turret","x":20,"y":23,"team":"green"},
                
                {"type":"vehicles","name":"scout-tank","x":16,"y":26,"team":"green","direction":4},
                {"type":"vehicles","name":"heavy-tank","x":18,"y":26,"team":"green","direction":6},
                
                {"type":"aircraft","name":"chopper","x":20,"y":27,"team":"green","direction":2},
                {"type":"aircraft","name":"wraith","x":22,"y":28,"team":"green","direction":3},
                
                {"type":"buildings","name":"base","x":19,"y":28,"team":"green"},
                {"type":"buildings","name":"starport","x":15,"y":28,"team":"green"},
                
                {"type":"terrain","name":"oilfield","x":3,"y":5,"action":"hint"},
                
                {"type":"terrain","name":"oilfield","x":31,"y":15},
                {"type":"terrain","name":"oilfield","x":37,"y":5},
                {"type":"terrain","name":"oilfield","x":4,"y":21},
                {"type":"terrain","name":"oilfield","x":13,"y":38},
                {"type":"terrain","name":"oilfield","x":21,"y":5},
                {"type":"terrain","name":"oilfield","x":25,"y":7},
                {"type":"terrain","name":"oilfield","x":13,"y":8},
                {"type":"terrain","name":"oilfield","x":23,"y":19},
                {"type":"terrain","name":"oilfield","x":26,"y":13},
                {"type":"terrain","name":"oilfield","x":12,"y":21},
                {"type":"terrain","name":"oilfield","x":6,"y":3},
                {"type":"terrain","name":"oilfield","x":23,"y":5},
                
                {"type":"terrain","name":"bigrocks","x":19,"y":6},
                {"type":"terrain","name":"smallrocks","x":8,"y":3}
            ],
            
            /* Economy Related*/
            "cash":{
                "blue":5000,
                "green":1000
            },
            
            /* Map coordinates that are obstructed by terrain*/
        "mapGridWidth":60,
        "mapGridHeight":40,
        "mapObstructedTerrain":[
        [49,8], [50,8], [51,8], [51,9], [52,9], [53,9], [53,10], [53,11], [53,12], [53,13], [53,14], 
        [53,15], [53,16], [52,16], [52,17], [52,18], [52,19], [51,19], [50,19], [50,18], [50,17], [49,17], 
        [49,18], [48,18], [47,18], [47,17], [47,16], [48,16], [49,16], [49,15], [49,14], [48,14], [48,13], 
        [48,12], [49,12], [49,11], [50,11], [50,10], [49,10], [49,9], [44,0], [45,0], [45,1], [45,2], 
        [46,2], [47,2], [47,3], [48,3], [48,4], [48,5], [49,5], [49,6], [49,7], [50,7], [51,7], [51,6], 
        [51,5], [51,4], [52,4], [53,4], [53,3], [54,3], [55,3], [55,2], [56,2], [56,1], [56,0], [55,0], 
        [43,19], [44,19], [45,19], [46,19], [47,19], [48,19], [48,20], [48,21], [47,21], [46,21], [45,21], 
        [44,21], [43,21], [43,20], [41,22], [42,22], [43,22], [44,22], [45,22], [46,22], [47,22], [48,22], 
        [49,22], [50,22], [50,23], [50,24], [49,24], [48,24], [47,24], [47,25], [47,26], [47,27], [47,28], 
        [47,29], [47,30], [46,30], [45,30], [44,30], [43,30], [43,29], [43,28], [43,27], [43,26], [43,25], 
        [43,24], [42,24], [41,24], [41,23], [48,39], [49,39], [50,39], [51,39], [52,39], [53,39], [54,39], 
        [55,39], [56,39], [57,39], [58,39], [59,39], [59,38], [59,37], [59,36], [59,35], [59,34], [59,33], 
        [59,32], [59,31], [59,30], [59,29], [0,0], [1,0], [2,0], [1,1], [2,1], [10,3], [11,3], [12,3], 
        [12,2], [13,2], [14,2], [14,3], [14,4], [15,4], [15,5], [15,6], [14,6], [13,6], [13,5], [12,5], 
        [11,5], [10,5], [10,4], [3,9], [4,9], [5,9], [5,10], [6,10], [7,10], [8,10], [9,10], [9,11], 
        [10,11], [11,11], [11,10], [12,10], [13,10], [13,11], [13,12], [12,12], [11,12], [10,12], [9,12], 
        [8,12], [7,12], [7,13], [7,14], [6,14], [5,14], [5,13], [5,12], [5,11], [4,11], [3,11], [3,10], 
        [33,33], [34,33], [35,33], [35,34], [35,35], [34,35], [33,35], [33,34], [27,39], [27,38], [27,37], 
        [28,37], [28,36], [28,35], [28,34], [28,33], [28,32], [28,31], [28,30], [28,29], [29,29], [29,28], 
        [29,27], [29,26], [29,25], [29,24], [29,23], [30,23], [31,23], [32,23], [32,22], [32,21], [31,21], 
        [30,21], [30,22], [29,22], [28,22], [27,22], [26,22], [26,21], [25,21], [24,21], [24,22], [24,23], 
        [25,23], [26,23], [26,24], [25,24], [25,25], [24,25], [24,26], [24,27], [25,27], [25,28], [25,29], 
        [24,29], [23,29], [23,30], [23,31], [24,31], [25,31], [25,32], [25,33], [24,33], [23,33], [23,34], 
        [23,35], [24,35], [24,36], [24,37], [23,37], [22,37], [22,38], [22,39], [23,39], [24,39], [25,39], 
        [26,0], [26,1], [25,1], [25,2], [25,3], [26,3], [27,3], [27,2], [28,2], [29,2], [29,3], [30,3], 
        [31,3], [31,2], [31,1], [32,1], [32,0], [33,0], [32,8], [33,8], [34,8], [34,9], [34,10], [33,10], 
        [32,10], [32,9], [8,29], [9,29], [9,30], [17,32], [18,32], [19,32], [19,33], [18,33], [17,33], 
        [18,34], [19,34], [3,27], [4,27], [4,26], [3,26], [2,26], [3,25], [4,25], [9,20], [10,20], [11,20], 
        [11,21], [10,21], [10,19], [19,7], [15,7], [29,12], [30,13], [20,14], [21,14], [34,13], [35,13], 
        [36,13], [36,14], [35,14], [34,14], [35,15], [36,15], [16,18], [17,18], [18,18], [16,19], [17,19], 
        [18,19], [17,20], [18,20], [11,19], [58,0], [59,0], [58,1], [59,1], [59,2], [58,3], [59,3], [58,4], 
        [59,4], [59,5], [58,6], [59,6], [58,7], [59,7], [59,8], [58,9], [59,9], [58,10], [59,10], [59,11], 
        [52,6], [53,6], [54,6], [52,7], [53,7], [54,7], [53,8], [54,8], [44,17], [46,32], [55,32], [54,28], 
        [26,34], [34,34], [4,10], [6,11], [6,12], [6,13], [7,11], [8,11], [12,11], [27,0], [27,1], [26,2], 
        [28,1], [28,0], [29,0], [29,1], [30,2], [30,1], [30,0], [31,0], [33,9], [46,0], [47,0], [48,0], 
        [49,0], [50,0], [51,0], [52,0], [53,0], [54,0], [55,1], [54,1], [53,1], [52,1], [51,1], [50,1], 
        [49,1], [48,1], [47,1], [46,1], [48,2], [49,2], [50,2], [51,2], [52,2], [53,2], [54,2], [52,3], 
        [51,3], [50,3], [49,3], [49,4], [50,4], [50,5], [50,6], [50,9], [51,10], [52,10], [51,11], [52,11], 
        [50,12], [51,12], [52,12], [49,13], [50,13], [51,13], [52,13], [50,14], [51,14], [52,14], [50,15], 
        [51,15], [52,15], [50,16], [51,16], [51,17], [48,17], [51,18], [44,20], [45,20], [46,20], [47,20], 
        [42,23], [43,23], [44,23], [45,23], [46,23], [47,23], [48,23], [49,23], [44,24], [45,24], [46,24], 
        [44,25], [45,25], [46,25], [44,26], [45,26], [46,26], [44,27], [45,27], [46,27], [44,28], [45,28], 
        [46,28], [44,29], [45,29], [46,29], [11,4], [12,4], [13,4], [13,3], [14,5], [25,22], [31,22], 
        [27,23], [28,23], [27,24], [28,24], [26,25], [27,25], [28,25], [25,26], [26,26], [27,26], [28,26], 
        [26,27], [27,27], [28,27], [26,28], [27,28], [28,28], [26,29], [27,29], [24,30], [25,30], [26,30], 
        [27,30], [26,31], [27,31], [26,32], [27,32], [26,33], [27,33], [24,34], [25,34], [27,34], [25,35], 
        [26,35], [27,35], [25,36], [26,36], [27,36], [25,37], [26,37], [23,38], [24,38], [25,38], [26,38], 
        [26,39], [2,25], [9,19], [36,31]
            ],
        /* Conditional and Timed Trigger Events */
        triggers:[
        /* Timed Events*/
        {
            type: "timed",
            time: 1000,
            action: function(){
                game.showMessage("system",'Get the harvester near the oil field and gather \n<div style="text-align: center"><strong>fucking USD</strong></div>');
            }
        },
        {
            type: "conditional",
            condition: function(){
                //singleplayer.endLevel(false);
            }
        },
        /* Conditional Event */
        {
            type: "conditional",
            condition: function() {
                var cashBalance = game.cash[game.team];
                
                return cashBalance > 20000;
            },
            action: function(){
                singleplayer.endLevel(true);
            }
        },
                {
            type: "timed",
            repeat: true,
            time: function f() {
                f.min = 5;
                
                var time = window.randomIntFromInterval(f.min > 2 ? f.min * 1000 : 2000, f.min * 2 * 1000);
                f.min--;
                
                return time;
                },
            action: function() {

                var width = game.currentLevel.mapGridWidth,
                    height = game.currentLevel.mapGridHeight;

                var x = window.randomIntFromInterval(-1, width);
                var y = null;

                if (x === -1 || x === width) {
                    y = window.randomIntFromInterval(-1, height);
                }
                else {
                    y = window.randomFromValues(-1, height);
                }

                var greenFly = {
                    "type": "aircraft",
                    "name": window.randomFromValues(Object.keys(aircraft.list)),
                    "x": x,
                    "y": y,
                    "team": "green",
                    "orders": {
                        "type": "hunt"
                    },
                    "direction": 1
                };

                game.add(greenFly);
            }
        }
        ]} ]
    };

    namespace.maps = maps;
}());