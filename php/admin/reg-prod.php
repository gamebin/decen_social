<?php
	include "./this_user.php";
	$boardtext = $_REQUEST["boardtext"];
	$userid = $_REQUEST["userid"];
	$title = $_REQUEST["title"];
	$imageurl = $_REQUEST["imageurl"];
	$regYHS = $_REQUEST["regYHS"];
	$userIp =  $_SERVER['REMOTE_ADDR'];
	$productLink = $_REQUEST["productLink"];
	$isEdit = $_REQUEST["isEdit"];
	$price = $_REQUEST["price"];
	$boardSerno = $_REQUEST["boardSerno"];
	$gRstArry = array();
	$gRstArry["data"] = array();
	$SQL = "";
	if($_REQUEST["isEdit"] == "Y"){
		$SQL = "UPDATE db_product ";
		$SQL .= "SET boardtext = '".$boardtext."',";
		$SQL .= " userid = '".$userid."',";
		$SQL .= " title = '".$title."',";
		$SQL .= " userIp = '".$userIp."',";
		$SQL .= " productLink = '".$productLink."',";
		$SQL .= " imageurl = '".$imageurl."',";
		$SQL .= " price = '".$price."' where boardSerno = '".$boardSerno."'";
	}else{
		$SQL = "INSERT INTO db_product (boardtext, userid, title, imageurl, regYHS,userIp,productLink,price)";
		$SQL .= " values ('$boardtext'";
		$SQL .= ", '$userid'";
		$SQL .= ", '$title'";
		$SQL .= ", '$imageurl'";
		$SQL .= ", now() ";
		$SQL .= ", '$userIp' ";
		$SQL .= ", '$productLink' ";
		$SQL .= ", '$price')";

	}


  $result = mysqli_query($kiki_conn, $SQL);
	
	if( $result === false) {
		echo("SQL : $SQL");
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

	function modProd(){

	}

?>