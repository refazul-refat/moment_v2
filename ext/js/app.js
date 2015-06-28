// __site_comp_navTopRow_render__
Global.getTemplate('nav.html', function(data){
	data=Global.sanitize(data);
   $('body').prepend(data);
	// __site_comp_panel_buttons_render__
	Global.getTemplate('button-group-1.html',function(data){
		data=Global.sanitize(data);
		$('#main').append(data);
		// __site_comp_panel_render__
		Global.getTemplate('panel-group-1.html',function(data){
			$('#main').append(data);
			var api_base='http://api.mpulsemedia.com/v1/';
			var token='TqD5p_0h9ZEH8Bef5pV1r9d8AX9u05MT';

			// __site_comp_register_button_render__
			$('#load-register').click(function(){
				if(Global.isSite())
					Page.load({target:$('#register'),targetButton:$('#load-register')});
				else{
					chrome.tabs.create({url: $(this).attr('href')});
					return false;
				}
				Global.scrollToTop();
			});
			$('#load-login').click(function(){
				if(Global.isSite())
					Page.load({target:$('#login'),targetButton:$('#load-login')});
				else{
					chrome.tabs.create({url: $(this).attr('href')});
					return false;
				}
				Global.scrollToTop();
			});
			$('#logout-button').click(function(){
				if(!Global.isSite()){
					chrome.tabs.create({url: $(this).attr('href')});
					return false;
				}
			});

			Global.locationHashChanged();
			if(User.isLoggedIn())
				$('.outworld').hide();

			var t=setInterval(function(){
				if(!Global.isSite()){
					chrome.runtime.sendMessage({greeting:'isLoggedIn'},function(response){
						console.log(response);
						if(!Global.elements('fallback').text())
							$('body').append($('<div>',{class:'fallback'}).css('display','none').text(response.data.fallback));
						if(response.data.loggedIn===true){
							if(!Global.elements('vuid').text())
								$('body').append($('<div>',{id:'vuid'}).css('display','none').text(response.data.vuid));
							$('.outworld').hide();
						}
					});
				}
			},1000);
		});
	});
});
