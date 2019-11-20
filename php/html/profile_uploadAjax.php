<?php header('Access-Control-Allow-Credentials: true'); ?>
<?php  header('Access-Control-Allow-Origin:http://starplanner.kr'); ?>
<?php
header('charset=UTF-8');
	include "./this_user.php";
	if ($_FILES['filename1']['name']) {
		$filename = upload($_FILES['filename1'],5*1024*1024,'profile');
		$fileSize = $_FILES['filename1']['size']; 
	}

function upload(&$file,$limit_file_size, $folder1)    {
   $save_dir="../data";
   //금지된 확장자 설정 - 금지할 확장자를 추가해서 사용
   $ban_ext = array('php','php3','html','htm','cgi','pl','asp','jsp','exe','com','inc','bat');

   //업로드 파일 제한 크기를 초과하였는지 확인
   if ($file[size] > $limit_file_size) {    
     //파일의 크기를 아래의 단위로 표시합니다.
     $unit=Array("Bytes", "KB", "MB", "GB");
     for ($i=0; $limit_file_size>=1024; $limit_file_size>>=10, $i++);
       $file_size = sprintf("%d $unit[$i]", $limit_file_size);
       //  MsgBox("업로드 파일 크기 제한 : $file_size");
	   $filename = "";
     }

     //확장자를 이용하여 업로드 가능한 파일인지 체크한다.
     $temp_name = explode(".",$file['name']);
//	 $temp_name = str_replace(" ","",$temp_name);
     $ext = strtolower($temp_name[sizeof($temp_name)-1]);
     $temp_name2 = str_replace("&","",$file['name']);
//	 $temp_name2 = str_replace(" ","",$temp_name2);
	if (in_array($ext,$ban_ext)) {
   //     MsgBox("업로드가 불가능한 확장자입니다.");
		$filename = "";
    }
            
    //같은 파일명이 있지 않게 하기위해 파일명을 절대 중복이 불가능하게 만든다.
    mt_srand((double)microtime()*1000000);
    $new_file_name = time() . mt_rand(10000,99999);

    $file_name = $new_file_name . '.' . $ext; //파일 이름뒤에 확장자를 붙인다.
    $file_name_db = $file_name . '||' . $temp_name2; //db에 저장될 화일명 예) 새파일명||원래파일명
	$re_ext = strtolower($ext);
	$sumFile = $save_dir.'/'.$folder1.'/thumb_'.$file_name;
// 이미지 회전 될까요?
 if($re_ext == "jpg" or $re_ext == "jpeg" or $re_ext == "png" or $re_ext == "bmp" or $re_ext == "gif") {
    if($re_ext == "jpg" || $re_ext == "jpeg"){
        $image = imagecreatefromjpeg($file['tmp_name']);
    }else if($re_ext == "png"){
        $image = imagecreatefrompng($file['tmp_name']);
    }else if($re_ext == "bmp" || $re_ext == "wbmp"){
        $image = imagecreatefromwbmp($file['tmp_name']);
    }else if($re_ext == "gif"){
        $image = imagecreatefromgif($file['tmp_name']);
    }
    $exif = exif_read_data($file['tmp_name']);
    if(!empty($exif['Orientation'])) {
        switch($exif['Orientation']) {
            case 8:
                $image = imagerotate($image,90,0);
                break;
            case 3:
                $image = imagerotate($image,180,0);
                break;
            case 6:
                $image = imagerotate($image,-90,0);
                break;
        }
        if($re_ext == "jpg" || $re_ext == "jpeg"){
            imagejpeg($image,$file['tmp_name']);
        }else if($re_ext == "png"){
            imagepng($image,$file['tmp_name']);
        }else if($re_ext == "bmp" || $re_ext == "wbmp"){
            imagewbmp($image,$file['tmp_name']);
        }else if($re_ext == "gif"){
            imagegif($image,$file['tmp_name']);
        }
    }
 }
// 이미지 회전 될까? 
    //화일을 지정된 폴더로 이동시킨다.
   if(move_uploaded_file($file['tmp_name'],$save_dir.'/'.$folder1.'/'.$file_name)) {
     @unlink($file['tmp_name']);
     return $file_name_db;
   } else {
     @unlink($file['tmp_name']);
	 $filename = "";
   } 
}

function del_file($file, $folder1) {
    $save_dir="../data";
    $temp_name = explode('||',$file); 
    $save_file_name = $temp_name[0];
//echo "file = $file / save = $save_file_name ";
    if( preg_match( "#\.\./|\/\/#", $save_file_name ) ) return;
    if(file_exists($save_dir.'/'.$folder1.'/'.$save_file_name)) {
	//	if(!(@unlink($save_dir.'/'.$folder1.'/thumb_'.$save_file_name))); //MsgBox("파일을 삭제하는데 실패하였습니다.");
		if(!(@unlink($save_dir.'/'.$folder1.'/'.$save_file_name))); //MsgBox("파일을 삭제하는데 실패하였습니다.");
    }
}

if ($filename) {
 // 기존에 업로드 된 파일이 있으면 삭제합니다.
	$SQL = " Select image from db_user ";
	$SQL .= " where userid = '$UserID' and delFlag = 'N'";
//echo $SQL ."<BR>";
	$result = mysqli_query($kiki_conn, $SQL);
	if( $result === false) {
		 die( print_r( mysqli_connect_error(), true) );
	} else {
		$row = mysqli_fetch_array($result, MYSQLI_ASSOC);
		$photo = $row["image"];
		$firstchk = substr($photo,0,4);
		if ($photo AND $firstchk != "http" and $firstchk != "./as") { //회원 업로드
			del_file($photo,'profile');
		}
	 mysqli_free_result($result);
	}

	$SQL = "UPDATE db_user SET ";
	$SQL .= " image = '$filename'";
	$SQL .= " where  userid = '$UserID' and delFlag = 'N'";
	$result = mysqli_query($kiki_conn, $SQL);
	if ( $result === false ) {
	   die( print_r( mysqli_connect_error(), true));
	}
	mysqli_close($kiki_conn);
	echo  '{"prog":"true","filename":"'. $filename .'"}';
} else {
	mysqli_close($kiki_conn);
	echo '{"prog":"'. $_FILES['filename1']['name'] .'"}';
}

?>