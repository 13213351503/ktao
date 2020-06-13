
;(function($){

/*顶部下拉菜单开始*/
	var $dropdown = $('.dropdown');
	
	$dropdown.on('dropdown-show dropdown-shown dropdown-hide dropdown-hidden',function(ev){
		if(ev.type == 'dropdown-shown'){
			var $this = $(this);
			//当需要显示时从服务器获取数据并且加载
			var $dropdownLayer = $this.find('.dropdown-layer')
			//获取需要请求的地址
			var url = $this.data('load');
			//如果页面上没有设置请求地址直接返回
			if(!url) return;

			var isLoaded = $this.data('isLoaded');
			//如果已经加载过数据了直接返回
			if(!$this.data('isLoaded')){
				$.getJSON(url,function(data){
					var html = '';
					for(var i = 0;i<data.length;i++){
						html += '<li><a href="'+data[i].url+'" class="menu-item">'+data[i].name+'</a></li>';
					}
					//模拟网络延时
					setTimeout(function(){
						$dropdownLayer.html(html);
						$this.data('isLoaded',true);
					},500);
				});
			};
			
			//如果有请求地址,发送请求获取数据
			
		}
	});
	
	$dropdown.dropdown({
		js:true,
		mode:'slideUpDown'
	});

/*顶部下拉菜单结束*/
	
/*搜索框开始*/

	var $search = $('.search');
	
	$search.search({
		js:true,
		mode:'slideUpDown'
	});

	//得到数据并显示下拉菜单
	$search.on('getSearchData',function(ev,data){
		var $elem = $(this);
		//1.生成HTML结构
		var html = getSearchLayer(data,10);
		//2.将HTML插入到下拉菜单中
		$elem.search('appendHtml',html);
		//3.显示下拉菜单
		$elem.search('showLayer');
	});
	//隐藏下拉层
	$search.on('getNoSearchData',function(){
		$elem.search('appendHtml','');
		$elem.search('hideLayer');
	});
	//用来判定显示几条数据函数
	function getSearchLayer(data,max){
		var html = '';
		for(var i=0;i<data.result.length;i++){
			if(i>=max) break;
			html += '<li class="search-item">'+data.result[i][0]+'</li>';
		};
		return html
	}
	

	
/*搜索框结束*/	

// 焦点区域分类逻辑列表区域-----------------------------------------开始
	var $categoryDropdown = $('.focus .dropdown');
	$categoryDropdown.dropdown({
		js:true,
		mode:'slideLeftRight'
	});

	
	// $categoryDropdowm.on('dropdown-show dropdown-shown dropdown-hide dropdown-hidden',function(ev){
	// 	if(ev.type == 'dropdown-shown'){
	// 		var $this = $(this);
	// 		//当需要显示时从服务器获取数据并且加载
	// 		var $dropdownLayer = $this.find('.dropdown-layer')
	// 		//获取需要请求的地址
	// 		var url = $this.data('load');
	// 		//如果页面上没有设置请求地址直接返回
	// 		if(!url) return;

	// 		var isLoaded = $this.data('isLoaded');
	// 		//如果已经加载过数据了直接返回
	// 		if(!$this.data('isLoaded')){
	// 			$.getJSON(url,function(data){
	// 				var html = '';
	// 				for(var i = 0;i<data.length;i++){
	// 					html += '<li><a href="'+data[i].url+'" class="menu-item">'+data[i].name+'</a></li>';
	// 				}
	// 				//模拟网络延时
	// 				setTimeout(function(){
	// 					$dropdownLayer.html(html);
	// 					$this.data('isLoaded',true);
	// 				},500);
	// 			});
	// 		};
	// 	}
	// });






// 焦点区域分类逻辑列表区域-----------------------------------------结束

})(jQuery);