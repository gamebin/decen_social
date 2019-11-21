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
	$pagesize = 5;
	$cur_page = kiki_isnumb($_POST["cur_page"]);
	if (!$cur_page) {
	   $cur_page = 1;
	}

	$SQL = "Select count(boardSerno) as totcnt from db_product a ";
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
mysqli_close($kiki_conn);		?>

  <main role="main" class="container">

    <div class="row mt-3">
      <div class="col-12">

        <h4 class="my-3">상품 리스트</h4>
		<div id="pro_con01">
<!-- Ajax 내용 보이기 -->
		</div>

      <div id="more_page" style="display:<?=$display?>" class="text-right my-3"><a href="javascript:kiki_list();"><small>더보기 <i class="fas fa-chevron-down"></i></small></a></div>
      </div>
    </div>
  </main>
<?		include "./inc_footer.php"	?>
</body>
<script>
$(function () {	
	load_cont();
});

function load_cont(){
	$("#cur_page").val(2);
	$.ajax({
        url: './product_Ajax.php?callback=?',
        type: 'POST',
		data: {
		  "cur_page": 1,
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
        url: './product_Ajax.php?callback=?',
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

function go_detail(num, uri){
  document.list.num.value = num;
  document.list.method = "post";
  document.list.action = "product-detail.php";
  document.list.submit();
}
</script>


</body>
</html>
<form name="list" method="post">
  <input type="hidden" name="cur_page" value="<?=$cur_page?>" id="cur_page">
  <input type="hidden" name="num" value="">
</form>