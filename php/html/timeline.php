<!doctype html>
<html lang="ko">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <title>타임라인 - Linking: Decentralized Social Networking</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Noto+Sans+KR:400,700|Roboto:400,700&display=swap&subset=korean">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.css">
  <link rel="stylesheet" href="../assets/css/bootstrap.min.css">
  <link rel="stylesheet" href="../assets/css/linking.css">
</head>

<body class="bg-light">
<?	include "./this_user.php";
	if (!$UserID ) {	?>
<script>
location.href = "./sign-in.php"
</script>
<?	}

	include "./inc_nav.php";	?>

  <main role="main" class="container">

    <div class="row mt-3">
      <div class="col-lg-9">

        <div class="p-3 my-3 bg-white shadow-sm rounded">
          <div class="form-group">
            <textarea class="form-control" id="boardtext" rows="2" placeholder="무슨 생각하세요?" style="resize: none;"></textarea>
          </div>

          <div class="row align-items-center">
    <!--        <div class="col-3 col-lg-2 mb-3"><a href="#"><img class="img-fluid" src="https://via.placeholder.com/640x640"></a></div>
            <div class="col-3 col-lg-2 mb-3"><a href="#"><img class="img-fluid" src="https://via.placeholder.com/640x480"></a></div>
            <div class="col-3 col-lg-2 mb-3"><a href="#"><img class="img-fluid" src="https://via.placeholder.com/640x640"></a></div>
            <div class="col-3 col-lg-2 mb-3"><a href="#"><img class="img-fluid" src="https://via.placeholder.com/640x480"></a></div>
            <div class="col-3 col-lg-2 mb-3"><a href="#"><img class="img-fluid" src="https://via.placeholder.com/640x480"></a></div>
            <div class="col-3 col-lg-2 mb-3"><a href="#"><img class="img-fluid" src="https://via.placeholder.com/640x640"></a></div>
            <div class="col-3 col-lg-2 mb-3"><a href="#"><img class="img-fluid" src="https://via.placeholder.com/640x480"></a></div>
            <div class="col-3 col-lg-2 mb-3"><a href="#"><img class="img-fluid" src="https://via.placeholder.com/640x480"></a></div>
            <div class="col-3 col-lg-2 mb-3"><a href="#"><img class="img-fluid" src="https://via.placeholder.com/640x640"></a></div>
            <div class="col-3 col-lg-2 mb-3"><a href="#"><img class="img-fluid" src="https://via.placeholder.com/640x480"></a></div>
            <div class="col-3 col-lg-2 mb-3"><a href="#"><img class="img-fluid" src="https://via.placeholder.com/640x640"></a></div> -->
          </div>

          <div class="text-right">
      <!--      <button type="button" class="btn btn-sm btn-light"><i class="fas fa-image"></i></button>
            <button type="button" class="btn btn-sm btn-light"><i class="fas fa-video"></i></button>
            <button type="button" class="btn btn-sm btn-light"><i class="fas fa-camera"></i></button> -->
            <button type="button" class="btn btn-sm btn-primary" onclick="GoWrite()">확인</button>
          </div>
        </div>

	  <div id="pro_con01">
