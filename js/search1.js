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
			//监听输入时触发事件，并调用getData函数
			this.$searchInput.on('input',$.proxy(this.getData,this));
		},
		getData:function(){
			//如果输入框的值为空，停止发送请求
			if(this.getInputVal() == ''){
				return;
			}
			//如果有值就向淘宝发送ajax请求
			$.ajax({
				url:this.options.url + this.getInputVal(),
				dataType:'jsonp',
				jsonp:'callback'
			})
			.done(function(data){
				console.log(data);
				//1.生成HTML结构
				var html = '';
				for(var i=0;i<data.result.length;i++){
					html += '<li>'+data.result[i][0]+'</li>';
				}
				//2.将HTML插入到下拉菜单中
				this.appendHtml(html)
				//3.显示下拉菜单
				this.showLayer();
			}.bind(this))
			.fail(function(err){
				console.log(err);
			})
		},
		appendHtml:function(html){
			this.$searchLayer.html(html);
		},
		showLayer:function(){
			this.$searchLayer.showHide('show')
		}

		autocomplete:function(){
			//监听输入时触发事件，并调用getData函数
			this.$searchInput.on('input',$.proxy(this.getData,this));
		},
	};

	Search.DEFAULTS = {
		autocomplete:true,	//默认输入时有下拉菜单
		url:'https://suggest.taobao.com/sug?code=utf-8&q='		//默认请求固定地址
	}
	//https://suggest.taobao.com/sug?code=utf-8&q=dd&_ksTS=1591882631944_958&callback=jsonp959&k=1&area=c2c&bucketid=7
	$.fn.extend({
		Search:function(options){
			return this.each(function(){
				var $this = $(this);
				var search = $this.data('Search');
				if(!search){//单例模式
					options  = $.extend({},Search.DEFAULTS,options);
					search = new Search($(this),options);
					$this.data('search',Search);
				}
				if(typeof search[options] == 'function'){
					search[options]();
				}
			});
		}
	})
})(jQuery);