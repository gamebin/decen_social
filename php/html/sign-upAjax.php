<?php header('X-UA-Compatible: IE=edge'); ?>
<?php header('X-UA-Compatible: IE=8'); ?>
<?php
header('Content-Type: application/json; charset=UTF-8');
	include "./this_user.php";

	$UserName = kiki_ischar($_POST["UserName"]);
	$passwd =  kiki_ischar(trim($_POST["passwd"]));
	$UserID = kiki_ischar(trim($_POST["UserID"]));		// 아이디
	$email = kiki_ischar(trim($_POST["email"]));

/*$UserID = "hyonu";
$email = "louis@gamebin.co.kr";
$UserName = "장현우";
$passwd =  "dps1011";	*/

if ($passwd <> "") {
	$passwd = hash("sha256",$passwd, true);
	$passwd = base64_encode($passwd);
}

if ($UserID and $UserName and $passwd and $email) {
	$SQL = "Select userSerno from db_user where (userid = '$UserID' or email = '$email') and delFlag = 'N' ";
//echo $SQL;
//exit;
	$result = mysqli_query($kiki_conn, $SQL);
	if( $result === false) {
		 die( print_r( mysqli_connect_error(), true) );
	} else {
		$row = mysqli_fetch_array($result, MYSQLI_ASSOC);
		$chk_UserID = $row["userSerno"];
		mysqli_free_result($result);
	}

if($chk_UserID != NULL) {
	$prog = "false";
	$msg = "이미 등록된 아이디 혹은 이메일 입니다.";
} else {		//'같은 이메일이 없다면
	$UserIP =  $_SERVER["REMOTE_ADDR"];

	$SQL = "INSERT INTO db_user (userid, username ";
	$SQL .= ", email, userpasswd, regYHS, userIp ) ";
	$SQL .= "  values ('$UserID'";
	$SQL .= ", '$UserName'";
	$SQL .= ", '$email'";
	$SQL .= ", '$passwd'";
	$SQL .= ", now() ";
	$SQL .= ", '$UserIP' )" ;
/**/ 	$result = mysqli_query($kiki_conn, $SQL);
	if ( $result === false ) {
	   die( print_r( mysqli_connect_error(), true));
	}
	$prog = "true";
	$msg = "";
//	setcookie("UserID",$UserID,-1,"/",$this_domain);
  }	
} else {   // if ($UserID && $UserName && $passwd) {
			
	$prog = "false";
	$msg = "필수값이 입력되지 않았습니다.";
}	// 같은 ID 있는지 확인  
	mysqli_close($kiki_conn);
echo $_REQUEST["callback"].'({"prog":"'. $prog . '","msg" : "'. $msg .'"})';	?>
