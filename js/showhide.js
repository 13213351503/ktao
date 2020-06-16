;(function($) {
	//共通的初始化方法
	function init($elem,hiddenCallBack){
		if($elem.is(':hidden')){
			$elem.data('status','hidden');
			if(typeof hiddenCallBack == 'function') hiddenCallBack();
		}else{
			$elem.data('status','shown');
		}		
	}
	function show($elem,callBack){
		if($elem.data('status')=='shown') return;
		if($elem.data('status')=='show') return;
		
		$elem.data('status','show').trigger('show');

		callBack();	
	}
	function hide($elem,callBack){
		if($elem.data('status') == 'hidden') return;
		if($elem.data('status') == 'hide') return;

		$elem.data('status','hide').trigger('hide');
		callBack();		
	}
	var slient = {

		init:init,
		show:function($elem){

			show($elem,function(){
				$elem.show();
				$elem.trigger('shown').data('status','shown');
			})
			
		},
		hide:function($elem){

			hide($elem,function(){
				$elem.hide();
				$elem.trigger('hidden').data('status','hidden');				
			});
		}
	};

	//js相关显示和隐藏
	var js = {
		//淡入淡出的显示隐藏
		fade:{
			init:function($elem){
				js._init($elem);
			},
			show:function($elem){
				js._show($elem,'fadeIn');
			},
			hide:function($elem){
				js._hide($elem,'fadeOut');
			}
		},
		slideUpDown:{
			init:function($elem){
				js._init($elem);
			},
			show:function($elem){
				js._show($elem,'slideDown');		
			},
			hide:function($elem){
				js._hide($elem,'slideUp');
			}
		},
		//左右卷入卷出
		slideLeftRight:{
			init:function($elem){
				js._customInit($elem,{
						width:'0px',
						paddingLeft:'0px',
						paddingRight:'0px'
					});
			},
			show:function($elem){
				js._customShow($elem);
			},
			hide:function($elem){
				js._customHide($elem,{
						width:'0px',
						paddingLeft:'0px',
						paddingRight:'0px'				
					});
			}
		},
		//淡入淡出上下卷入卷出
		fadeSlideUpDown:{
			init:function($elem){
				js._customInit($elem,{
						height:'0px',
						paddingTop:'0px',
						paddingBottom:'0px',
						opacity:0
					});
			},
			show:function($elem){
				js._customShow($elem);
			},
			hide:function($elem){
				js._customHide($elem,{
						height:'0px',
						paddingTop:'0px',
						paddingBottom:'0px',	
						opacity:0		
					});
			}			
		},
		//淡入淡出左右卷入卷出
		fadeSlideLeftRight:{
			init:function($elem){
				js._customInit($elem,{
						width:'0px',
						paddingLeft:'0px',
						paddingRight:'0px',
						opacity:0
					});
			},
			show:function($elem){
				js._customShow($elem);

			},
			hide:function($elem){
				js._customHide($elem,{
						width:'0px',
						paddingLeft:'0px',
						paddingRight:'0px',
						opacity:0				
					});
			}
		}				
	}
	js._init = function($elem){
		$elem.removeClass('transition');//避免和css3的过渡发生冲突
		init($elem);
	}
	js._show = function($elem,mode){
		show($elem,function(){
			$elem.stop()[mode](function(){
				$elem.trigger('shown').data('status','shown');
			})
		});		
	}
	js._hide = function($elem,mode){
		hide($elem,function(){
			$elem.stop()[mode](function(){
				$elem.trigger('hidden').data('status','hidden');
			})
		});		
	}
	js._customInit = function($elem,options){
		$elem.removeClass('transition');

		var styles = {};

		for(key in options){
			styles[key] = $elem.css(key);
		}
		$elem.data('styles',styles);				
		init($elem,function(){
			//把水平的宽度值设置为0
			$elem.css(options);
		});		
	}
	js._customShow = function($elem){
		$elem.show();//display:block
		//获取原始值
		show($elem,function(){
			$elem
			.stop()
			.animate($elem.data('styles'),function(){
				$elem.trigger('shown').data('status','shown');
			});					
		})		
	}
	js._customHide = function($elem,options){
		hide($elem,function(){
			$elem.stop().animate(options,function(){
				$elem.hide();
				$elem.trigger('hidden').data('status','hidden');
			});						
		})		
	}

	//根据参数决定使用什么方式的显示和隐藏
	function showHide($elem,options){
		
			
		
		
		var showHideFn = null;

		if(options.css3 && kuazhu.transition.isSupport){//css3
			showHideFn = css3[options.mode];
		}else if(options.js){//js
			showHideFn = js[options.mode];
		}else{//slietn
			showHideFn = slient;
		}

		showHideFn.init($elem);
		
		return {
			show:showHideFn.show,
			hide:showHideFn.hide
		}
	}

	$.fn.extend({
		showHide:function(options){
			var defaults = {
				css3:false,
				js:false,
				mode:'slideLeftRight'
			}
			this.each(function(){
				var $elem = $(this);
				var mode = $elem.data('mode');//undefined/obj
				//单例模式
				if(!mode){
					options = $.extend(defaults,options);
					mode = showHide($elem,options);
					//把有方法(show/hide)的对象存到对应的DOM元素上
					$elem.data('mode',mode);
				}
				if(typeof mode[options] == 'function'){
					//注意，此处要不执行显示隐藏的元素jquery对象传递
					mode[options]($elem);
				}
			});
			return this;
		}
	});

})(jQuery);