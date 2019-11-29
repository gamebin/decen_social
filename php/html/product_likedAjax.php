<? header("Content-Type: text/html; charset=UTF-8");
	include "./this_user.php";
	$num = kiki_isnumb($_POST["num"]);	 
//$num = 1;
if(!$num or !$UserID) {	// 기본 값이 등록되지 않았다면
	$prog = "false";
	$msg = "기본 값이 등록되지 않았습니다.";
} else {
	$SQL = "Select likeFlag, likedSerno from product_liked ";
	$SQL .= " where boardSerno = $num ";
	$SQL .= " and userId = '$UserID' ";
//echo $SQL;
	$result = mysqli_query($kiki_conn, $SQL);
	if ( $result === false ) {
		die( print_r( mysqli_connect_error(), true));
		mysqli_close($kiki_conn);
	} else {
	  $row = mysqli_fetch_array($result, MYSQLI_ASSOC);
 	  $likeFlag = $row["likeFlag"];	
 	  $likedSerno = $row["likedSerno"];	
	  mysqli_free_result($result);
	}
	if ($likedSerno) { 	// 기존 자료 있다면
		IF ($likeFlag = "1"){
			$re_flag = "0";
			$css = "fas fa-heart fa-lg";
		} else {
			$re_flag = "1";
			$css = "fas fa-heart fa-lg text-danger";
		}
		$SQL = "UPDATE product_liked SET likeFlag = '$re_flag' ";
		$SQL .= ", LikeDate = now() ";	
		$SQL .= " WHERE likedSerno = $likedSerno ";
		$result = mysqli_query($kiki_conn, $SQL);
		if ( $result === false ) {
		   die( print_r( mysqli_connect_error(), true));
		}
	} else {// 좋아요 등록
		$SQL = "INSERT INTO product_liked (boardSerno ";
		$SQL .= ", userId, LikeDate )";
		$SQL .= "  values ($num ";
		$SQL .= ", '$UserID'";
		$SQL .= ", now() )" ;
		$result = mysqli_query($kiki_conn, $SQL);
		if ( $result === false ) {
		   die( print_r( mysqli_connect_error(), true));
		}
		$css = "fas fa-heart fa-lg text-danger";
	}
	$prog = "true";
	$msg = "";
}
	mysqli_close($kiki_conn);
// 토론 등록 form append
echo $_REQUEST["callback"]."({'prog':'". $prog ."','css' : '". $css ."','msg' : '". $msg ."' })";				?>	