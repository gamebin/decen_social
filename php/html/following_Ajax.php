<?	include "./this_user.php";

	$cur_page = kiki_isnumb($_POST["cur_page"]) ;
	if (!$cur_page) {
		$cur_page = 1;
	}
	$board = "db_friends";
	$pagesize = 10;
	$wheStr = "a.userid = '$UserID'";

	$SQL = "Select count(friendSerno) as totcnt from $board a inner join db_user b";
	$SQL .= " ON a.friendId = b.userid where $wheStr  ";
//echo $SQL;
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

		$SQL = "Select a.userid, username, image, regYHS from $board a ";
		$SQL .= " inner join db_user b ON a.friendId = b.userid where $wheStr ";
		$SQL .= " order by friendSerno desc limit $start, $pagesize ";
		$result = mysqli_query($kiki_conn, $SQL);
		if( $result === false) {
		} else {
		  while($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
			$userid = $row["userid"];
			$userid = stripslashes($userid);
			$username = $row["username"];
			$username = stripslashes($username);
			$image = $row["image"];
			$image = stripslashes($image);
IF ($image) {
	$temp_name = explode('||',$image); 
    $original_file = $temp_name[0];
}
			$regYHS = new DateTime($row["regYHS"]);
			$regYHS = date_format($regYHS, "Y-m-d H:i");

$result_stmt .= "<div class='d-flex py-3 border-bottom'>";
$result_stmt .= " <div class='avatar avatar-lg mr-3'></div>";
$result_stmt .= " <div>";
$result_stmt .= "  <h6 class='mt-1 mb-0'>$username</h6> ";
$result_stmt .= "  <a href='javascript:go_profile(\"$userid\")'><small>linking.kr/$userid</small></a> ";
$result_stmt .= " </div> ";
$result_stmt .= " <a href='#' class='ml-auto text-muted' id='follower-menu-01' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'><i class='fas fa-caret-down'></i></a> ";
$result_stmt .= " <div class='dropdown-menu' aria-labelledby='follower-menu-01'> ";
$result_stmt .= "  <a class='dropdown-item' href='javascript:go_profile(\"$userid\")'>프로필 보기</a>	  ";
$result_stmt .= "  <a class='dropdown-item' href='#'>메뉴2</a>  ";
$result_stmt .= "  <a class='dropdown-item' href='#'>메뉴3</a>  ";
$result_stmt .= " </div> ";
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
