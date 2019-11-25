<!doctype html>
<?  
  include "./this_user.php";
  if (!$UserID ) {  ?>
<script>
location.href = "./sign-in.php"
</script>
<?  }
//  $filename = upload($_FILES['filename1'],50*1024*1024,'board');
  $isEdit = "N";
  $price="";
  $title="";
  $boardSerno = "";

  if(isset($_REQUEST["isEdit"])){
    $isEdit = $_REQUEST["isEdit"];
    $price = $_REQUEST["price"];
    $boardSerno = $_REQUEST["boardSerno"];
    $title = $_REQUEST["title"];
    $imageurl = $_REQUEST["imageurl"];
    $boardtext = $_REQUEST["boardtext"];
    $productLink = $_REQUEST["productLink"];
  }

  echo("plink : ".$productLink);
  if(isset($_REQUEST["boardSerno"])){
    $boardSerno = $_REQUEST["boardSerno"];
  }
  
  if($isEdit == "Y"){

  }
?>
<html lang="ko">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <title>상품 리스트 - Linking 관리자</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Noto+Sans+KR:400,700|Roboto:400,700&display=swap&subset=korean">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.css">
  <link rel="stylesheet" href="../assets/css/bootstrap.min.css">
  <link rel="stylesheet" href="../assets/css/linking.css">
</head>

<body class="bg-dark text-light">
 <? include "./inc/header.php";?>


  <main role="main" class="container">

    <h4 class="my-3">상품 리스트</h4>


    <form id="addProdFrm" action="reg-prod.php">
      <?if($isEdit=="Y"){?>
        <input type="text" name="boardSerno" value="<?=$boardSerno?>" style="display:none"></input>
         <?}?>   
        <input type="text" name="isEdit" value="<?=$isEdit?>" style="display:none"></input>
          <input type="text" name="imageurl" value="<?=$imageurl?>" style="display:none"></input>
      
      <input type="text" name="userid" value="<?=$UserID?>" style="display:none"></input>
      <div class="form-group row">
        <label for="" class="col-sm-2 col-form-label">상품명</label>
        <div class="col-sm-10">
          <input type="text" value="<?=$title?>" name="title" class="form-control bg-secondary text-light">
        </div>
      </div>
      <div class="form-group row">
        <label for="" class="col-sm-2 col-form-label">상품 가격</label>
        <div class="col-sm-10">
          <input type="number" name="price" value="<?=$price?>" class="form-control bg-secondary text-light">
        </div>
      </div>
      <div class="form-group row">
        <label for="" class="col-sm-2 col-form-label">상품 소개</label>
        <div class="col-sm-10">
          <textarea  name="boardtext" class="form-control bg-secondary text-light" rows="3"><?=$boardtext?></textarea>
        </div>
      </div>
      <div class="form-group row">
        <label for="" class="col-sm-2 col-form-label">구매 링크</label>
        <div class="col-sm-10">
          <input  name="productLink" value="<?=$productLink?>" type="text" class="form-control bg-secondary text-light">
        </div>
      </div>
         </form>
      <div class="form-group row">
        <label for="" class="col-sm-2 col-form-label">이미지 첨부</label>
        <div class="col-sm-10">
          <div class="custom-file">
            <form id="frm3" enctype="MULTIPART/FORM-DATA">
            <input type="file" id="filename1" name="filename1"  class="custom-file-input">
          </form>
            <label id="filename1_label" class="custom-file-label bg-secondary text-light" for="">첨부</label>
          </div>
        </div>
      </div>
      
   
      <p class="text-right mt-5"><button onclick="checkFrm(); return" class="btn btn-secondary">상품 등록</button></p>

    
  </main>
  <footer>
    <p class="mt-5 mb-0 p-3 text-secondary border-top border-secondary">© 2019</p>
  </footer>
  <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
  <script>
    $(function () {
      'use strict'
      $('[data-toggle="offcanvas"]').on('click', function () {
        $('.offcanvas-collapse').toggleClass('open')
      })
    })

    window.addEventListener("DOMContentLoaded", function(){
      if(document.querySelector("input[name='isEdit']").value == "N"){
        document.querySelector("input[name='productLink'").value = "http://";
      }
          // 파일 input 에 변화가 있다면 업로드
      $('#filename1').change(

      function(){
        console.debug("f change");
        data = $('#filename1').val();
      //console.log("data="+data)
        ext = data.substring(data.lastIndexOf(".") + 1, data.length).toLowerCase();
        if((ext.indexOf("gif") == 0) || (ext.indexOf("jpg")== 0) || (ext.indexOf("jpeg")== 0) || (ext.indexOf("png")== 0) ) {  // - 가 포함되었다면,
          $(this).closest('form').trigger('submit');
        } else {
          alert("업로드 할 수 없는 파일 형식입니다.");  //경고문 출력
        }
      });

      // ajax 를 이용해 파일 업로드
      $("form#frm3").submit(function(event){      
        event.preventDefault();
      if(typeof FormData == "undefined"){
          fileUpload2();
      } else{
        var fdd = new FormData($(this)[0]); 
      }
        console.debug("4.ajax", $);
        $.ajax({
              url: "./prod_image_uploadAjax.php",
              type: "POST",
          data: fdd,
              async: false,
              cache: false,
              contentType: false,
              processData: false,
              success:  function(data){
                var obj = $.parseJSON(data);
                if (obj.prog == "true") {
                  let fAry = obj.filename.split("||");
                  document.querySelector("input[name='imageurl'").value= fAry[0];
                  document.querySelector("#filename1_label").innerHTML = fAry[1];
                }  //  if (obj.success == "true") {
              } // success
          }); 
        return false;
      });

    })

    $(function () {
      $('[data-toggle="popover"]').popover()
    })

    function checkFrm(){
      if(window.addProdFrm.title.value.length < 1){
        alert("상품명을 입력해주세요");
        return
      }
      if(window.addProdFrm.price.value.length < 1){
        alert("상품 가격을 입력해주세요");
        return
      }
      if(window.addProdFrm.boardtext.value.length < 1){
        alert("상품 소개를 입력해주세요");
        return
      }
      if(window.addProdFrm.productLink.value.length < 1){
        alert("구매링크를 입력해주세요");
        return
      }
      window.addProdFrm.submit();
    }




  </script>
</body>

</html>