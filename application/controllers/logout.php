<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Logout extends CI_Controller {

	public function index(){
		// __browser_session_destroy__
		$this->session->sess_destroy();
		header('Location:'.base_url());
		die();
	}
}

/* End of file logout.php */
/* Location: ./application/controllers/logout.php */
