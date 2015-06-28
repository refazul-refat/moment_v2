<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Assist extends CI_Controller {
	public function index(){
		// __partner_video_info_get__ 
		header("Access-Control-Allow-Origin: *");
		header('Content-Type: application/json');
		if($this->input->get('video_id')){
			$vid=$this->input->get('video_id');

			if($this->input->get('source')=='twitch'){
				$return=file_get_contents('https://api.twitch.tv/kraken/videos/'.$vid);
				echo $return;
				die();
			}
			$return=file_get_contents('https://www.youtube.com/get_video_info?video_id='.$vid);
			echo $return;
			die();
		}
	}
}
