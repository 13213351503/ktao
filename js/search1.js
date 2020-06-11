;(function($){
	function Search($elem,options){
		this.$elem = $elem;
		this.options = options;
		this.$searchForm = this.$elem.find('.search-form');
		this.$searchInput = this.$elem.find('.search-input');
		this.$searchBtn = this.$elem.find('.search-btn');
		
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
			this.$searchForm.trigger('submit');
		},
		getInputVal:function(){
			//获取输入框的值进行判断
			return $.trim(this.$searchInput.val())
		},
		autocomplete:function(){
			this.$searchInput.on('input',function(){
				console.log(this.getInputVal());
			}.bind(this))
		}
	};

	Search.DEFAULTS = {
		autocomplete:true
	}

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