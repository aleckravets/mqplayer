<?php
session_start();

require_once 'phar://yandex-sdk_0.2.0.phar/vendor/autoload.php';

use Yandex\Disk\DiskClient;

use Yandex\Common\AbstractServiceClient;
use Guzzle\Http\Client;
use Guzzle\Http\Message\Request;
use Guzzle\Http\Message\RequestFactory;
use Guzzle\Http\Message\Response;
use Guzzle\Http\Exception\ClientErrorResponseException;

$disk = new DiskClient();

$disk->setAccessToken('9aed859d536244ab891e11caeb7947e0');

if (isset($_GET['get'])) {
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, "https://webdav.yandex.ru" . $_GET['get']);
    curl_setopt($ch, CURLOPT_HEADER, false);
    curl_setopt ($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_HEADERFUNCTION, 'read_header');
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Authorization: OAuth 9aed859d536244ab891e11caeb7947e0',
            'Host: webdav.yandex.ru',
            'Accept: */*'
    ));
    curl_exec($ch);
    curl_close($ch);
}
else {
    header('Content-Type: application/json');
    if (!$_SESSION[$_GET['path']]) {
        $files = $disk->directoryContents($_GET['path']);
        array_shift($files);
        $_SESSION[$_GET['path']] = $files;
    }
    echo json_encode($_SESSION[$_GET['path']]);
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