<?	$cur_page = kiki_isnumb($_POST["cur_page"]) ;
	if (!$cur_page) {
		$cur_page = 1;
	}
	$board = "db_board";
	$board_review = "db_review";
	$pagesize = 5;
	$wheStr = "(a.userId = '$UserID' or (c.userId = '$UserID' and a.userId = c.friendId)) ";

	$SQL = "Select count(boardSerno) as totcnt from $board a inner join";
	$SQL .= " db_user b ON a.userid = b.userid left join db_friends c ";
	$SQL .= " on a.userid = c.friendid where $wheStr ";
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
//echo "tot = $totcnt <BR>";
	if($totcnt == 0) {	?>
	    <div class='w-100 text-center text-muted py-5'> 자료가 없습니다. </div>
<?	}  Else {
		$start = ($cur_page-1) * $pagesize;
		$num = $totcnt - (($cur_page - 1) * $pagesize);

		$SQL = "Select boardSerno, a.userid, username, image ";
		$SQL .= ", a.regYHS, reviewcnt, boardtext ";
		$SQL .= ", (select count(likedSerno) from db_liked where a.boardSerno ";
		$SQL .= " = boardSerno and userId ='$UserID' and likeFlag = '1') as likeSerno ";
		$SQL .= " from $board a inner join db_user b ON a.userid = b.userid left join ";
		$SQL .= " db_friends c on a.userid = c.friendid where $wheStr ";
		$SQL .= " order by boardSerno desc limit $start, $pagesize ";
		$result = mysqli_query($kiki_conn, $SQL);
		if( $result === false) {
		} else {
		  while($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
			$likeSerno = "";
			$boardSerno = $row["boardSerno"];
			$userid = $row["userid"];
			$userid = stripslashes($userid);
			$username = $row["username"];
			$username = stripslashes($username);
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
			$boardtext = stripslashes(nl2br($boardtext));
			$likeSerno = $row["likeSerno"];
	if ($likeSerno) {
		$liked_txt = "fas fa-heart fa-lg text-danger";
	} else {
		$liked_txt = "far fa-heart fa-lg";
	}				?>
        <article id="board_<?=$boardSerno?>" class="post">
          <div class="post-header mb-3">
            <div class="avatar" style="background-image: url('<?=$profileImg?>');"></div>
            <div>
              <h6 class="user-name"><?=$username?></h6>
              <a href="#" class="user-link">linking.kr/<?=$userid?></a>
              <small class="date"><?=$regYHS?></small>
            </div>
<?	if ($userid == $UserID and $UserID) {	?>
            <a href="#" class="ml-auto text-muted" id="post-menu-01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fas fa-ellipsis-h"></i></a>
            <div class="dropdown-menu" aria-labelledby="post-menu-01">
     <!--         <a class="dropdown-item" href="#">수정</a> -->
              <a class="dropdown-item" href="javascript:remove_board('<?=$boardSerno?>')">삭제</a>
            </div>
<?	}	?>
          </div>

          <p><?=$boardtext?></p>

   <!--       <div class="row align-items-center no-gutters mb-2">
            <div class="col mx-1"><a href="#"><img class="img-fluid" src="https://via.placeholder.com/640x640"></a></div>
            <div class="col mx-1"><a href="#"><img class="img-fluid" src="https://via.placeholder.com/640x480"></a></div>
          </div> -->
          <div class="d-flex justify-content-between mt-3">
            <p class="m-0">
              <button type="button" class="btn btn-sm btn-light"><i id='liked_txt_<?=$boardSerno?>' class="<?=$liked_txt?>"></i></button>
              <button type="button" class="btn btn-sm btn-light" data-toggle="collapse" href="#collapseReply_<?=$boardSerno?>" role="button" aria-expanded="false"><i class="fas fa-comment fa-lg"></i></button>
             <!--  <button type="button" class="btn btn-sm btn-light"><i class="fas fa-share-alt fa-lg"></i></button> -->
            </p>
            <div class="mb-0 text-muted"><small>댓글</small> <span id="review_cnt_<?=$boardSerno?>" class="badge badge-secondary badge-pill"><?=$reviewcnt?></span></div>
          </div>
          <div class="collapse" id="collapseReply_<?=$boardSerno?>">
            <div class="form-group mt-3">
              <textarea id="review_cont_<?=$boardSerno?>" class="form-control" rows="2" placeholder="댓글 입력" style="resize: none;"></textarea>
            </div>
            <div class="text-right"><button type="button" onclick="GoWrite_review('<?=$boardSerno?>')" class="btn btn-sm btn-primary">확인</button></div>
          </div>
		  <div id="pro_con01_<?=$boardSerno?>">
<!-- 댓글 넣기 -->
<?	$wheStr2 = "a.boardSerno = '$boardSerno'";
	$SQL2 = "Select count(reviewSerno) as totcnt from $board_review a";
	$SQL2 .= " inner join db_user b ON a.userid = b.userid where $wheStr2 ";
	$result2 = mysqli_query($kiki_conn, $SQL2);
	if( $result2 === false) {
		 die( print_r( mysqli_connect_error(), true) );
	} else {
		$row2 = mysqli_fetch_array($result2, MYSQLI_ASSOC);
		$totcnt = $row2["totcnt"];
		mysqli_free_result( $result2);
	}

	if($totcnt) {
//		$start = ($cur_page-1) * $pagesize;
//		$num = $totcnt - (($cur_page - 1) * $pagesize);

		$SQL2 = "Select reviewSerno, a.userid, username, review, image, a.regYHS ";
		$SQL2 .= " from $board_review a inner join db_user b ON a.userid = b.userid";
		$SQL2 .= " where $wheStr2  order by reviewSerno desc limit $start, $pagesize ";
		$result2 = mysqli_query($kiki_conn, $SQL2);
		if( $result2 === false) {
		} else {
		  while($row2 = mysqli_fetch_array($result2, MYSQLI_ASSOC)) {
			$reviewSerno = $row2["reviewSerno"];
			$reviewuserid = $row2["userid"];
			$reviewuserid = stripslashes($reviewuserid);
			$reviewusername = $row2["username"];
			$reviewusername = stripslashes($reviewusername);
			$review = $row2["review"];
			$review = stripslashes(nl2br($review));
			$reviewimage = $row2["image"];
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
			$regYHS = new DateTime($row2["regYHS"]);
			$regYHS = date_format($regYHS, "Y. m. d");	?>

           <div id='review_<?=$reviewSerno?>' class='reply border-bottom my-3'>
            <div class='post-header mb-2'> 
             <div class='avatar' style='background-image: url("<?=$reviewprofileImg?>");'></div> 
             <a href='#' class='text-dark' data-toggle='popover' data-trigger='hover' title='<?=$reviewusername?>' data-content='linking.kr/<?=$reviewuserid?>'>
              <h6 class='user-name'><?=$reviewusername?></h6>
             </a> 
             <small class='date ml-auto'><?=$regYHS?></small> 
            </div> 
            <p class='small'><?=$review?> 
<?	if ($reviewuserid == $UserID and $UserID) {	?>
             <a href='javascript:remove_review_board("<?=$reviewSerno?>","<?=$boardSerno?>")' class='ml-1'>삭제</a>  
<?	}	?>
            </p> 
           </div> 
<?		  }
		mysqli_free_result( $result2);
		}
	}  //  if($totcnt == 0) {		?>
		  </div>

          <!-- <div class="text-right"><a href="#"><small>댓글(5) 더보기 <i class="fas fa-chevron-down"></i></small></a></div> -->
        </article>
<?		  }
		mysqli_free_result( $result);
	}
}  //  if($totcnt == 0) {	?>
	  </div>
