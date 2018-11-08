<?php

$lock = file_get_contents("/Applications/League of Legends.app/Contents/LoL/lockfile");
$auth = explode(':',$lock);
//print_r($auth);

echo $auth[2];
echo $auth[3];
$url = 'https://127.0.0.1/lol-champ-select/v1/pickable-champions';

//$url = 'https://op.lol';


echo $url.'<br />';

$username = 'riot';
$password = $auth[3];
echo  base64_encode('riot:'.$auth[3]).'<br />';
/*
$context = stream_context_create(array(
    'https' => array(
        'header'  => "Authorization: Basic " . base64_encode("$username:$password")
    )
));
//https://127.0.0.1:54156/lol-champ-select/v1/pickable-champions
$response = file_get_contents($url, false, $context);
*/
$ch = curl_init();

$headers = array(
  'Accept: application/json',
  'Authorization: Basic '.base64_encode('riot:'.$auth[3])
);
print_r($headers);
//curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_URL,$url);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_PORT, $auth[2]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
//curl_setopt($ch, CURLOPT_HEADER, true);
//curl_setopt($ch, CURLOPT_USERPWD,"riot:".$auth[3]);
//curl_setopt($ch, CURLOPT_HTTPGET, 1);

$exec = curl_exec($ch);
echo '<br />';
print_r(curl_errno($ch));
echo '<br />';
print_r($exec);
curl_close($ch);
/*
function get_data($url,$logfile) {
  $ch = curl_init();
  curl_setopt($ch,CURLOPT_URL,$url);
  curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
  curl_setopt($ch,CURLOPT_CONNECTTIMEOUT,5);
  curl_setopt($ch,CURLOPT_SSL_VERIFYHOST,0);
  curl_setopt($ch,CURLOPT_SSL_VERIFYPEER, false);
  $data = curl_exec($ch);
  if (curl_errno($ch)) {
    file_put_contents($logfile, date('Y-m-d H:i:s',time()).' Curl Error: ' . curl_error($ch).PHP_EOL, FILE_APPEND);
    $data=false;
  }
  curl_close($ch);
  return $data;
}*/




?><pre><?php
print_r($exec);
?></pre>
<?php echo "DONE";
