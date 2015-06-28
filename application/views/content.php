<!-- __site_page_element_body_browser__ -->
<div id='content' class='container'>
	<section id='main'>

	</section>
</div>

<div class='fallback' style='display:none;'></div>
<?php if($this->session->userdata('vuid')):?>
<div id='vuid' style='display:none;'><?php echo $this->session->userdata('vuid');?></div>
<?php endif;?>
<script type='text/javascript'>
	// __user_anonLocal_init__
	function makeId(){
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
		for( var i=0; i < 32; i++ )
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		return text;
	}
	if(localStorage.getItem('fallback'));
	else localStorage.setItem('fallback',makeId());

	$('.fallback').text(localStorage.getItem('fallback'));
	$('input[name="fallback"]').val(localStorage.getItem('fallback'));
</script>

<!--app-->
<script type='text/javascript' src='ext/js/core.js?_=<?php echo time();?>'></script>
<script type='text/javascript' src='ext/js/app.js?v=<?php echo time();?>'></script>
<!-- <script type='text/javascript' src='ext/js/demo.js'></script> -->
<script type='text/javascript' src='ext/js/moment_list.js?v=<?php echo time();?>'></script>
<script type='text/javascript' src='ext/js/moment_playhead.js?v=<?php echo time();?>'></script>
