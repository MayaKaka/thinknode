
(function() {
    "use strict";

var Resource = Class.extend({
	_preloadRes: null,
    _asynloadRes: null,
	crossOriginAllow: false,
	
	init: function ( crossOriginAllow ){
        this.crossOriginAllow = crossOriginAllow;
    },
	
	getItem: function(name){
		var item = (this._preloadRes? this._preloadRes.getItem(name): null)
				|| (this._asynloadRes? this._asynloadRes.getItem(name): null);
        return item? item.tag : name;
    },
    
    initLoad: function(manifest, loadComplete, fileLoaded){
    	this._preloadRes = this._startLoad(manifest, loadComplete, fileLoaded);
    },
    
    asynLoad: function(manifest, loadComplete, fileLoaded){
		this._asynloadRes = this._startLoad(manifest, loadComplete, fileLoaded);
    },

    clearAsynRes: function(){
		this._asynloadRes = null;
	},
	
	_startLoad: function(manifest, loadComplete, fileLoaded) {
        var loader = new cy.LoadQueue(this.crossOriginAllow);
        loader.installPlugin(cy.Sound);
        
        var handleFileload = this._handleFileload;
        var handleProgress = function(e){
        	fileLoaded && fileLoaded(e);
        };
        var handleComplete = function(e){
        	loader.removeEventListener('progress', handleProgress);
        	loader.removeEventListener('fileload', handleFileload);
            loader.removeEventListener('complete', handleComplete);

            loadComplete(e);

            loader._loadItemsBySrc = {};
            loader._loadedResults = {};
            loader._loadQueueBackup = [];
        };
        
        loader.addEventListener('progress', handleProgress);
        loader.addEventListener('fileload', handleFileload);
        loader.addEventListener('complete', handleComplete);
        loader.loadManifest(manifest);
		
		return loader;
    },

    _handleFileload: function(e){
    	var item = e.item,
            result = e.result;
        if (item.type === cy.LoadQueue.IMAGE) {
        	if (!(result.width>2047 || result.height>2047)) {
            	var cache = document.createElement('canvas');
            	cache.src = result.src;
            	cache.width = result.width;
            	cache.height = result.height;
            	cache.getContext('2d').drawImage(result,0,0);
            	item.tag = cache;
            }
       	} 
        else if (item.type === cy.LoadQueue.JAVASCRIPT) {
        	if (App.resource.crossOriginAllow) {
            	document.head.appendChild( result );
                document.head.removeChild( result );
            }
        }
        else if (item.type === cy.LoadQueue.CSS) {
         	document.head.AppendChild( result );
        } 
        else if (item.type === cy.LoadQueue.SOUND){
            // createjs.Sound.registerSound(src, "music");
        }     
     }
});

cy.Resource = Resource;

})();