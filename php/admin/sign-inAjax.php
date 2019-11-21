<?php header('X-UA-Compatible: IE=edge'); ?>
<?php header('X-UA-Compatible: IE=8'); ?>
<?php
header('Content-Type: application/json; charset=UTF-8');
//header('charset=UTF-8');

	include "./this_user.php";
$UserID = kiki_ischar($_POST["UserID"]);	//UserID
$UserID = strtolower($UserID);
$passwd = kiki_ischar($_POST["passwd"]);	//passwd

if ($passwd <> "") {
	$passwd = hash("sha256",$passwd, true);
	$passwd = base64_encode($passwd);
}

if ($UserID <> "" and $passwd <> "" ) {
	$SQL = "select userid, userpasswd from db_user ";
	$SQL .= " where userid = '$UserID' and gubun = '9' and delFlag = 'N'";
	$result = mysqli_query($kiki_conn, $SQL);
	if( $result === false) {
		 die( print_r( mysqli_connect_error(), true) );
		 $prog = "false";
		$msg = "오류 입니다. ";
	} else {
		$row = mysqli_fetch_array($result, MYSQLI_ASSOC);
		$now_UserId = $row["userid"];
		$now_userpasswd = $row["userpasswd"];
		mysqli_free_result($result);

		if($UserID <> trim($now_UserId)) {
			$prog = "false";
			$msg = "입력하신 아이디가 존재하지 않습니다.아이디를 확인해 주세요. ";
		} elseif ($passwd <> trim($now_userpasswd)) {
			$prog = "false";
			$msg = "비밀번호가 틀립니다. 비밀번호를 확인해 주세요. ";
		} else {
			$prog = "true";
			$msg = "";
			setcookie("UserID",$UserID,-1,"/",$this_domain);
		} //if (userpasswd <> trim($userpasswd)) {
	}		// if ( $result === false ) {
}		// if ($UserID <> "" and $userpasswd <> "" ) {
		mysqli_close ($kiki_conn);
//		echo "true";
   
echo $_REQUEST["callback"].'({"prog":"'. $prog . '","msg" : "'. $msg .'"})';		?>