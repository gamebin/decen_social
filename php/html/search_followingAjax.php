<?php	
	include "./this_user.php";

	$userid = kiki_ischar($_POST["userid"]) ;
	$UserIP =  $_SERVER["REMOTE_ADDR"];

	$SQL = "INSERT INTO db_friends (userId";
	$SQL .= ", friendId, regYHS, userIp )";
	$SQL .= "  values ( '$UserID'";
	$SQL .= ", '$userid' ";
	$SQL .= ", now() ";
	$SQL .= ", '$UserIP' )" ;
	$result = mysqli_query($kiki_conn, $SQL);
	if ( $result === false ) {
	   die( print_r( mysqli_connect_error(), true));
	}

	$SQL = "UPDATE db_user SET following = (select count(friendSerno) from ";
	$SQL .= " db_friends where userid = '$UserID' ) where userid = '$UserID' ";
	$result = mysqli_query($kiki_conn, $SQL);
	if ( $result === false ) {
	   die( print_r( mysqli_connect_error(), true));
	}
	mysqli_close($kiki_conn);

	echo $_REQUEST["callback"].'({"prog":"true","reviewcnt":"'.$reviewcnt.'"})';		?>