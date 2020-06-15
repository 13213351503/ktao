;(function($){
	



	function Coursel($elem,options){
		this.$elem = $elem;
		this.options = options;
		this.$courselItem = this.$elem.find('.carousel-item');
		this.$courselBtn = this.$elem.find('.btn-item');
		this.$courselControl = this.$elem.find('.control');
		this.itemLength = this.$courselBtn.length;
		this.time = null;

		this.now = this.options.activeIndex;
		this.init();
	}

	Coursel.prototype = {
		constructor:Coursel,
		init:function(){
			var _this = this;
			if(this.options.slide){

			}else{
				//1.隐藏所有图片，显示当前图片
				this.$elem.addClass('fade');
				this.$courselItem.eq(this.now).show();
				//2.底部按钮选中状态
				this.$courselBtn.eq(this.now).addClass('active');
				//3.鼠标移入显示左右点击按钮
				this.$elem.hover(function(){
					this.$courselControl.show();
				}.bind(this),function(){
					this.$courselControl.hide();	
				}.bind(this));
				//5.初始化显示隐藏插件
				this.$courselItem.showHide(this.options);
				//4.(事件代理)监听点击左右按钮实现动画切换
				this.$elem.on('click','.control',function(){
					var $this = $(this);
					if($this.hasClass('control-left')){		//点击左按钮
						_this._fade(_this._getCorrentIndex(_this.now-1));
					}else if($this.hasClass('control-right')){	//点击右按钮
						_this._fade(_this._getCorrentIndex(_this.now+1));
					}
				});
				//6.自动轮播
				if(this.options.autotime){
					this.autoPlay();
					//鼠标移入停止，移出开始
					this.$elem.hover($.proxy(this.paused,this),$.proxy(this.autoPlay,this));
				};
				//7.点击底部按钮实现图片切换
				this.$courselBtn.on('click',function(){
					var index = _this.$courselBtn.index($(this));
					_this._fade(index);
				})
			}
		},
		_fade:function(index){
			//当重复点击底部同一个按钮则不切换
			if(this.now == index){
				return
			};
			console.log('aa')
			//1.隐藏当前图片
			this.$courselItem.eq(this.now).showHide('hide');
			//2.显示下一张图片
			this.$courselItem.eq(index).showHide('show');
			//3.更新底部按钮
			this.$courselBtn.eq(this.now).removeClass('active');
			this.$courselBtn.eq(index).addClass('active')
			//4.更新索引
			this.now = index;
		},

		//判断下标
		_getCorrentIndex:function(num){
			if(num > this.itemLength-1){
				num = 0;
			}else if(num < 0){
				num = this.itemLength-1;
			}
			return num;
		},

		//自动轮播方法方法
		autoPlay:function(){
			this.time = setInterval(function(){
				this.$courselControl.eq(1).trigger('click');
			}.bind(this),this.options.autotime)
		},

		//停止轮播方法
		paused:function(){
			clearInterval(this.time);
		}
	};

	Coursel.DEFAULT = {
		slide:false,
		activeIndex:0,
		js:true,
		mode:'fade',
		autotime:0
	}
	$.fn.extend({
		coursel:function(options){
			return this.each(function(){
				var $elem = $(this);
				var coursel = $elem.data('coursel');
				if(!coursel){//单例模式
					options  = $.extend({},Coursel.DEFAULT,options);
					coursel = new Coursel($elem,options);
					$elem.data('coursel',coursel);
				}
				if(typeof coursel[options] == 'function'){
					coursel[options]();
				}
			});
		}
	})
})(jQuery);