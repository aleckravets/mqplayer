<?php

$cache = false;

session_start();



require_once 'phar://yandex-sdk_0.2.0.phar/vendor/autoload.php';

use Yandex\Disk\DiskClient;

use Yandex\Common\AbstractServiceClient;
use Guzzle\Http\Client;
use Guzzle\Http\Message\Request;
use Guzzle\Http\Message\RequestFactory;
use Guzzle\Http\Message\Response;
use Guzzle\Http\Exception\ClientErrorResponseException;

if (isset($_GET['get'])) {
    getFile($_GET['get']);
}
else {
    getDirectoryContents($_SERVER['PATH_INFO'], $cache);
}

function pr($obj) {
    echo '<pre>';
    print_r($obj);
    echo '</pre>';
}



