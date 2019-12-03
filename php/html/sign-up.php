<!doctype html>
<html lang="ko">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Noto+Sans+KR:400,700|Roboto:400,700&display=swap&subset=korean">
  <link rel="stylesheet" href="../assets/css/bootstrap.min.css">
  <link rel="stylesheet" href="../assets/css/sign-in.css">
  <title>회원가입 - Linking: Decentralized Social Networking</title>
</head>

<?	$UserID = $_COOKIE["UserID"];
	if ($UserID ) {	?>
<script>
location.href = "./timeline.php"
</script>
<?	}	?>

<body class="text-center">
  <form class="form-signin">
    <a href="#"><img class="mb-4" src="../assets/img/logo.svg" alt="로고" width="200"></a>
    <h1 class="h3 mb-2">내 데이터는 나의 것</h1>
    <p class="text-muted">원하는 서비스에 언제든 이동하세요.</p>

    <label for="UserID" class="sr-only">아이디</label>
    <input type="text" id="UserID" maxlength="20" class="form-control mb-3" placeholder="아이디" required="" autofocus="">
    <div id="userid_success_text" style="display:none" class="alert alert-success alert-dismissible fade show">
      <strong>사용 가능한 아이디</strong>입니다.
    </div>

    <div id="userid_danger_text" style="display:none" class="alert alert-danger alert-dismissible fade show">
      <strong>이미 존재하는 아이디</strong>입니다.
    </div>

    <label for="UserName" class="sr-only">이름</label>
    <input type="text" id="UserName" maxlength="10" class="form-control mb-3" placeholder="이름" required="">
    <label for="email" class="sr-only">이메일</label>
    <input type="email" id="email" maxlength="30" class="form-control mb-3" placeholder="이메일" required="">
    <div id="email_success_text" style="display:none" class="alert alert-success alert-dismissible fade show">
      <strong>사용 가능한 이메일</strong>입니다.
    </div>

    <div id="email_danger_text" style="display:none" class="alert alert-danger alert-dismissible fade show">
      <strong>이미 존재하는 이메일</strong>입니다.
    </div>

    <label for="passwd" class="sr-only">비밀번호</label>
    <input type="password" id="passwd" maxlength="15" class="form-control mb-3" placeholder="비밀번호" required="">
    <label for="passwdok" class="sr-only">비밀번호 확인</label>
    <input type="password" id="passwdok" maxlength="15" class="form-control mb-3" placeholder="비밀번호 확인" required="">

    <div id="passwd_danger_text" style="display:none" class="alert alert-danger alert-dismissible fade show">
      <strong>비밀번호</strong>가 일치하지 않습니다.
    </div>

    <button class="btn btn-lg btn-outline-dark btn-block" type="button" onclick="fn_sign_up();" id="btn_write">가입하기</button>
    <div class="signin-links my-3"><a href="./sign-in.php">로그인</a><a href="./find-userid.php">아이디 확인</a><a href="./find-password.php">비밀번호 확인</a></div>
    <p class="mt-5 mb-3 text-muted">© GPL 2.0 License. Powered by Gamebin inc</p>
 
    <input type="hidden" id="userid_chk" value="N">
    <input type="hidden" id="email_chk" value="N">
  </form>

  <script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>

  <script src="./sign-in.js" type="text/javascript"></script>
</body>

</html>