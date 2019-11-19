<?php header('X-UA-Compatible: IE=edge'); ?>
<?php header('X-UA-Compatible: IE=8'); ?>
<?php
	include "./this_user.php";
header('charset=UTF-8');
	setcookie("UserID", "", -1,"/","linking.kr");
	setcookie("UserID", "", -1,"/","www.linking.kr");
	setcookie("UserID", "", -1,"/",$this_domain);

	$redirectUrl = "./index.php";
mysqli_close ($kiki_conn);		?>

<script>
var redirectUrl = "<?=$redirectUrl?>";
 location.href=redirectUrl;
</script>