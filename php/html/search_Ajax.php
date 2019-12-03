<?	include "./this_user.php";

	$cur_page = kiki_isnumb($_POST["cur_page"]) ;
	$schStr = kiki_ischar($_POST["schStr"]) ;
	if (!$cur_page) {
		$cur_page = 1;
	}

	$board = "db_user";
	$pagesize = 10;

	$wheStr = "((a.userid like '%". trim($schStr). "%' or username like '%". trim($schStr). "%') and (a.userid != '$UserID')) ";

	$SQL = "Select count(userSerno) as totcnt from $board a where $wheStr  ";
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

		$SQL = "Select a.userid, username, image, (select friendSerno from ";
		$SQL .= " db_friends where (a.userid = friendId and userId ='$UserID') ";
		$SQL .= " or (friendId = '$UserID' and a.userId = userId)) as friendSerno ";
		$SQL .= " from $board a where $wheStr ";
		$SQL .= " order by userSerno desc limit $start, $pagesize ";
//echo $SQL;
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
			$friendSerno = $row["friendSerno"];

$result_stmt .= "<div class='d-flex py-3 border-bottom'>";
$result_stmt .= " <div class='avatar avatar-lg mr-3'></div>";
$result_stmt .= " <div>";
$result_stmt .= "  <h6 class='mt-1 mb-0'>$username</h6> ";
$result_stmt .= "  <a href='javascript:go_profile(\"$userid\")'><small>linking.kr/$userid</small></a> ";
$result_stmt .= " </div> ";
	if (!$friendSerno) {
$result_stmt .= " <button id='btn_$userid' type='button' onclick='go_follow(\"$userid\")' class='ml-auto btn btn-outline-secondary'>팔로잉</button>  ";
	} else {
$result_stmt .= " <button type='button' class='ml-auto btn btn-primary'>팔로우</button> ";
	}
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