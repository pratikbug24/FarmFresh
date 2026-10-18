<?php
/**
 * Small helpers shared by the PHP endpoints.
 */

declare(strict_types=1);

/** Send a JSON response and stop. */
function json_response(array $payload, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload);
    exit;
}

/** Read a JSON request body into an associative array. */
function json_input(): array
{
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

/** Only allow the HTTP verbs a handler supports. */
function require_method(string ...$allowed): void
{
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    if (!in_array($method, $allowed, true)) {
        header('Allow: ' . implode(', ', $allowed));
        json_response(['ok' => false, 'error' => 'Method not allowed.'], 405);
    }
}

/** Return the signed-in user row, or null when the session is empty. */
function current_user(mysqli $conn): ?array
{
    if (empty($_SESSION['user_id'])) {
        return null;
    }

    $stmt = $conn->prepare('SELECT id, user_name, email, name, phone, address FROM users WHERE id = ?');
    $stmt->bind_param('i', $_SESSION['user_id']);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    return $result ?: null;
}

/** Abort with 401 when nobody is signed in. */
function require_login(mysqli $conn): array
{
    $user = current_user($conn);
    if ($user === null) {
        json_response(['ok' => false, 'error' => 'Authentication required.'], 401);
    }
    return $user;
}
