<?php

session_start();

$appid = '474c45e49ee44ea38dc31a069759207d';
$appsecret = '3424cde6d86f4ca1acd6038b1c56a7c1';

if (isset($_GET['code'])) {
    $token = getTokenByCode($_GET['code'], $appid, $appsecret);
    $_SESSION['token'] = $token;
    header("Location: /");
}
else {
    $url = "https://oauth.yandex.ru/authorize?response_type=code&client_id=$appid&state=1";
    header("Location: $url");
}

function getTokenByCode($code, $appid, $appsecret) {
    $ch = curl_init();

    $body = array(
        'grant_type' => 'authorization_code',
        'code' => $code,
        'client_id' => $appid,
        'client_secret' => $appsecret);

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
?>