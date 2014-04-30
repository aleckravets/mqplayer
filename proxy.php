<?php

$cache = false;

session_start();

DEFINE('TOKEN', isset($_SESSION['token']) ? $_SESSION['token'] : '');

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

function getDirectoryContents($path, $cache) {
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

    header('Content-Type: application/json');

    if (!TOKEN) {
        die('[]');
    }

    $disk = new DiskClient();

    $disk->setAccessToken(TOKEN);

    if ($cache && isset($_SESSION[$path])) {
        $files = $_SESSION[$path];
    }
    else {
        $files = $disk->directoryContents($path);
        array_shift($files);

        if ($cache)
            $_SESSION[$path] = $files;
    }

    die(json_encode($files));
}