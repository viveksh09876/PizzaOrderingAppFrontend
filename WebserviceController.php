<?php
App::uses('AppController', 'Controller');
class WebserviceController extends AppController {
    public $uses = array('Category','Language','Slide','SubCategory','Product','ProductModifier','Modifier','Option','SubOption','ModiferOption','ProductIncludedModifier','Store','OptionSuboption','Orderlog');
    public $components=array('Core');

    function beforeFilter(){
        parent::beforeFilter();
        $this->Auth->allow(array('get_categories','getip','get_languages','get_slides','get_sub_categories','get_products','get_modifiers','get_options','get_suboptions','getImagePath','get_all_categories_data','getItemData','placeOrder','getStoreList','getStoresFromPostalCode', 'getStoresFromLatLong','getStoreDetails','login','getTwitterFeeds','getInstagramPost','getCountryStores','saveFavItem','getCitiesSuggestion','getFBFeed','getIGFeed'));
    }

    public function get_categories($count=10){
        $this->layout = FALSE;
        $this->autoRender = FALSE;
		
        $this->paginate = array(
            'conditions' => array(
                'Category.status' => 1
            ),
            'limit' => $count
        );
		
        echo json_encode($this->paginate('Category'));
    }

    function getip(){
        $this->layout = FALSE;
        $this->autoRender = FALSE;
          $ipaddress = '';
        if (getenv('HTTP_CLIENT_IP'))
            $ipaddress = getenv('HTTP_CLIENT_IP');
        else if(getenv('HTTP_X_FORWARDED_FOR'))
            $ipaddress = getenv('HTTP_X_FORWARDED_FOR');
        else if(getenv('HTTP_X_FORWARDED'))
            $ipaddress = getenv('HTTP_X_FORWARDED');
        else if(getenv('HTTP_FORWARDED_FOR'))
            $ipaddress = getenv('HTTP_FORWARDED_FOR');
        else if(getenv('HTTP_FORWARDED'))
           $ipaddress = getenv('HTTP_FORWARDED');
        else if(getenv('REMOTE_ADDR'))
            $ipaddress = getenv('REMOTE_ADDR');
        else
            $ipaddress = 'UNKNOWN';
		
		//$ipaddress = '72.229.28.185';
        $ip_data = @json_decode(file_get_contents("http://www.geoplugin.net/json.gp?ip=".$ipaddress));  
        echo json_encode((array) $ip_data);
    }

     public function get_languages($count=10){
        $this->layout = FALSE;
        $this->autoRender = FALSE;
        $this->paginate = array(
            'conditions' => array(
                'status' => 1
            ),
            'limit' => $count
        );
        echo json_encode($this->paginate('Language'));
    }

    public function get_slides($lang_id = 1){
        $this->layout = FALSE;
        $this->autoRender = FALSE;
		
		$slides = $this->Slide->find('all', array('conditions' => array(
								'lang_id' => $lang_id,
								'status' => 'Active'
					)));
		
		
        echo json_encode($slides); die;
		
    }

    public function get_sub_categories($count=10){
        $this->layout = FALSE;
        $this->autoRender = FALSE;
        $this->paginate = array(
            'conditions' => array(
                'SubCategory.status' => 1
            ),
            'limit' => $count
        );
        echo json_encode($this->paginate('SubCategory'));
    }

    public function get_products($count=10){
        $this->layout = FALSE;
        $this->autoRender = FALSE;
        $this->Product->bindModel(array('hasMany'=>array('ProductModifier')));
        $this->ProductModifier->bindModel(array('belongsTo'=>array('Modifier','Option'=>array('foreignKey' => false,'type'=>'RIGHT','conditions' => array('ProductModifier.default_option_id = Option.id')
                                ))));
        $this->Product->recursive = 2;
        $this->paginate = array(
            'conditions' => array(
                'Product.status' => 1
            ),
            'limit' => $count
        );
        $products = $this->paginate('Product');
        echo json_encode($products);
    }

    public function get_modifiers($id=null,$count=10){
        $this->layout = FALSE;
        $this->autoRender = FALSE;
        
        if(isset($id)){
            $conditions = array(
                'Modifier.status' => 1,
                'Modifier.id' => $id,
            );
        }else{
           $conditions = array(
                'Modifier.status' => 1,
            ); 
        }
        $this->paginate = array(
            'conditions' => $conditions,
            'limit' => $count
        );
        echo json_encode($this->paginate('Modifier'));
    }

    public function get_options($id=null,$count=10){
        $this->layout = FALSE;
        $this->autoRender = FALSE;
        
        if(isset($id)){
            $conditions = array(
                'Option.status' => 1,
                'Option.id' => $id,
            );
        }else{
           $conditions = array(
                'Option.status' => 1,
            ); 
        }
        $this->paginate = array(
            'conditions' => $conditions,
            'limit' => $count
        );
        echo json_encode($this->paginate('Option'));
    }

