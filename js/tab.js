;(function($){
	function Tab($elem,options){
		//1.罗列属性
		this.$elem = $elem;
		this.options = options;
		this.$tabItems = this.$elem.find('.tab-item');
		this.$tabPannels = this.$elem.find('.tab-panel');
		this.itemLength = this.$tabItems.length;

		this.timer = null;
		//显示当前索引值
		this.now = this._getCorrentIndex(this.options.activeIndex);
		//2.初始化
		this.init()

	} 
	Tab.prototype = {
		constructor:Tab,
		init:function(){
			var _this = this;
			//1.初始化显示当前按钮
			this.$tabItems.eq(this.now).addClass('tab-item-active');
			//2.初始化显示面板
			this.$tabPannels.eq(this.now).show();
			//4.初始化显示隐藏插件
			
			this.$elem.trigger('tab-show',[this.now,this.$tabPannels.eq(this.now)]);
			//默认加载显示楼层图片
			this.$tabPannels.on('show',function(ev){
				_this.$elem.trigger('tab-show',[_this.$tabPannels.index(this),this])
			})
			this.$tabPannels.showHide(this.options);
			//3.监听事件切换选项卡
			var eventType = '';
			if(this.options.eventName){
				eventType = 'click';
			}else{
				eventType = 'mouseenter';
			}
			this.$elem.on(eventType,'.tab-item',function(){
				var index = _this.$tabItems.index($(this));
				_this._toggle(index);
			});
			//5.自动轮播
			if(this.options.autotime){
				this.autoplay();
				//监听事件移入停止轮播移出开始轮播
				this.$elem.hover($.proxy(this.paused,this),$.proxy(this.autoplay,this));
			};
		},
		_toggle:function(index){
			//4.当当前显示和将要显示的值相同时则不切换
			if(this.now == index) return ;
			//1.隐藏当前选项卡
			this.$tabItems.eq(this.now).removeClass('tab-item-active');
			this.$tabPannels.eq(this.now).showHide('hide');
			//2.显示下一个选项卡
			this.$tabItems.eq(index).addClass('tab-item-active');
			this.$tabPannels.eq(index).showHide('show');
			//3.更新索引
			this.now = index;
		},

		_getCorrentIndex:function(num){
			if(num > this.itemLength-1){
				num = 0;
			}else if(num < 0){
				num = this.itemLength-1;
			}
			return num;
		},

		autoplay:function(){
			this.timer = setInterval(function(){
				this._toggle(this._getCorrentIndex(this.now+1))
			}.bind(this),this.options.autotime)
		},

		paused:function(){
			clearInterval(this.timer);
		}
	}

	//如果不传递参数则使用默认配置信息
	Tab.DEFAULT = {
		activeIndex:0,
		js:false,
		mode:'fade',
		autotime:0,
		eventName:'click'
	}

	$.fn.extend({
		tab:function(options){
			//1.实现隐式迭代和链式调用
			return this.each(function(){
				var $elem = $(this);
				//2.单例模式
				var tab = $elem.data('tab');
				if(!tab){
					//利用面向对象完成下拉菜单功能
					options = $.extend({},Tab.DEFAULT,options);
					tab = new Tab($elem,options);
					$elem.data('tab',tab);
				}
				//判断当传入的参数是方法时,则调用该方法
				if(typeof tab[options] == 'function'){
					tab[options]();
				}
			})
		}
	})
})(jQuery);