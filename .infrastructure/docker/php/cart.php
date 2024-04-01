<?php

/*
2022 cart - Fall - RAK Edits
2023 cart - Fall - RRR Edits
*/

// live mode
$PAYPAL_ADDRESS = 'www.paypal.com';
$PAYPAL_EMAIL = 'info@tngamedays.com';

session_set_cookie_params(0, '/', '.tngamedays.com');
session_start();

$hash_key = ".asgo%a31";

$all_fields = array(
    'first_name',
    'last_name',
    'email',
    // 'phone',
    // 'address',
    // 'city',
    // 'state',
    'zip',
    'phone',

    // 'hotel_reservation',
    // 'hotel_reservation_nights',
    // 'hotel_reservation_confirmation_number',

    // 'thursday_gaming',

    'contact_name',
    'contact_number',
    'contact_relationship',
    // 'how_heard',

    'free_memberships',
    'individual_memberships',
    'couple_memberships',
    'family_memberships',
    'family_info',
);

$PRICING = [
    'individual' => 40,
    'couple' => 70,
    'family' => 100,
];

// free memberships are disabled
// $END_FREE_MEMBERSHIP_DATE = strtotime('01/15/2019 23:59:59');
// $free_membership_allowed = (time() <= $END_FREE_MEMBERSHIP_DATE);

$free_membership_allowed = false;

$errors = array();
if ($_POST) {

    $entered = true;
    foreach ($all_fields as $var_name) {
        $posted_val = $_POST[$var_name];
        switch ($var_name) {
            case 'first_name':
                if (!strlen($posted_val)) $errors[] = "Please enter your first name.";
                $pp_data[$var_name] = $posted_val;
                break;
            case 'last_name':
                if (!strlen($posted_val)) $errors[] = "Please enter your last name.";
                $pp_data[$var_name] = $posted_val;
                break;
            case 'email':
                if (!strlen($posted_val)) $errors[] = "Please enter your email address.";
                else if (!valid_email($posted_val)) $errors[] = "This email address was not valid.  Please enter a valid email address.";
                $pp_data[$var_name] = $posted_val;
                break;
            case 'phone':
                if (!strlen($posted_val)) $errors[] = "Please enter your contact phone number.";
                $pp_data[$var_name] = $posted_val;
                break;
            case 'zip':
                if (!strlen($posted_val)) $errors[] = "Please enter your zip code.";
                $pp_data[$var_name] = $posted_val;
                break;
            case 'family_info':
                $pp_data[$var_name] = trim($posted_val);
                break;
            case 'hotel_reservation_nights':
                if ($pp_data['hotel_reservation'] == 'Yes') {
                    $pp_data[$var_name] = $posted_val;
                    if (!strlen($posted_val)) $errors[] = "Please enter the number of hotel reservation nights.";
                } else {
                    $pp_data[$var_name] = '';
                }
                break;

            case 'free_memberships':
                if ($free_membership_allowed) {
                    $pp_data[$var_name] = $posted_val;
                } else {
                    $pp_data[$var_name] = 0;
                    // $errors[] = "The complimentary membership offer has expired.";
                }
                break;


            default:
                if (in_array($var_name, $all_fields)) {
                    $pp_data[$var_name] = $posted_val;
                }
                break;
        }
    }

    // check family membership info
    $family_membership_exists = (
        ($pp_data['family_memberships'] > 0 or $pp_data['couple_memberships'] > 0 or $pp_data['individual_memberships'] > 1)
        or ($pp_data['hotel_reservation_nights'] > 1 and $free_membership_allowed)
    );
    $family_info_data = [];
    for ($i = 0; $i < 20; $i++) {
        $fn_exists = (isset($_POST['family_first_name_' . $i]) and strlen($_POST['family_first_name_' . $i]));
        $ln_exists = (isset($_POST['family_last_name_' . $i]) and strlen($_POST['family_last_name_' . $i]));
        $email_exists = (isset($_POST['family_email_' . $i]) and strlen($_POST['family_email_' . $i]));
        if ($fn_exists or $ln_exists or $email_exists) {
            if (!$family_membership_exists) {
                unset($_POST['family_first_name_' . $i]);
                unset($_POST['family_last_name_' . $i]);
                unset($_POST['family_email_' . $i]);
                continue;
            }
            if (!$fn_exists) {
                $errors[] = "Please enter a first name for additional family member #" . ($i + 1) . ".";
            }
            if (!$ln_exists) {
                $errors[] = "Please enter a last name for additional family member #" . ($i + 1) . ".";
            }

            $family_info_data[] = [
                'first_name' => ($_POST['family_first_name_' . $i]),
                'last_name'  => ($_POST['family_last_name_' . $i]),
                'email'      => $email_exists ? ($_POST['family_email_' . $i]) : '',
            ];
        }
    }
    $pp_data['family_info_data'] = json_encode($family_info_data);

    if (!$errors) {
        $_SESSION['pp_data'] = $pp_data;
        $total = number_format(
            intval(max($pp_data['individual_memberships'], 0)) * $PRICING['individual'] +
                intval(max($pp_data['couple_memberships'], 0))  * $PRICING['couple'] +
                intval(max($pp_data['family_memberships'], 0))  * $PRICING['family'],
            2
        );
        $_SESSION['pp_data_hash'] = sha1($hash_key . $total);
        if ($total <= 0 and $pp_data['free_memberships'] <= 0) {
            $errors[] = "No membership was chosen.  Please choose the number of individual, couple or family memberships to purchase.";
        }
    }
}


