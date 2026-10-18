<?php
/**
 * GET  /backend/auth/profile.php  - return the signed-in user
 * POST /backend/auth/profile.php  - update name, email, phone, address, password
 */

declare(strict_types=1);

session_start();
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/response.php';

require_method('GET', 'POST');

$user = require_login($conn);

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'GET') {
    json_response(['ok' => true, 'user' => $user]);
}

$data    = json_input();
$name    = trim((string)($data['name'] ?? $user['name']));
$email   = strtolower(trim((string)($data['email'] ?? $user['email'])));
$phone   = trim((string)($data['phone'] ?? $user['phone']));
$address = trim((string)($data['address'] ?? $user['address']));

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(['ok' => false, 'error' => 'A valid name and email are required.'], 422);
}

$stmt = $conn->prepare('SELECT id FROM users WHERE email = ? AND id <> ?');
$stmt->bind_param('si', $email, $user['id']);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
    $stmt->close();
    json_response(['ok' => false, 'error' => 'That email is already in use.'], 409);
}
$stmt->close();

$stmt = $conn->prepare('UPDATE users SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?');
$stmt->bind_param('ssssi', $name, $email, $phone, $address, $user['id']);
$stmt->execute();
$stmt->close();

if (!empty($data['password'])) {
    $password = (string)$data['password'];
    if (strlen($password) < 6) {
        json_response(['ok' => false, 'error' => 'New password must be at least 6 characters.'], 422);
    }
    $hash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $conn->prepare('UPDATE users SET password_hash = ? WHERE id = ?');
    $stmt->bind_param('si', $hash, $user['id']);
    $stmt->execute();
    $stmt->close();
}

json_response([
    'ok'   => true,
    'user' => ['id' => $user['id'], 'user_name' => $user['user_name'], 'name' => $name, 'email' => $email, 'phone' => $phone, 'address' => $address],
]);
