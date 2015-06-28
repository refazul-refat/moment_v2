Moment_List=(function(){
	var _private={
		onVideoLoaded:function(o){
			// __momentlist_all_render__
			//o={parent:*,source:*,resource_id:*}
			console.log('Initiating Moment_List')
			console.log(o);
			$('#moment_list').remove();
			var parent=o.parent;
			var asset_source=o.asset_source;
			var asset_resource_id=o.asset_resource_id;
			var that=this;
			$.ajax({
				// __asset_resolve_post_api_call__
				url:Global.getAPIRoot()+'assets/resolve',
				data:{asset_source:asset_source,asset_resource_id:asset_resource_id},
				method:'POST',
				dataType:'json',
				success:function(moments){
					moments=U.sort(moments,'time_start','asc');
					that.moments=moments;

					$(parent).append($('<div>',{id:'moment_list'}));
					Global.getTemplate('carousel.html',function(data){
						$('#moment_list').append(data);

						for(var i=0;i<that.moments.length;i++){
							Moment.renderOnly(that.moments[i],'#moment_list .items',{class:'item'});
						}
						if(Global.isTouch()){
							// __momentlist_touch_render__
			            
						}
						Moment.refresh();
					});
				}
			});
		}
	};
	return{
		onVideoLoaded:function(object){
			_private.onVideoLoaded(object);
		}
	};
})();
E.subscribe('VIDEO_LOADED',Moment_List,'Moment_List');
