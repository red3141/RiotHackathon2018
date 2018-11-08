<?php
$lock = file_get_contents("/Applications/League of Legends.app/Contents/LoL/lockfile");
$auth = explode(':',$lock);
exec('curl -X GET --header "Accept: application/json" --header "Authorization: Basic '.base64_encode('riot:'.$auth[3]).'" "https://127.0.0.1:'.$auth[2].'/lol-champ-select/v1/session" -k',$output);
$data = json_decode(implode('',$output));

?>
<pre><?php
echo json_encode($data,JSON_PRETTY_PRINT);
?>
</pre>