function valid_email($email)
{
    return !!filter_var($email, FILTER_VALIDATE_EMAIL);
}

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
    <style type="text/css">
        #regForm label {
            font-weight: bold;
        }

        #regForm label.inline {
            font-weight: normal;
            color: #555;
        }

        #regForm div.field_group {
            margin-top: 12px;
            margin-bottom: 8px;
            /*  border-bottom: 1px dotted #ccc;
*/
        }

        #regForm .validationError {
            font-weight: bold;
            color: #900;
            background-color: yellow;
            padding: 2px;
        }

        #verify label {
            font-weight: bold;
        }

        #verify {
            line-height: 1.5em;
        }

        div#verify {
            margin-bottom: 16px;
        }

        .hidden {
            display: none;
        }
    </style>

    <script type="text/javascript" src="js/jquery-3.1.1.min.js"></script>

    <?php /* <script type="text/javascript" src="js/jquery.validate-1.15.0.js"></script> */ ?>


    <script type="text/javascript">
        jQuery(function($) {
            // console.log('ready...');

            // $.validator.addMethod("regQuantity", function(value) {
            //  return ($('#individual_memberships').val() > 0 || $('#family_memberships').val() > 0 || $('#free_memberships').val() > 0);
            // }, 'Please choose the number of memberships to purchase.');

            // $.validator.addMethod("reservation", function(value) {
            //  var radio_val = $("input[name='hotel_reservation']:checked").val();
            //  return (radio_val == 'No' || value.length > 0);
            // }, 'Please enter the name used for the hotel reservation.');


            // $("#regForm").validate({
            //  rules: {
            //      first_name: "required",
            //      last_name: "required",
            //      email: {
            //          required: true,
            //          email: true
            //      },
            //      zip: "required",
            //      phone: "required",

            //      individual_memberships: "regQuantity",
            //      family_memberships: "regQuantity",

            //      hotel_reservation_name: "reservation"

            //  },
            //  messages: {
            //      first_name: "Please enter your first name",
            //      last_name: "Please enter your last name",
            //      email: "Please enter a valid email address",
            //      zip: "Please enter your zip code",
            //      phone: "Please enter your phone number"
            //  },

            //  errorClass: "validationError"
            // });


            $("input[name='hotel_reservation']").on('change', function(e) {
                updateMembershipStatus();
                updateFamilyMembershipStatus();
            });
            $("#family_memberships").on('change', function(e) {
                updateFamilyMembershipStatus();
            });
            $("#individual_memberships").on('change', function(e) {
                updateFamilyMembershipStatus();
            });
            $("#couple_memberships").on('change', function(e) {
                updateFamilyMembershipStatus();
            });
            $("#hotel_reservation_nights").on('change', function(e) {
                updateFamilyMembershipStatus();
            });

            function updateMembershipStatus() {
                var val = $("input[name='hotel_reservation']:checked").val();
                var showFreeMembership = true;

                if (val == 'Yes') {
                    $('.reservationLength').show();
                    $('.reservationConfNumber').show();


                    showFreeMembership = freeRegistrationOptionAvailable();

                    if (showFreeMembership) {
                        $('.familyMembership').hide();
                        $('.individualMembership').hide();
                    }

                } else if (val == 'No') {
                    $('.reservationLength').hide();
                    $('.reservationConfNumber').hide();

                    $('.familyMembership').show();
                    $('.individualMembership').show();

                    showFreeMembership = false;

                }

                if (showFreeMembership) {
                    $('.freeMembership').show();
                    $('.freeMembershipInput').val('1');
                    $('.individual_memberships').val('0');
                    $('.couple_memberships').val('0');
                    $('.family_memberships').val('0');
                } else {
                    $('.freeMembershipInput').val('0');
                    $('.freeMembership').hide();
                }
            };

            function updateFamilyMembershipStatus(init) {
                init = !!init;
                var numberOfFamilyMemberships = $("#family_memberships").val();
                var numberOfIndividualMemberships = $("#individual_memberships").val();
                var numberOfCoupleMemberships = $("#couple_memberships").val();
                var numberOfHotelNights = $("#hotel_reservation_nights").val();
                var isHotelReservation = $("input[name=hotel_reservation]:checked").val() == 'Yes';
                if (numberOfFamilyMemberships > 0 || numberOfIndividualMemberships > 1 || numberOfCoupleMemberships > 0 || (isHotelReservation && numberOfHotelNights > 1 && freeRegistrationOptionAvailable())) {
                    $('#family_registration_info').show();

                    var desiredInputs = 1;
                    if (numberOfFamilyMemberships > 0) {
                        desiredInputs = 2;
                    } else if (numberOfCoupleMemberships > 0) {
                        desiredInputs = numberOfCoupleMemberships * 2 - 1;
                    } else if (numberOfIndividualMemberships > 1) {
                        desiredInputs = numberOfIndividualMemberships - 1;
                    }

                    for (var i = 0; i < desiredInputs; i++) {
                        addFamilyRow();
                    }

                    var actualInputs = 0;
                    $("#family_registration_info tr").slice(1).each(function() {
                        ++actualInputs;
                        if (actualInputs > desiredInputs) {
                            if ($('input.family_first_name', this).val().length < 1) {
                                $(this).remove();
                            }
                        }
                    });

                } else {
                    $('#family_registration_info').hide();
                }

                if (init) {
                    $("#family_registration_info tr").slice(1).each(function() {
                        // console.log('family_first_name val:', $('input.family_first_name', this).val());
                        if ($('input.family_first_name', this).val().length < 1) {
                            $(this).remove();
                        }
                    });
                }

            }

            var lastFamilyRowOffset = 1;

            function addFamilyRow() {
                var offset = ++lastFamilyRowOffset;
                var newRow = $('<tr>' +
                    '<td>' +
                    '<input class="family_first_name" type="text" name="family_first_name_' + offset + '" placeholder="First Name" />' +
                    '</td>' +
                    '<td>' +
                    '<input type="text" name="family_last_name_' + offset + '" placeholder="Last Name" />' +
                    '</td>' +
                    '<td>' +
                    '<input size="50" type="email" name="family_email_' + offset + '" placeholder="Email (Optional)" />' +
                    '</td>' +
                    '</tr>'
                );

                $('#family_membership_table').append(newRow);

            }

            function freeRegistrationOptionAvailable() {
                return <?php echo ($free_membership_allowed ? 'true' : 'false'); ?>;
            };

            updateMembershipStatus();

            $(window).ready(function() {
                setTimeout(function() {
                    updateFamilyMembershipStatus(true);
                }, 150);
            })


            $('a.add-family-row').on('click', function(e) {
                e.preventDefault();
                addFamilyRow();
                // console.log('add row');
            });

            $("#submitButton").attr("disabled", "disabled");
            var waiver = $("#waiver");
            waiver.click(function() {
                if ($(this).is(":checked")) {
                    $("#submitButton").removeAttr("disabled");
                } else {
                    $("#submitButton").attr("disabled", "disabled");
                }
            });

            $("#regForm").submit(function(e) {
                if (!$('#waiver:checked').length) {
                    alert("Please agree to the waiver requirement before continuing.");
                    return false;
                }
                return true;
            });
        });
    </script>


    <title>Tennessee Game Days - Online Registration</title>
