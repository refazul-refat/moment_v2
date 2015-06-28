<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Google extends CI_Controller {
	public function index(){
		// __auth_google__
		if($this->input->get_post('code')){
			$code=$this->input->get_post('code');
			$app_id = "856474361847-cveg7qql7bpnstvl48c5217usphcn76t.apps.googleusercontent.com";
			$app_secret = "_N1iaIhs98NSY0tiWXc7Ljop";
			$my_url = "http://dev.mpulsemedia.com/web/google/";
			$token_url = "https://www.googleapis.com/oauth2/v3/token";
			$data = array('code' => $code,
						  'client_id' => $app_id,
						  'client_secret' => $app_secret,
						  'redirect_uri' => $my_url,
						  'grant_type' => 'authorization_code');

			// use key 'http' even if you send the request to https://...
			$options = array(
				'http' => array(
					'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
					'method'  => 'POST',
					'content' => http_build_query($data),
				),
			);
			$context  = stream_context_create($options);
			$response = @file_get_contents($token_url, false, $context);
			$response = json_decode($response);

			if($response->access_token){
				$access_token=$response->access_token;
				$request_url='https://www.googleapis.com/plus/v1/people/me?access_token='.$access_token;
				$response=file_get_contents($request_url);
				$user=json_decode($response);

				$ch = curl_init();

				curl_setopt($ch, CURLOPT_URL,'http://api.mpulsemedia.com/v1/users');
				curl_setopt($ch, CURLOPT_POST, 1);
				curl_setopt($ch, CURLOPT_POSTFIELDS,http_build_query(array('google' => $user)));
				curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
				curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);

				// receive server response ...
				curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

				$result = json_decode(curl_exec($ch));
				header('Location:'.base_url().'authenticate?token='.$result);
				die();
			}
		}
	}
}