    public function get_suboptions($id=null,$count=10){
        $this->layout = FALSE;
        $this->autoRender = FALSE;
        
        if(isset($id)){
            $conditions = array(
                'SubOption.status' => 1,
                'SubOption.id' => $id,
            );
        }else{
           $conditions = array(
                'SubOption.status' => 1,
            ); 
        }
        $this->paginate = array(
            'conditions' => $conditions,
            'limit' => $count
        );
        echo json_encode($this->paginate('SubOption'));
    }
	
	
	public function get_all_categories_data($lang_id = 1){
		//Configure::write('debug', 2);
        $this->layout = FALSE;
        $this->autoRender = FALSE;
		$this->Category->recursive = 2;
		
		$this->Category->bindModel(array('hasMany'=>array(
								'Product' => array(
										'conditions' => array('Product.status' => 1, 'Product.lang_id !=' => 0),
										'fields' => array(
														'Product.id', 'Product.lang_id','Product.category_id',
														'Product.sub_category_id', 'Product.short_description', 'Product.plu_code',
														'Product.title', 'Product.price_title', 'Product.slug','Product.price','Product.image',
														'Product.thumb_image','Product.sort_order'
														
												),
										'order' => array('Product.sort_order' => 'asc')		
								)
						)));
						
		$this->Product->bindModel(array('belongsTo' => array(
									'SubCategory' => array(
											'ClassName' => 'SubCategory',
											'foreignKey' => 'sub_category_id',
											'conditions' => array('SubCategory.status' => 1),
											'fields' => array(
													'SubCategory.id','SubCategory.lang_id','SubCategory.store_id','SubCategory.cat_id','SubCategory.name','SubCategory.slug','SubCategory.short_description','SubCategory.sort_order','SubCategory.image','SubCategory.status'
												),
											'order' => array('SubCategory.sort_order' => 'asc')	
									)
								)));
        
		
									
		$data = $this->Category->find('all', array('conditions' => array(
														'Category.status' => 1,
														'Category.lang_id' => $lang_id)
												));
		
		//echo '<pre>'; print_r($data); die;
		$plu_json = file_get_contents('http://35.185.240.172/nkd/index.php/menu/UAE');
		$plu_json = json_decode($plu_json, true);
		$plu_json = $plu_json['item'];
		//echo '<pre>'; print_r($plu_json); die;
		$resp = array();
		$all_categories = $cats = $subCats = array();
		
		if(!empty($data)){
			$i = 0;
			foreach($data as $dat) {
				
				if(!in_array($dat['Category']['name'], $all_categories)) {
					$cats[$i]['id'] = $dat['Category']['id'];
					$cats[$i]['name'] = $dat['Category']['name'];
					$cats[$i]['subCats'] = array();
					$cats[$i]['products'] = array();
					$cats[$i]['subCatsName'] = array();
					$all_categories[] = $dat['Category']['name'];
				}
				
				
				if(!empty($dat['Product'])) {
					$j = 0; $count = array();
					foreach($dat['Product'] as $prod) {
						
						$prod['is_price_mapped'] = 0;
						
						//map price of product using plu code
						if(!empty($plu_json)) {
							foreach($plu_json as $pluData) {
								//echo '<pre>'; print_r($pluData); die;
								foreach($pluData as $pdat) {
									//echo '<pre>'; print_r($pdat); 
									if($dat['Category']['name'] == 'Pizza') {
										
										if($prod['plu_code'] == 999999) {
											$prod['is_price_mapped'] = 1;
											$prod['price'] = $prod['price_title'];	
										}else{
											
											if(is_array($pdat)) {
												foreach($pdat as $pz) {
													if(isset($pz['PLU'])) {
														if($prod['plu_code'] == $pz['PLU']) {
															$prod['is_price_mapped'] = 1;
															$prod['price'] = array(
																'small' => $pz['PriceSm'],
																'medium' => $pz['PriceMed'],
																'large' => $pz['PriceLg']
															);
														}	
													}
												}
											}
											
										}
										//echo '<pre>'; print_r($prod); die;
										
									}else{
										if(isset($pdat['PLU'])) {
											if($prod['plu_code'] == $pdat['PLU']) {
												$prod['is_price_mapped'] = 1;
												$prod['price'] = $pdat['Price']. ' AED';
											}	
										}
									}									
								}								
							}
						}
						
						//echo '<pre>'; print_r($prod); die;
						if(!empty($prod['sub_category_id'])){
							
							if(!in_array($prod['SubCategory']['name'], $cats[$i]['subCatsName'])) {
								$cats[$i]['subCatsName'][] = $prod['SubCategory']['name'];
							}
							
							
							if(!isset($count[$prod['SubCategory']['name']])) {
								$count[$prod['SubCategory']['name']] = 0;
							}
							
							$sName = $prod['SubCategory'];
							unset($prod['SubCategory']);
							unset($prod['created']);
							unset($prod['modified']);
							
							$cats[$i]['subCats'][$sName['name']][$count[$sName['name']]]['name'] = $sName['name'];
							$cats[$i]['subCats'][$sName['name']][$count[$sName['name']]]['products'][] = $prod;
							
							$count[$sName['name']] +=1;
						}else{
							$cats[$i]['products'][] = $prod;
						}
						
						$j++;
					}
				}
				
				$i++;			
			}
		}
			
		
		//die;
		//echo '<pre>'; print_r($cats); die;
        echo json_encode($cats);
    }
	
	
	public function getItemData($slug = '') {
		//Configure::write('debug', 2);
		if($slug != '') {
			
			$this->Product->recursive = 6;
			
			$this->OptionSuboption->bindModel(array(
								'belongsTo' => array(
									'SubOption' => array(
										'className' => 'SubOption',
										'foreignKey' => 'suboption_id'
									)
								)
							));
			
			$this->ModiferOption->bindModel(array(
								'belongsTo' => array(
									'Option' => array(
										'className' => 'Option',
										'foreignKey' => 'option_id',
										'conditions' => array('Option.status' => 1),
										'fields' => array(
												'Option.id','Option.lang_id','Option.store_id','Option.name','Option.plu_code','Option.image','Option.sort_order','Option.dependent_modifier_id','Option.dependent_modifier_option_id','Option.dependent_modifier_count'
											
										),
										'order' => array('Option.sort_order' => 'asc')
									)
								)
							));
			
			$this->Modifier->bindModel(array(
								'hasMany' => array(
									'ModifierOption' => array(
										'className' => 'ModifierOption',
										'foreignKey' => 'modifier_id',
										'fields' => array(
												'ModifierOption.id', 'ModifierOption.modifier_id', 'ModifierOption.option_id'
										)
									)
								)
							));
			
			$this->ProductModifier->bindModel(array(
								'belongsTo' => array(
										'Modifier' => array(
											'className' => 'Modifier',
											'foreignKey' => 'modifier_id',
											'conditions' => array('Modifier.status' => 1),
											'fields' => array(
													'Modifier.id','Modifier.lang_id','Modifier.store_id','Modifier.title','Modifier.image','Modifier.short_description','Modifier.sort_order','Modifier.status'											
											 ),
											 'order' => array('Modifier.sort_order' => 'asc')
										)
								)
							));
			
			$this->ProductIncludedModifier->bindModel(array(
								'belongsTo' => array(
									'ModifierOption' => array(
										'className' => 'ModifierOption',
										'foreignKey' => 'modifier_option_id'
									)
								)							
							));
			
			$this->Product->bindModel(array(
								'hasMany' => array(
											'ProductModifier' => array(
												'className' => 'ProductModifier',
												'foreignKey' => 'product_id',
												'fields' => array(
														'ProductModifier.id','ProductModifier.product_id','ProductModifier.modifier_id','ProductModifier.default_option_id','ProductModifier.store_id','ProductModifier.lang_id','ProductModifier.is_required','ProductModifier.choice','ProductModifier.min_choice','ProductModifier.max_choice','ProductModifier.max_choice'
													),
												'order' => 'ProductModifier.sort_order ASC'	
											),
											'ProductIncludedModifier' => array(
												'className' => 'ProductIncludedModifier',
												'foreignKey' => 'product_id'
											)
										)
							));
			$item = $this->Product->find('first', array(
											'conditions' => array('Product.slug' => $slug),
											'fields' => array(
												'Product.id', 'Product.lang_id','Product.category_id',
												'Product.sub_category_id', 'Product.short_description', 'Product.plu_code', 'Product.title', 'Product.price_title', 'Product.slug','Product.price','Product.image',
												'Product.thumb_image','Product.sort_order'
											)
										));
			
			$plu_json = file_get_contents('http://35.185.240.172/nkd/index.php/menu/UAE');
			$plu_json = json_decode($plu_json, true);
			
			
			if(!empty($item)) {
				
				$item['Product']['price'] = 0;
				
				//map price of product
				foreach($plu_json['item'] as $plu_item) {	
					foreach($plu_item as $pt) {	
						//echo '<pre>'; print_r($pt); die;						
						if($item['Product']['category_id'] == 1) {							
							foreach($pt as $pti) {
								if(isset($pti['PLU']) && ($pti['PLU'] == $item['Product']['plu_code'])) {
									if(isset($pti['Price'])) {
										$item['Product']['price'] = $pti['Price'];
									}else if(isset($pti['PriceSm'])) {
										$item['Product']['price'] = array(
															'small' => $pti['PriceSm'],
															'medium' => $pti['PriceMed'],
															'large' => $pti['PriceLg']	
														);
									}	
								}
							}								
							
						}else{
							if(isset($pt['PLU']) && ($pt['PLU'] == $item['Product']['plu_code'])) {
									$item['Product']['price'] = $pt['Price'];
							}
						}					
					}								
				}  
				
				
				
				$item['Product']['qty'] = 1;	
				
				
				if(!empty($item['ProductIncludedModifier'])) {					
					$i = 0;
					$includedArr = array();					
					foreach($item['ProductIncludedModifier'] as $pim) {						
						if(!empty($pim['ModifierOption'])) {
							$includedArr[$pim['ModifierOption']['modifier_id']]['title'] = $pim['ModifierOption']['Modifier']['title'];
							$includedArr[$pim['ModifierOption']['modifier_id']]['option'][] = $pim['ModifierOption']['Option'];	
							$i++;	
						}						
					}
					
					//map prices of included modifier using plu
					if(!empty($includedArr)) {
						foreach($includedArr as $key => $ia) {
							$i = 0;
							foreach($ia['option'] as $opt) {
								foreach($plu_json['modifier'] as $plu_mod) {
									foreach($plu_mod as $pl_m) {
										if($pl_m['PLU'] == $opt['plu_code']) {
											if(isset($pl_m['Price'])) {
												$price = $pl_m['Price'];
											}else if(isset($pl_m['PriceSm'])){
												$price = array(
													'small' => $pl_m['PriceSm'],
													'medium' => $pl_m['PriceMed'],
													'large' => $pl_m['PriceLg']
												);
											}	
											$includedArr[$key]['option'][$i]['price'] = $price;
											$includedArr[$key]['option'][$i]['send_code'] = '';
											$includedArr[$key]['option'][$i]['add_extra'] = false;
											$includedArr[$key]['option'][$i]['default_checked'] = true;
											$includedArr[$key]['option'][$i]['is_checked'] = true;
											$i++;
										}
									}
								}								
							}						
						}						
					}
					
					$iArr = array();
					if(!empty($includedArr)) {
						$i = 0;
						foreach($includedArr as $arr) {
							$iArr[$i] = $arr;
							$i++;
						}
					}
					
					$item['ProductIncludedModifier'] = $iArr;
				}
				
				//map modifier price				
				if(!empty($item['ProductModifier'])) {	
					$i = 0;
					foreach($item['ProductModifier'] as $pm) {
						$j = 0;
						foreach($pm['Modifier']['ModifierOption'] as $mo) {
							
							$item['ProductModifier'][$i]['Modifier']['ModifierOption'][$j]['Option']['is_checked'] = false;
							
							$item['ProductModifier'][$i]['Modifier']['ModifierOption'][$j]['Option']['default_checked'] = false;
							
							$item['ProductModifier'][$i]['Modifier']['ModifierOption'][$j]['Option']['send_code'] = '';
							
							$item['ProductModifier'][$i]['Modifier']['ModifierOption'][$j]['Option']['add_extra'] = false;
							
							$item['ProductModifier'][$i]['Modifier']['ModifierOption'][$j]['Option']['quantity'] = 1;
							
							$item['ProductModifier'][$i]['Modifier']['ModifierOption'][$j]['Option']['is_included_mod'] = false;
							
							$item['ProductModifier'][$i]['Modifier']['ModifierOption'][$j]['Option']['send_code_permanent'] = false;
							
							//add param if it is included modifier
							if(!empty($item['ProductIncludedModifier'])) {
								foreach($item['ProductIncludedModifier'] as $includedPm) {
									foreach($includedPm['option'] as $ipmOP) {
									
										if($ipmOP['plu_code'] == $mo['Option']['plu_code']) {
											$item['ProductModifier'][$i]['Modifier']['ModifierOption'][$j]['Option']['is_checked'] = true;								
											$item['ProductModifier'][$i]['Modifier']['ModifierOption'][$j]['Option']['default_checked'] = true;								
											$item['ProductModifier'][$i]['Modifier']['ModifierOption'][$j]['Option']['is_included_mod'] = true;
										}
									}
								}
							}
							
							if(!empty($mo['Option']['OptionSuboption'])) {
								$n = 0;
								foreach($mo['Option']['OptionSuboption'] as $sop) {
									if($item['ProductModifier'][$i]['Modifier']['ModifierOption'][$j]['Option']['OptionSuboption'][$n]['SubOption']['name'] == 'Full') {
										$item['ProductModifier'][$i]['Modifier']['ModifierOption'][$j]['Option']['OptionSuboption'][$n]['SubOption']['is_active'] = true;	
									}else{
										$item['ProductModifier'][$i]['Modifier']['ModifierOption'][$j]['Option']['OptionSuboption'][$n]['SubOption']['is_active'] = false;
									}									
									$n++;
								}
							}
							
							if($item['Product']['category_id'] == 1) {
								
								$loopArr = $plu_json['modifier'];
								if($item['Product']['plu_code'] == 999999) {
									$loopArr = $plu_json['item'];	
								}
								
								
								foreach($loopArr as $plu_mod) {
									foreach($plu_mod as $pl_m) {
										if($item['Product']['plu_code'] == 999999) {
											foreach($pl_m as $cyo) {
												if(isset($cyo['PLU'])) {
													if($cyo['PLU'] == $mo['Option']['plu_code']) {
																							
														if(isset($cyo['Price'])) {
															$price = $cyo['Price'];
															$item['ProductModifier'][$i]['Modifier']['ModifierOption'][$j]['Option']['price'] = $price;
														}else if(isset($cyo['PriceSm'])){
															$item['ProductModifier'][$i]['Modifier']['ModifierOption'][$j]['Option']['price'] = array(
																'small' => $cyo['PriceSm'],
																'medium' => $cyo['PriceMed'],
																'large' => $cyo['PriceLg']
															);
														}												
													}
												}
												
											}
											
											//echo '<pre>'; print_r(); die;
											
										}else{	
																											
											if($pl_m['PLU'] == $mo['Option']['plu_code']) {
																							
												if(isset($pl_m['Price'])) {
													$price = $pl_m['Price'];
													$item['ProductModifier'][$i]['Modifier']['ModifierOption'][$j]['Option']['price'] = $price;
												}else if(isset($pl_m['PriceSm'])){
													$item['ProductModifier'][$i]['Modifier']['ModifierOption'][$j]['Option']['price'] = array(
														'small' => $pl_m['PriceSm'],
														'medium' => $pl_m['PriceMed'],
														'large' => $pl_m['PriceLg']
													);
												}	
												
												//$mo['price'] = $pl_m['Price'];
											}
										}
									}
								}	
								
								
								//loop to get values of crust for pizza other than cyo
								foreach($plu_json['item'] as $plu_mod) {
									foreach($plu_mod as $pl_m) {
																								
										foreach($pl_m as $cyo) {											
											if(isset($cyo['PLU'])) {
												if($cyo['PLU'] == $mo['Option']['plu_code']) {
												
													if(isset($cyo['Price'])) {
														$price = $cyo['Price'];
														$item['ProductModifier'][$i]['Modifier']['ModifierOption'][$j]['Option']['price'] = $price;
													}else if(isset($cyo['PriceSm'])){
														$item['ProductModifier'][$i]['Modifier']['ModifierOption'][$j]['Option']['price'] = array(
															'small' => $cyo['PriceSm'],
															'medium' => $cyo['PriceMed'],
															'large' => $cyo['PriceLg']
														);
													}												
												}	
											}	
											
										}
										
									}
								}
							}
										
							
							foreach($plu_json['modifier'] as $plu_mod) {
								foreach($plu_mod as $pl_m) {
																			
										if($pl_m['PLU'] == $mo['Option']['plu_code']) {
										
											if(isset($pl_m['Price'])) {
												$price = $pl_m['Price'];
											}else if(isset($pl_m['PriceSm'])){
												$price = array(
													'small' => $pl_m['PriceSm'],
													'medium' => $pl_m['PriceMed'],
													'large' => $pl_m['PriceLg']
												);
											}	
											$item['ProductModifier'][$i]['Modifier']['ModifierOption'][$j]['Option']['price'] = $price;
											$item['ProductModifier'][$i]['Modifier']['ModifierOption'][$j]['Option']['is_topping'] = true;
											//$mo['price'] = $pl_m['Price'];
										}	
								}
							}
							$j++;			
						}
						$i++;	
					}
				}				
			}
			
			$item['ProductIncludedModifier'] = array();
			//unset($item['ProductIncludedModifier']);
			
			//echo '<pre>'; print_r($item); die;
			echo json_encode($item); die;
		}
	}
    
	
	public function placeOrder() {
		
		$data = $this->request->input ( 'json_decode', true) ;
		if(!empty($data)) {
			
			$arr = array();
			
			if(!empty($data['order_details'])) {
				$i = 0;
				$pArr = array();
				foreach($data['order_details'] as $ord) {
					
					if($ord['category_id'] == 1) {						
						$crustArr = array();
						$modArr = array();						
						if(isset($ord['modifier']) && !empty($ord['modifier'])) {
							foreach($ord['modifier'] as $mod) {
								if($mod['plu'] == 'I100' || $mod['plu'] == 'I101' || $mod['plu'] == '91') {
									$crustArr['plu'] = $mod['plu'];	
									$crustArr['quantity'] = $ord['quantity'];	
								}else{
									unset($mod['send_code']);
									unset($mod['quantity']);
									unset($mod['is_checked']);
									$modArr[] = $mod;
								}
							}
						}
						
						$prod = array(
							'add_extra' => false,
							'choice' => "Full",
							'modifier_type' => 'modifier',
							'plu' => $ord['plu'],
							'type' => '1'
						);	
						array_push($modArr, $prod);
						
						$crustArr['modifiers'] = $modArr;
						$data['order_details'][$i] = $crustArr;
						
					}else{
						if(isset($ord['modifier']) && !empty($ord['modifier'])) {
							foreach($ord['modifier'] as $mod) {
								$arr[$mod['choice']][] = $mod;
							}
							
							$data['order_details'][$i]['modifier'] = $arr;
						}						
					}	
					unset($data['order_details'][$i]['category_id']);
					$i++;					
				}
				
			}
			
			//echo json_encode($data); die;
			
			//echo '<pre>'; print_r($arr); die;
			//echo '<pre>'; print_r($data); die;
			
			$url = 'http://35.185.240.172/nkd/index.php/placeOrder';
			$content = json_encode($data); 
			$curl = curl_init($url);
			curl_setopt($curl, CURLOPT_HEADER, false);
			curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
			curl_setopt($curl, CURLOPT_HTTPHEADER,
					array("Content-type: application/json"));
			curl_setopt($curl, CURLOPT_POST, true);
			curl_setopt($curl, CURLOPT_POSTFIELDS, $content);
			curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false); //curl error SSL certificate problem, verify that the CA cert is OK
			 
			$result     = curl_exec($curl);
			//$response   = json_decode($result);
			$response = array( 'response' =>  $result, 'message' => 'success');
			curl_close($curl);
			echo json_encode($response); die;
			
			
		}
		
