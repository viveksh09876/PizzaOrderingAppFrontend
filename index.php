<?php

    require 'vendor/autoload.php';

    require_once('order/Coupon.php');
    require_once('order/Favorite.php');
    require_once('order/Menu.php');
    require_once('order/OnlineOrder.php');
    require_once('order/User.php');
    require_once('order/Util2.php');
    require_once('order/Payment.php');
    require_once('order/Tracker.php');

    $app = new \Slim\Slim();

    $app->get('/test', function () {
	$address = "Hazelbank Terrace,Edinburgh, EH11 1SL, UK";
	$r = Tracker::pushOrder("b3607f90-c136-11e7-8468-0dab0c1879b5", "23", "Abhay", "Jain", "9898989898", "random@email.com", $address, "Margherita pizza Large, Rando Ice cream", "", "apply_key_test");
	echo $r;
    });

    //======================================================================
    // USER PROFILE APIS
    //======================================================================

    /**
     * New User Signup
     */
    $app->post('/Signup', function() use ($app) {
	$data = $app->request->getBody();
	Util2::sendResponse( User::doSignup( json_decode($data, true) ) );
    });


    /**
     * Existing User Login
     */
    $app->post('/Login', function() use ($app) {
	$data = $app->request->getBody();
	Util2::sendResponse( User::doLogin( json_decode($data, true) ) );
    });


    /**
     * Get User Profile
     */ 
    $app->get('/getProfile/:pid', function ($pid) {
	Util2::sendResponse( User::getProfile($pid) );
    });


    /**
     * Update User Profile
     */ 
    $app->post('/updateProfile/:pid', function($pid) use ($app) {
	$data = $app->request->getBody();
	Util2::sendResponse( User::updateProfile( $pid, json_decode($data, true) ) );
    });


    /**
     * Reset Password Request
     */
    $app->post('/resetPasswordReq/', function() use ($app) {
	$data = $app->request->getBody();
	Util2::sendResponse( User::resetPasswordRequest( json_decode($data, true) ) );
    });


    /**
     * Reset Password Confirm
     */
    $app->post('/resetPassword/', function() use ($app) {
	$data = $app->request->getBody();
	Util2::sendResponse( User::resetPassword( json_decode($data, true) ) );
    });
 
    //======================================================================
    // MENU AND ORDER APIS
    //======================================================================


    /**
     * Get store's menu in default format for debugging
     */
    $app->get('/rawmenu/:storeid', function ($storeid) {
	$menu = Menu::PullRawMenu($storeid);
	echo Util2::sendResponse( $menu );
    });


    /**
     * Get store's menu via crontab
     */
    $app->get('/cronmenu/', function () {
	$menu = Menu::PullPOSMenu("Marina");
    	Menu::ParseAndSave($menu);
    });


    /**
     * Get User Order History
     */ 
    $app->get('/orderHistory/:pid', function ($pid) {
	Util2::sendResponse( User::getOrderHistory($pid) );
    });


    /**
     * Get Fresh Menu From POS
     */ 
    $app->get('/menu/:country', function ($country) {
	if ($country == 'UAE')
	{
	    echo Util2::sendResponse( Menu::PullSQLMenu() );
	}
    });


    /**
     * Place Order
     */ 
    $app->post('/placeOrder', function() use ($app) {
	$data = $app->request->getBody();

	$resp = OnlineOrder::placeOrder(json_decode($data, true));
	Util2::sendResponse( $resp );
    });


    /**
     * Check Coupon Discount
     */ 
    $app->post('/checkDiscount', function() use ($app) {
	$data = $app->request->getBody();

	$resp = Coupon::checkDiscount(json_decode($data, true));
	Util2::sendResponse( $resp );
    });

    $app->post('/Pay', function () use ($app) {
/*	$dummy = array( "fname" => "Dummy", "lname" => "Guy", "ccode" => "91",
	"phone" => "99999999", "email" => "a@b.com", "amount" => "10", "userid" => 1, "bill_address" => "xyz",
	"bill_city" => "Dubai", "bill_state" => "Dubai", "bill_postal" => "00000", "bill_country" => "BHR",
	"ship_address" => "abc", "ship_state" => "Dubai", "ship_city" => "Dubai", "ship_postal" => "00000", "ship_country" => "BHR");
*/
	$data = $app->request->getBody();
        Util2::sendResponse( Payment::doPay( json_decode($data, true) ));
    });

    $app->post('/confirmPaytabs', function () use ($app) {
	$data = $app->request->getBody();
	parse_str($data, $newdata);
	$response = Payment::confirmPay( $newdata );

	header('Location: https://nkdpizza.com/#/checkout?payment_reference=' . $response);
    });


    //======================================================================
    // FAVORITES APIS
    //======================================================================
    
    /**
     * Add A Favorite
     */ 
    $app->post('/addFav', function() use ($app) {
	$data = $app->request->getBody();

	$resp = Favorite::addFav(json_decode($data, true));
	Util2::sendResponse( $resp );
    });


    /**
     * Delete A Favorite
     */ 
    $app->post('/delFav', function() use ($app) {
	$data = $app->request->getBody();
	$resp = Favorite::delFav(json_decode($data, true));
	Util2::sendResponse( $resp );
    });


    /**
     * Get Favorite Items of a user
     */ 
    $app->get('/getFavItem/:id', function ($id) {
	Util2::sendResponse( Favorite::getFavItem($id) );
    });


    /**
     * Get Favorite Orders of a user
     */ 
    $app->get('/getFavOrder/:id', function ($id) {
	Util2::sendResponse( Favorite::getFavOrder($id) );
    });


    /**
     * Slim App Run
     */ 
    $app->run();

?>
