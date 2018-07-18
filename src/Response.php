<?php

namespace Fijax;

class Response {
  protected $valid;

  protected $errors;

  public function __construct() {
    $valid = true;
    $errors = [];
  }

  public function __toString() {
    return $this->getJson();
  }

  public function isValid() {
    return $this->valid;
  }

  public function write(\Psr\Http\Message\ResponseInterface $response) {
    $response->withStatus($this->getCode());
    $response->withHeader('Content-Type', 'application/json');

    $response->getBody()->write($this->getJson());

    return $response;
  }

  public function getCode() {
    return $this->valid ? '200' : '400';
  }

  public function getJson() {
    return json_encode($this->errors);
  }

  public function addError($name, $message) {
    $this->valid = false;

    $this->errors[] = [ 'name' => $name, 'message' => $message ];
  }
}
