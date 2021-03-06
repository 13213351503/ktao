;(function($){
	function DropDown($elem,options){
		this.$elem = $elem;
		this.options = options;
		this.activeClass = this.$elem.data('active') + '-active';
		this.$layer = this.$elem.find('.dropdown-layer');
		

		this.init();
	
	}

	DropDown.prototype = {
		constructor:DropDown,
		init:function(){
			//初始化显示隐藏模块
			this.$layer.showHide(this.options);	

			this.$layer.on('show shown hide hidden',function(ev){
				// console.log(ev.type);
				this.$elem.trigger('dropdown-'+ev.type);
			}.bind(this));

			//绑定事件
			// this.$elem.hover(this.show.bind(this),this.hide.bind(this));
			if(this.options.eventName == 'click'){
				this.$elem.on('click',function(ev){
					ev.stopPropagation();
					this.show();
				}.bind(this));
				$(document).on('click',$.proxy(this.hide,this));
			}else{
				this.$elem.hover($.proxy(this.show,this),$.proxy(this.hide,this));	
			}
		},
		show:function(){
			//避免用户快速划过触发事件
			if(this.options.delay){
				this.timer = setTimeout(function(){
					//显示下拉层
					this.$layer.showHide('show');
					this.$elem.addClass(this.activeClass);		
				}.bind(this),this.options.delay)
			}else{
				//显示下拉层
				this.$layer.showHide('show');
				this.$elem.addClass(this.activeClass);					
			}	
		},
		hide:function(){
			if(this.options.delay){
				clearTimeout(this.timer);
			}
			//隐藏下拉层
			this.$layer.showHide('hide');
			this.$elem.removeClass(this.activeClass);	
		}
	};

	DropDown.DEFAULTS = {
		js:true,
		mode:'slideLeftRight',
		delay:200,
		eventName:''		
	}

	$.fn.extend({
		dropdown:function(options){
			return this.each(function(){
				var $this = $(this);
				var dropdown = $this.data('dropdown');
				if(!dropdown){//单例模式
					options  = $.extend(DropDown.DEFAULTS,options);
					dropdown = new DropDown($(this),options);
					$this.data('dropdown',dropdown);
				}
				if(typeof dropdown[options] == 'function'){
					dropdown[options]();
				}
			});
		}
	})
})(jQuery);