		die;
	}

	
	public function getStoreList($city) {
		Configure::write('debug', 2);
		if(!empty($city)) {
			
			$city = explode(',', $city);
			$city = $city[0];
			
			$stores = $this->Store->find('all', array(							
								'conditions' => array(
									'OR' => array(
										'LOWER(Store.city)' => $city,
										'LOWER(Store.state)' => $city
									),
									'Store.status' => 1	
								),
								'fields' => array(
									'Store.id', 'Store.store_name', 'Store.store_address', 'Store.store_ip_address', 'Store.store_image', 'Store.store_phone', 'Store.store_email', 'Store.city', 'Store.state', 'Store.country', 'Store.zip', 'Store.latitude', 'Store.longitude', 'Store.delivery_radius'
								),
								'order' => array('Store.store_name' => 'asc')
							));
			
			$already = array();	
			$allStores = array();
			
			if(!empty($stores)) {
				foreach($stores as $st) {
					if(!in_array($st['Store']['store_name'], $already)) {
						$allStores[] = $st;
						$already[] = $st['Store']['store_name'];
					}
				}
			}				
			
				
			echo json_encode($allStores); die;
			
		}	
		
	}
	
	
	public function getStoresFromPostalCode($code) {
		
		if($code != '') {
			
			$url = 'http://maps.googleapis.com/maps/api/geocode/json?address='.$code;
			
			$curl = curl_init($url);
			curl_setopt($curl, CURLOPT_HEADER, false);
			curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
			curl_setopt($curl, CURLOPT_HTTPHEADER,
					array("Content-type: application/json"));
			
			
			curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false); //curl error SSL certificate problem, verify that the CA cert is OK
			 
			$result     = curl_exec($curl);
			$response   = json_decode($result, true);
			//echo '<pre>'; print_r($result); die;
			$stores = array();
			$allStores = array();
			
			if($response['status'] == 'OK') {
				
				$city = strtolower($response['results'][0]['address_components'][1]['long_name']);
				
				$stores = $this->Store->find('all', array(							
								'conditions' => array(
									'OR' => array(
										'LOWER(Store.city)' => $city,
										'LOWER(Store.state)' => $city
									),
									'Store.status' => 1	
								),
								'fields' => array(
									'Store.id', 'Store.store_name', 'Store.store_address', 'Store.store_ip_address', 'Store.store_image', 'Store.store_phone', 'Store.store_email', 'Store.city', 'Store.state', 'Store.country', 'Store.zip', 'Store.latitude', 'Store.longitude', 'Store.delivery_radius'
								),
								'order' => array('Store.store_name' => 'asc')
							));
			
				$already = array();	
				
				
				if(!empty($stores)) {
					foreach($stores as $st) {
						if(!in_array($st['Store']['store_name'], $already)) {
							$allStores[] = $st;
							$already[] = $st['Store']['store_name'];
						}
					}
				}
							
				
			}
			echo json_encode($allStores); die;
			//echo '<pre>'; print_r($response); die;
		}
		
	}
	
	
	public function getStoresFromLatLong($lat, $long) {
		
		if($lat != '' && $long != '') {
			
			$url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng='.$lat.','.$long.'&sensor=true';
			
			$curl = curl_init($url);
			curl_setopt($curl, CURLOPT_HEADER, false);
			curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
			curl_setopt($curl, CURLOPT_HTTPHEADER,
					array("Content-type: application/json"));
			
			
			curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false); //curl error SSL certificate problem, verify that the CA cert is OK
			 
			$result     = curl_exec($curl);
			$response   = json_decode($result, true);
			//echo '<pre>'; print_r($response); die;
			
			$postalCode = '';
			$city = '';
			
			$return = array(
						'cityVal' => '',
						'postalCode' => '',
						'stores' => array()	
					);
			
			if($response['status'] == 'OK') {
				
				foreach($response['results'] as $res) {
					foreach($res['address_components'] as $comp) {
						if(isset($comp['types'])){						
							foreach($comp['types'] as $typ) {
								if($typ == 'locality') {
									$city = $comp['long_name'];									
								}else if($typ == 'postal_code') {
									$postalCode = $comp['long_name'];
								}
							}						
						}
					}					
				}
				
				//$city = strtolower($response['results'][0]['address_components'][1]['long_name']);
				
				$stores = $this->Store->find('all', array(							
								'conditions' => array(
									'OR' => array(
										'LOWER(Store.city)' => $city,
										'LOWER(Store.state)' => $city
									),
									'Store.status' => 1	
								),
								'fields' => array(
									'Store.id', 'Store.store_name', 'Store.store_address', 'Store.store_ip_address', 'Store.store_image', 'Store.store_phone', 'Store.store_email', 'Store.city', 'Store.state', 'Store.country', 'Store.zip', 'Store.latitude', 'Store.longitude', 'Store.delivery_radius'
								),
								'order' => array('Store.store_name' => 'asc')
							));
			
				$already = array();	
				$allStores = array();
				
				if(!empty($stores)) {
					foreach($stores as $st) {
						if(!in_array($st['Store']['store_name'], $already)) {
							$allStores[] = $st;
							$already[] = $st['Store']['store_name'];
						}
					}
				}
							
				
				$return = array(
								'cityVal' => $city,
								'postalCode' => $postalCode,
								'stores' => $allStores	
						);
				
			}
			echo json_encode($return); die;
			//echo '<pre>'; print_r($response); die;
			
			
		}
		
	}
	
	
	public function getStoreDetails($storeId) {
		
		$store = $this->Store->findById($storeId);
		echo json_encode($store); die;
	}
	
	
	public function login() {
		$data = $this->request->input ( 'json_decode', true) ;
		
		if(!empty($data)) {
			
			$url = 'http://35.185.240.172/nkd/index.php/Login';
			$content = json_encode($data); 
			$curl = curl_init($url);
			curl_setopt($curl, CURLOPT_HEADER, false);
			curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
			curl_setopt($curl, CURLOPT_HTTPHEADER,
					array("Content-type: application/json"));
			curl_setopt($curl, CURLOPT_POST, true);
			curl_setopt($curl, CURLOPT_POSTFIELDS, $content);
			curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false); //curl error SSL certificate problem, verify that the CA cert is OK
			 
			$result     = curl_exec($curl);
			curl_close($curl);
			$response   = json_decode($result, true);
			//echo '<pre>'; print_r($response); die;
			//$response = array( 'response' =>  $result);
			
			if($response['Status'] == 'OK') {
				$resp = array(
			
						'id' => $response['Id'],
						'FirstName' => $response['FirstName'],
						'LastName' => $response['LastName'],
						'Status' => $response['Status']
					);	
			}else{
				$resp = array('Status' => $response['Status']);	
			}
			
			echo json_encode($resp); die;
			
			
		}
		
		die;
	}
	
	
	public function getTwitterFeeds($name) {
		
		$token = '2513266519-YuLXSe7MykmRA5eoNgSfBb4dDRTQpBIlpjrxsgm';
		$token_secret = 'aca8AD9fpIF0yEvaltPzlEoeTwmT1WHvKfDlbxf3QyNUe';
		$consumer_key = '7HN4TNXa4jykiu8oDzM78OkYP';
		$consumer_secret = 'FhcuBzYCFO2IoIZl9i7xxHCCYyvEXvH6nZyJZtcJfDRI7LXHmV';

		$host = 'api.twitter.com';
		$method = 'GET';
		$path = '/1.1/statuses/user_timeline.json'; // api call path

		$query = array( // query parameters
			'screen_name' => $name,
			'count' => '5'
		);

		$oauth = array(
			'oauth_consumer_key' => $consumer_key,
			'oauth_token' => $token,
			'oauth_nonce' => (string)mt_rand(), // a stronger nonce is recommended
			'oauth_timestamp' => time(),
			'oauth_signature_method' => 'HMAC-SHA1',
			'oauth_version' => '1.0'
		);

		$oauth = array_map("rawurlencode", $oauth); // must be encoded before sorting
		$query = array_map("rawurlencode", $query);

		$arr = array_merge($oauth, $query); // combine the values THEN sort

		asort($arr); // secondary sort (value)
		ksort($arr); // primary sort (key)

		// http_build_query automatically encodes, but our parameters
		// are already encoded, and must be by this point, so we undo
		// the encoding step
		$querystring = urldecode(http_build_query($arr, '', '&'));

		$url = "https://$host$path";

		// mash everything together for the text to hash
		$base_string = $method."&".rawurlencode($url)."&".rawurlencode($querystring);

		// same with the key
		$key = rawurlencode($consumer_secret)."&".rawurlencode($token_secret);

		// generate the hash
		$signature = rawurlencode(base64_encode(hash_hmac('sha1', $base_string, $key, true)));

		// this time we're using a normal GET query, and we're only encoding the query params
		// (without the oauth params)
		$url .= "?".http_build_query($query);
		$url=str_replace("&amp;","&",$url); //Patch by @Frewuill

		$oauth['oauth_signature'] = $signature; // don't want to abandon all that work!
		ksort($oauth); // probably not necessary, but twitter's demo does it

		// also not necessary, but twitter's demo does this too
		function add_quotes($str) { return '"'.$str.'"'; }
		$oauth = array_map("add_quotes", $oauth);

		// this is the full value of the Authorization line
		$auth = "OAuth " . urldecode(http_build_query($oauth, '', ', '));

		// if you're doing post, you need to skip the GET building above
		// and instead supply query parameters to CURLOPT_POSTFIELDS
		$options = array( CURLOPT_HTTPHEADER => array("Authorization: $auth"),
						  //CURLOPT_POSTFIELDS => $postfields,
						  CURLOPT_HEADER => false,
						  CURLOPT_URL => $url,
						  CURLOPT_RETURNTRANSFER => true,
						  CURLOPT_SSL_VERIFYPEER => false);

		// do our business
		$feed = curl_init();
		curl_setopt_array($feed, $options);
		$json = curl_exec($feed);
		curl_close($feed);

		$twitter_data = json_decode($json, true);
		
		$alltweets = array();
		$i = 0;
		
		if(!empty($twitter_data)) {
			foreach($twitter_data as $tw) {
				$alltweets[$i] = $tw['text'];
				$i++;
			}
		}
		
		echo json_encode($alltweets); die;
		//echo '<pre>'; print_r($twitter_data); die;
		
	}
	
	public function getInstagramPost() {
		
		 $url = "https://api.instagram.com/v1/users/4840586777/media/recent/?access_token=4840586777.ca0f88f.7727fb8e3cab4780ac3ac391240e636f";	
			
		  $ch = curl_init();
		  curl_setopt($ch, CURLOPT_URL, $url);
		  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		  curl_setopt($ch, CURLOPT_TIMEOUT, 20);
		  $result = curl_exec($ch);
		  curl_close($ch); 
		  //return $result;
		  

		 
		  //$result = json_decode($result);
		  
		  echo '<pre>'; print_r($result); die;
		  //foreach ($result->data as $post) {
			// Do something with this data.
		  //}
		
	}
	
	
	public function getCountryStores($country) {		
		if(!empty($country)) {
			$country = strtolower($country);
			$stores = $this->Store->find('all', array(
							'conditions' => array(
								'LOWER(Store.country)' => $country
							)
					));	
					
			echo json_encode($stores); die;		
					
		}		
	}
	
	
	public function saveFavItem() {
		$data = $this->request->input ( 'json_decode', true) ;
		if(!empty($data)) {
			//echo '<pre>'; print_r(json_encode($data)); die;
			$url = 'http://35.185.240.172/nkd/index.php/addFav';
			$content = json_encode($data); 
			$curl = curl_init($url);
			curl_setopt($curl, CURLOPT_HEADER, false);
			curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
			curl_setopt($curl, CURLOPT_HTTPHEADER,
					array("Content-type: application/json"));
			curl_setopt($curl, CURLOPT_POST, true);
			curl_setopt($curl, CURLOPT_POSTFIELDS, $content);
			curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false); //curl error SSL certificate problem, verify that the CA cert is OK
			 
			$result     = curl_exec($curl);
			//echo '<pre>'; print_r($result); die;
			$response   = json_decode($result);
			//$response = array( 'response' =>  $response, 'message' => 'success');
			
			curl_close($curl);
			echo json_encode($response); die;
			
		}
		
		die;
	}
	
	
	public function getCitiesSuggestion($searchKey, $countryCode = null) {
		
		$result = array();
		
		if(!empty($searchKey)) {
			$url = "http://gd.geobytes.com/AutoCompleteCity?filter=".$countryCode."&q=".$searchKey;
			
			$curl = curl_init($url);
			curl_setopt($curl, CURLOPT_HEADER, false);
			curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
			curl_setopt($curl, CURLOPT_HTTPHEADER,
					array("Content-type: application/json"));
			
			
			curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false); //curl error SSL certificate problem, verify that the CA cert is OK
			 
			$result     = curl_exec($curl);
			
		}
			
		echo $result; die;
		
	}
	
	function getFBFeed ($page='nkdpizza'){
	    $result = array();

	    $graph_url = 'https://graph.facebook.com/'. $page .'/feed?access_token=1413958752014988|u7WaXrdFfFiFO9mX09mxdqC1NcU';
	    $fb_feed = json_decode(file_get_contents($graph_url), true);


	    foreach($fb_feed["data"] as $f)
	    {
		    $id_arr = explode("_", $f["id"]);

		    $feed = array(
			                "message" => $f["message"],
			                "image" => 'https://graph.facebook.com/' . $id_arr[1] . '/picture'
	                    );

		    array_push($result, $feed);
	    }

	    echo json_encode($result);
	    die;
	}
	
	function getIGFeed($page='nkdpizza'){
	    $result = array();

	    $graph_url = 'https://www.instagram.com/' . $page . '/media/';
	    $ig_feed = json_decode(file_get_contents($graph_url), true);

	    foreach($ig_feed["items"] as $i)
	    {
		    $feed = array(
			                "message" => $i["caption"]["text"],
			                "image" => $i["images"]["standard_resolution"]["url"]
			            );

		    array_push($result, $feed);
	    }

	    echo json_encode($result);
	    die;
	}

	/* Send catering info to email */

 function sendCateringInfo(){
  $data = $this->request->input ( 'json_decode', true) ;
  if(!empty($data)) {
   $username = $data['username'];
   $email = $data['email'];
   $tel = $data['tel'];
   $location = $data['location'];
   $date = $data['date'];
   $noofuser = $data['noofuser'];
   $social = $data['social'];

   /*-template asssignment if any*/
                $template = $this->EmailTemplate->find('first',array(
                        'conditions' => array(
                            'template_key'=> 'catering_notification',
                            'template_status' =>'Active'
                        )
                    )
                );

                if($template){  
                    $arrFind=array('{name}','{email}','{phone}','{location}','{event_date}','{no_of_person}','{special_instruction}');
                    $arrReplace=array($username,$email,$tel,$location,$date,$noofuser,$social);
                    
                    $from=$template['EmailTemplate']['from_email'];
                    $subject=$template['EmailTemplate']['email_subject'];
                    $content=str_replace($arrFind, $arrReplace,$template['EmailTemplate']['email_body']);
                }

                $this->set('Content',$content);   

                try{
                    $this->Email->from=$from;
                    $this->Email->to=SUPPORT_EMAIL;
                    $this->Email->subject=$subject;
                    $this->Email->sendAs='html';
                    $this->Email->template='general';
                    $this->Email->delivery = 'smtp';
                    if($this->Email->send()){
      echo json_encode(array('show'=>true, 'isSuccess'=>true, 'message'=>'Thank You ! email sent successfully will contact you soon.'));
     }

                }catch(Exception $e){
                    echo json_encode(array('show'=>true, 'isSuccess'=>false, 'message'=>'Sorry ! mail not send, please try again.'));
                }
                /*-[end]template asssignment*/ 
  }
  die;
 }
}
