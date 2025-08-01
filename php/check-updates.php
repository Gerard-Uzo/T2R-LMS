<?php
// check-updates.php
$lastCheck = isset($_GET['lastCheck']) ? (int)$_GET['lastCheck'] : 0;
$file = 'events.log';

$latestEventTime = 0;
if (file_exists($file)) {
    $latestEventTime = filemtime($file);
}

header('Content-Type: application/json');
echo json_encode([
    'updateAvailable' => $latestEventTime > $lastCheck,
    'timestamp' => time()
]);
?>