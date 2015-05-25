(function() {
    var namespace = app.namespace('game'),
        game = null,
        entities = null,
        fog = null,
        mouse = null;

    var sidebar = {
        init: function() {
            game = namespace.base;
            entities = namespace.entities;
            mouse = namespace.mouse;
            fog = namespace.fog;

            $("#scouttankbutton").click(function() {
                sidebar.construct['starport']({
                    type: "vehicles",
                    "name": "scout-tank"
                });
            });
            $("#heavytankbutton").click(function() {
                sidebar.construct['starport']({
                    type: "vehicles",
                    "name": "heavy-tank"
                });
            });
            $("#harvesterbutton").click(function() {
                sidebar.construct['starport']({
                    type: "vehicles",
                    "name": "harvester"
                });
            });
            $("#chopperbutton").click(function() {
                sidebar.construct['starport']({
                    type: "aircraft",
                    "name": "chopper"
                });
            });
            $("#wraithbutton").click(function() {
                sidebar.construct['starport']({
                    type: "aircraft",
                    "name": "wraith"
                });
            });

            //Initialize building construction buttons
            $("#starportbutton").click(function() {
                game.deployBuilding = "starport";
            });
            $("#turretbutton").click(function() {
                game.deployBuilding = "ground-turret";
            });
        },
        construct: {
            starport: function(unitDetails) {
                var starport = null;
                // Find the first eligible starport among selected items
                for (var i = game.selectedItems.length - 1; i >= 0; i--) {
                    var item = game.selectedItems[i];
                    if (item.type == "buildings" && item.name == "starport" && item.team == game.team && item.lifeCode == "healthy" && item.action == "stand") {

                        starport = item;

                        game.sendCommand([starport.uid], {
                            type: "construct-unit",
                            details: unitDetails
                        });

                        break;
                    }
                };
            }
        },
        enableSidebarButtons: function() {
            // Buttons only enabled when appropriate building is selected
            var $buttons = $("#gameinterfacescreen #sidebarbuttons input[type='button']");
            $buttons.attr('disabled', true);
            $buttons.css('display', 'none');

            // If no building selected, then no point checking below
            if (game.selectedItems.length === 0) {
                return;
            }

            var cashBalance = game.cash[game.team];

            // Check if base or starport is selected
            for (var i = game.selectedItems.length - 1; i >= 0; i--) {
                var item = game.selectedItems[i];

                // Check If player selected a healthy,inactive building (damaged buildings can't produce)
                if (item.type == "buildings" && item.team == game.team && item.lifeCode == "healthy") {

                    switch (item.name) {
                        case 'base':

                            $("#turretbutton").css('display', 'inline-block');
                            $("#starportbutton").css('display', 'inline-block');


                            /* Enable building buttons if base is selected,building has been loaded in requirements, not 
                            in deploy building mode and player has enough money*/
                            if (!game.deployBuilding && item.action == "stand") {
                                if (game.currentLevel.requirements.buildings.indexOf('starport') > -1) {
                                    if (cashBalance >= entities.buildings.list["starport"].cost) {
                                        $("#starportbutton").removeAttr("disabled");
                                    }

                                }
                                if (game.currentLevel.requirements.buildings.indexOf('ground-turret') > -1) {
                                    if (cashBalance >= entities.buildings.list["ground-turret"].cost) {
                                        $("#turretbutton").removeAttr("disabled");
                                    }
                                }
                            }
                            break;

                        case 'starport':
                            $("#scouttankbutton").css('display', 'inline-block');
                            $("#heavytankbutton").css('display', 'inline-block');
                            $("#harvesterbutton").css('display', 'inline-block');
                            $("#chopperbutton").css('display', 'inline-block');
                            $("#wraithbutton").css('display', 'inline-block');

                            if (item.action == "stand") {
                                /* Enable unit buttons if starport is selected, unit has been loaded in requirements, and 
                                      player has enough money*/
                                if (game.currentLevel.requirements.vehicles.indexOf('scout-tank') > -1) {
                                    if (cashBalance >= entities.vehicles.list["scout-tank"].cost) {
                                        $("#scouttankbutton").removeAttr("disabled");
                                    }
                                }
                                if (game.currentLevel.requirements.vehicles.indexOf('heavy-tank') > -1) {
                                    if (cashBalance >= entities.vehicles.list["heavy-tank"].cost) {
                                        $("#heavytankbutton").removeAttr("disabled");
                                    }
                                }
                                if (game.currentLevel.requirements.vehicles.indexOf('harvester') > -1) {
                                    if (cashBalance >= entities.vehicles.list["harvester"].cost) {
                                        $("#harvesterbutton").removeAttr("disabled");
                                    }
                                }
                                if (game.currentLevel.requirements.aircraft.indexOf('chopper') > -1) {
                                    if (cashBalance >= entities.aircraft.list["chopper"].cost) {
                                        $("#chopperbutton").removeAttr("disabled");
                                    }
                                }
                                if (game.currentLevel.requirements.aircraft.indexOf('wraith') > -1) {
                                    if (cashBalance >= entities.aircraft.list["wraith"].cost) {
                                        $("#wraithbutton").removeAttr("disabled");
                                    }
                                }
                            }
                            break;

                        default:
                            // code
                    }
                }
            };
        },
        animate: function() {
            // Display the current cash balance value
            $('#cash').html(Math.floor(game.cash[game.team]));

            this.enableSidebarButtons();

            if (game.deployBuilding) {
                // Create the buildable grid to see where building can be placed
                game.rebuildBuildableGrid();
                
                // Compare with buildable grid to see where we need to place the building
                var placementGrid = entities.buildings.list[game.deployBuilding].buildableGrid;
                
                game.placementGrid = placementGrid.slice();
                game.canDeployBuilding = true;
                
                for (var i = game.placementGrid.length - 1; i >= 0; i--) {
                    for (var j = game.placementGrid[i].length - 1; j >= 0; j--) {
                        if (game.placementGrid[i][j] &&
                            (mouse.gridY + i >= game.currentLevel.mapGridHeight ||
                                mouse.gridX + j >= game.currentLevel.mapGridWidth ||
                                game.currentMapBuildableGrid[mouse.gridY + i][mouse.gridX + j] === 1 ||
                            fog.grid[game.team][mouse.gridY + i][mouse.gridX + j] === 1)) {
                            game.canDeployBuilding = false;
                            game.placementGrid[i][j] = 0;
                        }
                    };
                };
            }
        },
        cancelDeployingBuilding:function(){
            game.deployBuilding = null;
        },
        finishDeployingBuilding: function() {
            var buildingName = game.deployBuilding;
            var base;
            for (var i = game.selectedItems.length - 1; i >= 0; i--) {
                var item = game.selectedItems[i];
                if (item.type == "buildings" && item.name == "base" && item.team == game.team &&
                    item.lifeCode == "healthy" && item.action == "stand") {
                    base = item;
                    break;
                }
            };

            if (base) {
                
                var buildingDetails = {
                    type: "buildings",
                    name: buildingName,
                    x: mouse.gridX,
                    y: mouse.gridY
                };
                
                game.sendCommand([base.uid], {
                    type: "construct-building",
                    details: buildingDetails
                });
            }
            
            // Clear deployBuilding flag
            game.deployBuilding = null;
        },
    };

    namespace.sidebar = sidebar;
}());