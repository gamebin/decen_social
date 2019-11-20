<?php
//header('Content-Type: application/json; charset=UTF-8');
header('charset=UTF-8');
	include "./this_user.php";

	$UserName = kiki_ischar($_POST["UserName"]);
	$passwd =  kiki_ischar(trim($_POST["passwd"]));
	$summary = kiki_ischar(trim($_POST["summary"]));

/*$UserID = "aaaa";
//$email = "louis@gamebin.co.kr";
$UserName = "장현우";
$passwd =  "1111";	*/

if ($passwd <> "") {
	$passwd = hash("sha256",$passwd, true);
	$passwd = base64_encode($passwd);
}

if ($UserID and $UserName) {
	$SQL = "UPDATE db_user SET  ";
	$SQL .= " UserName = '$UserName'";
  if ($passwd) {
	$SQL .= ", userpasswd = '$passwd'";
  }
	$SQL .= ", summary = '$summary'";
	$SQL .= " WHERE userid = '$UserID'";
//echo $SQL;
	$result = mysqli_query($kiki_conn, $SQL);
	if ( $result === false ) {
	   die( print_r( mysqli_connect_error(), true));
	}
	$prog = "true";
	$msg = "";
} else {   // if ($UserID && $UserName && $passwd) {
	$prog = "false";
	$msg = "필수값이 입력되지 않았습니다.";
}	// 같은 ID 있는지 확인  
	mysqli_close($kiki_conn);
echo $_REQUEST["callback"].'({"prog":"'. $prog . '","msg" : "'. $msg .'"})';	?>
