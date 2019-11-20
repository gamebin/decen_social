<!doctype html>
<html lang="ko">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <title>프로필 - Linking: Decentralized Social Networking</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Noto+Sans+KR:400,700|Roboto:400,700&display=swap&subset=korean">
  <link rel="stylesheet" href="../assets/vendor/fontawesome-free-5.11.2-web/css/all.min.css">
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
	$profileId = kiki_ischar($_POST["profileId"]) ;
	if (!$profileId) {
		$profileId = $UserID;
	}
	$SQL = "Select username, summary, image, email, following, followers ";
	$SQL .= " from db_user where userid = '$profileId' and delFlag = 'N'";	
	$result = mysqli_query($kiki_conn, $SQL);
	if( $result === false) {
	} else {
		$row = mysqli_fetch_array($result, MYSQLI_ASSOC);
		$username = $row["username"];
		$username = stripslashes($username);
		$summary = $row["summary"];
		$summary = stripslashes($summary);
		$summary2 = stripslashes(nl2br($summary));
		$image = $row["image"];
IF ($image) {
	if (substr($image,0,8) != "./assets") {
		$temp_name = explode('||',$image); 
		$original_file = $temp_name[0];
		$profileImg = "../data/profile/".$original_file;
	} else {

		$profileImg = $image;
	}
} else {
	$profileImg = "../assets/img/profile.jpg";
}
		$email = $row["email"];
		$email = stripslashes($email);
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
  <main role="main" class="container">

    <div class="row mt-3">
      <div class="col-12 col-lg-6 mx-auto">

        <div class="p-4 my-3 bg-white rounded shadow-sm">
          <div class="text-center">
            <div id="profile1" class="avatar avatar-xl mb-3 mx-auto" style="background-image: url('<?=$profileImg?>');"></div>
<form id="frm3" enctype="MULTIPART/FORM-DATA">
			<div style="position: relative; overflow: hidden; display: inline-block;">
             <button type="button" class="btn btn-sm btn-outline-primary rounded-pill mb-3">사진 변경</button>
             <input type="file" id="filename1" name="filename1" style="font-size: 10rem; position: absolute; left: 0; top: 0; opacity: 0;" />
           </div>
</form>

            <h5><?=$username?></h5>
            <a href="#">linking.kr/<?=$profileId?></a>
          </div>

          <div class="d-flex justify-content-around my-3">
            <div>팔로워 <a href="#" class="badge badge-primary badge-pill"><?=$followers?></a></div>
            <div>팔로잉 <a href="#" class="badge badge-primary badge-pill"><?=$following?></a></div>
            <div><a href="#"><i class="fas fa-box-open"></i></a></div>
          </div>
          <p class="mb-0 text-center"><?=$summary2?></p>
        </div>

        <div class="my-3">
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text">이름</span>
            </div>
            <input type="text" class="form-control" id="UserName" maxlength="10" value="<?=$username?>">
          </div>

          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text">소개글</span>
            </div>
            <textarea class="form-control" id="summary" style="resize: none;" rows="5"><?=$summary?></textarea>
          </div>

          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text">이메일</span>
            </div>
            <input type="email" class="form-control" value="<?=$email?>" readonly id="email" maxlength="30">
          </div>

          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text">비밀번호</span>
            </div>
            <input type="password" id="passwd" maxlength="15" class="form-control">
          </div>

          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text">비밀번호 확인</span>
            </div>
            <input type="password" id="passwdok" maxlength="15" class="form-control">
          </div>
          <div id="passwd_danger_text" style="display:none" class="alert alert-danger alert-dismissible fade show">
            <strong>비밀번호</strong>가 일치하지 않습니다.
          </div>
<?	if ($UserID == $profileId and $UserID) { // 자기 프로필일 경우 수정	?>
          <button type="button" class="btn btn-block btn-primary" onclick="fn_profile();" id="btn_write">저장</button>
<?	}	?>
        </div>

      </div>

    </div>
  </main>
<?		include "./inc_footer.php"	?>
</body>
<script src="./profile.js" type="text/javascript"></script>
</html>