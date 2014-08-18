(function() {
	"use strict";

var WSClient = cc.Class.extend({
	
	_socket: null,
	_handler: null,
	_address: null,
	
	connected: false,
	
	ctor: function(address, handler) {
        this._address = address;
        
        if (handler) {
        	this.setMessageHandler(handler);
        }
        
        this.connect();
	},
	
	setMessageHandler: function(handler) {
		this._handler = handler;
	},
	
	connect: function() {
		var o = this,
			ws = new WebSocket(this._address);
			
		cc.log("连接服务器："+this._address);
        // ws.binaryType = "arraybuffer";
        ws.onopen = function(evt) {
           cc.log("连接成功");
           o.connected = true;
        };
        ws.onmessage = function(evt) {
        	cc.log("recevie ========= "+evt.data);
        	if (o._handler && o._handler.parse) {
        		o._handler.parse(evt.data);
        	}
        };
        ws.onerror = function(evt) {
        	cc.log("连接失败");
        	o.connected = false;
        };
        ws.onclose = function(evt) {
        	cc.log("断开连接");
        	o.connected = false;
        };
        
        this._socket = ws;
	},
	
	send: function(data) {
		if (this._handler && this._handler.string) {
        	data = this._handler.string(data);
        }
        if (this.connected) {
        	cc.log("send    ========= "+data);
        	this._socket.send(data);
        }
	},
	
	close: function(){
		this._socket.close();
	}
});

ccp.WSClient = WSClient;
}());