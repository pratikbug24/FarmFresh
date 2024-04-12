<?php
// Start session
session_start();

// Check if user is logged in
if (!isset($_SESSION["user_name"])) {
    header("Location: login.php");
    exit;
}

// Include the database connection file

include "db_conn.php";

// Fetch user information from the database
$user_name = $_SESSION["user_name"];
$sql = "SELECT name, email, language, domain_of_interest FROM users WHERE user_name = ?";
if ($stmt = $conn->prepare($sql)) {
    // Bind variables to the prepared statement as parameters
    $stmt->bind_param("s", $user_name);

    // Attempt to execute the prepared statement
    if ($stmt->execute()) {
        // Store result
        $stmt->store_result();

        // Bind result variables
        $stmt->bind_result($name, $email, $language, $domain_of_interest);

        // Fetch values
        $stmt->fetch();
    } else {
        echo "Oops! Something went wrong. Please try again later.";
    }

    // Close statement
    $stmt->close();
}

// Close connection
$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Profile</title>
</head>
<body>
    <h2>Welcome, <?php echo $_SESSION['name'];?>!</h2>
    <p>Your username: <?php echo $_SESSION['user_name']; ?></p>
    <p>Email: <?php echo $_SESSION['name'];?></p>
    <p><a href="logout.php">Logout</a></p>
</body>
</html>
