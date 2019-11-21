<?php	
	include "./this_user.php";
	$reviewSerno = kiki_isnumb($_POST["reviewSerno"]);
	$num = kiki_isnumb($_POST["num"]);

	$SQL = "delete from db_review where ";
	$SQL .= " reviewSerno = '$reviewSerno'" ;
	$result = mysqli_query($kiki_conn, $SQL);
	if ( $result === false ) {
	   die( print_r( mysqli_connect_error(), true));
	}

	$SQL = "UPDATE db_board SET reviewcnt = (select count(reviewSerno) from ";
	$SQL .= " db_review where boardSerno = $num ) where boardSerno = $num ";
	$result = mysqli_query($kiki_conn, $SQL);
	if ( $result === false ) {
	   die( print_r( mysqli_connect_error(), true));
	}
// 리뷰 갯수 
	$SQL = "select count(reviewSerno) as reviewcnt from ";
	$SQL .= " db_review where boardSerno = $num ";
	$result = mysqli_query($kiki_conn, $SQL);
	if( $result === false) {
		 die( print_r( mysqli_connect_error(), true) );
	} else {
		$row = mysqli_fetch_array($result, MYSQLI_ASSOC);
		$reviewcnt = $row["reviewcnt"];
		mysqli_free_result( $result);
	}
	mysqli_close($kiki_conn);

	echo $_REQUEST["callback"].'({"prog":"true","reviewcnt":"'.$reviewcnt.'"})';	?>