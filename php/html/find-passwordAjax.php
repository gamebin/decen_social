<?php header('X-UA-Compatible: IE=edge'); ?>
<?php header('X-UA-Compatible: IE=8'); ?>
<?php
header('Content-Type: application/json; charset=UTF-8');
//header('charset=UTF-8');

	include "./this_user.php";
$userID = kiki_ischar($_POST["userID"]);
$email = kiki_ischar($_POST["email"]);

// send html mail
function send_htmlmail($fromEmail, $fromName, $toEmail, $toName, $subject, $message){
  $charset='UTF-8'; // 문자셋 : UTF-8
  $body = iconv("UTF-8", "euc-kr", $message);

  $encoded_subject="=?".$charset."?B?".base64_encode($subject)."?=\n"; // 인코딩된 제목
  $to= "\"=?".$charset."?B?".base64_encode($toName)."?=\" <".$toEmail.">" ; // 인코딩된 받는이
  $from= "\"=?".$charset."?B?".base64_encode($fromName)."?=\" <".$fromEmail.">" ; // 인코딩된 보내는이

  $headers="MIME-Version: 1.0\n".
    "Content-Type: text/html; charset=euc-kr; format=flowed\n".
//    "To: ". $to ."\n".
    "From: ".$from."\n".
    "Return-Path: ".$from."\n".
    "urn:content-classes:message\n".
    "Content-Transfer-Encoding: 8bit\n"; // 헤더 설정
  //send the email
  $mail_sent = @mail( $to, $encoded_subject, $body, $headers, $fromEmail );

  //if the message is sent successfully print "Mail sent". Otherwise print "Mail failed"  return $mail_sent;
}
	$SQL = "select userSerno from db_user where userid = '$userID' ";
	$SQL .= " and email = '$email' and delFlag = 'N' ";
	$res = mysqli_query($kiki_conn, $SQL);
	if( $res === false) {
		 die( print_r( mysqli_connect_error(), true) );
	} else {
		$row = mysqli_fetch_array($res, MYSQLI_ASSOC);
		$chk_UserID = $row["userSerno"];
		mysqli_free_result($res);
	}

if(!$chk_UserID) {		//'같은 이메일이 없다면 
	$prog = "false";
	$msg = "입력하신 아이디, 이메일과 일치한 정보가 없습니다.";
} else {// 아이디가 있다면 
	/* 랜덤 문자 */
  $feed = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"; 
  $size = 6;
  $string = (string)time();
  for ($i=0; $i < $size; $i++) {
	$chk2 = substr($feed, rand(0, strlen($feed)-1), 1);
	if ($i % 2) {
		$new_passwd .= $string{$i}; 
	} else {
		$new_passwd .= $chk2;
	}
  }
	if($new_passwd) {
		$passwd = hash("sha256",$new_passwd,true);
		$passwd = base64_encode($passwd);
	}
	$SQL2 = "UPDATE db_user SET ";
	$SQL2 .= " userpasswd = '$passwd'";
	$SQL2 .= " where userid = '$userID' ";
	$SQL2 .= " and email = '$email' and delFlag = 'N' ";
/**/	$result2 = mysqli_query($kiki_conn, $SQL2);
	if ( $result2 === false ) {
	   die( print_r( mysqli_connect_error(), true));
	}

	$prog = "true";
	$msg = "[".$email."]로 임시 비밀번호가 발급되었습니다.";

//'''''''''' 메일 보내기

  $message .="   <div> 임시 비밀번호 : $new_passwd </div> ";
  $message .="   <a href='login.php' style='display:block; text-align:center' target=_blank>로그인</a>";

  $result = send_htmlmail('master@linking.kr', '관리자', $email, "회원님", '임시비밀번호 전송', $message);
//''' 가입 메일 보내기 끝났습니다.
}

mysqli_close($kiki_conn);	

echo $_REQUEST["callback"]."({'prog':'". $prog ."','msg' : '". $msg ."'})";	?>