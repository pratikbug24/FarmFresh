<?php 

session_start();

if (isset($_SESSION['id']) && isset($_SESSION['user_name'])) {

 ?>

<!DOCTYPE html>

<html>

<head>

    <title>HOME</title>

    <style>
        body{
            background-color:white;
        }
        </style>

</head>

<body>

     <h1>Hello, <?php echo $_SESSION['name']; ?></h1>

     <a href="logout.php">Logout</a>
     <a href="profile.php">PROFILE</a>

</body>

</html>

<?php 

}else{

     header("Location: index.php");

     exit();

}

 ?>