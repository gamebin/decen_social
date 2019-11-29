<?	include "./this_user.php";

	$cur_page = kiki_isnumb($_POST["cur_page"]) ;
	if (!$cur_page) {
		$cur_page = 1;
	}
	$board = "product_review";
	$pagesize = 5;

	$wheStr = "a.boardSerno = '$no'";
	$SQL = "Select count(reviewSerno) as totcnt from $board a";
	$SQL .= " inner join db_user b ON a.userid = b.userid where $wheStr  ";
	$result = mysqli_query($kiki_conn, $SQL);
	if( $result === false) {
		 die( print_r( mysqli_connect_error(), true) );
	} else {
		$row = mysqli_fetch_array($result, MYSQLI_ASSOC);
		$totcnt = $row["totcnt"];
		$totpage = ceil((($totcnt / $pagesize) * -1) * -1);
		mysqli_free_result( $result);
	}

	if (!$totcnt) {
		$totpage=1;
	}
	if ($totpage < $cur_page) {
		$cur_page = $totpage;
	}
	if($totcnt == 0) {
$result_stmt .= "<div class='w-100 text-center text-muted py-5'> 자료가 없습니다. </div> ";
	}  Else {
		$start = ($cur_page-1) * $pagesize;
		$num = $totcnt - (($cur_page - 1) * $pagesize);

		$SQL = "Select reviewSerno, a.userid, username, review, image, a.regYHS ";
		$SQL .= " from $board a inner join db_user b ON a.userid = b.userid where $wheStr ";
		$SQL .= " order by reviewSerno desc limit $start, $pagesize ";
		$result = mysqli_query($kiki_conn, $SQL);
		if( $result === false) {
		} else {
		  while($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
			$reviewSerno = $row["reviewSerno"];
			$reviewuserid = $row["userid"];
			$reviewuserid = stripslashes($reviewuserid);
			$reviewusername = $row["username"];
			$reviewusername = stripslashes($reviewusername);
			$review = $row["review"];
			$review = stripslashes(nl2br($review));
			$reviewimage = $row["image"];
			$reviewimage = stripslashes($reviewimage);
IF ($reviewimage) {
	if (substr($reviewimage,0,8) != "./assets") {
		$reviewtemp_name = explode('||',$reviewimage); 
		$review_file = $reviewtemp_name[0];
		$reviewprofileImg = "../data/profile/".$review_file;
	} else {
		$reviewprofileImg = $reviewimage;
	}
} else {
	$reviewprofileImg = "../assets/img/profile.jpg";
}
			$regYHS = new DateTime($row["regYHS"]);
			$regYHS = date_format($regYHS, "Y. m. d");

$result_stmt .= "<div id='review_$reviewSerno' class='reply border-bottom my-3'>";
$result_stmt .= " <div class='post-header mb-2'>  ";
$result_stmt .= "  <div class='avatar' style='background-image: url(\"$reviewprofileImg\");'></div> ";
$result_stmt .= "  <a href='#' class='text-dark' data-toggle='popover' data-trigger='hover' title='$reviewusername' data-content='linking.kr/$reviewuserid'>";
$result_stmt .= "   <h6 class='user-name'>$reviewusername</h6> ";
$result_stmt .= "  </a> ";
$result_stmt .= "  <small class='date ml-auto'>$regYHS</small> ";
$result_stmt .= " </div> ";
$result_stmt .= " <p class='small'>$review ";
	if ($reviewuserid == $UserID and $UserID) {
$result_stmt .= "  <a href='javascript:remove_review(\"$reviewSerno\")' class='ml-1'>삭제</a> "; 
	}
$result_stmt .= " </p> ";
$result_stmt .= "</div> ";
		  }
		mysqli_free_result( $result);
	}
}  //  if($totcnt == 0) { 
	mysqli_close($kiki_conn);

  if ($cur_page == 1) {
$result_stmt .= "  <input type='hidden' id='totpage' value='$totpage'> ";
$result_stmt .= "  <input type='hidden' id='totcnt' value='$totcnt'> ";
	}

	echo $result_stmt;		?>
