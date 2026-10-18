<?php
/**
 * POST /backend/auth/login.php
 * Body: { username, password }
 */

declare(strict_types=1);

session_start();
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/response.php';

require_method('POST');

$data     = json_input();
$username = strtolower(trim((string)($data['username'] ?? '')));
$password = (string)($data['password'] ?? '');

if ($username === '' || $password === '') {
    json_response(['ok' => false, 'error' => 'Please enter your username and password.'], 422);
}

$stmt = $conn->prepare('SELECT id, user_name, email, name, phone, password_hash FROM users WHERE user_name = ?');
$stmt->bind_param('s', $username);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$user || !password_verify($password, $user['password_hash'])) {
    json_response(['ok' => false, 'error' => 'Incorrect username or password.'], 401);
}

session_regenerate_id(true);
$_SESSION['user_id'] = (int)$user['id'];

unset($user['password_hash']);
json_response(['ok' => true, 'user' => $user]);
