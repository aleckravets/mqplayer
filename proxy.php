<?php

DEFINE('TOKEN', '9aed859d536244ab891e11caeb7947e0');

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
    getDirectoryContents($_SERVER['PATH_INFO']);
}

function pr($obj) {
    echo '<pre>';
    print_r($obj);
    echo '</pre>';
}

function read_header($ch, $string)
{
    $length = strlen($string);

    header($string);

    return $length;
}

function getFile($path) {
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, "https://webdav.yandex.ru" . $path);
    curl_setopt($ch, CURLOPT_HEADER, false);
    curl_setopt ($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_HEADERFUNCTION, 'read_header');
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        "Authorization: OAuth " . TOKEN,
        'Host: webdav.yandex.ru',
        'Accept: */*',
        'Depth: 1'
    ));
    curl_exec($ch);
    curl_close($ch);
}

function getDirectoryContents($path) {
//    $ch = curl_init();
//
//    curl_setopt($ch, CURLOPT_URL, "https://webdav.yandex.ru" . $path);
//    curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
//    curl_setopt($ch, CURLOPT_HEADER, false);
//    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
//    curl_setopt ($ch, CURLOPT_SSL_VERIFYPEER, false);
//    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PROPFIND');
//    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
//        'Authorization: OAuth 9aed859d536244ab891e11caeb7947e0',
//        'Host: webdav.yandex.ru',
//        'Accept: */*',
//        'Depth: 1'
//    ));
//    $response = curl_exec($ch);
//
//    curl_close($ch);

//    return $response;

    header('Content-Type: application/json');

    $disk = new DiskClient();

    $disk->setAccessToken(TOKEN);

    if (!$_SESSION[$path]) {
        $files = $disk->directoryContents($path);
        array_shift($files);
        $_SESSION[$path] = $files;
    }

    echo json_encode($_SESSION[$path]);
}