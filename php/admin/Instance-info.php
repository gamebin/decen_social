<!doctype html>
<?php
  include "./this_user.php";
  if (!$UserID ) {  ?>
  <script>
    location.href = "./sign-in.php"
  </script>
  <?  }
  $adminSQL = "SELECT * from db_admin where adminId='".$UserID."'";
  $result = mysqli_query($kiki_conn, $adminSQL);
  $row = mysqli_fetch_array($result, MYSQLI_ASSOC);

?>
<html lang="ko">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <title>인스턴스 정보 - Linking 관리자</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Noto+Sans+KR:400,700|Roboto:400,700&display=swap&subset=korean">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.css">
  <link rel="stylesheet" href="../assets/css/bootstrap.min.css">
  <link rel="stylesheet" href="../assets/css/linking.css">
</head>

<body class="bg-dark text-light">
  <? include "./inc/header.php";?>

  <main role="main" class="container">

    <h4 class="my-3">인스턴스 정보</h4>

    <div class="row">
      <div class="col-12">
        <div class="table-responsive">
          <table class="table table-bordered table-dark">
            <tbody>
              <tr>
                <th scope="row">도메인</th>
                <td><?=$row["domain"]?></td>
              </tr>
              <tr>
                <th scope="row">서비스 소개</th>
                <td><?=$row["intro"]?></td>
              </tr>
              <tr>
                <th scope="row">관리자</th>
                <td><?=$row["adminId"]?></td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

    </div>
  </main>
  <footer>
    <p class="mt-5 mb-0 p-3 text-secondary border-top border-secondary">© 2019</p>
  </footer>
  <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
  <script>
    $(function () {
      'use strict'
      $('[data-toggle="offcanvas"]').on('click', function () {
        $('.offcanvas-collapse').toggleClass('open')
      })
      $(".navbar-nav .nav-item .nav-link").eq(3).addClass("active");
      
    })

    $(function () {
      $('[data-toggle="popover"]').popover()
    })

  </script>
</body>

</html>