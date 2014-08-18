var MsgHandler = cc.Class.extend({
	
	_protocolsById: null,
	_protocolsByType: null,
	
	ctor: function(data){
		var protocolsById = {},
			protocolsByType = {};
		data.forEach(function(a, i){
			protocolsById[a.id] = a;
			protocolsByType[a.type] = a;
		});
		this._protocolsById = protocolsById;
		this._protocolsByType = protocolsByType;
	},
	
	parse: function(data){
		data = JSON.parse(data);
		var date = data.shift(),
			id  = data.shift(),
			protocol = this._protocolsById[id];
		ccp.Notification.notify(protocol.callback, data);
	},
	
	string: function(data){
		var protocol = this._protocolsByType[data.type],
			arr = [];
		arr.push(new Date().getTime());
		arr.push(protocol.id);
		data.data.forEach(function(a, i){
			arr.push(a);
		});
		return JSON.stringify(arr);
	}
	
});
