<?php header('X-UA-Compatible: IE=edge'); ?>
<?php header('X-UA-Compatible: IE=8'); ?>
<?php
header('Content-Type: application/json; charset=UTF-8');
//header('charset=UTF-8');

	include "./this_user.php";
$email = kiki_ischar($_POST["email"]);	//UserID
$email = strtolower($email);

if ($email <> "" ) {
	$SQL = "select userid from db_user ";
	$SQL .= " where email = '$email' and delFlag = 'N'";
	$result = mysqli_query($kiki_conn, $SQL);
	if( $result === false) {
		 die( print_r( mysqli_connect_error(), true) );
		 $prog = "false";
		$msg = "오류 입니다. ";
	} else {
		$row = mysqli_fetch_array($result, MYSQLI_ASSOC);
		$now_UserId = $row["userid"];
		mysqli_free_result($result);

		if (!$now_UserId) {  // 자료가 없다면
			$prog = "false";
			$msg = "입력하신 이메일과 일치한 정보가 없습니다.";
		} else {
			$prog = "true";
			$msg = "회원님의 아이디는 [".$now_UserId."] 입니다. ";
		} //if (userpasswd <> trim($userpasswd)) {
	}		// if ( $result === false ) {
}		// if ($UserID <> "" and $userpasswd <> "" ) {
		mysqli_close ($kiki_conn);
//		echo "true";
   
echo $_REQUEST["callback"].'({"prog":"'. $prog . '","msg" : "'. $msg .'","userid" : "'. $now_UserId .'"})';		?>