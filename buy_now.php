<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Farm Fresh Foods</title>
        <link rel="stylesheet" href="styles.css">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    </head>
<body>
</head>
<body>
    <header>
<div class="a">
<div>
<h1 class="b">FREASH FOOD</h1>
</div>
<div>
<ul>
<li><button><a href="home.php">HOME</a></li></button>
<li><button><a href="about.php">ABOUT</a></li></button>
<li><button><a href="contect.php">CONTACT US</a></li></button>
</ul>
</div>
</div>
</header>
    <main>
        <section id="payment">
            <h2>Payment Information</h2>
            <form id="payment-form">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required><br><br>

                
                
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required><br><br>
                
                <label for="card-number">Card Number:</label>
                <input type="text" id="card-number" name="card-number" pattern="[0-9]{13,16}" required><br><br>
                
                <label for="expiration-date">Expiration Date:</label>
                <input type="text" id="expiration-date" name="expiration-date" placeholder="MM/YY" pattern="(0[1-9]|1[0-2])\/?([0-9]{2})" required><br><br>
                
                <label for="cvv">CVV:</label>
                <input type="text" id="cvv" name="cvv" pattern="[0-9]{3,4}" required><br><br>
                
                <button type="submit">Submit Payment</button>
            </form>
        </section>
    </main>

    <footer>
        <p>&copy; 2024 Farm Fresh Foods. All rights reserved.</p>
    </footer>
</body>
</html>
