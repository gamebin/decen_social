<?php	
	include "./this_user.php";

	$boardtext = kiki_ischar($_POST["boardtext"]) ;
//	$boardtext = $_POST["boardtext"] ;
	$UserIP =  $_SERVER["REMOTE_ADDR"];

	$SQL = "INSERT INTO db_board ( userId ";
	$SQL .= ", boardtext, regYHS, userIp )";
	$SQL .= "  values ( ";
	$SQL .= " '$UserID' ";
	$SQL .= ", '$boardtext' ";
	$SQL .= ", now() ";
	$SQL .= ", '$UserIP' )" ;
/**/	$result = mysqli_query($kiki_conn, $SQL);
	if ( $result === false ) {
	   die( print_r( mysqli_connect_error(), true));
	}
	$boardSerno = mysqli_insert_id($kiki_conn);	

	$regYHS = date("Y. m. d");
	$SQL = "Select username, image from db_user ";
	$SQL .= " where userid= '$UserID' ";
	$result = mysqli_query($kiki_conn, $SQL);
	if( $result === false) {
	} else {
	    $row = mysqli_fetch_array($result, MYSQLI_ASSOC);
		$reviewusername = $row["username"];
		$reviewusername = stripslashes($reviewusername);
		$reviewimage = $row["image"];
		$reviewimage = stripslashes($reviewimage);
		IF ($reviewimage) {
			if (substr($reviewimage,0,8) != "./assets") {
				$reviewtemp_name = explode('||',$reviewimage); 
				$review_file = $reviewtemp_name[0];
				$profileImg = "../data/profile/".$review_file;
			} else {
				$profileImg = $reviewimage;
			}
		} else {
			$profileImg = "../assets/img/profile.jpg";
		}
		mysqli_free_result( $result);
	}
	$boardtext = stripslashes(nl2br($boardtext));
	mysqli_close($kiki_conn);	

$result_stmt .= "<article id='board_$boardSerno' class='post'> ";
$result_stmt .= " <div class='post-header mb-3'> ";
$result_stmt .= "  <div class='avatar' style='background-image: url(\"$profileImg\");'></div> ";
$result_stmt .= "  <div> ";
$result_stmt .= "   <h6 class='user-name'>$reviewusername</h6> ";
$result_stmt .= "   <a href='#' class='user-link'>linking.kr/$UserID</a> ";
$result_stmt .= "   <small class='date'>$regYHS</small> ";
$result_stmt .= "  </div> ";
$result_stmt .= "  <a href='#' class='ml-auto text-muted' id='post-menu-01' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'><i class='fas fa-ellipsis-h'></i></a> ";
$result_stmt .= "  <div class='dropdown-menu' aria-labelledby='post-menu-01'> ";
$result_stmt .= "   <a class='dropdown-item' href='#'>수정</a> ";
$result_stmt .= "   <a class='dropdown-item' href='#'>삭제</a> ";
$result_stmt .= "  </div> ";
$result_stmt .= " </div> ";
$result_stmt .= " <p>$boardtext</p> ";
$result_stmt .= " <div class='d-flex justify-content-between align-items- mt-3'> ";
$result_stmt .= "  <p class='m-0'> ";
$result_stmt .= "   <button type='button' class='btn btn-sm btn-light'><i class='far fa-heart fa-lg'></i></button> ";
$result_stmt .= "   <button type='button' class='btn btn-sm btn-light' data-toggle='collapse' href='#collapseReply_$boardSerno' role='button' aria-expanded='false'><i class='fas fa-comment fa-lg'></i></button> ";
$result_stmt .= "   <button type='button' class='btn btn-sm btn-light'><i class='fas fa-share-alt fa-lg'></i></button> ";
$result_stmt .= "  </p> ";
$result_stmt .= "  <div class='mb-0 text-muted'><small>댓글</small> <span class='badge badge-secondary badge-pill'>0</span></div> ";
$result_stmt .= " </div> ";
$result_stmt .= " <div class='collapse' id='collapseReply$boardSerno'> ";
$result_stmt .= "  <div class='form-group mt-3'> ";
$result_stmt .= "   <textarea class='form-control' id='review_cont_$boardSerno' rows='2' placeholder='댓글 입력' style='resize: none;'></textarea> ";
$result_stmt .= "  </div> ";
$result_stmt .= "  <div class='text-right'><button type='button' onclick='GoWrite_review(\'$boardSerno\')' class='btn btn-sm btn-primary'>확인</button></div> ";
$result_stmt .= " </div> ";
$result_stmt .= " <div id='pro_con01_$boardSerno'> ";
$result_stmt .= "  <!-- 댓글 넣기 --> ";
$result_stmt .= " </div> ";
$result_stmt .= "</article> ";

	echo $result_stmt;			?>