
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
		
	};



	function getDataOnce($elem,url,callback){
		var data = $elem.data('url');
		if(!data){
			$.getJSON(url,function(resData){
				$elem.data('url',resData);
				callback(resData);
			})
		}else{
			callback(data);
		}
	};


	function lazyLoad(options){
		var item = {},
			totalLoadedNum = 0,
			totalNum = options.totalNum,
			fnLoad = null,
			$elem = options.$elem,
			eventName = options.eventName,
			eventPrefix = options.eventPrefix;
		//1.开始加载
		$elem.on(eventName,fnLoad = function(ev,index,elem){
			if(!item[index]){
				$elem.trigger(eventPrefix+'-load',[index,elem,function(){
					//图片加载完毕
					item[index] = 'loaded';
					totalLoadedNum++;
					//判断是否所有图片加载完毕,如果加载完毕则移出监听的事件
					if(totalLoadedNum == totalNum){
						$elem.trigger('coursel-loaded')
					}
				}]);
			}
		})
		//3.加载完毕
		$elem.on(eventPrefix+'-loaded',function(){
			$elem.off(eventName,fnLoad);
		})
	};



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
				var imgUrl = $img.data('src');			//获取图片的地址
				loadImg(imgUrl,function(imgUrlg){
					$img.attr('src',imgUrl)
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
			$coursel.off('coursel-show',$elem.fnLoaded);
		})
	}


	var $coursel = $('.focus .carousel-wrap');
	courselLazyLoad($coursel);
	$coursel.coursel({});

// 焦点区域轮播图区域-----------------------------------------结束

// 今日热销区域-----------------------------------------开始
	var $todayCoursel = $('.todays .carousel-wrap');
	courselLazyLoad($todayCoursel);
	$todayCoursel.coursel({});
// 今日热销区域-----------------------------------------结束


