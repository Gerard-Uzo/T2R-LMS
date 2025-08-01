<?php
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('Connection: keep-alive');

// Get the last event ID (if any)
$lastEventId = isset($_SERVER['HTTP_LAST_EVENT_ID']) ? $_SERVER['HTTP_LAST_EVENT_ID'] : 0;

// Infinite loop to keep connection open
while (true) {
    // Check for new events (in a real app, this would check a database)
    $newEvents = checkForNewEvents($lastEventId);

    foreach ($newEvents as $event) {
        echo "id: " . $event['id'] . "\n";
        echo "event: " . $event['type'] . "\n";
        echo "data: " . $event['data'] . "\n\n";
        ob_flush();
        flush();
        $lastEventId = $event['id'];
    }

    // Sleep for a while before checking again
    sleep(1);
}

function checkForNewEvents($lastId) {
    // In a real implementation, you would query a database or message queue
    // For this example, we'll use a simple file-based approach

    $events = [];
    $file = 'events.log';

    if (file_exists($file)) {
        $lines = file($file);
        foreach ($lines as $line) {
            $parts = explode('|', trim($line));
            if ($parts[0] > $lastId) {
                $events[] = [
                    'id' => $parts[0],
                    'type' => $parts[1],
                    'data' => $parts[2]
                ];
            }
        }
    }

    return $events;
}
?>