var g_protocols = [
	{ id: 1000 , type: 'userLogin', callback: 'userLoginEcho' },        // 登陆
	{ id: 1002 , type: 'getUserInfo', callback: 'getUserInfoEcho' },    // 获取用户信息
	{ id: 1005 , type: 'createRole', callback: 'createRoleEcho' },      // 登陆
	{ id: 1001 , type: 'exportRole', callback: 'exportRoleEcho' },      // 登陆
	
	{ id: 3006 , type: 'resetScene', callback: 'resetSceneEcho' },     // 重置场景
	{ id: 3000 , type: 'getMapInfo', callback: 'getMapInfoEcho' },    // 获取地图信息
	{ id: 3001 , type: 'getNpcs', callback: '' },        // 获取 NPC信息
	{ id: 3002 , type: 'getBuildings', callback: '' },   // 获取建筑信息
	{ id: 3003 , type: 'getEvents', callback: '' },      // 获取事件信息
	{ id: 3015 , type: 'getDialogs', callback: '' },     // 获取对话信息
	
	{ id: 2001 , type: 'getRoles', callback: 'getRolesEcho' },       // 获取角色列表
	{ id: 2002 , type: 'updatePosition', callback: 'updatePositionEcho' },   // 获取位置信息
	{ id: 2003 , type: 'addRole', callback: 'addRoleEcho' },         // 获取角色列表
	{ id: 2004 , type: 'removeRole', callback: 'removeRoleEcho' },   // 获取位置信息
];
