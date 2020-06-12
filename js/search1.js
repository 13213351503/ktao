;(function($){
	function Search($elem,options){
		this.$elem = $elem;
		this.options = options;
		this.$searchForm = this.$elem.find('.search-form');
		this.$searchInput = this.$elem.find('.search-input');
		this.$searchBtn = this.$elem.find('.search-btn');
		this.$searchLayer = this.$elem.find('.search-layer');
		
		this.init();

		if(this.options.autocomplete){
			// console.log('aa')
			this.autocomplete();
		}
	}

	Search.prototype = {
		constructor:Search,
		init:function(){
			//监听提交数据事件
			this.$searchBtn.on('click',$.proxy(this.submit,this))
		},
		submit:function(){
			//如果输入框的值为空，不提交数据
			if(!this.getInputVal()){

				return false;
			};
			//触发提交事件
			this.$searchForm.trigger('submit');	
		},
		getInputVal:function(){
			//获取输入框的值进行判断
			return $.trim(this.$searchInput.val())
		},
		autocomplete:function(){
			//初始化显示隐藏插件
			this.$searchLayer.showHide(this.options);
			//监听输入时触发事件，并调用getData函数
			this.$searchInput.on('input',$.proxy(this.getData,this));
			//监听页面其他地方点击事件,点击页面其他地方，下拉框消失
			$(document).on('click',function(){
				this.hideLayer();
			}.bind(this));
			//点击事件阻止冒泡
			this.$searchInput.on('click',function(ev){
				ev.stopPropagation();
			});
			//输入框获取焦点的时候显示下拉
			this.$searchInput.on('focus',function(){
				//如果输入框没有值，不执行下拉
				if(this.getInputVal()){
					this.showLayer();
				}
				
			}.bind(this));

			//点击每一个li取提交数据的方法
			this.$elem.on('click','.search-item',function(){
				//获取当前点击项的值
				console.log(this);
				var val = $(this).html()
			})
		},
		getData:function(){
			//如果输入框的值为空，停止发送请求，并且收回下拉框
			if(this.getInputVal() == ''){
				this.hideLayer();
				return;
			}
			//如果有值就向淘宝发送ajax请求
			$.ajax({
				url:this.options.url + this.getInputVal(),
				dataType:'jsonp',
				jsonp:'callback'
			})
			.done(function(data){
				// console.log(data);
				// //1.生成HTML结构
				// var html = '';
				// for(var i=0;i<data.result.length;i++){
				// 	html += '<li>'+data.result[i][0]+'</li>';
				// }
				// //2.将HTML插入到下拉菜单中
				// this.appendHtml(html)
				// //3.显示下拉菜单
				// this.showLayer();
				this.$elem.trigger('getSearchData',[data]);
			}.bind(this))


			.fail(function(err){
				this.$elem.trigger('getNoSearchData');
			})
		},
		appendHtml:function(html){
			//2.将HTML插入到下拉菜单中
			this.$searchLayer.html(html);
		},
		showLayer:function(){
			//3.显示下拉菜单
			this.$searchLayer.showHide('show')
		},
		hideLayer:function(){
			//3.隐藏下拉菜单
			this.$searchLayer.showHide('hide')
		},

		
	};

	Search.DEFAULTS = {
		autocomplete:true,	//默认输入时有下拉菜单
		url:'https://suggest.taobao.com/sug?code=utf-8&q='		//默认请求固定地址
	}
	//https://suggest.taobao.com/sug?code=utf-8&q=dd&_ksTS=1591882631944_958&callback=jsonp959&k=1&area=c2c&bucketid=7
	$.fn.extend({
		search:function(options,val){
			return this.each(function(){
				var $elem = $(this);
				var search = $elem.data('search');
				if(!search){//单例模式
					options  = $.extend({},Search.DEFAULTS,options);
					search = new Search($elem,options);
					$elem.data('search',search);
				}
				if(typeof search[options] == 'function'){
					search[options](val);
				}
			});
		}
	})
})(jQuery);