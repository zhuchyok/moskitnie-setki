<?php
$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['cookie_event']) && $data['cookie_event'] === 'accept') {
    $logLine = date('Y-m-d H:i:s') . "; " .
        $_SERVER['REMOTE_ADDR'] . "; " .
        "cookie_analytics:" . (isset($data['analytics']) ? ($data['analytics'] ? 'yes' : 'no') : '') . "; " .
        "cookie_marketing:" . (isset($data['marketing']) ? ($data['marketing'] ? 'yes' : 'no') : '') . "; " .
        "url:" . (isset($data['url']) ? $data['url'] : '') . "; " .
        "user_agent:\"" . (isset($data['user_agent']) ? addslashes($data['user_agent']) : '') . "\"\n";
    file_put_contents(__DIR__ . '/../logs/consent.log', $logLine, FILE_APPEND);
    echo json_encode(['status' => 'ok']);
    exit;
}

$logLine = date('Y-m-d H:i:s') . "; " .
    $_SERVER['REMOTE_ADDR'] . "; " .
    "phone:" . (isset($data['phone']) ? $data['phone'] : '') . "; " .
    "name:" . (isset($data['name']) ? $data['name'] : '') . "; " .
    "address:" . (isset($data['address']) ? $data['address'] : '') . "; " .
    "consent_type:" . (isset($data['consent_type']) ? $data['consent_type'] : '') . "; " .
    "version:" . (isset($data['version']) ? $data['version'] : '') . "; " .
    "url:" . (isset($data['url']) ? $data['url'] : '') . "; " .
    "user_agent:\"" . (isset($data['user_agent']) ? addslashes($data['user_agent']) : '') . "\"\n";

file_put_contents(__DIR__ . '/../logs/consent.log', $logLine, FILE_APPEND);
echo json_encode(['status' => 'ok']);
?>