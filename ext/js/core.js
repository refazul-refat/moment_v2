var token='TqD5p_0h9ZEH8Bef5pV1r9d8AX9u05MT';

if(!document.getElementById('core')){
	var core=document.createElement('div');core.id='core';
	document.body.appendChild(core);

	Global=(function(){
		var _private={
			// __?
			constants:function(key){
				if(key=='activeClass')
					return 'active';
				if(key=='siblingClass')
					return 'frame';
				if(key=='momentClass')
					return 'moment';
				if(key=='baseDir')
					return 'ext';
				if(key=='moment_border_width')
					return 2;
				return false;
			},
			elements:function(key){
				if(key=='fallback')
					return $('.fallback').first();
				if(key=='vuid')
					return $('#vuid');
			},
			isSite:function(){
				// __browser_is__ - distinct from extension, as both serve the site
				if(location.protocol==='chrome-extension:')return false;
					return true;
			},
			getAPIRoot:function(){
				// __api_root_get__
				if(location.protocol==='https:')
					return 'https://api.mpulsemedia.com/v1/';
				else
					return 'http://api.mpulsemedia.com/v1/';
			},
			getBaseDir:function(){
				// __browser_url_base_get__
				if(location.protocol==='chrome-extension:' || this.isPartnerSite())return '';
				return this.constants('baseDir')+'/';
			},
			getRandomID:function(){
				var text = "";
				var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
				for( var i=0; i < 32; i++ )
					text += possible.charAt(Math.floor(Math.random() * possible.length));
				return text;
			},
			getAUID:function(){
				// __browser_session_get__
				if(this.elements('vuid').html())
					return this.elements('vuid').html();
				if(this.elements('fallback').html())
					return this.elements('fallback').html();
				if(this.AUID)return this.AUID;
			},
			setAUID:function(AUID){
				// __browser_session_set__
				this.AUID=AUID;
			},
			sanitize:function(data){
				// __browser_url_base_set__
				if(this.isSite())
					data=data.replace(/{{site}}/g,'');
				else
					data=data.replace(/{{site}}/g,'http://dev.mpulsemedia.com/web/');
				return data;
			},
			scrollToTop:function(){
				// __ext_scroll_top__
				setTimeout(function(){
					window.scrollTo(0,0);
				},1);
			},
			locationHashChanged:function(){
				// __site_page_changed__
				// __site_page_feed_selected__
				if(location.hash === "#feed" || typeof location.hash === 'undefined' || location.hash==''){
					Feed.load({target:'#feed'});
				}
				else if(location.hash==='#history'){
					History.history({target:'#history'});
				}
				else if(location.hash==='#playlists'){
					Playlist.load({target:'#playlists'});
				}
				else if(location.hash==='#register'){
					Page.load({target:$('#register'),targetButton:$('#load-register')});
				}
				else if(location.hash==='#login'){
					Page.load({target:$('#login'),targetButton:$('#load-login')});
				}
				else if(location.hash==='#_=_')
					location.hash='#feed';
				this.scrollToTop();
			},
			isYoutube:function(){
				// __browser_url_youtube_is__
				if(location.href.indexOf('youtube.com')>-1)return true;
				return false;
			},
			isTwitch:function(){
				// __browser_url_twitch_is__
				if(location.href.indexOf('twitch.tv')>-1)return true;
				return false;
			},
			isPartnerSite:function(){
				// __browser_url_partner_is__
				if(location.href.indexOf('youtube.com')>-1)return true;
				if(location.href.indexOf('twitch.tv')>-1)return true;
				return false;
			},
			loadConfig:function(callback){
				// __site_config_load__
				var that=this;
				$.ajax({
					// __site_config_get_api_call__
					url:this.getAPIRoot()+'config',
					method:'GET',
					dataType:'json',
					success:function(response){
						that.config={};
						for(var i=0;i<response.length;i++)
							that.config[response[i].key]=response[i].value;
						if(typeof callback==='function')
							callback(that.config);
					}
				});
			},
			getConfig:function(key){
				// __site_config_get__
				if(this.config.hasOwnProperty(key))
					return this.config[key];
			},
			mapAssetSource:function(key){
				// __partner_name_get__
				//if(!(Number(key)===key && key%1===0))return key;
				if(parseInt(key,10)==1)return 'Youtube';
				if(parseInt(key,10)==2)return 'Netflix';
				if(parseInt(key,10)==3)return 'Twitch';
				if(parseInt(key,10)==4)return 'Vimeo';

				if(key=='Youtube' || key=='youtube')return 'Youtube';
				if(key=='Twitch' || key=='twitch')return 'Twitch';
			}
		};
		return{
			constants:function(key){
				return _private.constants(key);
			},
			elements:function(key){
				return _private.elements(key);
			},
			isSite:function(){
				return _private.isSite();
			},
			getBaseDir:function(){
				return _private.getBaseDir();
			},
			getAPIRoot:function(){
				return _private.getAPIRoot();
			},
			getRandomID:function(){
				return _private.getRandomID();
			},
			getAUID:function(){
				return _private.getAUID();
			},
			setAUID:function(AUID){
				_private.setAUID(AUID);
			},
			sanitize:function(data){
				return _private.sanitize(data);
			},
			scrollToTop:function(){
				_private.scrollToTop();
			},
			locationHashChanged:function() {
				_private.locationHashChanged();
			},
			isYoutube:function(){
				return _private.isYoutube();
			},
			isTwitch:function(){
				return _private.isTwitch();
			},
			isPartnerSite:function(){
				return _private.isPartnerSite();
			},
			loadConfig:function(callback){
				_private.loadConfig(callback);
			},
			config:function(key){
				return _private.config(key);
			},
			mapAssetSource:function(key){
				return _private.mapAssetSource(key);
			},
			//#Global.getTemplate()
			//What is does - loads a template (e.g. moment.html) & caches it in Global.templates for fast response later on
			getTemplate:function(template,callback){
				// __site_comp_load__
				var html='template/'+template+'?_='+new Date().getTime();
				if(Global.isPartnerSite())html=chrome.extension.getURL(html);

				if(!Global.templates)Global.templates={};
				if(Global.templates[template]){
					if(typeof callback==='function')
						callback(Global.templates[template]);
					return;
				}

				$.get(Global.getBaseDir()+html,function(data){
					function recursion(){
						var h=/{{.*\.html}}/g;
						var matches=data.match(h);
						if(!matches || matches.length==0){
							Global.templates[template]=data;
							if(typeof callback==='function')
								callback(data);
							return;
						}

						function l(index){
							if(!matches[index]){
								recursion();
								return;
							}
							var template=matches[index].replace('{{','').replace('}}','');
							var html='template/'+template+'?_='+new Date().getTime();
							if(Global.isPartnerSite())html=chrome.extension.getURL(html);
							$.get(Global.getBaseDir()+html,function(d){
								data=data.replace(matches[index],d);
								l(++index);
							});
						}
						l(0);
					}
					recursion();
				});
			},
			//#Global.getSelector()
			//What is does - returns player selectors of partner sites
			getSelector:function(){
				// __partner_player_element_name_get__
				var selector;
				if(this.isTwitch())
					selector='#player';
				else if(this.isYoutube())
					selector='.html5-video-container';
				return selector;
			},
			//#Global.refresh()
			//What it does - attempt to position #moment_list & #moment_playhead
			refresh:function(){
				// __momentlist_position_set__
			},
			isTouch:function(){
				// __device_touch_is__
				return (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
			},
			getMainFrameId:function(){
				// __partner_player_element_id_get__?
				return $('.p-container').children().first().attr('id');
			},
			getVideoObject:function(){
				// __partner_video_object_get__
				if(Global.isSite()){
					if(Global.isPartnerSite()){
						if(Global.isYoutube())return Youtube;
						if(Global.isTwitch())return Twitch;
					}
					else{
						var id=Global.getMainFrameId();
						var Video;

						if($('#'+id).attr('data-asset_source')==='Youtube' || $('#'+id).attr('data-asset_source')==='youtube')
							Video=Youtube;
						else if($('#'+id).attr('data-asset_source')==='Twitch' || $('#'+id).attr('data-asset_source')==='twitch')
							Video=Twitch;
						return Video
					}
				}
			},
			isHost:function(){
				if(location.href.indexOf('dev.mpulsemedia.com')>-1 ||
				location.href.indexOf('localhost/moment_v2'))
					return true;
				return false;
			}
		};
	})();
	//False Promise
	if(Global.isTouch())
		$('html').removeClass('no-touch').addClass('touch');
	else
		$('html').removeClass('touch').addClass('no-touch');

	if(Global.isHost())
		$('html').removeClass('host').addClass('host');

	E=(function(){
		var _private={
			subscribe:function(channel,object,who){
				// __event_?
				if(!E.channels[channel])E.channels[channel]=[];
				for(var i in E.channels){
					for(var j=0;j<E.channels[i].length;j++){
						if(E.channels[i][j].who===who && i==channel && typeof who!=='undefined'){
							return;
						}
					}
				}
				E.channels[channel].push({who:who,callback:object});
			},
			camelize:function(string) {
				// __event_?
				var parts=string.split('_');
				var result='on';
				for(var i=0;i<parts.length;i++)
					result+=parts[i].charAt(0).toUpperCase()+parts[i].slice(1).toLowerCase();
				return result;
			},
			dispatch:function(channel,object){
				// __event_?
				if(!E.channels[channel])return;
				for(var i=0,l=E.channels[channel].length;i<l;i++){
					var subscription=E.channels[channel][i];
					if(typeof subscription.callback === 'object'){
						var required_method=this.camelize(channel);
						if(subscription.callback.hasOwnProperty(required_method))
							subscription.callback[required_method](object);
					}
				}
			}
		};
		return{
			channels:{},
			subscribe:function(channel,object,who){
				_private.subscribe(channel,object,who);
			},
			dispatch:function(channel,object){
				_private.dispatch(channel,object);
			},
			list:function(){
				// __event_?
				console.log(E.channels);
			}
		};
	})();
	U=(function(){
		var _private={
			check:function(object){
				if(typeof object==='undefined')return true;
				return false;
			},
			run:function(script){
				// __browser_page_script_run__
				var s=document.createElement('script');
				s.setAttribute('type','text/javascript');
				s.textContent=script;
				document.getElementsByTagName('head')[0].appendChild(s);
				document.getElementsByTagName('head')[0].removeChild(s);
			},
			getParameterByName:function(name) {
				// __browser_url_parameter_get_byName__
				name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
				var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
					results = regex.exec(location.search);
				return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
			},
			bind:function(template,object,callback){
				// __site_comp_property_replace__?  same as twitch call?
				$.get(template,function(data){
					for(var prop in object){
						var r = new RegExp('{{'+prop+'}}',"g");
						data=data.replace(r,object[prop]);
					}
					if(typeof callback==='function')
						callback(data);
				});
			},
			debug:function(object){
				if(this.debugging)
					console.log(object);
			},
			setDebugMode:function(mode){
				this.debugging=mode;
			},
			sort:function(objects,property,order){
				if(typeof order==='undefined')order='asc';
				function descCompare(a,b) {
					if (parseInt(a[property],10) < parseInt(b[property],10))
						return 1;
					if (parseInt(a[property],10) > parseInt(b[property],10))
						return -1;
					return 0;
				}
				function ascCompare(a,b) {
					if (parseInt(a[property],10) < parseInt(b[property],10))
						return -1;
					if (parseInt(a[property],10) > parseInt(b[property],10))
						return 1;
					return 0;
				}
				if(order=='asc')
					objects.sort(ascCompare);
				else if(order=='desc')
					objects.sort(descCompare);

				return objects;
			}
		};
		return{
			check:function(object){
				return _private.check(object);
			},
			run:function(script){
				_private.run(script);
			},
			getParameterByName:function(name){
				return _private.getParameterByName(name);
			},
			bind:function(template,object,callback){
				_private.bind(template,object,callback);
			},
			debug:function(object){
				_private.debug(object);
			},
			setDebugMode:function(mode){
				_private.setDebugMode(mode);
			},
			sort:function(objects,property,order){
				return _private.sort(objects,property,order);
			},
			resolveAsset:function(asset_source,asset_resource_id,callback){
				// __asset_resolve__
				$.ajax({
					// __asset_resolve_post_api_call__
					url:Global.getAPIRoot()+'assets/resolve',
					method:'POST',
					data:{'asset_source':asset_source,'asset_resource_id':asset_resource_id},
					dataType:'json',
					success:function(response){
						if(typeof callback==='function')
							callback(response);
					}
				});
			}
		};
	})();

	// __browser_page_onLoad__?
	Global.loadConfig(function(response){E.dispatch('CONFIG_LOADED',response);});
	Global.getTemplate('moment.html',function(){});
	Global.getTemplate('widgets.html',function(){});
	Global.getTemplate('carousel.html',function(){});
	E.subscribe('CONFIG_LOADED',{
		onConfigLoaded:function(config){
			console.log('Config Loaded');
		}
	});
	if(Global.isSite()){
		$.get('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js',function(data){
			E.dispatch('BOOTSTRAP_LOADED',{});
		});
		if(Global.isPartnerSite()){
			chrome.runtime.sendMessage({greeting: "isLoggedIn"}, function(response) {
				Global.setAUID(response.data.fallback);
				if(response.data.loggedIn===true)
					Global.setAUID(response.data.vuid);
				console.log(Global.getAUID());
			});
		}
		else
			Global.setAUID(localStorage.getItem('vuid')?localStorage.getItem('vuid'):localStorage.getItem('fallback'));
	}
	else{
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = Global.getBaseDir()+'js/bootstrap.min.js';

		document.getElementsByTagName('head')[0].appendChild(script);
		E.dispatch('BOOTSTRAP_LOADED',{});
	}

	function onPlayerReadyPassive(event){
		// __youtube_player_play__? there is another inside the YouTube class definition
		event.target.playVideo();
	}

	function onPlayerStateChangePassive(event,object){
		// __youtube_player_playhead_set__? there is another inside the YouTube class definition
		if (event.data == YT.PlayerState.PLAYING) {
			if($(event.target.f).attr('data-once')=='false' || $(event.target.f).attr('data-once')==undefined){
				player.seekTo(parseInt($(object).attr('data-time_start'),10));
				$(event.target.f).attr('data-once','true');
				E.dispatch('VIDEO_LOADED',{parent:'#container-'+$('.p-container').children().first().attr('id'),asset_source:'Youtube',asset_resource_id:$(event.target.f).attr('data-asset_resource_id')});
			}
		}
	}

	function onPlayerEvent(data,id){
		// __twitch_player_playhead_set__? there is another inside the twitch class definition
		data.forEach(function(event) {
			if (event.event == "videoPlaying") {
				var player = $('#'+id)[0];
				if($(player).attr('data-time_start') && (!$(player).attr('data-once'))){
					player.videoSeek(parseInt($(player).attr('data-time_start'),10));
					$(player).attr('data-once','true');
				}
				player.playVideo();
				E.dispatch('VIDEO_LOADED',{parent:'#container-'+$('.p-container').children().first().attr('id'),asset_source:'Twitch',asset_resource_id:$(player).attr('data-asset_resource_id')});
			}
		});
	};

	Youtube=(function(){
		var _private={
			play:function(id){
				// __youtube_player_play__? there is another outside the class definition
				if(U.check(id))
					U.run('(function(){yt.player.getPlayerByElement(document.getElementById("player-api")).playVideo();})();');
				else YT.get(id).playVideo();
			},
			pause:function(id){
				// __youtube_player_pause__
				if(U.check(id))
					U.run('(function(){yt.player.getPlayerByElement(document.getElementById("player-api")).pauseVideo();})();');
				else YT.get(id).pauseVideo();
			},
			seekTo:function(id,time){
				// __youtube_player_playhead_set__? there is another outside the class definition
				if(U.check(id))
					U.run('(function(){yt.player.getPlayerByElement(document.getElementById("player-api")).seekTo('+time+');})();');
				else YT.get(id).seekTo(time);
			},
			getCurrentTime:function(id){
				// __youtube_player_playhead_get__
				if(U.check(id)){
					U.run('(function(){document.getElementById("moment_time").innerHTML=yt.player.getPlayerByElement(document.getElementById("player-api")).getCurrentTime();})();');
					return $('#moment_time').html();
				}
				return YT.get(id).getCurrentTime();
			},
			getTitle:function(id){
				// __youtube_video_title_get__
				if(U.check(id)){
					U.run('(function(){document.getElementById("video_title").innerHTML=yt.player.getPlayerByElement(document.getElementById("player-api")).getVideoData().title;})();');
					return $('#video_title').html();
				}
				return YT.get(id).getVideoData().title;
			},
			getPublisher:function(id){
				// __youtube_video_publisher_get__
				if(U.check(id)){
					U.run('(function(){document.getElementById("video_publisher").innerHTML=yt.player.getPlayerByElement(document.getElementById("player-api")).getVideoData().author;})();');
					return $('#video_publisher').html();
				}
				return YT.get(id).getVideoData().author;
			},
			getDuration:function(id){
				// __youtube_video_duration_get__
				if(U.check(id)){
					U.run('(function(){document.getElementById("video_duration").innerHTML=yt.player.getPlayerByElement(document.getElementById("player-api")).getDuration();})();');
					return parseInt($('#video_duration').html(),10);
				}
				return YT.get(id).getDuration();
			},
			getResourceId:function(id){
				// __youtube_video_resource_id_get__
				if(U.check(id))
					return U.getParameterByName('v');
				return $('#'+id).attr('data-asset_resource_id');
			},
			getThumbnail:function(id){
				// __youtube_video_thumbnail_get__
				if(U.check(id))
					return 'https://img.youtube.com/vi/'+this.getResourceId()+'/default.jpg';
				return 'https://img.youtube.com/vi/'+$('#'+id).attr('data-asset_resource_id')+'/default.jpg';
			},
			getThumbnailAt:function(id,time){
				// __youtube_video_thumbnail_at_get__
				var r={
					'rows':0,
					'columns':0,
					'position':0,
					'm_rows':0,
					'm_columns':0,
					'm_position':0
				};
				r.url=this.getThumbnail(id);
				r.m_url=this.getThumbnail(id);
				return r;

				var storyboard='';
				if(U.check(id))
					storyboard=$('#moment_thumb').html();
				else{
					//Skipping storyboard
					storyboard=$('#'+id).attr('data-storyboard_spec');
				}
				console.log(storyboard);
				var seconds=this.getDuration(id);
				try{
					var mobile_thumb={};
					var best_thumb={};

					/*
					https://i.ytimg.com/sb/hMjL76obRLI/storyboard3_L$L/$N.jpg
					|48#27#100#10#10#0#default#DoBpEXT7bOS1vivqNiHTtqQhH2k
					|80#45#136#10#10#2000#M$M#svnVOloYnXCM5uSXWxZ9k7kg75E
					|160#90#136#5#5#2000#M$M#Fw_tBgH-q3rv91dOl1-QshZx5xg
					*/
					var array=storyboard.split('|');
					mobile_thumb.url=array[0].replace('$L',1);
					best_thumb.url=array[0].replace('$L',array.length-2);

					var mobile=array[2];
					var best=array.reverse()[0];

					//console.log(mobile);
					//console.log(best);
					var mobile_tokens=mobile.split('#');
					var best_tokens=best.split('#');

					mobile_thumb.width=parseInt(mobile_tokens[0],10);
					mobile_thumb.height=parseInt(mobile_tokens[1],10);
					mobile_thumb.total=parseInt(mobile_tokens[2]);
					mobile_thumb.gridX=parseInt(mobile_tokens[3]);
					mobile_thumb.gridY=parseInt(mobile_tokens[4]);
					//var thumb.unknown=tokens[5];
					mobile_thumb.name=mobile_tokens[6];
					mobile_thumb.sigh=mobile_tokens[7];

					best_thumb.width=parseInt(best_tokens[0],10);
					best_thumb.height=parseInt(best_tokens[1],10);
					best_thumb.total=parseInt(best_tokens[2]);
					best_thumb.gridX=parseInt(best_tokens[3]);
					best_thumb.gridY=parseInt(best_tokens[4]);
					//var thumb.unknown=tokens[5];
					best_thumb.name=best_tokens[6];
					best_thumb.sigh=best_tokens[7];

					mobile_thumb.totalseconds=parseInt(seconds,10);
					best_thumb.totalseconds=parseInt(seconds,10);
					this.mobile_thumb=mobile_thumb;
					this.best_thumb=best_thumb;
					//console.log(this.mobile_thumb);
					//console.log(this.best_thumb);

					time=parseInt(time,10);

					var mobile_per=Math.ceil(this.mobile_thumb.totalseconds/this.mobile_thumb.total);
					var best_per=Math.ceil(this.best_thumb.totalseconds/this.best_thumb.total);

					var mobile_desired_thumb=Math.floor((time/mobile_per)+1);
					var best_desired_thumb=Math.floor((time/best_per)+1);

					var mobile_sheet=Math.floor(mobile_desired_thumb/(this.mobile_thumb.gridX*this.mobile_thumb.gridY));
					var best_sheet=Math.floor(best_desired_thumb/(this.best_thumb.gridX*this.best_thumb.gridY));

					var mobile_pos=(mobile_desired_thumb%(this.mobile_thumb.gridX*this.mobile_thumb.gridY));
					var best_pos=(best_desired_thumb%(this.best_thumb.gridX*this.best_thumb.gridY));

					var mobile_url=this.mobile_thumb.url;
					mobile_url=mobile_url.replace('$N','M'+mobile_sheet)+'?sigh='+this.mobile_thumb.sigh;

					var best_url=this.best_thumb.url;
					best_url=best_url.replace('$N','M'+best_sheet)+'?sigh='+this.best_thumb.sigh;

					//last page fix
					if(Math.floor(this.best_thumb.total/(this.best_thumb.gridX * this.best_thumb.gridY))==best_sheet){
						var lptotal=this.best_thumb.total%(this.best_thumb.gridX*this.best_thumb.gridY);
						var lpcolumn=Math.ceil(lptotal/this.best_thumb.gridY);

						this.best_thumb.gridY=lpcolumn;
					}
					if(Math.floor(this.mobile_thumb.total/(this.mobile_thumb.gridX * this.mobile_thumb.gridY))==best_sheet){
						var lptotal=this.mobile_thumb.total%(this.mobile_thumb.gridX*this.mobile_thumb.gridY);
						var lpcolumn=Math.ceil(lptotal/this.mobile_thumb.gridY);

						this.mobile_thumb.gridY=lpcolumn;
					}

					var r={
						'url':best_url,
						'rows':this.best_thumb.gridX,
						'columns':this.best_thumb.gridY,
						'position':best_pos,
						'm_url':mobile_url,
						'm_rows':this.mobile_thumb.gridX,
						'm_columns':this.mobile_thumb.gridY,
						'm_position':mobile_pos
					};
					return r;
				}
				catch(err){
					console.log('---Unable to parse storyboard spec---');
					return false;
				}
			},
			getSource:function(id){
				// __youtube_source_name_get__
				return 'youtube';
			},
			getURL:function(id){
				// __youtube_url_create__
				if(U.check(id))
					return 'https://www.youtube.com/watch?v='+this.getResourceId();
				return 'https://www.youtube.com/watch?v='+$('#'+id).attr('data-asset_resource_id');
			},
			isReady:function(id){
				// __youtube_page_onLoad_complete_is__
				if(U.check(id)){
					$('#moment_container').remove();
					this.populate();
					if(!document.getElementById('player-api'))
						return false;
					U.run('(function(){document.getElementById("video_title").innerHTML=yt.player.getPlayerByElement(document.getElementById("player-api")).getVideoData().title;document.getElementById("video_publisher").innerHTML=yt.player.getPlayerByElement(document.getElementById("player-api")).getVideoData().author;document.getElementById("video_duration").innerHTML=yt.player.getPlayerByElement(document.getElementById("player-api")).getDuration();})();');
					if(document.getElementById('video_title').innerHTML && document.getElementById('video_publisher').innerHTML && document.getElementById('video_duration').innerHTML){
						return true;
					}
					return false;
				}

				if(	typeof YT.get(id)==='undefined' ||
					typeof YT.get(id).pauseVideo==='undefined' ||
					typeof YT.get(id).playVideo==='undefined' ||
					typeof YT.get(id).getCurrentTime==='undefined' ||
					typeof YT.get(id).getVideoData==='undefined' ||
					typeof YT.get(id).getDuration==='undefined' ||
					typeof YT.get(id).seekTo==='undefined' ||
					!$('#'+id).attr('data-storyboard_spec') ||
					!$('#'+id).attr('data-resource') ||
					!$('#'+id).attr('data-asset')
					)
					return false;

				if(!Global.isSite())return true;
				return true;
			},
			populate:function(){
				// __youtube_page_data_append__
				var container=$('<div>',{id:'moment_container'});

				$(container).append($('<div>',{id:'moment_button',class:'moment_button youtube '}).text('#moment'));
				$(container).append($('<div>',{id:'asset_source',class:'moment_info'}));
				$(container).append($('<div>',{id:'asset_resource_id',class:'moment_info'}));

				$(container).append($('<div>',{id:'moment_time',class:'moment_info'}));
				$(container).append($('<div>',{id:'moment_tag',class:'moment_info'}));
				$(container).append($('<div>',{id:'moment_thumb',class:'moment_info'}));

				$(container).append($('<div>',{id:'video_title',class:'moment_info'}));
				$(container).append($('<div>',{id:'video_publisher',class:'moment_info'}));
				$(container).append($('<div>',{id:'video_duration',class:'moment_info'}));
				$(container).append($('<div>',{id:'video_thumbnail',class:'moment_info'}));

				$('.html5-player-chrome').append(container);
			},
			loadModal:function(callback){
				// __youtube_moment_new_tag_prompt__
				Global.getTemplate('widgets.html',function(data){
					$('body').append(data);
					if(typeof callback==='function')
						callback();
				});
			},
			getStoryBoard:function(video,callback){
				// __youtube_video_thumbnail_source_get__
				$.ajax({
					// __partner_video_url_get_api_call__
					url:Global.getAPIRoot()+'assist?video_id='+video,
					dataType:'json',
					method:'GET',
					statusCode:{
						200:function(data){
							var storyboard_spec=decodeURIComponent((/&storyboard_spec=(.*?)&/.exec(data.responseText) || [])[1]);
							if(typeof callback==='function')
								callback(storyboard_spec);
						}
					}
				});
			},
			init:function(){
				// __youtube_page_onLoad__
				var that=this;
				if(Global.isYoutube()){
					if(U.getParameterByName('v')){
						var video=U.getParameterByName('v');
						if(video==that.video)return;

						E.channels['YOUTUBE_VIDEO_LOADED']=[];
						E.channels['YOUTUBE_READY']=[];

						that.video=video;

						console.log('Video - '+that.video);

						function d(){
							// __youtube_page_onLoad_complete_event_dispatch__
							if(that.isReady()){
								that.getStoryBoard(that.video,function(storyboard){
									document.getElementById("moment_thumb").innerHTML=storyboard;
									E.dispatch('YOUTUBE_VIDEO_LOADED',{});
									E.dispatch('VIDEO_LOADED',{parent:'body',asset_source:'Youtube',asset_resource_id:that.video});
									return;
								});
							}
							else
								setTimeout(d,1000);
						}
						d();
						E.subscribe('YOUTUBE_VIDEO_LOADED',{
							onYoutubeVideoLoaded:function(){
								// __youtube_momentbutton_show__
								that.loadModal(function(){
									$('#moment_button').click(function(){
										$('#moment-save').modal('show');
										Youtube.pause();
										$('#moment-save [data-action="save"]').unbind('click');
										$('#moment-save [data-action="save"]').click(function(){

											$('#moment-save').modal('hide');
											var tag=$('#tag').val();
											Moment.save(Youtube,tag);
											Youtube.play();
										});
										$('#moment-save [data-action="dismiss"]').unbind('click');
										$('#moment-save [data-action="dismiss"]').click(function(){

											$('#moment-save').modal('hide');
											Youtube.play();
										});
									});
									E.dispatch('YOUTUBE_READY',{});
								});
								console.log('--Done--');
							}
						});
					}
				}
			}
		};
		return{
			/* <iframe id='id'></iframe> */
			play:function(id){
				_private.play(id);
			},
			pause:function(id){
				_private.pause(id);
			},
			seekTo:function(id,time){
				_private.seekTo(id,time);
			},
			getCurrentTime:function(id){
				return _private.getCurrentTime(id);
			},
			getTitle:function(id){
				return _private.getTitle(id);
			},
			getPublisher:function(id){
				return _private.getPublisher(id);
			},
			getDuration:function(id){
				return _private.getDuration(id);
			},
			getResourceId:function(id){
				return _private.getResourceId(id);
			},
			getThumbnail:function(id){
				return _private.getThumbnail(id);
			},
			getThumbnailAt:function(id,time){
				return _private.getThumbnailAt(id,time);
			},
			getSource:function(id){
				return _private.getSource(id);
			},
			getURL:function(id){
				return _private.getURL(id);
			},
			isReady:function(id){
				return _private.isReady(id);
			},
			init:function(){
				_private.init();
			}
		};
	})();
	Twitch=(function(){
		var _private={
			play:function(id){
				// __twitch_player_play__
				if(U.check(id))
					U.run('(function(){document.getElementsByTagName("object")[0].playVideo();})();');
				else $('#'+id)[0].playVideo();
			},
			pause:function(id){
				// __twitch_player_pause__
				if(U.check(id))
					U.run('(function(){document.getElementsByTagName("object")[0].pauseVideo();})();');
				else $('#'+id)[0].pauseVideo();
			},
			seekTo:function(id,time){
				// __twitch_player_playhead_set__? there is another outside the class definition
				if(U.check(id))
					U.run('(function(){document.getElementsByTagName("object")[0].videoSeek('+parseInt(time,10)+');})();');
				else $('#'+id)[0].videoSeek(parseInt(time,10)-1);
			},
			getCurrentTime:function(id){
				// __twitch_player_playhead_get__
				if(U.check(id)){
					U.run('(function(){document.getElementById("moment_time").innerHTML=document.getElementsByTagName("object")[0].getVideoTime();})();');
					return $("#moment_time").html();
				}
				return $('#'+id)[0].getVideoTime();
			},
			getTitle:function(id){
				// __twitch_video_title_get__
				if(U.check(id))
					return this.title;
				return Twitch.title;
			},
			getPublisher:function(id){
				// __twitch_video_publisher_get__
				if(U.check(id))
					return this.publisher;
				return Twitch.publisher;
			},
			getDuration:function(id){
				// __twitch_video_duration_get__
				if(U.check(id))
					return this.duration;
				return Twitch.duration;
			},
			getResourceId:function(id){
				// __twitch_video_resource_id_get__
				if(U.check(id))
					return this.resource_id?this.resource_id:location.href.split('/')[4]+location.href.split('/')[5];
				return Twitch.resource_id;
			},
			getThumbnail:function(id){
				// __twitch_video_thumbnail_get__
				if(U.check(id))
					return this.thumbnail;
				return Twitch.thumbnail;
			},
			getThumbnailAt:function(id,time){
				// __twitch_video_thumbnail_at_get__
				if(U.check(id))
					return this.thumbnail;
				return Twitch.thumbnail;
			},
			getSource:function(){
				// __twitch_source_name_get__
				return 'twitch';
			},
			getURL:function(id){
				// __twitch_url_create__
				if(U.check(id))
					return this.url;
				return Twitch.url;
			},
			isReady:function(id){
				// __twitch_page_onLoad_complete_is__
				if(U.check(id)){
					if(!document.getElementById('player'))
						return false;
					if((document.getElementsByTagName('object')[0]) && typeof(document.getElementsByTagName('object')[0].videoSeek)==='function' && typeof(document.getElementsByTagName('object')[0].getVideoTime)==='function'){
						$('#moment_container').remove();
						this.populate();
						return true;
					}
					return false;
				}

				if(typeof $('#'+id)[0].videoSeek==='function' && typeof $('#'+id)[0].getVideoTime==='function')
					return true;
				return false;

				if(!Global.isSite())return true;
				return true;
			},
			populate:function(){
				// __twitch_page_data_append__
				var container=$('<div>',{id:'moment_container'});

				$(container).append($('<div>',{id:'moment_button',class:'moment_button twitch '}).text('#moment'));
				$(container).append($('<div>',{id:'asset_source',class:'moment_info'}));
				$(container).append($('<div>',{id:'asset_resource_id',class:'moment_info'}));

				$(container).append($('<div>',{id:'moment_time',class:'moment_info'}));
				$(container).append($('<div>',{id:'moment_tag',class:'moment_info'}));
				$(container).append($('<div>',{id:'moment_thumb',class:'moment_info'}));

				$(container).append($('<div>',{id:'video_title',class:'moment_info'}));
				$(container).append($('<div>',{id:'video_publisher',class:'moment_info'}));
				$(container).append($('<div>',{id:'video_duration',class:'moment_info'}));
				$(container).append($('<div>',{id:'video_thumbnail',class:'moment_info'}));

				$('#player').append(container);
			},
			loadInfo:function(resource_id,callback){
				// __twitch_video_info_get__
				$.ajax({
					dataType: "json",
					method:'GET',
					url: 'https://api.twitch.tv/kraken/videos/'+resource_id,
					success: function(response){
						if(typeof callback==='function')
							callback(response);
					}
				});
			},
			assign:function(object){
				// __twitch_page_object_assign
				this.resource_id=object._id;
				this.title=object.title;
				this.publisher=object.channel.display_name;
				this.duration=parseInt(object.length,10);
				this.thumbnail=object.preview;
				this.url=object.url;

				document.getElementById('asset_source').innerHTML=('twitch');
				document.getElementById('asset_resource_id').innerHTML=(this.getResourceId());
				document.getElementById('video_title').innerHTML=(this.getTitle());
				document.getElementById('video_publisher').innerHTML=(this.getPublisher());
				document.getElementById('video_duration').innerHTML=(this.getDuration());
				document.getElementById('video_thumbnail').innerHTML=(this.getThumbnail());
			},
			checkLiveStatus:function(channel,callback){
				// __twitch_publisher_live_is__
				$.ajax({
					url:'https://api.twitch.tv/kraken/streams?channel='+channel,
					method:'GET',
					dataType:'json',
					success:function(response){
						if(typeof callback==='function'){
							if(response.streams.length==1)
								callback(true);
							else
								callback(false);
						}
					}
				});
			},
			findLiveVideo:function(channel,callback){
				// __twitch_video_live_get__
				$.ajax({
					url:'https://api.twitch.tv/kraken/channels/'+channel+'/videos?broadcasts=true',
					method:'GET',
					dataType:'json',
					success:function(response){
						var recording;
						for(var i=0;i<response.videos.length;i++){
							if(response.videos[i].status=='recording'){
								recording=response.videos[i];
								break;
							}
						}
						if(typeof callback==='function')
							callback(recording);
					}
				});
			},
			loadModal:function(callback){
				// __twitch_moment_new_tag_prompt__
				Global.getTemplate('widgets.html',function(data){
					$('body').append(data);
					if(typeof callback==='function')
						callback();
				});
			},
			init:function(){
				// __twitch_page_onLoad__
				var that=this;
				if(Global.isTwitch()){
					//channel
					if(location.href.split('/')[4]=='' || location.href.split('/')[4]==undefined){
						if($('#player object [name="flashvars"]').first().attr('value')==undefined)return;
						var channel=$('#player object [name="flashvars"]').first().attr('value').split('channel=')[1].split('&')[0];
						if(channel==that.channel)return;

						E.channels['TWITCH_INFO_LOADED']=[];
						E.channels['TWITCH_VIDEO_LOADED']=[];
						E.channels['TWITCH_READY']=[];

						that.channel=channel;

						console.log('Channel - '+that.channel);

						that.checkLiveStatus(that.channel,function(live){
							if(live===true){
								console.log(that.channel+' is Online');
								that.findLiveVideo(that.channel,function(live_video){
									console.log('Live Video -');
									console.log(live_video);
									if(U.check(live_video))return;
									that.loadInfo(live_video._id,function(response){
										console.log('Video Info -');
										console.log(response);

										that.asset_recorded_at=response.recorded_at;
										that.asset_status='recording';

										E.dispatch('TWITCH_INFO_LOADED',response);
									});
								});
							}
							else
								console.log(that.channel+' is Offline');
						});
					}
					//vod
					else if(location.href.split('/')[4] && location.href.split('/')[5] && $.isNumeric(location.href.split('/')[5].split('?')[0])){
						var resourceId=location.href.split('/')[4]+location.href.split('/')[5].split('?')[0];
						if(resourceId==that.resourceId)return;

						E.channels['TWITCH_INFO_LOADED']=[];
						E.channels['TWITCH_VIDEO_LOADED']=[];
						E.channels['TWITCH_READY']=[];

						that.resourceId=resourceId;

						that.loadInfo(that.resourceId,function(response){

							that.asset_recored_at=0;
							that.asset_status='recorded';

							E.dispatch('TWITCH_INFO_LOADED',response);
						});
					}

					//channel or vod
					E.subscribe('TWITCH_INFO_LOADED',{
						onTwitchInfoLoaded:function(video){
							// __twitch_page_onLoad_complete_event_dispatch__
							console.log(video);

							function c() {
								console.log("waiting");
								if(that.isReady()){
									E.dispatch('TWITCH_VIDEO_LOADED',video);
									E.dispatch('VIDEO_LOADED',{parent:'body',asset_source:'Twitch',asset_resource_id:video._id});
									return;
								}
								setTimeout(c, 1000);
							}
							c();
						}
					});

					E.subscribe('TWITCH_VIDEO_LOADED',{
						onTwitchVideoLoaded:function(video){
							// __twitch_momentbutton_show__
							that.assign(video);
							function d(){
								if(document.getElementsByTagName('object')[0].getVideoTime()>0){
									document.getElementsByTagName('object')[0].videoSeek(U.getParameterByName('start'));
									return;
								}
								setTimeout(d,1000);
							}
							d();
							that.loadModal(function(){
								$('#moment_button').click(function(){
									that.timestamp=Math.floor(Date.now()/1000);
									$('#moment-save').modal('show');
									Twitch.pause();
									$('#moment-save [data-action="save"]').unbind('click');
									$('#moment-save [data-action="save"]').click(function(){

										$('#moment-save').modal('hide');
										var tag=$('#tag').val();
										Moment.save(Twitch,tag);
										Twitch.play();
									});
									$('#moment-save [data-action="dismiss"]').unbind('click');
									$('#moment-save [data-action="dismiss"]').click(function(){

										$('#moment-save').modal('hide');
										Twitch.play();
									});
								});
								E.dispatch('TWITCH_READY',{});
							});
							console.log('--Done--');
						}
					});
				}
			}
		};
		return{
			/* <iframe id='id'></iframe> */
			play:function(id){
				_private.play(id);
			},
			pause:function(id){
				_private.pause(id);
			},
			seekTo:function(id,time){
				_private.seekTo(id,time);
			},
			getCurrentTime:function(id){
				return _private.getCurrentTime(id);
			},
			getTitle:function(id){
				return _private.getTitle(id);
			},
			getPublisher:function(id){
				return _private.getPublisher(id);
			},
			getDuration:function(id){
				return _private.getDuration(id);
			},
			getResourceId:function(id){
				return _private.getResourceId(id);
			},
			getThumbnail:function(id){
				return _private.getThumbnail(id);
			},
			getThumbnailAt:function(id,time){
				return _private.getThumbnailAt(id,time);
			},
			getSource:function(id){
				return _private.getSource(id);
			},
			getURL:function(id){
				return _private.getURL(id);
			},
			isReady:function(id){
				return _private.isReady(id);
			},
			init:function(){
				_private.init();
			},
			getTimeStamp:function(){
				return _private.timestamp;
			},
			getAssetStatus:function(){
				return _private.asset_status;
			},
			getAssetRecordedAt:function(){
				return _private.asset_recorded_at;
			}
		};
	})();

	Moment=(function(){
		var _private={
			debug:function(object,tag,id){
				// __moment_debug__
				console.log('Current Time - ',object.getCurrentTime(id));
				console.log('Source - ',object.getSource(id));
				console.log('Resource - ',object.getResourceId(id));
				console.log('Title - ',object.getTitle(id));
				console.log('Publisher - ',object.getPublisher(id));
				console.log('Duration - ',object.getDuration(id));
				console.log('Thumbnail - ',object.getThumbnail(id));
				console.log('Current Thumbnail - ',object.getThumbnailAt(id,object.getCurrentTime(id)));
				console.log('Moment Tag - ',tag);

				if(typeof object.getTimeStamp==='function' && typeof object.getAssetStatus==='function' && typeof object.getAssetRecordedAt==='function'){
					if(object.getAssetStatus()==='recording')
						console.log('Asset Status - ',object.getAssetStatus());
					console.log('Current Time - '+object.getTimeStamp());
					console.log('Recored At - ',object.getAssetRecordedAt());
				}
			},
			//#Moment.refresh()
			refresh:function(){
				// __moment_refresh__?  what's refreshed, visual location?
				var border_width=Global.constants('moment_border_width');

				//Moment width is controlled by responsive css
				$('.moment').each(function(){
					var width=$(this).width();
					var height=width*9/16;

					var rows=parseInt($(this).attr('data-rows'),10);
					var columns=parseInt($(this).attr('data-columns'),10);
					var position=parseInt($(this).attr('data-position'),10);
					$(this).css('height',height+2*border_width);
					$(this).find('.moment_thumb')
							.css('background-position','-'+((position%columns)*width)+'px -'+(Math.floor(position/rows)*height)+'px');
				});

				//Popup height is controlled by css (55%)
				$('.moment_popup').each(function(){
					$(this).css('width',$(this).height())
							.css('border-radius',$(this).height()/2);
				});

				if(Global.isTouch()){
					$('.moment').each(function(){
						var popup=$(this).find('.moment_popup');
						$(popup).each(function(){
							var slide_amount=2*$(this).width()/3 + 5;
							if($(this).hasClass('right'))
								$(this).css('right',-slide_amount);
							else if($(this).hasClass('left'))
								$(this).css('left',-slide_amount);
						});
					});
				}
				else{
					//Slide the popup (Show 2/3 + 5 pixels)
					$('.moment').unbind('hover');
					$('.moment').hover(function(){
						var popup=$(this).find('.moment_popup');
						$(popup).each(function(){
							var slide_amount=2*$(this).width()/3 + 5;
							if($(this).hasClass('right'))
								$(this).css('right',-slide_amount);
							else if($(this).hasClass('left'))
								$(this).css('left',-slide_amount);
						});
					});

					//Hide the popup
					$('.moment').unbind('mouseleave');
					$('.moment').on('mouseleave',function(){
						var popup=$(this).find('.moment_popup');
						$(popup).each(function(){
							if($(this).hasClass('right'))
								$(this).css('right',0);
							else if($(this).hasClass('left'))
								$(this).css('left',0);
						});
					});
				}

				//Repositioning moment_list 90% stable
				if(Global.isSite()){
					if(Global.isPartnerSite()){
						$('#moment_list')
							.css('width',$(Global.getSelector()).width())
							.css('bottom','auto')
							.css('left',$(Global.getSelector()).offset().left)
							.css('top',$(Global.getSelector()).offset().top+$(Global.getSelector()).height()-130);
					}
					else{
						$('#moment_list')
							.css('width',$('#'+Global.getMainFrameId()).width());
					}
				}

				//Repositioning moment_playhead 90% stable
				if(Global.isSite()){
					if(Global.isPartnerSite()){
						$('#moment_playhead')
							.css('bottom','auto')
							.css('left','0px')
							.css('top',$(Global.getSelector()).offset().top+$(Global.getSelector()).height()-130);
					}
				}

				//Repositioning moment_list items 50% stable (Touch is critical)
				if(Global.isTouch()){

				}
				else{
					$('#moment_list .items').children().each(function(){

						var selector;
						if(Global.isPartnerSite())
							selector=Global.getSelector();
						else
							selector='#'+Global.getMainFrameId();

						var duration=Global.getVideoObject().getDuration(Global.getMainFrameId());
						var current=$(this).attr('data-time_start');

						//Show all
						$(this).removeClass('hidden');
						$(this).css('position','absolute').css('left',(current/duration)*$(selector).width()-($(this).width()/2));
					});
				}
			},
			sanitize:function(object,tag,id){
				// __moment_sanitize__?  what is sanitized?
				var data={
						token:token,
						tag:tag,
						time_start:parseInt(object.getCurrentTime(id),10),
						asset_source:object.getSource(id),
						asset_resource_id:object.getResourceId(id),
						asset_title:object.getTitle(id),
						asset_publisher:object.getPublisher(id),
						asset_duration:object.getDuration(id),
						asset_thumbnail:object.getThumbnail(id),
						asset_url:object.getURL(id),
						auid:Global.getAUID()
				};
				if(object.getSource(id)=='twitch')
					data['thumbnail_background_image']=object.getThumbnailAt(id,object.getCurrentTime(id));
				else if(object.getSource(id)=='youtube'){
					var thumb=object.getThumbnailAt(id,object.getCurrentTime(id));
					data['thumbnail_background_image']=thumb.url;
					data['thumbnail_background_image_rows']=thumb.rows;
					data['thumbnail_background_image_columns']=thumb.columns;
					data['thumbnail_background_image_position']=thumb.position;

					data['thumbnail_background_image_mobile']=thumb.m_url;
					data['thumbnail_background_image_mobile_rows']=thumb.m_rows;
					data['thumbnail_background_image_mobile_columns']=thumb.m_columns;
					data['thumbnail_background_image_mobile_position']=thumb.m_position;
				}
				if(typeof object.getTimeStamp==='function' && typeof object.getAssetStatus==='function' && typeof object.getAssetRecordedAt==='function'){
					if(object.getAssetStatus()==='recording')
						data['time_start']=object.getTimeStamp();
					data['asset_status']=object.getAssetStatus();
					data['asset_recorded_at']=object.getAssetRecordedAt();
				}
				return data;
			},
			//#Moment.save()
			save:function(object,tag,id,callback){
				// __moment_save__
				var data=this.sanitize(object,tag,id);
				console.log('About to save moment');
				console.log(data);
				$.ajax({
					// __moment_post_api_call__
					dataType:'json',
					method:'POST',
					url:Global.getAPIRoot()+'moments',
					data:data,
					statusCode:{
						201:function(response){
							console.log('Moment saved');
							console.log(response);
							E.dispatch('MOMENT_SAVED',{object:response});
							if(typeof callback==='function'){
								callback(response);
							}
							var data={
								object_id:response.id,
								object_type:'moment',
								auid:Global.getAUID()
							};
							$.ajax({
								// __moment_play_post_api_call__
								dataType:'json',
								method:'POST',
								url:Global.getAPIRoot()+'play/moment',
								data:data,
								statusCode:{
									200:function(r){
										console.log('Moment played - '+response.id);
										E.dispatch('MOMENT_PLAYED',{id:response.id});
									}
								}
							});
						}
					}
				});
			},
			//#Moment.edit()
			edit:function(moment_id,object,tag,id,callback){
				var data=this.sanitize(object,tag,id);
				console.log('About to edit moment');
				console.log(data);
				data.method='edit';
				data.editor=Global.getAUID();
				$.ajax({
					// __moment_post_api_call__
					dataType:'json',
					method:'POST',
					url:Global.getAPIRoot()+'moments/'+moment_id,
					data:data,
					statusCode:{
						204:function(response){
							console.log('Moment edited');
							if(typeof callback==='function')
								callback(response);
						},
						201:function(response){
							console.log('Moment copied');
							console.log(response);
							if(typeof callback==='function'){
								callback(response);
							}
						}
					}
				});
			},
			//#Moment.play()
			play:function(id){
				// __moment_play__
				if(id==0)return;
				var data={
					object_id:id,
					object_type:'moment',
					auid:Global.getAUID()
				};
				$.ajax({
					// __moment_play_post_api_call__
					dataType:'json',
					method:'POST',
					url:Global.getAPIRoot()+'play/moment',
					data:data,
					statusCode:{
						200:function(response){
							console.log('Moment played - '+id);
							E.dispatch('MOMENT_PLAYED',{id:id});
						}
					}
				});
				if(!Global.isSite())return;
				var that=this;
				that.load(id,function(moment){
					var id=Global.getRandomID();
					var resource=moment.asset.resource_id;
					var m=$('<div>',{id:id})
						.attr('data-moment',moment.id)
						.attr('data-time_start',parseInt(moment.time_start,10))
						.attr('data-time_end',parseInt(moment.time_end,10))
						.attr('data-asset_resource_id',moment.asset.resource_id)
						.attr('data-asset_id',moment.asset.id);
					if(moment.asset.source==1)
						$(m).attr('data-asset_source','youtube').addClass('yt-player').addClass('player');
					else if(moment.asset.source==2)
						$(m).attr('data-asset_source','netflix');
					else if(moment.asset.source==3)
						$(m).attr('data-asset_source','twitch').addClass('tw-player').addClass('player');

					var container=$('<div>',{id:'container-'+id,class:'p-container'});
					$(m).appendTo(container);
					Global.getTemplate('widgets.html',function(data){
						$(container).append(data);
						$(container).appendTo($('body'));
						$(container).click(function(e){
							if($(e.target).hasClass('p-container')){
								$('.p-container').fadeIn().remove();
								E.dispatch('RESET',{});
							}
						});
						if(!YT){console.log("Couldn't load YT from youtube!!!!!");return;}
						if(moment.asset.source==1){
							// __moment_play_youtube__
							player = new YT.Player(id, {
								height: '100%',
								width: '80%',
								videoId: resource,
								events: {
									'onReady': onPlayerReadyPassive,
									'onStateChange': function(e){onPlayerStateChangePassive(e,$('#'+id));}
								}
							});
							$.ajax({
								// __partner_video_url_get_api_call__
								url:Global.getAPIRoot()+'assist?video_id='+moment.asset.resource_id,
								dataType:'json',
								method:'GET',
								statusCode:{
									200:function(data){
										//Very Unstable (Changes Frequently, so keep an hawk eye on it)
										var storyboard_spec=decodeURIComponent((/&storyboard_spec=(.*?)&/.exec(data.responseText) || [])[1]);
										//var storyboard_spec=data.responseText.split('storyboard_spec":"')[1].split('",')[0];
										$('#'+id).attr('data-storyboard_spec',storyboard_spec);

										var button=$('<div>',{class:'moment_button'});
										$(button).text('#moment');
										$(button).click(function(){
											Youtube.pause(id);
											$('#moment-save').modal('show');
											$('#moment-save [data-action="save"]').unbind('click');
											$('#moment-save [data-action="save"]').click(function(){
												$('#moment-save').modal('hide');
												var tag=$('#tag').val();
												that.save(Youtube,tag,id);
												Youtube.play(id);
											});
											$('#moment-save [data-action="dismiss"]').unbind('click');
											$('#moment-save [data-action="dismiss"]').click(function(){
												$('#moment-save').modal('hide');
												Youtube.play(id);
											});
										});
										$(button).appendTo($(container));
									}
								}
							});
						}
						else if(moment.asset.source==3){
							// __moment_play_twitch__
							$.ajax({
								// __partner_video_url_get_api_call__
								url:'assist?video_id='+moment.asset.resource_id+'&source=twitch',
								dataType:'json',
								method:'GET',
								statusCode:{
									200:function(data){
										Twitch.resource_id=data._id;
										Twitch.title=data.title;
										Twitch.publisher=data.channel.display_name;
										Twitch.duration=parseInt(data.length,10);
										Twitch.thumbnail=data.preview;
										Twitch.url=data.url;

										var attributes={};
										attributes['data-time_start']=moment.time_start;
										attributes['data-asset_id']=moment.asset.id;
										attributes['data-asset_source']=Global.mapAssetSource(moment.asset.source);
										attributes['data-asset_resource_id']=moment.asset.resource_id;

										swfobject.embedSWF("http://www-cdn.jtvnw.net/swflibs/TwitchPlayer.swf",
											id,
											'80%',
											'100%',
											"11",
											null,
											{"eventsCallback":"function(e){onPlayerEvent(e,'"+id+"')}","embed":1,"videoId":moment.asset.resource_id,"auto_play":"true"},
											{"allowScriptAccess":"always","allowFullScreen":"true"},
											attributes);

										var button=$('<div>',{class:'moment_button'});
										$(button).text('#moment');
										$(button).click(function(){
											Twitch.pause(id);
											$('#moment-save').modal('show');
											$('#moment-save [data-action="save"]').unbind('click');
											$('#moment-save [data-action="save"]').click(function(){
												$('#moment-save').modal('hide');
												var tag=$('#tag').val();
												that.save(Twitch,tag,id);
												Twitch.play(id);
											});
											$('#moment-save [data-action="dismiss"]').unbind('click');
											$('#moment-save [data-action="dismiss"]').click(function(){
												$('#moment-save').modal('hide');
												Twitch.play(id);
											});
										});
										$(button).appendTo($(container));
									}
								}
							});
						}
					});
				});
			},
			load:function(id,callback){
				// __moment_id_get__
				$.ajax({
					// __moment_id_get_api_call__
					url:Global.getAPIRoot()+'moments/'+id+'?token='+token,
					method:'GET',
					dataType:'json',
					statusCode:{
						200:function(response){
							if(typeof callback==='function')callback(response);
						}
					}
				});
			},
			bind:function(template,object,callback){
				// __twitch_component_property_replace__?  same as site call?
				Global.getTemplate(template,function(data){
					for(var prop in object){
						var r = new RegExp('{{'+prop+'}}',"g");
						data=data.replace(r,object[prop]);
					}
					if(typeof callback==='function')
						callback(data);
				});
			},
			//#Moment.render()
			render:function(id,parent){
				// __moment_render_byID__
				var that=this;
				that.load(id,function(moment){
					that.renderOnly(moment,parent);
				});
			},
			//#Moment.renderOnly()
			renderOnly:function(moment,parent,attr){
				// __moment_render__
				var that=this;
				//#Optional - moment.asset.id
				moment.asset_id=moment.asset.id?moment.asset.id:0;
				moment.id=moment.id?moment.id:0;
				moment.time_start=moment.time_start?moment.time_start:0;

				//#Required - moment.asset.source Example('Youtube','Twitch')
				moment.asset_source=Global.mapAssetSource(moment.asset.source);

				//#Required - moment.asset.resource_id Example('hMjL76obRLI','v3977400')
				moment.asset_resource_id=moment.asset.resource_id;

				//#Required - moment.thumbnail_background_image
				//#Required - moment.thumbnail_background_image_rows
				//#Required - moment.thumbnail_background_image_columns
				//#Required - moment.thumbnail_background_image_position

				that.bind('moment.html',moment,function(moment_html){
					var border_width=Global.constants('moment_border_width');
					var width=160;

					var height=width*9/16 + 2*border_width;
					var moment_html=$.parseHTML(moment_html)[0];
					//console.log(moment_html);

					var rows=parseInt($(moment_html).attr('data-rows'),10);
					var columns=parseInt($(moment_html).attr('data-columns'),10);
					var position=parseInt($(moment_html).attr('data-position'),10);
					$(moment_html).css('height',height+2*border_width);
					$(moment_html).find('.moment_thumb')
							.css('background-image','url('+$(moment_html).attr('data-image')+')')
							.css('background-size',rows*100+'% '+columns*100+'%')
							.css('background-position','-'+((position%columns)*width)+'px -'+(Math.floor(position/rows)*height)+'px');
					if(rows==0 && columns==0 && position==0)$(moment_html).find('.moment_thumb').css('background-size','100% 100%');

					$(parent).append(moment_html);

					$(moment_html).click(function(e){
						// __moment_onClick__
						e.stopPropagation();

						//If moment_playhead is clicked
						if($(this).attr('id')==='moment_playhead'){

							//Pause the Video
							Global.getVideoObject().pause(Global.getMainFrameId());
							$(this).find('.moment_tag').attr('contenteditable','true').focus().text('');
							$(this).find('.moment_tag').unbind('keydown');
							$(this).find('.moment_tag').on('keydown',function(e){
								e.stopPropagation();
							});
							return false;
						}

						var moment_id=$(this).attr('data-moment');
						E.dispatch('MOMENT_CLICKED',{id:moment_id});
						if(Global.isSite()){

							//#Check if moment_list is ancestor of the clicked moment. If so, seekTo() that time
							var p=this.parentNode;
							while(true){
								if(p==document.body || $(p).attr('id')==='moment_list')
									break;
								p=p.parentNode;
							}

							if($(p).attr('id')==='moment_list'){
								E.dispatch('MOMENT_CLICKED_FRAME',{id:moment_id});
								var id=$(p).siblings().first().attr('id');

								if(Global.isPartnerSite())
									Global.getVideoObject().seekTo(undefined,parseInt($(this).attr('data-time_start'),10));
								else
									Global.getVideoObject().seekTo(id,parseInt($(this).attr('data-time_start'),10));
								Global.getVideoObject().play(Global.getMainFrameId());
							}
							else{
								E.dispatch('MOMENT_CLICKED_SITE',{id:moment_id});
								that.play(moment_id);
							}
						}
						else{
							E.dispatch('MOMENT_CLICKED_EXT',{id:moment_id});
							that.play(moment_id);
							var t=moment.asset.url.indexOf('?')>-1?'&':'?';
							chrome.tabs.create({url:moment.asset.url+t+'start='+moment.time_start});
						}
					});
					if(typeof attr!='undefined'){
						for(var i in attr){
							if(i=='class')
								$(moment_html).removeClass(attr[i]).addClass(attr[i]);
							if(i=='id')
								$(moment_html).attr('id',attr[i]);
						}
					}
					$(moment_html).attr('draggable',true);
					$(moment_html).find('.moment_popup.menu').click(function(e){
						e.preventDefault();
						e.stopPropagation();
					});
					$(moment_html).find('.moment_popup.done').click(function(e){
						e.preventDefault();
						e.stopPropagation();
						var that=this;
						var tag=$(that).parent().find('.moment_tag').html();
						console.log(tag);
						if(tag!='New Moment'){
							if($(that).parent().attr('data-moment')==0){
								Moment.save(Global.getVideoObject(),tag,Global.getMainFrameId(),function(m){
									console.log(m);
									Moment.renderOnly(m,'#moment_list .items',{class:'item hidden'});
									Moment.refresh();
									Global.getVideoObject().play(Global.getMainFrameId());

									$(that).parent().find('.moment_tag').text('New Moment').attr('contenteditable','false');
								});
							}
							else if(parseInt($(that).parent().attr('data-moment'))>0){
								Moment.edit(parseInt($(that).parent().attr('data-moment')),Global.getVideoObject(),tag,Global.getMainFrameId(),function(m){
									console.log(m);
									if(typeof m==='undefined'){
										$(that).parent().removeAttr('data-original_time_start');
									}
									else{
										if($(that).parent().attr('data-original_time_start'))
											$(that).parent().attr('data-time_start',$(that).parent().attr('data-original_time_start')).removeAttr('data-original_time_start');

										Moment.renderOnly(m,'#moment_list .items',{class:'item hidden'});
									}
									$(that).parent().removeClass('edit_mode');
									Moment.refresh();
									Global.getVideoObject().play(Global.getMainFrameId());
								});
							}
						}
					});
					$(moment_html).find('.moment_popup.cancel').click(function(e){
						e.preventDefault();
						e.stopPropagation();
						if($(this).parent().attr('id')==='moment_playhead')
							$(this).parent().find('.moment_tag').text('New Moment');
						Global.getVideoObject().play(Global.getMainFrameId());

						$(this).parent().removeClass('edit_mode');
						$(this).parent().find('.moment_tag').attr('contenteditable',false);
						if($(this).parent().attr('data-original_time_start'))
							$(this).parent().attr('data-time_start',$(this).parent().attr('data-original_time_start')).removeAttr('data-original_time_start');

						Moment.refresh();
					});
					$(moment_html).find('.moment_popup.go_left').click(function(e){
						e.preventDefault();
						e.stopPropagation();
						$('#moment_list .moment').removeClass('edit_mode');
						$(this).parent().addClass('edit_mode');
						$(this).parent().find('.moment_tag').attr('contenteditable',true);

						Global.getVideoObject().pause(Global.getMainFrameId());
						var new_start=parseInt($(this).parent().attr('data-time_start'))-2;
						console.log(new_start);
						Global.getVideoObject().seekTo(Global.getMainFrameId(),new_start);

						if(!$(this).parent().attr('data-original_time_start'))
							$(this).parent().attr('data-original_time_start',$(this).parent().attr('data-time_start'));
						$(this).parent().attr('data-time_start',new_start);
						Moment.refresh();
					});
					$(moment_html).find('.moment_popup.go_right').click(function(e){
						e.preventDefault();
						e.stopPropagation();
						$('#moment_list .moment').removeClass('edit_mode');
						$(this).parent().addClass('edit_mode');
						$(this).parent().find('.moment_tag').attr('contenteditable',true);

						Global.getVideoObject().pause(Global.getMainFrameId());
						var new_start=parseInt($(this).parent().attr('data-time_start'))+2;
						Global.getVideoObject().seekTo(Global.getMainFrameId(),new_start);

						if(!$(this).parent().attr('data-original_time_start'))
							$(this).parent().attr('data-original_time_start',$(this).parent().attr('data-time_start'));
						$(this).parent().attr('data-time_start',new_start);
						Moment.refresh();
					});
					that.refresh();
				});
			}
		};
		return{
			debug:function(object,id,tag){
				_private.debug(object,id,tag);
			},
			refresh:function(){
				_private.refresh();
			},
			render:function(id,parent){
				_private.render(id,parent);
			},
			renderOnly:function(moment,parent,attr){
				_private.renderOnly(moment,parent,attr);
			},
			load:function(id,callback){
				_private.load(id,callback);
			},
			play:function(id){
				_private.play(id);
			},
			save:function(object,tag,id,callback){
				_private.save(object,tag,id,callback);
			},
			edit:function(moment_id,object,tag,id,callback){
				_private.edit(moment_id,object,tag,id,callback);
			}
		};
	})();



	Page=(function(){
		var _private={
			load:function(object){
				// __site_page_load__
				$('.'+object.activeClass).removeClass(object.activeClass);
				$(object.targetButton).addClass(object.activeClass);
				$(object.target).siblings('.'+object.siblingClass).hide();
				$(object.target).show();
			}
		};
		return{
			load:function(object){
				//filter object before calling private function
				if(typeof object!=='object')return;
				if(U.check(object.target))return;
				if(U.check(object.targetButton))return;

				//fallback to default if not set
				if(U.check(object.activeClass))object.activeClass=Global.constants('activeClass');
				if(U.check(object.siblingClass))object.siblingClass=Global.constants('siblingClass');
				if(U.check(object.fallback))object.fallback=Global.elements('fallback');
				if(U.check(object.vuid))object.vuid=Global.elements('vuid');
				if(U.check(object.momentClass))object.momentClass=Global.constants('momentClass');
				if(U.check(object.momentIdAttribute))object.momentIdAttribute='data-moment';

				_private.load(object);
			}
		};
	})();

	History=(function(){
		var _private={
			history:function(object){
				// __site_page_history_load__
				var that=this;
				$('.'+object.activeClass).removeClass(object.activeClass);
				$(object.targetButton).addClass(object.activeClass);
				$(object.target).siblings('.'+object.siblingClass).hide();
				$(object.target).show();
				$(object.target).html('');

				$.ajax({
					// __user_id_history_moments_get_api_call__
					url:Global.getAPIRoot()+'users/'+Global.getAUID()+'/moments/history?token='+token,
					method:'GET',
					dataType:'json',
					success:function(response){
						for(var i=0;i<response.length;i++){
							var moment=response[i];
							var m=Moment.renderOnly(moment,'#history');
							Moment.refresh();
						}
					}
				});
			}
		};
		return{
			history:function(object){
				//filter object before calling private function
				if(typeof object!=='object')return;
				if(U.check(object.target))return;

				//fallback to default if not set
				if(U.check(object.targetButton))object.targetButton=$('#load-history');
				if(U.check(object.activeClass))object.activeClass=Global.constants('activeClass');
				if(U.check(object.siblingClass))object.siblingClass=Global.constants('siblingClass');
				if(U.check(object.fallback))object.fallback=Global.elements('fallback');
				if(U.check(object.vuid))object.vuid=Global.elements('vuid');
				if(U.check(object.momentClass))object.momentClass=Global.constants('momentClass');
				if(U.check(object.momentIdAttribute))object.momentIdAttribute='data-moment';

				_private.history(object);
			}
		};
	})();

	Feed=(function(){
		_private={
			// __site_page_feed__
			load:function(object){
				// __site_page_feed_load__
				var that=this;
				$('.'+object.activeClass).removeClass(object.activeClass);
				$(object.targetButton).addClass(object.activeClass);
				$(object.target).siblings('.'+object.siblingClass).hide();
				$(object.target).show();
				$(object.target).html('');

				$.ajax({
					// __moment_all_get_api_call__
					url:Global.getAPIRoot()+'moments/all?limit=20',
					method:'GET',
					dataType:'json',
					success:function(response){
						for(var i=0;i<response.length;i++){
							var moment=response[i];
							var m=Moment.renderOnly(moment,'#feed');
							Moment.refresh();
						}
					}
				});
			}
		};
		return {
			load:function(object){
				//filter object before calling private function
				if(typeof object!=='object')return;
				if(U.check(object.target))return;

				//fallback to default if not set
				if(U.check(object.targetButton))object.targetButton=$('#load-feed');
				if(U.check(object.activeClass))object.activeClass=Global.constants('activeClass');
				if(U.check(object.siblingClass))object.siblingClass=Global.constants('siblingClass');
				if(U.check(object.fallback))object.fallback=Global.elements('fallback');
				if(U.check(object.vuid))object.vuid=Global.elements('vuid');
				if(U.check(object.momentClass))object.momentClass=Global.constants('momentClass');
				if(U.check(object.momentIdAttribute))object.momentIdAttribute='data-moment';

				_private.load(object);
			}
		};
	})();

	Playlist=(function(){
		var _private={
			// __site_page_playlists_load__
			load:function(object){
				$('.'+object.activeClass).removeClass(object.activeClass);
				$(object.targetButton).addClass(object.activeClass);
				$(object.target).siblings('.'+object.siblingClass).hide();
				$(object.target).show();
				var t=setInterval(function(){
					if(object.fallback.text()){
						clearInterval(t);
						$.ajax({
							// __users_id_playlists_get_api_call__
							url: Global.getAPIRoot()+'users/'+Global.getAUID()+'/playlists?token='+token,
							method:'GET',
							dataType:'json',
							success:function(response){
								$(object.target).html('');
								for(var i=0;i<response.length;i++){
									var moment=response[i];
									console.log(moment);
									var m=Moment.render(moment);
									$(object.target).append(m);
									Moment.refresh();
								}
							}
						});
					}
				},1000);
			}
		};
		return{
			load:function(object){
				//filter object before calling private function
				if(typeof object!=='object')return;
				if(U.check(object.target))return;

				//fallback to default if not set
				if(U.check(object.targetButton))object.targetButton=$('#load-playlists');
				if(U.check(object.activeClass))object.activeClass=Global.constants('activeClass');
				if(U.check(object.siblingClass))object.siblingClass=Global.constants('siblingClass');
				if(U.check(object.fallback))object.fallback=Global.elements('fallback');
				if(U.check(object.vuid))object.vuid=Global.elements('vuid');
				if(U.check(object.momentClass))object.momentClass=Global.constants('momentClass');
				if(U.check(object.momentIdAttribute))object.momentIdAttribute='data-moment';

				_private.load(object);
			}
		};
	})();

	User=(function(){
		var _private={
			register:function(object){
				// __user_register__
				$.ajax({
					// __user_login_signup_post_api_call__
					url:Global.getAPIRoot()+'login/signup',
					data:object,
					method:'POST',
					dataType:'json',
					success:function(response){
						window.location=response.location;
					},
					error:function(response){
						console.log(response);
					}
				});
			},
			login:function(object){
				// __user_login__
				$.ajax({
					// __user_login_post_api_call__
					url:Global.getAPIRoot()+'login/',
					data:object,
					method:'POST',
					dataType:'json',
					success:function(response){
						window.location=response.location;
					},
					error:function(response){
						console.log(response);
					}
				});
			},
			isLoggedIn:function(){
				// __user_login_is__
				if(Global.elements('vuid').text())
					return true;
				return false;
			},
			greetings:function(object){
				// __user_get__
				if(this.isLoggedIn()){
					$.ajax({
						// __user_id_get_api_call__
						url:Global.getAPIRoot()+'users/'+Global.getAUID()+'?token='+token,
						method:'GET',
						dataType:'json',
						success:function(response){
							$(object.target).html('Hello, '+response.display_name);
						},
						error:function(response){
							console.log(response);
						}
					});
				}
				else
					$(object.target).html('');
			}
		};
		return {
			register:function(){
				var object={
					name:$('#registration-form [name="name"]').val(),
					email:$('#registration-form [name="email"]').val(),
					password:$('#registration-form [name="password"]').val(),
					fallback:Global.elements('fallback').text()
				};
				_private.register(object);
			},
			login:function(){
				var object={
					name:$('#login-form [name="name"]').val(),
					password:$('#login-form [name="password"]').val(),
					fallback:Global.elements('fallback').text()
				};
				console.log(object);
				_private.login(object);
			},
			isLoggedIn:function(){
				return _private.isLoggedIn();
			},
			greetings:function(object){
				_private.greetings(object);
			}
		};
	})();

	// __user_merge_watch__
	var clock;
	if(!clock){
		clock=setInterval(function(){
			if(Global.elements('fallback').text()){
				clearInterval(clock);
				if(Global.elements('vuid').text()){
					$.ajax({
						// __user_merge_post_api_call__
						url:Global.getAPIRoot()+'merge',
						method:'POST',
						data:{auid:$('.fallback').first().text(),vuid:$('#vuid').text()},
						dataType:'json',
						success:function(response){
							console.log(response);
						}
					});
				}
			}
			console.log('merge waiting');
		},1000);
	}

	// __user_anonLocal_login_is_call__
	if(Global.isPartnerSite()){
		chrome.runtime.sendMessage({greeting:'isLoggedIn'},function(response){
			console.log(response);
			Global.setAUID(response.data.fallback);
			if(response.data.loggedIn===true)
				Global.setAUID(response.data.vuid);
		});
	}

	// __browser_page_resize__
	$(window).resize(function(){
		Moment.refresh();
	});

	U.setDebugMode(true);

	window.onhashchange = Global.locationHashChanged;

	setInterval(function(){User.greetings({target:$('#greetings')});},1000);
}
