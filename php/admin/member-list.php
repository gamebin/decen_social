<!doctype html>
<html lang="ko">
<?  
  include "./this_user.php";
  include("pageInc.php");
  if (!$UserID ) {  ?>
<script>
location.href = "./sign-in.php"
</script>
<?  }
//  $filename = upload($_FILES['filename1'],50*1024*1024,'board');

    $pagenum=1;
     
     
    $srchType="";
    $srchTxt ="";
    $isSrch = false;
    if(!empty($_REQUEST["pagenum"])){
      $pagenum=$_REQUEST["pagenum"];
    }  
     $whereStatement = "";
    if(!empty($_REQUEST["srchTxt"])){
      if(strlen($_REQUEST["srchTxt"]) > 0){
        $srchTxt =$_REQUEST["srchTxt"];
        $whereStatement = " where (userid like '%$srchTxt%' or username like  '%$srchTxt%' )";
        
      }
    }
  
    $pageDataAmt=4;
    $bottom_page_block=5;
    $endpg; 
    $startblock=0;
    if($pagenum > 1){
        $startblock = (intval($pagenum) * $pageDataAmt) - $pageDataAmt;        
    };

    $cnt_query= "select count(*) as total from db_user ".$whereStatement;
    $cnt_query_rst=  mysqli_query($kiki_conn, $cnt_query);
    $cntrow = mysqli_fetch_array($cnt_query_rst, MYSQLI_ASSOC);
    $endpg = ceil(intval($cntrow["total"])/$pageDataAmt);

  $productSQL = "select * from db_user $whereStatement order by regYHS DESC limit $startblock, $pageDataAmt";
  $result = mysqli_query($kiki_conn, $productSQL);
?>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <title>회원 리스트 - Linking 관리자</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Noto+Sans+KR:400,700|Roboto:400,700&display=swap&subset=korean">
  <link rel="stylesheet" href="../assets/vendor/fontawesome-free-5.11.2-web/css/all.min.css">
  <link rel="stylesheet" href="../assets/css/bootstrap.min.css">
  <link rel="stylesheet" href="../assets/css/linking.css">
</head>

<body class="bg-secondary text-light">
 <? include "./inc/header.php";?>


  <main role="main" class="container">

    <h4 class="my-3">회원 현황</h4>

    <div class="row">
      <div class="col-12">

        <table class="table table-hover table-dark">
          <thead>
            <tr>
              <th scope="col">회원 ID</th>
              <th scope="col">회원 이름</th>
              <th scope="col">이메일</th>
              <th scope="col">가입일</th>
            </tr>
          </thead>
          <tbody>
            <?while($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {?>
            <tr>
              <td><?=$row["userid"]?></td>
              <td><?=$row["username"]?></td>
              <td><?=$row["email"]?></td>
              <td><?=$row["regYHS"]?></td>
            </tr>
            <?}?>
          </tbody>
        </table>

        <nav>
          <ul class="pagination justify-content-center text-light">
              <?php
               echo(get_page_nums($pagenum,$endpg,$bottom_page_block));
              ?>
          </ul>
        </nav>

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
      $( ".navbar-nav .nav-item").each(function( index ) {
        $(this).removeClass("active");
      });

      $(".navbar-nav .nav-item .nav-link").eq(0).addClass("active");
      
    })

    $(function () {
      $('[data-toggle="popover"]').popover()
    })
     function list(pagenum){
        var reloadFrm = document.querySelector("#reloadFrm");
        var pagenumInput = reloadFrm.querySelector("input[name='pagenum']");
        pagenumInput.value=pagenum;
        reloadFrm.submit();
    }

  </script>
    <form id="reloadFrm" action="./product-list.php">   
      <input name="pagenum" style="display:none" value="<?=$pagenum?>"></input>
       <input name="srchTxt" style="display:none" value="<?=$srchTxt?>"></input>
    </form>
</body>

</html>