<!-- 상품 보여주기 -->
	  <div id="pro_con02">

	  </div>
<!-- 상품 보옂기 끝 -->
      </div>
<form name="list" method="post">
  <input type="hidden" name="cur_page" value="<?=$cur_page?>" id="cur_page">
  <input type="hidden" name="num" value="">
</form>

<?	$SQL = "Select username, image, following, followers ";
	$SQL .= " from db_user where userid= '$UserID' ";
	$result = mysqli_query($kiki_conn, $SQL);
	if( $result === false) {
	} else {
	    $row = mysqli_fetch_array($result, MYSQLI_ASSOC);
		$username = $row["username"];
		$username = stripslashes($username);
		$image = $row["image"];
		$image = stripslashes($image);
		IF ($image) {
			if (substr($image,0,8) != "./assets") {
				$reviewtemp_name = explode('||',$image); 
				$review_file = $reviewtemp_name[0];
				$profileImg = "../data/profile/".$review_file;
			} else {
				$profileImg = $image;
			}
		} else {
			$profileImg = "../assets/img/profile.jpg";
		}
		$following = $row["following"];
	if ($following) {
		$following = number_format($following);
	}
		$followers = $row["followers"];
	if ($followers) {
		$followers = number_format($followers);
	}
		mysqli_free_result( $result);
	}
