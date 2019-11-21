<?  $kiki_conn = mysqli_connect("127.0.0.1","linkin","linkin!@db#$") or die("SQL Server 에 연결할 수 없습니다.". mysqli_connect_error());
 mysqli_select_db($kiki_conn, 'linking_db') or die("SQL Server 에 연결할 수 없습니다.". mysqli_connect_error()); 
$kiki_conn->set_charset("utf8");
error_reporting(0);
$passadmin = "anjfkfRk"	;	
$hostname=$_SERVER["HTTP_HOST"]; 

IF ($hostname != NULL) {
	$hostname_ = explode(":", $hostname);
	$this_domain = $hostname_[0];
} else {
	$this_domain = "linking.kr";
}

$UserID = $_COOKIE["UserID"];

function kiki_isnumb($str) { 
   if(!is_numeric($str)) {
    return "";
   } else {
	   return $str;
   }
}

function kiki_ischar($str) { 
	$str = str_replace( "'", "''", $str );
	$str = str_replace( ";", "", $str );
	$str = str_replace( "--", "", $str );
	$str = str_replace( "1=1", "", $str );
	$str = str_replace( "or 1=1", "", $str );
	$str = str_replace( "sp_", "", $str );
	$str = str_replace( "xp_", "", $str );
	$str = str_replace( "@variable", "", $str );
	$str = str_replace( "@@variable", "", $str );
	$str = str_replace( "exec", "", $str );
	$str = str_replace( "sysobject", "", $str );
	$str = str_replace( "<", "&lt;", $str );
	$str = str_replace( ">", "&gt;", $str );
	return $str;		
}

function kiki_ischar2($str) { 
	$str = str_replace( ";", "", $str );
	$str = str_replace( "--", "", $str );
	$str = str_replace( "1=1", "", $str );
	$str = str_replace( "or 1=1", "", $str );
	$str = str_replace( "sp_", "", $str );
	$str = str_replace( "xp_", "", $str );
	$str = str_replace( "@variable", "", $str );
	$str = str_replace( "@@variable", "", $str );
	$str = str_replace( "exec", "", $str );
	$str = str_replace( "sysobject", "", $str );
	$str = str_replace( "<", "&lt;", $str );
	$str = str_replace( ">", "&gt;", $str );
	return $str;		
}

function kiki_ischar3($str) { 
	$str = str_replace( "'", "''", $str );
//	$str = str_replace( ";", "", $str );
	$str = str_replace( "--", "", $str );
	$str = str_replace( "1=1", "", $str );
	$str = str_replace( "or 1=1", "", $str );
	$str = str_replace( "sp_", "", $str );
	$str = str_replace( "xp_", "", $str );
	$str = str_replace( "@variable", "", $str );
	$str = str_replace( "@@variable", "", $str );
	$str = str_replace( "exec", "", $str );
	$str = str_replace( "sysobject", "", $str );
	$str = str_replace( "<script", "&lt;script", $str );
	$str = str_replace( "script>", "script&gt;", $str );
	return $str;
}

function kiki_utf8_length($str) {
  $len = strlen($str);
  for ($i = $length = 0; $i < $len; $length++) {
   $high = ord($str{$i});
   if ($high < 0x80)//0<= code <128 범위의 문자(ASCII 문자)는 인덱스 1칸이동
    $i += 1;
   else if ($high < 0xE0)//128 <= code < 224 범위의 문자(확장 ASCII 문자)는 인덱스 2칸이동
    $i += 2;
   else if ($high < 0xF0)//224 <= code < 240 범위의 문자(유니코드 확장문자)는 인덱스 3칸이동 
    $i += 3;
   else//그외 4칸이동 (미래에 나올문자)
    $i += 4;
  }
  return $length;
 }

function kiki_utf8_strcut($str, $chars, $tail = '...') {  
  if (kiki_utf8_length($str) <= $chars)//전체 길이를 불러올 수 있으면 tail을 제거.
   $tail = '';
  else
   $chars -= kiki_utf8_length($tail);//잘리게 생겼다면 tail 길이만큼 본문을 뺌.
  $len = strlen($str);
  for ($i = $adapted = 0; $i < $len; $adapted = $i) {
   $high = ord($str{$i});
   if ($high < 0x80)
    $i += 1;
   else if ($high < 0xE0)
    $i += 2;
   else if ($high < 0xF0)
    $i += 3;
   else
    $i += 4;
   if (--$chars < 0)
    break;
  }
  return trim(substr($str, 0, $adapted)) . $tail;
 }
	?>
