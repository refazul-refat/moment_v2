var token='TqD5p_0h9ZEH8Bef5pV1r9d8AX9u05MT';
var api_base='http://api.mpulsemedia.com/v1/';
var secure_api_base='https://api.mpulsemedia.com/v1/';

Twitchs={
	getTarget:function(){
		return document.getElementById('player');
	},
	getResourceId:function(){
		return this.resource_id?this.resource_id:location.href.split('/')[4]+location.href.split('/')[5];
	},
	populate:function(){
		var container=$('<div>',{id:'moment_container'});

		$(container).append($('<div>',{id:'moment_button',class:'moment_button twitch '}).text('#moment'));
		$(container).append($('<div>',{id:'asset_source',class:'moment_info'}));

		$(container).append($('<div>',{id:'moment_time',class:'moment_info'}));
		$(container).append($('<div>',{id:'moment_tag',class:'moment_info'}));
		$(container).append($('<div>',{id:'moment_thumb',class:'moment_info'}));

		$(container).append($('<div>',{id:'video_title',class:'moment_info'}));
		$(container).append($('<div>',{id:'video_publisher',class:'moment_info'}));
		$(container).append($('<div>',{id:'video_id',class:'moment_info'}));
		$(container).append($('<div>',{id:'video_duration',class:'moment_info'}));
		$(container).append($('<div>',{id:'video_thumbnail',class:'moment_info'}));
		//console.log(container);
		$(this.getTarget()).append(container);
	},
	loadChannel:function(channel){
		var that=this;
		$.ajax({
			url:'https://api.twitch.tv/kraken/streams?channel='+channel,
			dataType:'json',
			success:function(t){
				if(t.streams.length==1){
					console.log('--LIVE--');
					$.ajax({
						url:'https://api.twitch.tv/kraken/channels/'+channel+'/videos?broadcasts=true',
						dataType:'json',
						success:function(response){
							var recording;
							for(var i=0;i<response.videos.length;i++){
								if(response.videos[i].status=='recording'){
									recording=response.videos[i];
									break;
								}
							}
							if(recording!=undefined){
								$.ajax({
									url:'https://api.twitch.tv/kraken/channels/'+channel,
									dataType:'json',
									success:function(r){
										var data={};
										data.asset_source='twitch';
										data.asset_resource_id=recording._id;
										data.asset_thumbnail=recording.preview;
										data.asset_title=recording.title;
										data.asset_publisher=r.display_name;
										data.asset_url=recording.url;
										data.asset_recorded_at=recording.recorded_at;
										data.asset_status='recording';
										data.asset_duration=recording.length;
										data.token=token;
										data.auid=auid;
										data.tag='';
										data.thumbnail_background_image=recording.preview;
										data.time_start=Math.floor($.now()/1000);
										var t=setInterval(function(){
											if(that.getTarget()){
												clearInterval(t);
												console.log('--Done--');
												that.populate();
												$('#moment_button').click(function(e){
													that.pause();
													var tag=prompt("Enter Tag","");
													if(tag!=null){
														//Moment.save(that,tag);
														data.tag=tag;
														$.ajax({
															// __moment_post_api_call__
															dataType:'json',
															method:'POST',
															url:api_base+'moments',
															data:data,
															statusCode:{
																201:function(response){
																	console.log(response);
																}
															}
														});
													}
													that.play();
												});

												$('#asset_source').text('twitch');
												$('#video_title').text(that.getTitle());
												$('#video_publisher').text(that.getPublisher());
												$('#video_id').text(that.getResourceId());
												$('#video_duration').text(that.getDuration());
												$('#video_thumbnail').text(that.getThumbnail());
											}
										},100);
										console.log(recording._id);
										console.log(recording.preview);
										console.log(recording.length);
										console.log(recording.recorded_at);
										console.log(recording.title);
										console.log(r.display_name);
										console.log(recording.url);
									}
								});
							}
							else{
								console.log('--UNEXPECTED--');
							}
						}
					});
				}
				else{
					console.log('--OFFLINE--');
				}
			}
		});
	},
	init:function(){
		var that=this;
		if(location.href.split('/')[4]=='' || location.href.split('/')[4]==undefined){
			if($('#player object [name="flashvars"]').first().attr('value')==undefined)return;
			var channel=$('#player object [name="flashvars"]').first().attr('value').split('channel=')[1].split('&')[0];
			console.log(channel);
			if(channel==that.channel)
				return;
			that.channel=channel;
			console.log('Loading Channel - ',that.channel);
			that.loadChannel(that.channel);
		}
		else if(location.href.split('/')[4] && $.isNumeric(location.href.split('/')[5].split('?')[0])){
			var resourceId=location.href.split('/')[4]+location.href.split('/')[5].split('?')[0];
			console.log(resourceId);
			if(resourceId==that.resourceId)
				return;
			that.resourceId=resourceId;
			$.ajax({
				dataType: "json",
				url: 'https://api.twitch.tv/kraken/videos/'+that.getResourceId(),
				success: function(response){
					that.title=response.title;
					that.publisher=response.channel.display_name;
					that.resource_id=response._id;
					that.duration=parseInt(response.length,10);
					that.thumbnail=response.preview;
					that.url=response.url;
					console.log(that.url);

					var t=setInterval(function(){
						if(that.getTarget()){

							clearInterval(t);
							that.populate();
							$('#moment_button').click(function(e){
								that.pause();
								var tag=prompt("Enter Tag","");
								if(tag!=null){
									Moment.save(that,tag);
								}
								that.play();
							});

							$('#asset_source').text('twitch');
							$('#video_title').text(that.getTitle());
							$('#video_publisher').text(that.getPublisher());
							$('#video_id').text(that.getResourceId());
							$('#video_duration').text(that.getDuration());
							$('#video_thumbnail').text(that.getThumbnail());

							//Cheating Way for now
							var z=setInterval(function(){
								if(typeof(document.getElementsByTagName('object')[0].videoSeek)==='function' &&
									typeof(document.getElementsByTagName('object')[0].getVideoTime)==='function' &&
									document.getElementsByTagName('object')[0].getVideoTime()>0){

									clearInterval(z);
									console.log('--Twitch Ready--');
									if(General.getParameterByName('plist')){
										chrome.runtime.sendMessage({greeting: "next"}, function(response) {
											console.log(response);
											if(response.data!=null){
												var player=document.getElementsByTagName('object')[0];
												var next=$('<div>',{id:'next-moment'})
													.css('position','absolute')
													.css('top',$(player).offset().top+$(player).height()-150)
													.css('left',$(player).offset().left+$(player).width()-120)
													.css('width','100px')
													.css('height','100px')
													.css('background-color','#aaa')
													.css('cursor','pointer')
													.css('z-index','10000000000')
													.appendTo($('body'));
												$(next).click(function(){
													var t=response.data.next;
													var next_location=t.asset.url;
													if(next_location.indexOf('?')>-1)next_location+='&';
													else next_location+='?';

													next_location+='start='+parseInt(t.time_start,10)+'&plist=true';
													location.href=next_location;
												});
											}

										});
									}
									if(General.getParameterByName('start')){
										that.seekTo(parseInt(General.getParameterByName('start'),10));
									}
									that.ready=true;
								}
							},50);
						}
					},1000);
				}
			});
		}
	},
	isReady:function(){
		if(this.ready==undefined || this.ready==false)
			return false;
		return true;
	},
	pause:function(){
		var script='(function(){document.getElementsByTagName("object")[0].pauseVideo();})();';
		General.run(script);
	},
	play:function(){
		var script='(function(){document.getElementsByTagName("object")[0].playVideo();})();';
		General.run(script);
	},
	getCurrentTime:function(){
		script='(function(){document.getElementById("moment_time").innerHTML=document.getElementsByTagName("object")[0].getVideoTime();})();';
		General.run(script);
		return parseInt(document.getElementById("moment_time").innerHTML,10);
	},
	getTitle:function(){
		return this.title;
	},
	getPublisher:function(){
		return this.publisher;
	},
	getSource:function(){
		return 'twitch';
	},
	getDuration:function(){
		return this.duration;
	},
	seekTo:function(time){
		var script='(function(){document.getElementsByTagName("object")[0].videoSeek('+time+');})();';
		General.run(script);
	},
	getThumbnailAt:function(time,w,h){
		return this.thumbnail;
	},
	getThumbnail:function(){
		return this.thumbnail;
	},
	getURL:function(){
		return this.url;
	}
};

chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
	setInterval(function(){
		if(location.href.indexOf('youtube.com')>-1)
			Youtube.init();
		else if(location.href.indexOf('netflix.com')>-1)
			;
		else if(location.href.indexOf('twitch.tv')>-1)
			Twitch.init();
	},2000);
	if(location.href.indexOf('dev.mpulsemedia.com')>-1){
		var t=setInterval(function(){
			if($('.fallback').first().text()){
				clearInterval(t);
				var fallback=$('.fallback').first().text();
				console.log(fallback);
				if($('#vuid').text()){
					var vuid=$('#vuid').text();
					chrome.runtime.sendMessage({greeting:"login",data:{vuid:vuid}},function(response){});
				}
				else{
					chrome.runtime.sendMessage({greeting:"logout"},function(response){});
				}

				chrome.runtime.sendMessage({greeting:"isLoggedIn"},function(response){
					console.log(response);
					if(response.data.fallback!=fallback){
						$.ajax({
							// __user_merge_sacrifice_post_api_call__
							url:api_base+'merge/sacrifice',
							data:{ext:response.data.fallback,site:fallback},
							dataType:'json',
							method:'POST',
							success:function(r){
								chrome.runtime.sendMessage({greeting:"impose",fallback:fallback},function(response){});
								console.log(r);
								if(r.status='sacrificed')location.reload();
							}
						});
					}
				});
			}
			console.log('--Waiting--');
		},1000);
	}
});
