<?php
class Core extends CI_Model {
    function __construct(){
        // Call the Model constructor
        parent::__construct();
    }
    public function getRandomID($length = 32) {
		$characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		$charactersLength = strlen($characters);
		$randomString = '';
		for ($i = 0; $i < $length; $i++) {
			$randomString .= $characters[rand(0, $charactersLength - 1)];
		}
		return $randomString;
	}
    public function base64url_encode($s) {
		return str_replace(array('+', '/', '='), array('-', '_', '.'), base64_encode($s));
	}
	public function base64url_decode($s) {
   		return base64_decode(str_replace(array('-', '_', '.'), array('+', '/', '='), $s));
	}
	public function respond($http_response_code,$message){
		http_response_code($http_response_code);
		echo json_encode($message,JSON_PRETTY_PRINT);
		die();
	}
	public function encrypt($plain){
		$this->load->library('encrypt');
		$key='UIXA';
		$cipher=$this->encrypt->encode($plain,$key);
		
		return $cipher;
	}
	public function encode($input){
		return $this->base64url_encode($input);
	}
	public function decode($input){
		return $this->base64url_decode($input);
	}
	public function decrypt($cipher){
		$this->load->library('encrypt');
		$key='UIXA';
		$plain=$this->encrypt->decode($cipher,$key);
		
		return $plain;
	}
}