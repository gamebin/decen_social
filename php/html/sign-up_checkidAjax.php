<?php header('X-UA-Compatible: IE=edge'); ?>
<?php header('X-UA-Compatible: IE=8'); ?>
<?php
header("Content-Type: text/html; charset=UTF-8");
	include "./this_user.php";	
	$UserID =  kiki_ischar($_POST["UserID"]);
	
if (!$UserID) {
	$prog = "false";
	$msg = "";
} else {
//	$SQL = "Select userSerno from member where userId = '$email' and membStatus != 'O' ";
	$SQL = "Select userserno from db_user where userid = '$UserID' ";
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
	  $msg = "중복된 아이디가 있습니다.";
    } else {		//'같은 이메일이 없다면
	  $prog = "true";
	  $msg = "사용 가능한 아이디 입니다.";
    }	
}
	mysqli_close($kiki_conn);	
echo $_REQUEST["callback"].'({"prog":"'. $prog . '","msg" : "'. $msg .'"})';			?>