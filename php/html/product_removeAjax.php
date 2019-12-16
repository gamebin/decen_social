<?php	
	include "./this_user.php";
	include "./file_library.php";
	$Serno = kiki_isnumb($_POST["Serno"]);

// 댓글삭제
	$SQL = "delete from product_review where ";
	$SQL .= " boardSerno = '$Serno'" ;
	$result = mysqli_query($kiki_conn, $SQL);
	if ( $result === false ) {
	   die( print_r( mysqli_connect_error(), true));
	}
// 좋아요 삭제
	$SQL = "delete from product_liked where ";
	$SQL .= " boardSerno = '$Serno'" ;
	$result = mysqli_query($kiki_conn, $SQL);
	if ( $result === false ) {
	   die( print_r( mysqli_connect_error(), true));
	}

// 첨부파일 삭제
	$SQL = "Select imageurl from db_product where boardSerno = '$Serno' ";
	$result = mysqli_query($kiki_conn, $SQL);
	if ( $result === false ) {
		die( print_r( mysqli_connect_error(), true));
		mysqli_close($kiki_conn);
	} else {
	  $row = mysqli_fetch_array($result, MYSQLI_ASSOC);
	  $filename1 = $row["imageurl"];
	  mysqli_free_result($result);
	}

	if($filename1 != NULL) {
	  del_file($filename1,'product');
	}

//게시글 삭제
	$SQL = "delete from db_product where ";
	$SQL .= " boardSerno = '$Serno'" ;
	$result = mysqli_query($kiki_conn, $SQL);
	if ( $result === false ) {
	   die( print_r( mysqli_connect_error(), true));
	}
	mysqli_close($kiki_conn);

	echo $_REQUEST["callback"].'({"prog":"true"})';	?>
