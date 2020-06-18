
;(function($){



	//共通函数
	//只加载一次html结构函数
	function loadHtmlOnce($elem,callBack){
		var url = $elem.data('load');
		//如果没有数据地址则不发送请求
		if(!url) return; 
		
		//获取数据
		if(!$elem.data('isLoaded')){
			$.getJSON(url,function(data){
				typeof callBack == 'function' && callBack($elem,data);
			})
		}
	}


	//加载图片
	function loadImg(imgUrl,success,error){
		var img = new Image();
		img.onload = function(){
			success(imgUrl);
		};
		img.onerror = function(){
			error();
		};

		//模拟网络延迟
		setTimeout(function(){
			img.src = imgUrl;
		},300)
		
	}


/*顶部下拉菜单开始*/
	var $dropdown = $('.nav-site .dropdown');
	
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
		mode:'slideLeftRight',
	});
	//加载分类列表数据
	$categoryDropdown.on('dropdown-show dropdown-shown dropdown-hide dropdown-hidden',function(ev){
		if(ev.type == 'dropdown-show'){//加载数据,显示下拉层
			loadHtmlOnce($(this),buildCategoryLayer);
		}
	});
	//生成分类列表下拉菜单html
	function buildCategoryLayer($elem,data){
		var html = ''
		//动态加载数据
		for(var i = 0;i<data.length;i++){
			html += '<dl class="category-details">'
			html +=	'	<dt class="category-details-title fl">'
			html +=	'		<a href="#" class="category-details-title-link">'+data[i].title+'</a>'
			html +=	'	</dt>'
			html +=	'	<dd class="category-details-item fl">'
			for(var j = 0;j<data[i].items.length;j++){
				html +=	'<a href="#" class="link">'+data[i].items[j]+'</a>'
			}
			html +=	'	</dd>'
			html +=	'</dl>'
		}
		//模拟网络延迟家在数据
		setTimeout(function(){
			$elem.find('.dropdown-layer').html(html);
			//数据已经加载
			$elem.data('isLoaded',true);
		},300)
	}





// 焦点区域分类逻辑列表区域-----------------------------------------结束


// 焦点区域轮播图区域-----------------------------------------开始

	//今日焦点和轮播图封装
	function courselLazyLoad($elem){
		$elem.item = {};	//定义一个对象用来记录加载过的每一张图片
		$elem.totalLoadedNum = 0;	//定义未加载的图片个数为0，每次加载完毕+1
		$elem.totalNum = $coursel.find('.carousel-img').length;	//找到所有图片的个数
		$elem.fnLoaded = null;	//匿名函数
		//开始加载
		$elem.on('coursel-show',$elem.fnLoaded = function(ev,index,elem){
			if(!$elem.item[index]){
				$elem.trigger('coursel-load',[index,elem])
			}
		})
		//执行加载
		$elem.on('coursel-load',function(ev,index,elem){
			var $this = $(elem);					//包装成jquery对象
			var $imgs = $this.find('.carousel-img');	//找到每个图片
			$imgs.each(function(){
				var $img = $(this);
				console.log($img);
				var imgUrl = $img.data('src');			//获取图片的地址
				loadImg(imgUrl,function(imgUrlg){
					$img.attr('src',imgUrl)
					console.log(imgUrl);

				},function(){
					$img.attr('src','images/focus-carousel/placeholder.png')
				});
				$elem.item[index] = 'loaded';
				$elem.totalLoadedNum++;
				//判断是否所有的图片都加载完毕，如果加载完毕移除监听事件
				if($elem.totalLoadedNum == $elem.totalNum){
					$elem.trigger('coursel-loaded')
				}
			})
			
		})
		//加载完毕
		$elem.on('coursel-loaded',function(){
			$elem.off('coursel-show',$elem.fnLoaded);
		})
	}


	var $coursel = $('.carousel .carousel-wrap');
	courselLazyLoad($coursel);
	$coursel.coursel({});

// 焦点区域轮播图区域-----------------------------------------结束

// 今日热销区域-----------------------------------------开始
	var $todayCoursel = $('.todays .carousel-wrap');
	courselLazyLoad($todayCoursel);
	$todayCoursel.coursel({});
// 今日热销区域-----------------------------------------结束
})(jQuery);