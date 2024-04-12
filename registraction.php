<?php
// Include the database connection file
session_start(); 

include "db_conn.php";

// Define variables and initialize with empty values
$user_name = $password = $name = "";
$user_name_err = $password_err = $name_err = "";

// Processing form data when form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Validate user name
    if (empty(trim($_POST["user_name"]))) {
        $user_name_err = "Please enter a username.";
    } else {
        // Prepare a select statement
        $sql = "SELECT id FROM users WHERE user_name = ?";

        if ($stmt = $conn->prepare($sql)) {
            // Bind variables to the prepared statement as parameters
            $stmt->bind_param("s", $param_user_name);

            // Set parameters
            $param_user_name = trim($_POST["user_name"]);

            // Attempt to execute the prepared statement
            if ($stmt->execute()) {
                // Store result
                $stmt->store_result();

                if ($stmt->num_rows == 1) {
                    $user_name_err = "This username is already taken.";
                } else {
                    $user_name = trim($_POST["user_name"]);
                }
            } else {
                echo "Oops! Something went wrong. Please try again later.";
            }

            // Close statement
            $stmt->close();
        }
    }
    
    // Validate password
    if (empty(trim($_POST["password"]))) {
        $password_err = "Please enter a password.";     
    } else {
        $password = trim($_POST["password"]);
    }
    
    // Validate name
    if (empty(trim($_POST["name"]))) {
        $name_err = "Please enter your name.";     
    } else {
        $name = trim($_POST["name"]);
    }
    
    // Check input errors before inserting into database
    if (empty($user_name_err) && empty($password_err) && empty($name_err)) {
        
        // Prepare an insert statement
        $sql = "INSERT INTO users (user_name, password, name) VALUES (?, ?, ?)";

        if ($stmt = $conn->prepare($sql)) {
            // Bind variables to the prepared statement as parameters
            $stmt->bind_param("sss", $param_user_name, $param_password, $param_name);

            // Set parameters
            $param_user_name = $user_name;
            $param_password = $password; // Save the password as is
            $param_name = $name;

            // Attempt to execute the prepared statement
            if ($stmt->execute()) {
                // Redirect to login page
                header("location: login.php");
            } else {
                echo "Oops! Something went wrong. Please try again later.";
            }

            // Close statement
            $stmt->close();
        }
    }
    
    // Close connection
    $conn->close();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registration</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <center>
    <h2>Register</h2>
    <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post">
        <div>
            <label>E-mail Id</label>
            <input type="text" name="user_name" value="<?php echo $user_name; ?>">
            <span><?php echo $user_name_err; ?></span>
        </div>    
        <div>
            <label>Password</label>
            <input type="password" name="password">
            <span><?php echo $password_err; ?></span>
        </div>
        <div>
            <label>Name</label>
            <input type="text" name="name" value="<?php echo $name; ?>">
            <span><?php echo $name_err; ?></span>
        </div>
        <div>
            <input type="submit" value="Submit">
            <input type="reset" value="Reset">
        </div>
        <p>Already have an account? <a href="login.php">Login here</a>.</p>
    </form>
</center>
</body>
</html>
