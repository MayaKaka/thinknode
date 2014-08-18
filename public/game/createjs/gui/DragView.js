(function(){
    "use strict";
    
var DragView = cy.Panel.extend({
	type: 'DragView',
	init: function(width, height) {
		this.Super_init(width, height);
		DragView.apply(this);
	}
});

DragView.apply = function(target) {
	if (target.type!=='DragView') {
		target.type = 'DragView';
	}
	var o = target,
		dragTarget = null,
		copyTarget = null,
		copyTargetReg = null;
	o.addEventListener('mousedown',function(e){
		var child = e.target;
		while (child) {
			if (child.draggable) {
				dragTarget = child;
				child = null;
			}
			else if (child === o) {
				child = null;
			} else {
				child = child.parent;
			}
		}
		if (dragTarget) {
			// 确定拖拽对象
			var mtx1 = dragTarget.getConcatenatedMatrix(),
				mtx2 = new createjs.Matrix2D();
			mtx2.append(mtx1.a, mtx1.b, mtx1.c, mtx1.d, e.stageX, e.stageY);
			mtx1.invert();
			mtx2.invert();
			var dx = mtx1.tx-mtx2.tx,
				dy = mtx1.ty-mtx2.ty;
			copyTargetReg = {
				regX: dx,
				regY: dy
			};
		}
	});
	o.addEventListener('pressmove',function(e){
		// 有可拖拽对象被选中
		if (dragTarget) {
			// 创建对象的副本
			if (!copyTarget) {
				copyTarget = dragTarget.clone('true');
				copyTarget.regX = copyTargetReg.regX;
				copyTarget.regY = copyTargetReg.regY;
				App.stage.addChild(copyTarget);
			}
			// 更新副本的坐标
			copyTarget.x = e.stageX;
			copyTarget.y = e.stageY;
		}
	});
	o.addEventListener('pressup',function(){
		// 存在拖拽产生的副本时
		if (copyTarget) {
			App.stage.removeChild(copyTarget);
			// 检测  drop 事件
			DragView.testDropTarget(o, o._getObjectsUnderPoint(copyTarget.x, copyTarget.y), dragTarget);
			copyTarget = null;
		}
		// 清除对象引用
		dragTarget = null;
	});
};

DragView.testDropTarget =  function(target, result, dragTarget){
	// 冒泡检测
	while (result) {
		if (result.hasEventListener('drop')) {
			var event = new cy.Event('drop');
			event.dragTarget = dragTarget;
			result.dispatchEvent(event);
			result = null;
		} else {
			if (result===target) {
				result = null;
			} else {
				result = result.parent;
			}
		}
	}
};

cy.DragView = DragView;

})();
