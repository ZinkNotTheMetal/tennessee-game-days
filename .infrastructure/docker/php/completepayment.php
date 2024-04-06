<?php

ob_start();


function wlog($text, $array=null) {
	$fd = fopen("log/transaction.log", 'a');
	$out_text = rtrim($text);
	if (is_array($array)) {
		ob_start();
		print_r($array);
		$out_text .= (strlen($out_text)?"\n":"").ob_get_contents();
		ob_end_clean();
	}

	fwrite($fd, date("y-m-d H:i:s")." ".$out_text."\n");
	fclose($fd);
}

session_start();
$txn_data = @array_merge($_SESSION['pp_data'], $_SESSION['pp_ipn_data']);
// echo "txn_data dump:\n";
// print_r($txn_data);
if (!$txn_data) $txn_data = array();
$filtered_txn_data = array();
foreach($txn_data as $k => $v) {
	$filtered_txn_data[$k] = htmlentities($v);
}
$txn_data = $filtered_txn_data;



?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<meta http-equiv="content-type" content="text/html; charset=utf-8" />
<meta name="description" content="Tennessee Game Days is an open gaming convention held annually in Nashville, TN." />
<meta name="keywords" content="Tennessee Game Days" />
<meta name="author" content="Devon Weller" />
<link rel="stylesheet" type="text/css" href="styles.css" media="screen" title="styles (screen)" />
<link rel="stylesheet" type="text/css" href="print.css" media="print" />
<link rel="alternate" type="application/rss+xml" title="TN Game Days Current News and Updates" href="/blog/feed/" />

<title>Tennessee Game Days - Online Registration</title>
</head>

<body>

<?php
if ($_SESSION['pp_data'] AND !$_SESSION['pp_ipn_data']) {

	// header("Location: /completepayment.php");

	echo "<div style='text-align: center; margin-top: 48px;'>Waiting for the PayPal confirmation.  This can take up to a minute.  Please wait...</div>";
    echo <<<EOT
<script>
setTimeout(function() {
    window.location.reload(true);
}, 5000)
</script>
EOT;

	echo "</body></html>\n";
	ob_end_flush();
	flush();

	// sleep(10);
	exit();
}
?>


<div id="container">
<div id="logo">
<h1>
	<div class="logoImg">
		<img src="images/tngamedays-logo-shadow-80.png" width="103" height="80" alt="TN Game Days Logo">
	</div>
	<a href="index.html">Tennessee Game Days</a>
</h1>
</div>

<div id="navitabs">
<h2 class="hide">Site menu:</h2>
<a class="navitab" href="index.html">Home</a><span class="hide"> | </span>
<!--<a class="activenavitab" href="sprregistration.html">Registration</a><span class="hide"> | </span>
<a class="navitab" href="sprvolunteer.html">Volunteers</a><span class="hide"> | </span>
<a class="navitab" href="sprevents.html">Events</a><span class="hide"> | </span>
<a class="navitab" href="sprlibrary.html">Library</a><span class="hide"> | </span>
<a class="navitab" href="sprsponsors.html">Sponsors</a><span class="hide"> | </span>-->
</div>

<div id="empty_desc"><img src="images/spacer.gif" width="1" height="1"/></div>

<div id="main_container">
<div id="main">


	<!-- <div id="sidebar"> -->
	<!-- begin sidebar -->
	<!-- end sidebar -->
	<!-- </div> -->



<!-- Begin Main Content -->
<h3>Tennessee Game Days Spring 2024</h3>

<p>Thank you for your payment. Your transaction has been completed, and a receipt for your purchase has been emailed to you from Paypal. You may log in to your account at <a href="http://www.paypal.com/us">www.paypal.com/us</a> to view details of this transaction.  Your badge will be waiting for you at the registration desk.  You should keep a copy of your Paypal receipt in the unlikely event of a discrepancy.  Thanks and we can't wait to game with you at TGD!</p>

<!-- End Main Content -->

</div>
</div>

<div id="footer">
<a href="mailto:&#x69;&#x6E;&#x66;&#x6F;&#x40;&#x74;&#x6E;&#x67;&#x61;&#x6D;&#x65;&#x64;&#x61;&#x79;&#x73;&#x2E;&#x63;&#x6F;&#x6D;">Email us</a> for more information.<br />

<span class="copyright">
	Copyright &copy; 2007-2024 Tennessee Game Days.<br />
	Tennessee Game Days is an event produced and administered by the Tennessee Game Players Association, Inc.
</span>

</div>