mysqli_close($kiki_conn);		?>
      <div class="col-12 col-lg-3">

        <div class="align-items-center p-3 my-3 bg-white rounded shadow-sm">
          <div class="align-items-center mb-3 text-center">
            <div class="avatar avatar-xl mb-3 mx-auto" style="background-image: url('../assets/img/profile.jpg');"></div>
            <div class="lh-100">
              <h5><?=$username?>
                <a href="#" id="my-menu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fas fa-cog"></i></a>
                <div class="dropdown-menu" aria-labelledby="my-menu">
                  <a class="dropdown-item" href="#">메뉴1</a>
                  <a class="dropdown-item" href="#">메뉴2</a>
                  <a class="dropdown-item" href="#">메뉴3</a>
                </div>
              </h5>

              <a href="#">linking.kr/<?=$UserID?></a>
            </div>
          </div>
          <ul class="p-0 m-0">
            <li class="d-flex justify-content-between align-items-center mb-2">
              팔로워
              <span class="badge badge-secondary badge-pill"><?=$followers?></span>
            </li>
            <li class="d-flex justify-content-between align-items-center mb-0">
              팔로잉
              <span class="badge badge-secondary badge-pill"><?=$following?></span>
            </li>
          </ul>
        </div>

        <div class="my-3 p-3 bg-white rounded shadow-sm">
          <h6 class="border-bottom border-gray pb-2 mb-0">추천 유저</h6>
          <div class="media text-muted pt-3">
            <div class="avatar mr-3"></div>

            <div class="media-body pb-3 mb-0 small border-bottom border-gray">
              <div class="d-flex justify-content-between align-items-center img-fluid">
                <strong class="text-gray-dark">Full Name</strong>
                <a href="#">Follow</a>
              </div>
              <span class="d-block">@username</span>
            </div>
          </div>
          <div class="media text-muted pt-3">
            <div class="avatar mr-3"></div>
            <div class="media-body pb-3 mb-0 small border-bottom border-gray">
              <div class="d-flex justify-content-between align-items-center img-fluid">
                <strong class="text-gray-dark">Full Name</strong>
                <a href="#">Follow</a>
              </div>
              <span class="d-block">@username</span>
            </div>
          </div>
          <div class="media text-muted pt-3">
            <div class="avatar mr-3"></div>
            <div class="media-body pb-3 mb-0 small border-bottom border-gray">
              <div class="d-flex justify-content-between align-items-center img-fluid">
                <strong class="text-gray-dark">Full Name</strong>
                <a href="#">Follow</a>
              </div>
              <span class="d-block">@username</span>
            </div>
          </div>
          <small class="d-block text-right mt-3">
            <a href="#">모두 보기</a>
          </small>
        </div>


        <div class="my-3 p-3 bg-white rounded shadow-sm">
          <h6 class="border-bottom border-gray pb-2 mb-0">추천 상품</h6>
          <div class="media text-muted pt-3">
            <div class="thumbnail mr-3 rounded"></div>
            <p class="media-body pb-3 mb-0 small border-bottom border-gray">
              <strong class="d-block text-gray-dark">제품명</strong>
              Donec id elit non mi porta gravida at eget metus.
            </p>
          </div>
          <div class="media text-muted pt-3">
            <div class="thumbnail mr-3 rounded" style="background-image: url('../assets/img/bg-default01.jpg');"></div>
            <p class="media-body pb-3 mb-0 small border-bottom border-gray">
              <strong class="d-block text-gray-dark">제품명</strong>
              Donec id elit non mi porta gravida at eget metus.
            </p>
          </div>
          <div class="media text-muted pt-3">
            <div class="thumbnail mr-3 rounded"></div>
            <p class="media-body pb-3 mb-0 small border-bottom border-gray">
              <strong class="d-block text-gray-dark">제품명</strong>
              Donec id elit non mi porta gravida at eget metus.
            </p>
          </div>
          <small class="d-block text-right mt-3">
            <a href="#">모두 보기</a>
          </small>
        </div>

      </div>

    </div>

  </main>
<?		include "./inc_footer.php"	?>
<script src="./timeline.js" type="text/javascript"></script>

</body>

</html>