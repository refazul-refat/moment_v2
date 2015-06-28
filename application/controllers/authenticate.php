<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Authenticate extends CI_Controller {
	public function index(){
		// __browser_session_init__
		if($this->input->get('token')){
			$this->load->model('core');
			$this->load->library('session');

			$token=$this->core->decode($this->input->get('token'));
			$string = $this->core->decrypt($token);
			$parts = explode(',',$string);
			if($parts[0]=='ok'){
				$this->session->set_userdata('uid',$parts[1]);
				$this->session->set_userdata('vuid',$parts[2]);
			}
		}
		header('Location:'.base_url());
		die();
	}
	public function test(){

		$token='UJneGtCjM1s5xEOUzlCyTGdGUSP8vTzsJYnI9ye3kJuulrLMTfikxHsPymsKnpcqETSAhS5eC6mLDAJg17WZmA==';
		$this->load->library('encrypt');
		$key='shared-super-secret-key';
		$string=$this->encrypt->decode($token,$key);
		echo '<pre>';print_r($string);echo '<br/>';
		echo $this->base64url_encode($string);echo '<br/>';
		echo $this->base64url_encode($this->base64url_encode($string));echo '<br/>';
		echo $this->base64url_encode($this->base64url_encode($this->base64url_encode($string)));echo '<br/>';
		echo $this->base64url_encode($this->base64url_encode($this->base64url_encode($this->base64url_encode($string))));echo '<br/>';
	}
}

/* End of file authenticate.php */
/* Location: ./application/controllers/authenticate.php */
