<!doctype html>
<html lang="ko">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <title>상품 상세화면 - Linking: Decentralized Social Networking</title>
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

	include "./inc_nav.php";
	$num = kiki_isnumb($_POST["num"]);

	$SQL = "Select boardSerno, a.userid, username, title, productLink, image ";
	$SQL .= ", imageurl, a.regYHS, reviewcnt, boardtext, price ";
	$SQL .= ", (select count(likedSerno) from product_liked where a.boardSerno ";
	$SQL .= " = boardSerno and userId ='$UserID' and likeFlag = '1') as likeSerno ";
	$SQL .= " from db_product a inner join db_user b ON  a.userid = b.userid where boardSerno = '$num' ";
//echo $SQL;
	$result = mysqli_query($kiki_conn, $SQL);
	if( $result === false) {
	} else {
	    $row = mysqli_fetch_array($result, MYSQLI_ASSOC);
		$userid = $row["userid"];
		$userid = stripslashes($userid);
		$username = $row["username"];
		$username = stripslashes($username);
		$title = $row["title"];
		$title = stripslashes($title);
		$productLink = $row["productLink"];
		$productLink = stripslashes($productLink);
		$image = $row["image"];
		$image = stripslashes($image);
IF ($image) {
	if (substr($image,0,9) != "../assets") {
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
	if (substr($imageurl,0,9) != "../assets") {
		$temp_name2 = explode('||',$imageurl); 
		$original_file2 = $temp_name2[0];
		$productimg = "../data/product/".$original_file2;
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
		mysqli_free_result( $result);
	}	?>

  <main role="main" class="container">

    <div class="row mt-3">
      <div class="col-12">

        <h4 class="my-3">상품 리스트</h4>

        <article class="post">
          <div class="post-header mb-3">
            <div class="avatar" style="background-image: url('../assets/img/profile.jpg');"></div>
            <div>
              <h6 class="user-name"><?=$username?></h6>
              <a href="#" class="user-link">linking.kr/<?=$userid?></a>
              <small class="date"><?=$regYHS?></small>
            </div>
<?	if ($userid == $UserID and !$UserID) {	?>
            <a href="#" class="ml-auto text-muted" id="post-menu-01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fas fa-ellipsis-h"></i></a>
            <div class="dropdown-menu" aria-labelledby="post-menu-01">
              <a class="dropdown-item" href="#">수정</a>
              <a class="dropdown-item" href="#">삭제</a>
            </div>
<?	}	?>
          </div>

          <p><?=$title?></p>
<?	IF ($imageurl) {	?>
          <div class="row align-items-center no-gutters mb-3">
            <div class="col"><a href="#"><img class="w-100" src="<?=$productimg?>"></a></div>
          </div>
<?	}	?>
          <p><?=$boardtext?></p>
 
		  <div class="row">
            <div class="col-12 col-lg-4 mb-3 my-lg-4"><button type="button" class="btn btn-block btn-outline-primary"><?=$price?>원</button></div>
<?	if ($productLink) {  ?>
			<div class="col-12 col-lg-8 mb-3 my-lg-4"><a href="<?=$productLink?>" target="_blank" class="btn btn-block btn-primary">구매하러 가기</a></div>
<?	}	?>
          </div>

          <div class="d-flex justify-content-between mt-3">
            <p class="m-0">
              <button type="button" onclick="btn_liked('<?=$num?>')" class="btn btn-sm btn-light"><i id="liked_txt" class="<?=$liked_txt?>"></i></button>
              <button type="button" class="btn btn-sm btn-light" data-toggle="collapse" href="#collapseReply" role="button" aria-expanded="false"><i class="fas fa-comment fa-lg"></i></button>
              <button type="button" class="btn btn-sm btn-light"><i class="fas fa-share-alt fa-lg"></i></button>
            </p>
            <div class="mb-0 text-muted"><small>댓글</small> <span class="badge badge-secondary badge-pill" id="reviewcnt"><?=$reviewcnt?></span></div>
          </div>
          <div class="collapse" id="collapseReply">
            <div class="form-group mt-3">
              <textarea id="review_cont" class="form-control" rows="2" placeholder="댓글 입력" style="resize: none;"></textarea>
            </div>
<?	if ($UserID) {	// 로그인 되어 있다면	?>
            <div class="text-right"><button onclick="GoWrite('<?=$num?>')" type="button" class="btn btn-sm btn-primary">확인</button></div>
<?	}	?>
          </div>
<?	$wheStr = "a.boardSerno = '$no'";
	$pagesize = "5";
	$cur_page = kiki_isnumb($_POST["cur_page"]) ;
	if (!$cur_page) {
		$cur_page = 1;
	}

	$SQL = "Select count(reviewSerno) as totcnt from product_review a";
	$SQL .= " inner join db_user b ON a.userid = b.userid where $wheStr  ";
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
	if ($totpage <= $cur_page) {
		$cur_page = $totpage;
		$display = "none";
	} else {
		$display = "";
	}
	mysqli_close($kiki_conn);	?>
<!-- 상품 리뷰 시작	-->
		  <div id="pro_con01">

		  </div>
<!-- 상품 리뷰 끝	-->
          <div id="more_page" style="display:<?=$display?>" class="text-right"><a href="javascript:kiki_list();"><small>댓글 더보기 <i class="fas fa-chevron-down"></i></small></a></div>

        </article>
      </div>
    </div>
  </main>
<?		include "./inc_footer.php"	?>
</body>

  <input type="hidden" name="cur_page" value="2" id="cur_page">
  <input type="hidden" name="num" value="<?=$num?>" id="num">
<script>
function btn_liked(num) {
	$.ajax({
        url: './product_likedAjax.php?callback=?',
        type: 'POST',
		data: {
		  "num": num,
       },
        contentType: 'application/x-www-form-urlencoded;charset=UTF-8', 
        dataType: 'json',
        success: function (data) {
			if(data.prog == "true"){
			  $("#liked_txt").attr('class',data.css);
			} else {
				alert(data.msg);
			}
	    },
        error: function(xhr, status, error) {
		 alert("error : "+error);
	    }
 	});
}

function GoWrite(num) {
    if ($("#review_cont").val().length < 1) {
        alert("댓글을 입력하세요.");
        $("#review_cont").focus();
        return;
    }
	$.ajax({
        url: './product_review_writeAjax.php?callback=?',
        type: 'POST',
		data: {
		  "num": num,
		  "review" :$("#review_cont").val(),
       },
        contentType: 'application/x-www-form-urlencoded;charset=UTF-8', 
        dataType: 'html',
        success: function (data) {
	      $("#pro_con01").empty();
		  $(data).appendTo($("#pro_con01"));
		  reviewcnt = $("#reviewcnt").text();
		  reviewcnt = Number(reviewcnt) + 1;
	      $("#reviewcnt").text(reviewcnt);
	      $("#review_cont").val('');
	    },
        error: function(xhr, status, error) {
		 alert("error : "+error);
	    }
 	});
}

function remove_review(reviewSerno) {
	$.ajax({
        url: './product_review_removeAjax.php?callback=?',
        type: 'POST',
		data: {
		  "reviewSerno": reviewSerno,
		  "num": "<?=$num?>",
       },
        contentType: 'application/x-www-form-urlencoded;charset=UTF-8', 
        dataType: 'json',
        success: function (data) {
			if(data.prog == "true"){
			  $("#review_"+reviewSerno).remove();
			  $("#reviewcnt").text(data.reviewcnt);
			} else {
				alert(data.msg);
			}
	    },
        error: function(xhr, status, error) {
		 alert("error : "+error);
	    }
 	});
}

$(function () {	
	load_cont();
});

function load_cont(){
	$("#cur_page").val(2);
	$.ajax({
        url: './product_reviewAjax.php?callback=?',
        type: 'POST',
		data: {
		  "cur_page": 1,
		  "num": "<?=$num?>",
       },
        contentType: 'application/x-www-form-urlencoded;charset=UTF-8', 
        dataType: 'html',
        success: function (data) {
		  $("#pro_con01").empty();
		  $(data).appendTo($("#pro_con01"));
	    },
        error: function(xhr, status, error) {
		 alert("error : "+error);
	    }
 	});
}

function kiki_list () {
	pg  = $("#cur_page").val();
	$.ajax({
        url: './product_reviewAjax.php?callback=?',
        type: 'POST',
		data: {
		  "cur_page": pg,
       },
        contentType: 'application/x-www-form-urlencoded;charset=UTF-8', 
        dataType: 'html',
        success: function (data) {
//	      $("#pro_con01").empty();
		  $(data).appendTo($("#pro_con01"));
		  this_page = Number(pg) + 1;
		  $("#cur_page").val(this_page);
		  totpage  = $("#totpage").val();
		  if (this_page > totpage) {
			  $("#more_page").hide();
		  } else {
			  $("#more_page").show();
		  }
	    },
        error: function(xhr, status, error) {
		 alert("error : "+error);
	    }
 	});
}
</script>
</html>