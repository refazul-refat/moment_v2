Moment_Playhead=(function(){
	var _private={
		onVideoLoaded:function(o){
			// __moment_new_init__
			//o={parent:*,source:*,resource_id:*}
			console.log('Initiating Moment_Playhead');
			console.log(o);
			$('#moment_playhead').remove();
			var parent=o.parent;
			var asset_source=o.asset_source;
			var asset_resource_id=o.asset_resource_id;
			var that=this;

			function t(){
				// __moment_new_create__
				var current=parseInt(Global.getVideoObject().getCurrentTime(Global.getMainFrameId()),10);
				var thumb=Global.getVideoObject().getThumbnailAt(Global.getMainFrameId(),current);
				if(!thumb.url){
					var t=thumb;
					thumb={};
					thumb.url=t;
					thumb.rows=0;
					thumb.columns=0;
					thumb.position=0;
				}
				var moment={
					asset:{
						source:asset_source,
						resource_id:asset_resource_id,
					}
				};
				moment.thumbnail_background_image=thumb.url;
				moment.thumbnail_background_image_rows=thumb.rows;
				moment.thumbnail_background_image_columns=thumb.columns;
				moment.thumbnail_background_image_position=thumb.position;
				moment.tag='New Moment';
				Moment.renderOnly(moment,parent,{id:'moment_playhead'});
				u();
			}
			function u(){
				// __moment_new_update__
				var html=$('#moment_playhead');
				var current=Global.getVideoObject().getCurrentTime(Global.getMainFrameId());
				var total=Global.getVideoObject().getDuration(Global.getMainFrameId());
				var thumb=Global.getVideoObject().getThumbnailAt(Global.getMainFrameId(),current);
				var border_width=Global.constants('moment_border_width');
				if(!thumb.url){
					var t=thumb;
					thumb={};
					thumb.url=t;
					thumb.rows=0;
					thumb.columns=0;
					thumb.position=0;
				}

				var width=$(html).width();
				var height=width*9/16;

				$(html).attr('data-time_start',parseInt(current));
				$(html).css('height',height+2*border_width);
				$(html).find('.moment_thumb')
						.css('background-image','url('+thumb.url+')')
						.css('background-size',thumb.rows*100+'% '+thumb.columns*100+'%')
						.css('background-position','-'+((thumb.position%thumb.columns)*width)+'px -'+(Math.floor(thumb.position/thumb.rows)*height)+'px');
				if((thumb.rows==0) && (thumb.columns==0) && (thumb.position==0))$(html).find('.moment_thumb').css('background-size','100% 100%');

				var selector;
				if(Global.isPartnerSite())
					selector=Global.getSelector();
				else
					selector='#'+Global.getMainFrameId();
				//console.log(current,total,$(selector).width());

				$(html).css('left',$(selector).offset().left+(current/total)*$(selector).width()-$(html).width()/2);
				Moment_Playhead.timer=setTimeout(u,1000);
			}
			t();
		}
	};
	return{
		timer:undefined,
		onVideoLoaded:function(object){
			_private.onVideoLoaded(object);
		},
		onReset:function(){
			clearTimeout(this.timer);
		}
	};
})();
E.subscribe('VIDEO_LOADED',Moment_Playhead,'Moment_Playhead');
E.subscribe('RESET',Moment_Playhead,'Moment_Playhead');
