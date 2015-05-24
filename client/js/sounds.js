(function() {
    var namespace = app.namespace('game'),
        loader = app.namespace('common').loader;


    function Sounds() {
        var _self = this;

        _self.list = {
            "bullet":["bullet1","bullet2"],
            "heatseeker":["heatseeker1","heatseeker2"],
            "fireball":["laser1","laser2"],
            "cannon-ball":["cannon1","cannon2"],
            "message-received":["message"],
            "acknowledge-attacking":["engaging"],
            "acknowledge-moving":["yup","roger1","roger2"]
        };

        _self.loaded = {};

        _self.init = function(){
            for(var soundName in _self.list){

                var sound = {};
                sound.audioObjects = [];

                for (var i=0; i < _self.list[soundName].length; i++) {
                    sound.audioObjects.push(loader.loadSound('audio/' + _self.list[soundName][i]));
                }

                _self.loaded[soundName] = sound;
            }
        };

        _self.play = function(soundName){
            var sound = _self.loaded[soundName];

            if(sound && sound.audioObjects && sound.audioObjects.length > 0){

                if(!sound.counter || sound.counter>= sound.audioObjects.length){
                    sound.counter = 0;
                }

                var audioObject = sound.audioObjects[sound.counter];
                sound.counter++;
                audioObject.play();
            }
        }
    }

    namespace.sounds = new Sounds();

}());