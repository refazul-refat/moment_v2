var token='TqD5p_0h9ZEH8Bef5pV1r9d8AX9u05MT';
var api_base='http://api.mpulsemedia.com/v1/';
var secure_api_base='https://api.mpulsemedia.com/v1/';
function randomID(length){
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for( var i=0; i < length; i++ )
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	return text;
}
var fallback=localStorage.getItem('fallback')?localStorage.getItem('fallback'):randomID(32);
localStorage.setItem('fallback',fallback);
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.greeting=='hello'){
		// __user_anonLocal_register__
		var fallback=localStorage.getItem('fallback')?localStorage.getItem('fallback'):randomID(32);
		localStorage.setItem('fallback',fallback);
		sendResponse({
			data: {fallback:fallback}
		});
	}
	else if(request.greeting==='login'){
		// __user_anonLocal_login__
		localStorage.setItem('vuid',request.data.vuid);
	}
	else if(request.greeting==='isLoggedIn'){
		// __user_anonLocal_login_is__
		var loggedIn=false;
		var response={};
		response.fallback=localStorage.getItem('fallback');
		if(localStorage.getItem('vuid') && localStorage.getItem('vuid').length){
			loggedIn=true;
			response.vuid=localStorage.getItem('vuid');
		}
		response.loggedIn=loggedIn;
		sendResponse({
			data:response
		});
	}
	else if(request.greeting==='logout'){
		// __user_anonLocal_login_clear__
		localStorage.removeItem('vuid');
	}
	else if(request.greeting==='impose'){
		// __?_browser_storage__
		localStorage.setItem('fallback',request.fallback);
	}
	else if(request.greeting==='next'){
		// __playlist_moment_next_get__
		var playlist=JSON.parse(localStorage.getItem('playlist'));
		console.log(playlist);
		$.ajax({
			// __playlist_id_get_api_call__
			url:api_base+'playlists/'+playlist.id+'?token='+token,
			method:'GET',
			dataType:'json',
			statusCode:{
				200:function(response){
					if(response.moments[playlist.index+1]){
						sendResponse({
							data: {next:response.moments[playlist.index+1]}
						});
						playlist.index++;
						console.log(playlist);
						localStorage.setItem('playlist',JSON.stringify(playlist));
					}
					else{
						sendResponse({
							data: null
						});
					}
				}
			}
		});
	}
	return true;
});
