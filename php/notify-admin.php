<?php
// notify-admin.php
$type = isset($_GET['type']) ? $_GET['type'] : '';

if (!empty($type)) {
    $eventId = time();
    $data = $type === 'new_student' ? 'new_student' : 'update';

    // Log the event
    file_put_contents('events.log', "$eventId|$type|$data\n", FILE_APPEND);

    echo "Notification sent";
} else {
    http_response_code(400);
    echo "Invalid request";
}
?>