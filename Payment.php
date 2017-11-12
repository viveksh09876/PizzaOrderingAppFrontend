<?php 

    class Payment {

	private static $memail = 'edward@nkdpizza.com';
	private static $msecret = 'pwO9eT2eJ3lCsq02jCwdcph42rn4r2NRzC1Ov42f7oRAOSD8uamHzDMC4aHwcuoM6pACuDRC1JcQCQZ70lPzZBb3LTAYnZKupl7T';

	static function doPay ($data) {

	    $postdata =
    	    	array(
        	    'merchant_email' => self::$memail,
        	    'secret_key' => self::$msecret
    	    	);

	    $response = json_decode(self::doCurl('https://www.paytabs.com/apiv2/validate_secret_key', $postdata), true);

	    if ($response["response_code"] == "4000") {
		    $postdata1 =
			array(
			    "merchant_email" => self::$memail,
			    "secret_key" => self::$msecret,
			    "site_url" => "https://nkdpizza.com/",
			    "return_url" => "https://nkdpizza.com/pos/index.php/confirmPaytabs",

			    "title" => $data["fname"] . " " . $data["lname"],
			    "cc_first_name" => $data["fname"],
			    "cc_last_name" => $data["lname"],
			    "cc_phone_number" => $data["ccode"],
			    "phone_number" => $data["phone"],
			    "email" => $data["email"],
			    "products_per_title" => "NKD UAE Order",
			    "unit_price" => $data["amount"],
			    "quantity" => "1",
			    "other_charges" => "0",
			    "amount" => $data["amount"],
			    "discount" => "0",
			    "currency" => "AED",
			    "reference_no" => $data["uuid"],
			    "ip_customer" => "1.2.3.4",
			    "ip_merchant" => "1.2.3.5",
			    "billing_address" => $data["bill_address"],
			    "city" => $data["bill_city"],
			    "state" => $data["bill_state"],
			    "postal_code" => $data["bill_postal"],
			    "country" => $data["bill_country"],
			    "address_shipping" => $data["ship_address"],
			    "state_shipping" => $data["ship_state"],
			    "city_shipping" => $data["ship_city"],
			    "postal_code_shipping"=> $data["ship_postal"],
			    "country_shipping" => $data["ship_country"],
			    "msg_lang" => "English",
			    "cms_with_version" => "None"
			);

		    $response1 = json_decode(self::doCurl('https://www.paytabs.com/apiv2/create_pay_page', $postdata1), true);
		    
		    if ($response1["response_code"] == "4012")
			return array("Status" => "OK", "payment_url" => $response1["payment_url"]);
		    else
			return array("Status" => "Error", "Message" => $response1["result"]);
		}
		else {
		    return array("Status" => "Error", "Message" => "A-" . $response["result"]);
		}
	}


	static function confirmPay ($data) {

	    $postdata =     
                array(      
                    'merchant_email' => self::$memail,
                    'secret_key' => self::$msecret
                );
                            
            $response = json_decode(self::doCurl('https://www.paytabs.com/apiv2/validate_secret_key', $postdata), true);

	    if ($response["response_code"] == "4000") {
	    	$postdata1 =     
                    array(      
                    	'merchant_email' => self::$memail,
                    	'secret_key' => self::$msecret,
		    	'payment_reference' => $data['payment_reference']
                    );

		$response1 = json_decode(self::doCurl('https://www.paytabs.com/apiv2/verify_payment', $postdata1), true);

		if ($response1["response_code"] == "100")
		    return $_POST['payment_reference'];
		else
		    return 0;
	    } else {
		return 0;
	    }
	}

	static function confirmPaytabsRef ($pref) {

	    $postdata =     
                array(      
                    'merchant_email' => self::$memail,
                    'secret_key' => self::$msecret
                );
                            
            $response = json_decode(self::doCurl('https://www.paytabs.com/apiv2/validate_secret_key', $postdata), true);

	    if ($response["response_code"] == "4000") {
	    	$postdata1 =     
                    array(      
                    	'merchant_email' => self::$memail,
                    	'secret_key' => self::$msecret,
		    	'payment_reference' => $pref
                    );

		$response1 = json_decode(self::doCurl('https://www.paytabs.com/apiv2/verify_payment', $postdata1), true);

		if ($response1["response_code"] == "100")
		    return $response1['reference_no'];
		else
		    return 0;
	    } else {
		return 0;
	    }
	}

	private function doCurl ($url, $post_arr) {
	    $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
	    curl_setopt($ch, CURLOPT_POST, 1);
	    curl_setopt($ch, CURLOPT_POSTFIELDS, $post_arr);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

	    return curl_exec ($ch);
    	}

    }

?>
