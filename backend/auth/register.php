<?php
/**
 * POST /backend/auth/register.php
 * Body: { name, username, email, password, phone? }
 */

declare(strict_types=1);

session_start();
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/response.php';

require_method('POST');

$data = json_input();

$name     = trim((string)($data['name'] ?? ''));
$username = strtolower(trim((string)($data['username'] ?? '')));
$email    = strtolower(trim((string)($data['email'] ?? '')));
$phone    = trim((string)($data['phone'] ?? ''));
$password = (string)($data['password'] ?? '');

if ($name === '' || $username === '' || $email === '' || $password === '') {
    json_response(['ok' => false, 'error' => 'Please fill in all required fields.'], 422);
}
if (strlen($username) < 3) {
    json_response(['ok' => false, 'error' => 'Username must be at least 3 characters.'], 422);
}
if (strlen($password) < 6) {
    json_response(['ok' => false, 'error' => 'Password must be at least 6 characters.'], 422);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(['ok' => false, 'error' => 'Please enter a valid email address.'], 422);
}

$stmt = $conn->prepare('SELECT id FROM users WHERE user_name = ? OR email = ?');
$stmt->bind_param('ss', $username, $email);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
    $stmt->close();
    json_response(['ok' => false, 'error' => 'That username or email is already registered.'], 409);
}
$stmt->close();

$hash = password_hash($password, PASSWORD_DEFAULT);
$stmt = $conn->prepare(
    'INSERT INTO users (user_name, email, password_hash, name, phone) VALUES (?, ?, ?, ?, ?)'
);
$stmt->bind_param('sssss', $username, $email, $hash, $name, $phone);
$stmt->execute();
$userId = $stmt->insert_id;
$stmt->close();

session_regenerate_id(true);
$_SESSION['user_id'] = $userId;

json_response([
    'ok'   => true,
    'user' => ['id' => $userId, 'username' => $username, 'email' => $email, 'name' => $name, 'phone' => $phone],
], 201);