// 楼层区域-----------------------------------------开始
	// //楼层图片懒加载
	// function floorImageLazyLoad($elem){
	// 	$elem.item = {};//{0:loaded,1:loaded}
	// 	$elem.totalLoadedNum = 0;
	// 	$elem.totalNum = $elem.find('.floor-img').length;
	// 	$elem.fnLoad = null;
	// 	//1.开始加载
	// 	$elem.on('tab-show',$elem.fnLoad = function(ev,index,elem){
	// 		if(!$elem.item[index]){
	// 			$elem.trigger('tab-load',[index,elem]);
	// 		}
	// 	})
	// 	//2.执行加载
	// 	$elem.on('tab-load',function(ev,index,elem){
	// 		var $this = $(elem);
	// 		var $imgs = $this.find('.floor-img');
	// 		$imgs.each(function(){
	// 			var $img = $(this);
	// 			var imgUrl = $img.data('src');
	// 			loadImg(imgUrl,function(imgUrl){
	// 				$img.attr('src',imgUrl);
	// 			},function(){
	// 				$img.attr('src','image/focus-carousel/placeholder.png');
	// 			});
	// 			//图片加载完毕
	// 			$elem.item[index] = 'loaded';
	// 			$elem.totalLoadedNum++;
	// 			//判断是否所有图片加载完毕,如果加载完毕则移出监听的事件
	// 			if($elem.totalLoadedNum == $elem.totalNum){
	// 				$elem.trigger('tab-loaded')
	// 			}
	// 		})
			
	// 	})
	// 	//3.加载完毕
	// 	$elem.on('tab-loaded',function(){
	// 		$elem.off('tab-show',$elem.fnLoad);
	// 	})
	// }


	// var $floor = $('.floor');
	// //遍历每一个楼层实现图片懒加载
	// $floor.each(function(){
	// 	floorImageLazyLoad($(this));
	// })

	// $floor.tab({})



	//楼层HTML懒加载
	function buildFloorHtml(oneFloorData){
		var html = '';
		html += '<div class="container">';
		html += buildFloorHeaderHtml(oneFloorData);
		html += buildFloorBodyHtml(oneFloorData);
		html += '</div>';
		return html;
	}
	function buildFloorHeaderHtml(oneFloorData){
		var html = '';
		html += '<div class="floor-hd">';
		html +=	'	<h2 class="floor-title fl">';
		html +=	'		<span class="floor-title-num">'+oneFloorData.num+'F</span>';
		html +=	'		<span class="floor-title-text">'+oneFloorData.text+'</span>';
		html +=	'	</h2>';
		html +=	'	<ul class="tab-item-wrap fr">';
		for(var i = 0;i<oneFloorData.tabs.length;i++){
		html +=	'		<li class="fl">';
		html +=	'			<a class="tab-item" href="javascript:;">'+oneFloorData.tabs[i]+'</a>';
		html +=	'		</li>';
			if(i != oneFloorData.tabs.length -1){
				html += '<li class="fl tab-divider"></li>';
			}
		}
		html +=	'	</ul>';
		html +=	'</div>';

		return html;
	}
	function buildFloorBodyHtml(oneFloorData){
		var html = '';
		 	html += '<div class="floor-bd">';
			for(var i = 0;i<oneFloorData.items.length;i++){
			html += '	<ul class="tab-panel clearfix">';
				for(var j = 0;j<oneFloorData.items[i].length;j++){
					html += '		<li class="floor-item fl">';
					html += '			<p class="floor-item-pic">';
					html += '				<a href="#">';
					html += '					<img class="floor-img" src="images/floor/loading.gif" data-src="images/floor/'+oneFloorData.num+'/'+(i+1)+'/'+(j+1)+'.png" alt="">';
					html += '				</a>';
					html += '			</p>';
					html += '			<p class="floor-item-name">';
					html += '				<a class="link" href="#">'+oneFloorData.items[i][j].name+'</a>';
					html += '			</p>';
					html += '			<p class="floor-item-price">￥'+oneFloorData.items[i][j].price+' </p>';
					html += '		</li>';
				}
			html += '	</ul>';
			}
			html += '</div>';
		return html;
	}

	//判断楼层是否进入到可视区 
	function isVisible($elem){
		return ($win.height()+$win.scrollTop()>$elem.offset().top) && ($elem.height()+$elem.offset().top > $win.scrollTop());
	}

	var $floor = $('.floor');
	var $win = $(window);
	var $doc = $(document);
	lazyLoad({
		$elem:$doc,
		totalNum:$floor.length,
		eventName:'floor-show',
		eventPrefix:'floor'
	});
	//楼层HTML懒加载:执行加载
	$doc.on('floor-load',function(ev,index,elem,success){
		//1.加载数据
		getDataOnce($doc,'data/floor/floorData.json',function(data){
			var html = buildFloorHtml(data[index]);
			//2.生成HTML结构并插入到楼层中
			$(elem).html(html)
			//3.实现楼层图片懒加载
			lazyLoad({
				$elem:$(elem),
				totalNum:$(elem).find('.floor-img').length,
				eventName:'tab-show',
				eventPrefix:'tab'
			});
			//图片懒加载:执行加载
			$(elem).on('tab-load',function(ev,index,elem,success){
				var $this = $(elem);
				var $imgs = $this.find('.floor-img');
				$imgs.each(function(){
					var $img = $(this);
					var imgUrl = $img.data('src');
					loadImg(imgUrl,function(imgUrl){
						$img.attr('src',imgUrl);
					},function(){
						$img.attr('src','image/focus-carousel/placeholder.png');
					});
					//加载成功执行函数
					success()
				})
			})
			//4.激活选项卡
			$(elem).tab({})
		})
		//HTML加载完毕
		success()
	})
	//遍历每一个楼层判断是否在可视区
	function timeShow(){
		$floor.each(function(index,elem){
			if(isVisible($(elem))){
				$doc.trigger('floor-show',[index,elem]);
			}
		})
	}
	
	$win.on('load resize scroll',function(){
		clearTimeout($doc.floorTimer);
		$doc.floorTimer = setTimeout(timeShow,300)
	})


// 楼层区域-----------------------------------------结束



/*电梯逻辑--------------------开始*/
	var $elevator = $('#elevator');
	var $elevatorItems = $('.elevator-item');

	//获取当前显示电梯号
	function getElevator(){
		var num = -1;
		$floor.each(function(index,elem){
			num = index;
			if($(elem).offset().top > $win.scrollTop() + $win.height()/2){
				num = index - 1;
				return false;
			}
		})
		return num;
	}
	//设置电梯
	function setElevator(){
		var num =	getElevator();
		if(num == -1){
			$elevator.fadeOut();
		}else{
			$elevator.fadeIn();
			//移出所有class
			$elevatorItems.removeClass('elevator-active');
			//当前电梯选中状态
			$elevatorItems.eq(num).addClass('elevator-active');
		} 
	}
	$win.on('load resize scroll',function(){
		clearTimeout($elevator.elevatorShowTimer);
		$elevator.elevatorShowTimer = setTimeout(setElevator,200)
	})
	//事件代理监听点击电梯到达指定楼层
	$elevator.on('click','.elevator-item',function(){
		var index = $elevatorItems.index(this);
		$('html,body').animate({
			scrollTop:$floor.eq(index).offset().top
		})
	})

/*电梯逻辑--------------------结束*/

/*工具条逻辑--------------------开始*/
	var $toTop = $('#backToTop');
	$toTop.on('click',function(){
		$('html,body').animate({
			scrollTop:0
		})
	})

/*工具条逻辑--------------------结束*/


})(jQuery);