</head>

<body>
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
            <a class="navitab" href="sprindex.html">Home</a><span class="hide"> | </span>
            <a class="activenavitab" href="sprregistration.html">Registration</a><span class="hide"> | </span>
            <!--<a class="navitab" hrg="sprvolunteer.html">Volunteers</a><span class="hide"> | </span>
            <a class="navitab" href="sprsponsors.html">Sponsors</a><span class="hide"> | </span>
            <a class="navitab" href="falldetails.html">Weekend Details</a><span class="hide"> | --></span>
        </div>

        <div id="empty_desc"><img src="images/spacer.gif" width="1" height="1" /></div>

        <div id="main_container">
            <div id="main">


                <!-- <div id="sidebar"> -->
                <!-- begin sidebar -->
                <!-- end sidebar -->
                <!-- </div> -->



                <!-- Begin Main Content -->
                <h3>Tennessee Game Days 2024 Spring Weekend Registration</h3>

            
                <p>
                    Please fill out all fields completely below. For those returning attendees, we will do our best to accurately identify your number of past events attended -- using the same email address to register, if possible, helps us to do this.</p>


                <?php if (!$_POST) { ?>

                    <form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post" accept-charset="utf-8" id="regForm">

                        <div class="field_group">
                            <label>Name</label><br />
                            <label class="inline" for="first_name">First *</label>
                            <input required type="text" name="first_name" value="" id="first_name">

                            <label class="inline" for="last_name">Last *</label>
                            <input required type="text" name="last_name" value="" id="last_name">
                        </div>

                        <div class="field_group">
                            <label for="email">Email Address *</label><br />
                            <label class="inline" for="email">Email</label> <input required type="text" name="email" value="" id="email"><br />
                        </div>


                        <div class="field_group">
                            <label for="zip">Zip Code *</label><br />
                            <label class="inline" for="zip">Zip</label> <input required type="text" name="zip" value="" id="zip">
                            <br />
                        </div>

                        <div class="field_group">
                            <label for="phone">Contact Phone Number *</label><br />
                            <label class="inline" for="phone">Phone</label> <input required type="text" name="phone" value="" id="phone">
                        </div>

                   
                        <!-- <h4>Hotel Information</h4>
                        <div class="field_group">
                            <label for="hotel_reservation">Will you be renting a room at the Cool Springs Marriott?</label><br />
                            <div>The block room rate is $164/night + fees/taxes. <a href="https://www.marriott.com/events/start.mi?id=1694446978268&key=GRP" target="_blank">separately reserved and paid directly to the hotel</a>. Reservations can be canceled up to three days before event. You need to both complete this form AND register with the hotel.<br /> 
							<b>IF YOU ARE STAYING AT THE HOST HOTEL BUT BOOKED ANOTHER WAY (POINTS, CORPORATE DISCOUNT, ETC.) PLEASE EMAIL US AND LET US KNOW!</b> Having an accurate account of all attendees staying at the hotel helps ensure the continued success of TGD.</div><br />
							
                            <input type="radio" value="Yes" name="hotel_reservation"> Yes
                            <input type="radio" value="No" name="hotel_reservation" checked="checked"> No<br />
                        </div>


                        <div class="field_group reservationLength">
                            <label for="hotel_reservation_nights">How many nights will you be staying?</label><br />
                            <select name="hotel_reservation_nights" id="hotel_reservation_nights" size="1">
                                <option value="0" selected="selected">0</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                            <div>(Our group rate is valid for check in as early as Thursday, Feb 28 through check out as late as Monday, March 4, 2024.)</div>
                        </div> -->

                        <!-- <div class="field_group reservationConfNumber">
        <label for="hotel_reservation_confirmation_number">If yes, please specify the the hotel reservation confirmation number</label> <br />
        <label class="inline" for="hotel_reservation_confirmation_number">Confirmation Number</label> <input type="text" name="hotel_reservation_confirmation_number" value="" id="hotel_reservation_confirmation_number">
        </div> -->



                    
                        <div class="field_group">
                            <label>Emergency Contact for the weekend</label><br />

                            <label class="inline" for="contact_name">Name</label>
                            <input type="text" name="contact_name" value="" id="contact_name">

                            <label class="inline" for="zip">Number</label>
                            <input type="text" name="contact_number" value="" id="contact_number">

                            <label class="inline" for="contact_relationship">Relationship</label>
                            <input type="text" name="contact_relationship" value="" id="contact_relationship">
                        </div>




                        <h4>Memberships to Purchase</h4>

                        <?php if ($free_membership_allowed) : ?>
                            <div class="field_group freeMembership hidden">
                                <input type="hidden" name="free_memberships" id="free_memberships" class="freeMembershipInput" value="0" />
                                <label for="free_memberships">Special Discount: Complimentary Membership with Confirmed Hotel Room Rental. If you are staying two or more nights, you qualify for a second guest / family membership, please provide information on any additional attendees below. </label><br />
                                <label class="inline">@ $0.00.</label><br />
                                <br />
                            </div>
                        <?php else : ?>
                            <input type="hidden" name="free_memberships" id="free_memberships" class="freeMembershipInput" value="0" />
                        <?php endif ?>

                        <div class="field_group individualMembership">
                            <label for="individual_memberships">Individual Memberships to Purchase</label><br />
                            <select name="individual_memberships" id="individual_memberships" size="1">
                                <option value="0" selected="selected">0</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                            </select> <label class="inline">@ $<?php echo number_format($PRICING['individual'], 2); ?> / ea.</label>
                            <br />
                        </div>

                        <div class="field_group coupleMembership">
                            <label for="couple_memberships">Couple Memberships to Purchase</label><br />
                            <select name="couple_memberships" id="couple_memberships" size="1">
                                <option value="0" selected="selected">0</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select> <label class="inline">@ $<?php echo number_format($PRICING['couple'], 2); ?> / ea.</label>
                            <br />
                        </div>

                        <div class="field_group familyMembership">
                            <label for="family_memberships">Family Memberships to Purchase</label><br />
                            <select name="family_memberships" id="family_memberships" size="1">
                                <option value="0" selected="selected">0</option>
                                <option value="1">1</option>
                            </select> <label class="inline">@ $<?php echo number_format($PRICING['family'], 2); ?> / ea.</label>
                        </div>

                        <div class="field_group" id="family_registration_info">
                            <label for="family_info">Additional Registration Information</label><br />
                            <span>
                                If purchasing a family membership, a couples membership, or multiple individual memberships, please provide the <strong>OTHER</strong> member's names (first and last for the badge) and optional email address.<br>
                                <br>
                                <i><font color = "blue"> You do NOT need to repeat your name.</i><br></font>
                            </span><br />

                            <table id="family_membership_table">
                                <tr class="header_row">
                                    <th style="text-align: left;">First Name</th>
                                    <th style="text-align: left;">Last Name</th>
                                    <th style="text-align: left;">Email</th>
                                </tr>
                                <?php
                                for ($i = 0; $i < 20; $i++) {
                                    echo <<<EOT
                <tr>
                    <td>
                        <input class="family_first_name" type="text" name="family_first_name_$i" placeholder="First Name" />
                    </td>
                    <td>
                        <input type="text" name="family_last_name_$i" placeholder="Last Name" />
                    </td>
                    <td>
                        <input size="50" type="email" name="family_email_$i" placeholder="Email (Optional)" />
                    </td>
                </tr>
EOT;
                                }
                                ?>
                            </table>
                            <div><a class="add-family-row" style="font-size: 0.70rem;" href="#add-row">[+] Add Another Row</a></div>
                        </div>
                        <br>
                        <br>
                        <p><input type="checkbox" id="waiver" name="waiver">
                            <label for="waiver">In order to attend TGD, I acknowledge that TGD is a mass gathering event and, as such, there is an elevated risk of contracting COVID-19 during the event. I assume all risks of such an infection and agree to hold harmless Tennessee Game Players Association, Inc., its officers, organizers and volunteers in the event that any member of my party that I am registering contracts COVID-19 at this event.</label>
                        <div>&nbsp;</div>
                        <p><input id="submitButton" type="submit" value="Continue &rarr;"></p>
                    </form>

                <?php } else if ($errors) { ?>
                    <p>There were errors. Please go <a href="javascript:history.go(-1)">back</a> and try again.</p>
                    <p class="errors"><?php echo join("<br/>", $errors); ?></p>
                <?php } else {
                    /* post successful */
                ?>

                    <h4>Your Registration is almost complete</h4>
                    <div>Please review the following information and click the continue button below to complete your registration.<br />
                        <br />

                    </div>


                    <div id="verify">
                        <label>Name: </label><?php echo $pp_data['first_name'] . " " . $pp_data['last_name']; ?><br />
                        <label>Email Address: </label><?php echo $pp_data['email']; ?><br />
                        <label>Zip Code: </label><?php echo $pp_data['zip']; ?><br />

                        <label>Contact Phone Number: </label><?php echo $pp_data['phone']; ?><br />
                        <label>Emergency Contact: </label><?php echo strlen($pp_data['contact_name']) ? ($pp_data['contact_name'] . ", " . $pp_data['contact_number'] . ", " . $pp_data['contact_relationship']) : 'none'; ?><br />
                        <!--<label>Hotel Reservation: </label><?php
                                                            echo ($pp_data['hotel_reservation'] == 'Yes')
                                                                ?   "Yes.  Staying for " . $pp_data['hotel_reservation_nights'] . " night(s) with confirmation number " . $pp_data['hotel_reservation_confirmation_number']
                                                                : 'No Hotel Reservation'; 
                                                            ?><br /> -->


                        <?php if ($pp_data['free_memberships'] > 0) { ?>
                            <label>Membership: </label>Complimentary membership with hotel confirmed registration<br />
                            <label>Total: </label>$0.00<br />
                        <?php } else { ?>
                            <label>Number of Individual Memberships to Purchase: </label><?php echo $pp_data['individual_memberships']; ?><br />
                            <!-- <label>Number of Couple Memberships to Purchase: </label><?php echo $pp_data['couple_memberships']; ?><br />
<label>Number of Family Memberships to Purchase: </label><?php echo $pp_data['family_memberships']; ?><br /> -->
                            <label>Total: </label>$<?php echo $total; ?><br />
                        <?php } ?>

                        <?php if (($pp_data['family_memberships'] > 0 or $pp_data['couple_memberships'] > 0 or $pp_data['individual_memberships'] > 1) or ($pp_data['hotel_reservation_nights'] > 1 and $free_membership_allowed)) { ?>
                            <label>Additional Registration Information: </label><br />
                            <?php
                            $any_found = false;
                            foreach (json_decode($pp_data['family_info_data'], 1) as $offset => $family_info) {
                                echo "Additional Member #" . ($offset + 1) . ": " . $family_info['first_name'] . " " . $family_info['last_name'] . (strlen($family_info['email']) ? " (" . $family_info['email'] . ")" : "") . "<br/>\n";
                                $any_found = true;
                            }
                            if (!$any_found) {
                                echo "none";
                            }
                            ?>
                        <?php } ?>

                    </div>

                    <?php if ($pp_data['free_memberships'] > 0) { ?>
                        <!-- LOCAL FORM -->
                        <form action="complete-free-registration.php" method="post" accept-charset="utf-8" id="regForm">
                            <input type="hidden" name="pp_data" value="<?php echo base64_encode(serialize($pp_data)); ?>">
                            <input type="hidden" name="pp_data_hash" value="<?php echo sha1(base64_encode(serialize($pp_data)) . $hash_key); ?>">
                            <input type="submit" name="Sumbit" value="Confirm Registration">
                            <p><span style="color: #900; font-weight: bold">Please note:</span> We will not receive the registration information provided on this form until you continue and complete the process by submitting this form.</p>
                        </form>

                    <?php } else { ?>
                        <!-- PAYPAL FORM -->

                        <form target="_self" action="https://<?php echo $PAYPAL_ADDRESS; ?>/cgi-bin/webscr" method="post">
                            <input type="hidden" name="cmd" value="_cart">
                            <input type="hidden" name="upload" value="1">
                            <input type="hidden" name="business" value="<?php echo $PAYPAL_EMAIL; ?>">

                            <?php if ($pp_data['individual_memberships'] > 0) {
                                $price = number_format($PRICING['individual'], 2);
                                echo <<<EOT
    <input type="hidden" name="item_name_1" value="Tennessee Game Days 2024 3 Day Individual Conference Registration">
    <input type="hidden" name="item_number_1" value="TNGD24I">
    <input type="hidden" name="amount_1" value="$price">
    <input type="hidden" name="quantity_1" value="{$pp_data['individual_memberships']}">
EOT;
                            }
                            ?>

                            <?php if ($pp_data['couple_memberships'] > 0) {
                                $price = number_format($PRICING['couple'], 2);
                                // item number 1 or 2
                                $item_no = ($pp_data['individual_memberships'] > 0 ? 2 : 1);
                                echo <<<EOT
    <input type="hidden" name="item_name_{$item_no}" value="Tennessee Game Days 2024 3 Day Couple Conference Registration">
    <input type="hidden" name="item_number_{$item_no}" value="TNGD24C">
    <input type="hidden" name="amount_{$item_no}" value="$price">
    <input type="hidden" name="quantity_{$item_no}" value="{$pp_data['couple_memberships']}">
EOT;
                            }
                            ?>

                            <?php if ($pp_data['family_memberships'] > 0) {
                                $price = number_format($PRICING['family'], 2);
                                // item number 1, 2 or 3
                                $item_no = ($pp_data['individual_memberships'] > 0 ? 2 : 1);
                                $item_no += ($pp_data['couple_memberships'] > 0 ? 1 : 0);
                                echo <<<EOT
    <input type="hidden" name="item_name_{$item_no}" value="Tennessee Game Days 2024 3 Day Family Conference Registration">
    <input type="hidden" name="item_number_{$item_no}" value="TNGD24F">
    <input type="hidden" name="amount_{$item_no}" value="$price">
    <input type="hidden" name="quantity_{$item_no}" value="{$pp_data['family_memberships']}">
EOT;
                            }
                            ?>

                            <input type="hidden" name="custom" value="<?php echo session_id(); ?>">

                            <?php
                            /*
    <input type="hidden" name="cancel_return" value="http://tngamedays.com/completepayment.php">
    <input type="hidden" name="return" value="http://tngamedays.com/completepayment.php">
*/
                            ?>
                            <input type="submit" name="PayPal" value="Continue and Pay with Paypal">
                            <p><span style="color: #900; font-weight: bold">Please note:</span> We will not receive the registration information provided on this form until you continue and complete the payment process using Paypal.</p>
                        </form>
                    <?php } ?>


                <?php } ?>



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
        } catch (err) {}
    </script>
</body>

</html>