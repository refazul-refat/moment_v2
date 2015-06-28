//Example
Demo=(function(){
	return{
		onVideoLoaded:function(param){
			var Video=param.object;
			var id=param.id;
			var asset_id=$('#'+id).attr('data-asset_id');

			$.ajax({
				// __asset_id_moments_get_api_call__
				url:Global.getAPIRoot()+'assets/'+asset_id,
				method:'GET',
				dataType:'json',
				success:function(response){
					var moment_list=$('<div>',{id:'moment_list'});
					for(var i=0,l=response.length;i<l;i++){
						//
					}
					$('#'+id).parent().append(moment_list);
				}
			});
		}
	};
})();
E.subscribe('VIDEO_LOADED',Demo);
