<?php
	include "./this_user.php";
	$boardtext = $_REQUEST["boardtext"];
	$userid = $_REQUEST["userid"];
	$title = $_REQUEST["title"];
	$imageurl = $_REQUEST["imageurl"];
	$regYHS = $_REQUEST["regYHS"];
	$userIp =  $_SERVER['REMOTE_ADDR'];
	$productLink = $_REQUEST["productLink"];
	$price = $_REQUEST["price"];
	$gRstArry = array();
	$gRstArry["data"] = array();

	// image upload not yet completed
	$imageurl = "../assets/img/bg-default01.jpg";
	
	$SQL = "INSERT INTO db_product (boardtext, userid, title, imageurl, regYHS,userIp,productLink,price)";
	$SQL .= " values ('$boardtext'";
	$SQL .= ", '$userid'";
	$SQL .= ", '$title'";
	$SQL .= ", '$imageurl'";
	$SQL .= ", now() ";
	$SQL .= ", '$userIp' ";
	$SQL .= ", '$productLink' ";
	$SQL .= ", '$price')";

  $result = mysqli_query($kiki_conn, $SQL);
	
	if( $result === false) {
		?>
		<script>
			alert("상품이 등록되지 않았습니다.");
			window.location.goback();
		</script>
		<?
		exit();
	}else{
		header("Location: product-list.php");
		exit();
	}

?>