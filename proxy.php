<?php
header('Content-Type: application/json');

require_once 'phar://yandex-sdk_0.2.0.phar/vendor/autoload.php';

use Yandex\Disk\DiskClient;

$disk = new DiskClient();

$disk->setAccessToken('9aed859d536244ab891e11caeb7947e0');

$files = $disk->directoryContents();

echo json_encode($files);