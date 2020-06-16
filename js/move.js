;(function($) {
	function init($elem){
		this.$elem = $elem;
		this.$elem.removeClass('transition');
		//获取初始值
		this.currentX = parseInt(this.$elem.css('left'));
		this.currentY = parseInt(this.$elem.css('top'));
	};
	function to(x,y,callback){
		if(this.currentX == x && this.currentY == y) return;
		this.$elem.trigger('move');		//自定义事件移入前
		callback();
		//更新初始值
		this.currentX = x;
		this.currentY = y;
	}

	//slient方法
	function Slient($elem){
		init.call(this,$elem);
	}
	Slient.prototype = {
		to:function(x,y){
			to.call(this,x,y,function(){
				this.$elem.css({
					top:y,
					left:x
				});
				this.$elem.trigger('moved');
			}.bind(this));
		},
	}

	//js方法
	function Js($elem){
		init.call(this,$elem);
		console.log(this.currentX,this.currentY)
	}
	Js.prototype = {
		to:function(x,y){
			to.call(this,x,y,function(){
				this.$elem
				.stop()
				.animate({
					top:y,
					left:x
				},function(){
					//自定义事件移入后
					this.$elem.trigger('moved');	
				}.bind(this));
			}.bind(this));
		}
	}

	var DEFAULT = {
		js:true,
	}

	//根据参数决定使用什么方式的显示和隐藏
	function getmove($elem,options){
		var move = null;
		if(options.js){
			move = new Js($elem);
		}else{
			move = new Slient($elem);
		};
		return move
		
	}

	$.fn.extend({
		move:function(options,n1,n2){
			//1.实现隐士迭代和链式调用
			return this.each(function(){
				var $elem = $(this);
				var moveObj = $elem.data('moveObj');
				//单例模式
				if(!moveObj){// 第一次调用能进来
					options = $.extend({},DEFAULT,options);
					//2.获取显示隐藏的方法
					moveObj = getmove($elem,options);
					//将显示隐藏方法存到当前dom节点上
					$elem.data('moveObj',moveObj);
				}
				//判断当传入的参数是方法时,则调用该方法
				if(typeof moveObj[options] == 'function'){
					//调用显示隐藏方法时必须传入jQuery对象
					moveObj[options](n1,n2);
				}
			})
		}
	})

})(jQuery);