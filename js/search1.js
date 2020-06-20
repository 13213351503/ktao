;(function($){
	//缓存机制
	cache = {
		data:{},//存放缓存数据
		count:0,//缓存个数
		addData:function(key,val){//添加缓存
			this.data[key] = val;
			this.count++;
		},
		getData:function(key){	//获取缓存
			return this.data[key]
		}
	};



	function Search($elem,options){
		this.$elem = $elem;
		this.options = options;
		this.$searchForm = this.$elem.find('#search-form');
		this.$searchInput = this.$elem.find('.search-input');
		this.$searchBtn = this.$elem.find('.search-btn');
		this.$searchLayer = this.$elem.find('.search-layer');
		
		this.timer = null;
		this.jqXHR = null;
		this.init();
		//判断是否显示下拉层
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
			this.$searchInput.on('input',function(){
				//开启一个定时器，防止在连续输入的时候多次向服务器请求数据
				if(this.options.delatGetData){				
					clearTimeout(this.timer);
					this.timer = setTimeout(function(){
						this.getData();
					}.bind(this),this.options.delatGetData)
				}else{
					this.getData();
				}
			}.bind(this));
			
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
			var _this = this;
			this.$elem.on('click','.search-item',function(){
				//获取当前点击项的值
				var val = $(this).html()	//这里的this不需要改变，如果从外部传入不合适
				//把数据赋给输入框
				_this.setInputVal(val);
				//提交数据
				_this.submit();
			})
		},
		getData:function(){
			// console.log('getdata')
			//如果输入框的值为空，停止发送请求，并且收回下拉框
			if(this.getInputVal() == ''){
				this.hideLayer();
				return;
			}
			//终止之前的请求，获取最新数据
			if(this.jqXHR){
				this.jqXHR.abort();
			}
			//判断是否有缓存
			if(cache.getData(this.getInputVal())){
				//把缓存的值存下来
				// console.log(cache.getData(this.getInputVal()));
				var cacheData = cache.getData(this.getInputVal());
				// //如果有缓存显示下拉菜单，并把缓存当参数传进去	
				this.$elem.trigger('getSearchData',[cacheData]);
				//有缓存就停止向下继续进行
				return;
			}
			console.log('will data')
			//如果有值就向淘宝发送ajax请求
			this.jqXHR = $.ajax({
				url:this.options.url + this.getInputVal(),
				dataType:'jsonp',
				jsonp:'callback'
			})
			.done(function(data){
				this.$elem.trigger('getSearchData',[data]);
				//将获取的缓存数据存下来
				cache.addData(this.getInputVal(),data);
			}.bind(this))


			.fail(function(err){
				this.$elem.trigger('getNoSearchData');
			})

			//不管成功失败最后都会走进always中，只要走进always中就代表请求完成，
			.always(function(){
				this.jqXHR = null;
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
		setInputVal:function(val){
			this.$searchInput.val(val);
		}
		
	};

	Search.DEFAULTS = {
		autocomplete:true,	//默认输入时有下拉菜单
		url:'https://suggest.taobao.com/sug?code=utf-8&q=',		//默认请求固定地址
		delatGetData:300
	}
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