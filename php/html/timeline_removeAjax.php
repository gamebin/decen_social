<?php	
	include "./this_user.php";
	$Serno = kiki_isnumb($_POST["Serno"]);

// 댓글삭제
	$SQL = "delete from db_review where ";
	$SQL .= " boardSerno = '$Serno'" ;
	$result = mysqli_query($kiki_conn, $SQL);
	if ( $result === false ) {
	   die( print_r( mysqli_connect_error(), true));
	}
// 공유 삭제
	$SQL = "delete from db_shared where ";
	$SQL .= " boardSerno = '$Serno'" ;
	$result = mysqli_query($kiki_conn, $SQL);
	if ( $result === false ) {
	   die( print_r( mysqli_connect_error(), true));
	}
// 좋아요 삭제
	$SQL = "delete from db_liked where ";
	$SQL .= " boardSerno = '$Serno'" ;
	$result = mysqli_query($kiki_conn, $SQL);
	if ( $result === false ) {
	   die( print_r( mysqli_connect_error(), true));
	}
//게시글 삭제
	$SQL = "delete from db_board where ";
	$SQL .= " boardSerno = '$Serno'" ;
	$result = mysqli_query($kiki_conn, $SQL);
	if ( $result === false ) {
	   die( print_r( mysqli_connect_error(), true));
	}
	mysqli_close($kiki_conn);

	echo $_REQUEST["callback"].'({"prog":"true"})';	?>