</div>
<script type="text/javascript">
var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
</script>
<script type="text/javascript">
try {
var pageTracker = _gat._getTracker("UA-11779969-1");
pageTracker._trackPageview();

<?php if ($txn_data['txn_id']) {

/*
    [first_name] => Devon
    [last_name] => Weller
    [email] => dweller@devonweller.com
    [phone] => 615-266-0386
    [address] => 7340 Hidden Lake Cir
    [city] => Fairview
    [state] => TN
    [zip] => 37062
    [hotel_reservation] => Yes
    [hotel_reservation_name] => Devon Weller
    [hotel_reservation_date] => Other
    [hotel_reservation_other] => All week long baby!
    [contact_name] => Janet Weller
    [contact_number] => 615.662.6297
    [contact_relationship] => Wife
    [how_heard] => Previous Attender
    [bgg_id] => deweller
    [bgg_avatar] => Yes
    [individual_memberships] => 1
    [family_memberships] => 0
    [family_info] => This is just a test.
    [mc_gross] => 30.00
    [protection_eligibility] => Eligible
    [address_status] => confirmed
    [item_number1] => TNGD10I
    [payer_id] => ZFECZUECYBK9C
    [tax] => 0.00
    [address_street] => 7340 Hidden Lake Cir
    [payment_date] => 09:30:50 Jan 16, 2010 PST
    [payment_status] => Completed
    [charset] => windows-1252
    [address_zip] => 370627226
    [mc_shipping] => 0.00
    [mc_handling] => 0.00
    [mc_fee] => 1.17
    [address_country_code] => US
    [address_name] => Devon Weller
    [notify_version] => 2.8
    [custom] => 2f5ea6f640fa8eb875cebda35e216579
    [payer_status] => verified
    [business] => info@tngamedays.com
    [address_country] => United States
    [num_cart_items] => 1
    [mc_handling1] => 0.00
    [address_city] => Fairview
    [verify_sign] => AIkKNboJiyuxWLOHUlzTd3lpqCSxA-lORXaN4E2e6cn5O4byttE0axKS
    [payer_email] => dweller@devonweller.com
    [mc_shipping1] => 0.00
    [tax1] => 0.00
    [txn_id] => 96752097VN283111H
    [payment_type] => instant
    [address_state] => TN
    [item_name1] => Tennessee Game Days 2010 3 Day Individual Conference Registration
    [receiver_email] => info@tngamedays.com
    [payment_fee] => 1.17
    [quantity1] => 1
    [receiver_id] => B74N8GRNHKEFQ
    [txn_type] => cart
    [mc_gross_1] => 30.00
    [mc_currency] => USD
    [residence_country] => US
    [transaction_subject] => 2f5ea6f640fa8eb875cebda35e216579
    [payment_gross] => 30.00
)
*/
?>

pageTracker._addTrans(
  "<?php echo $txn_data['txn_id']; ?>",                                     // Order ID
  "TNGamEdays",                            // Affiliation
  "<?php echo $txn_data['mc_gross']; ?>",                                    // Total
  "0",                                     // Tax
  "0",                                        // Shipping
  "<?php echo $txn_data['address_city']; ?>",                                 // City
  "<?php echo $txn_data['address_state']; ?>",                               // State
  "<?php echo $txn_data['address_country_code']; ?>"                                       // Country
);


pageTracker._addItem(
  "<?php echo $txn_data['txn_id']; ?>",                                     // Order ID
  "<?php echo $txn_data['item_number1']; ?>",                                     // SKU
  "<?php echo $txn_data['item_name1']; ?>",                                  // Product Name
  "<?php echo $txn_data['item_name1']; ?>",                             // Category
  "<?php echo $txn_data['mc_gross_1']; ?>",                                    // Price
  "<?php echo $txn_data['quantity1']; ?>"                                         // Quantity
);

<?php if ($txn_data['item_number2']) { ?>

	pageTracker._addItem(
	  "<?php echo $txn_data['txn_id']; ?>",                                     // Order ID
	  "<?php echo $txn_data['item_number2']; ?>",                                     // SKU
	  "<?php echo $txn_data['item_name2']; ?>",                                  // Product Name
	  "<?php echo $txn_data['item_name2']; ?>",                             // Category
	  "<?php echo $txn_data['mc_gross_2']; ?>",                                    // Price
	  "<?php echo $txn_data['quantity2']; ?>"                                         // Quantity
	);

<?php } ?>

pageTracker._trackTrans();

<?php } ?>
} catch(err) {}</script>
</body>
</html>