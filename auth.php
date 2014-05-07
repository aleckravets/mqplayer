<?php
session_start();

DEFINE('APPID', '474c45e49ee44ea38dc31a069759207d');
DEFINE('SECRET', '3424cde6d86f4ca1acd6038b1c56a7c1');

DEFINE('TOKEN', isset($_SESSION['token']) ? $_SESSION['token'] : '');

$task = getVar('task');

require_once 'phar://yandex-sdk_0.2.0.phar/vendor/autoload.php';

use Yandex\Disk\DiskClient;

switch($task) {
    case 'userinfo':
        getUserInfo();
        break;
    case 'file':
        $path = getVar('path');
        getFile($path);
        break;
    case 'dircontents':

        break;
    default:
        if (isset($_GET['code'])) {
            $token = getTokenByCode($_GET['code']);
            $_SESSION['token'] = $token;
            header("Location: /");
        }
        else {
            $url = "https://oauth.yandex.ru/authorize?response_type=code&client_id=" . APPID ;
            header("Location: $url");
        }
}

function getVar($var) {
    return isset($_GET[$var]) ? $_GET[$var] : null;
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
        "Authorization: OAuth " . TOKEN
    ));
    curl_exec($ch);
    curl_close($ch);
}

function getTokenByCode($code) {
    $ch = curl_init();

    $body = array(
        'grant_type' => 'authorization_code',
        'code' => $code,
        'client_id' => APPID,
        'client_secret' => SECRET);

    curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
    curl_setopt($ch, CURLOPT_URL, "https://oauth.yandex.ru/token");
    curl_setopt ($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HEADER, false);

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

    curl_setopt($ch, CURLOPT_POSTFIELDS, $body);

    $response = curl_exec($ch);

    curl_close($ch);

    $json = json_decode($response, true);

    return $json['access_token'];
}

function getUserInfo() {
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
    curl_setopt($ch, CURLOPT_URL, "https://login.yandex.ru/info?oauth_token=" . $_SESSION['token']);
    curl_setopt($ch, CURLOPT_HEADER, false);
    curl_setopt ($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $response = curl_exec($ch);
    curl_close($ch);

    header('Content-Type: application/json ');
    echo $response;
}

// todo: http://habrahabr.ru/post/157753/
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