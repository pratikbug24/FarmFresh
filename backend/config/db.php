<?php
/**
 * Database connection for the optional FarmFresh PHP backend.
 *
 * Copy this file's values into your environment or edit them for local XAMPP /
 * WAMP setups. The static front-end works without this file.
 */

declare(strict_types=1);

$DB_HOST = getenv('FF_DB_HOST') ?: 'localhost';
$DB_NAME = getenv('FF_DB_NAME') ?: 'farmfresh';
$DB_USER = getenv('FF_DB_USER') ?: 'root';
$DB_PASS = getenv('FF_DB_PASS') ?: '';

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $conn = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);
    $conn->set_charset('utf8mb4');
} catch (mysqli_sql_exception $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['ok' => false, 'error' => 'Database connection failed.']);
    exit;
}
