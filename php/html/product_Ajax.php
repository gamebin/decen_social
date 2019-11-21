<?	include "./this_user.php";

	$cur_page = kiki_isnumb($_POST["cur_page"]) ;
	if (!$cur_page) {
		$cur_page = 1;
	}
	$board = "db_product";
	$pagesize = 5;

	$SQL = "Select count(boardSerno) as totcnt from $board a inner join";
	$SQL .= " db_user b ON a.userid = b.userid  ";
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

		$SQL = "Select boardSerno, a.userid, username, title, image ";
		$SQL .= ", imageurl, a.regYHS, reviewcnt, boardtext, price ";
		$SQL .= ", (select count(likedSerno) from db_liked where a.boardSerno ";
		$SQL .= " = boardSerno and userId ='$UserID' and likeFlag = '1') as likeSerno ";
		$SQL .= " from $board a inner join db_user b where $wheStr ";
		$SQL .= " order by boardSerno desc limit $start, $pagesize ";
		$result = mysqli_query($kiki_conn, $SQL);
		if( $result === false) {
		} else {
		  while($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
			$likeSerno = "";
			$no = $row["boardSerno"];
			$userid = $row["userid"];
			$userid = stripslashes($userid);
			$username = $row["username"];
			$username = stripslashes($username);
			$title = $row["title"];
			$title = stripslashes($title);
			$image = $row["image"];
			$image = stripslashes($image);
IF ($image) {
	if (substr($image,0,8) != "./assets") {
		$temp_name = explode('||',$image); 
		$original_file_name = $temp_name[0];
		$profileImg = "../data/profile/".$original_file_name;
	} else {
		$profileImg = $image;
	}
} else {
	$profileImg = "../assets/img/profile.jpg";
}
			$imageurl = $row["imageurl"];
			$imageurl = stripslashes($imageurl);
IF ($imageurl) {
	if (substr($imageurl,0,8) != "./assets") {
		$temp_name2 = explode('||',$imageurl); 
		$original_file2 = $temp_name2[0];
		$productimg = "../data/profile/".$original_file2;
	} else {
		$productimg = $imageurl;
	}
} else {
	$productimg = "https://via.placeholder.com/640x640";
}
			$regYHS = new DateTime($row["regYHS"]);
			$regYHS = date_format($regYHS, "Y. m. d");
			$reviewcnt = $row["reviewcnt"];	
			$boardtext = $row["boardtext"];
			$boardtext = strip_tags($boardtext);
			$boardtext = kiki_utf8_strcut($boardtext,80);
			$price = $row["price"];
	if ($price) {
		$price = number_format($price);
	}
			$likeSerno = $row["likeSerno"];
	if ($likeSerno) {
		$liked_txt = "fas fa-heart fa-lg text-danger";
	} else {
		$liked_txt = "far fa-heart fa-lg";
	}

$result_stmt .= "<article class='post'> ";
$result_stmt .= " <div class='post-header mb-3'> ";
$result_stmt .= "  <div class='avatar' style='background-image: url('$profileImg');'></div> ";
$result_stmt .= "  <div> ";
$result_stmt .= "   <h6 class='user-name'>$username</h6> ";
$result_stmt .= "   <a href='javascript:go_profile(\"$userid\")' class='user-link'>linking.kr/$userid</a> ";
$result_stmt .= "   <small class='date'>$regYHS</small> ";
$result_stmt .= "  </div> ";
	if ($userid == $UserID and !$UserID) {
$result_stmt .= "  <a href='#' class='ml-auto text-muted' id='post-menu-01' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'><i class='fas fa-ellipsis-h'></i></a> ";
$result_stmt .= "  <div class='dropdown-menu' aria-labelledby='post-menu-01'> ";
$result_stmt .= "   <a class='dropdown-item' href='#'>삭제</a> ";
$result_stmt .= "  </div> ";
	}
$result_stmt .= " </div> ";
	IF ($imageurl) {
$result_stmt .= " <div class='row align-items-center no-gutters mb-3'> ";
$result_stmt .= "  <a href='javascript:go_detail(\'$no\')'>$productimg</a> ";
$result_stmt .= " </div> ";
	}
$result_stmt .= " <p>$boardtext <a href='javascript:go_detail(\'$no\')' class='ml-1'>더보기</a></p> ";


$result_stmt .= " <div class='d-flex justify-content-between mt-3'> ";
$result_stmt .= "  <p class='m-0'> ";
$result_stmt .= "   <span>$price원</span> ";
$result_stmt .= "   <button type='button' class='btn btn-sm btn-light'><i id='liked_txt_$no' class='$liked_txt'></i></button> ";
$result_stmt .= "   <!--            <button type='button' class='btn btn-sm btn-light' data-toggle='collapse' role='button' aria-expanded='false'><i class='fas fa-comment fa-lg'></i></button> ";
$result_stmt .= "   <button type='button' class='btn btn-sm btn-light'><i class='fas fa-share-alt fa-lg'></i></button>	--> ";
$result_stmt .= "  </p> ";
$result_stmt .= "  <div class='mb-0 text-muted'><small>댓글</small> <span class='badge badge-secondary badge-pill'>$reviewcnt</span></div> ";
$result_stmt .= " </div> ";
$result_stmt .= "</article> ";
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