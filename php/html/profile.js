function fn_profile() {
    $("#btn_write").prop("disabled", true);
	if ($("#UserName").val() < 1) {
       alert("이름을 입력하십시오");
       $("#UserName").focus();
	   $("#btn_write").prop("disabled", false);
       return;
    }
	if ($("#passwd").val()) {
	  if ($("#passwd").val().length < 4) {
		alert("비밀번호를 입력하세요.");
		$("#passwd").focus();
		$("#btn_write").prop("disabled", false);
		return;
	  }
	  if ($("#passwdok").val().length < 4) {
		alert("비밀번호 확인을 입력하세요.");
		$("#passwdok").focus();
		$("#btn_write").prop("disabled", false);
		return;
	  }
	}
	if ($("#passwd").val().length > 0) {
		if(!checkpw()) {
			$("#btn_write").prop("disabled", false);
			return;
		}
	}
	if ($("#passwd").val().length > 0) {
		if(!checkpw2()) {
			$("#btn_write").prop("disabled", false);
			return;
		}
	}
	$.ajax({
		type: 'POST',
		dataType: 'json',
		url: "./profile_Ajax.php?callback=?",
		data: {
			"summary" : $("#summary").val(),
			"UserName" : $("#UserName").val(),
			"passwd" : $("#passwd").val(),
		},
		success: function (data) {
		  if(data.prog == "true"){
			alert("수정 되었습니다.");
			$("#btn_write").prop("disabled", false);
		  } else {
			alert(data.msg);
			$("#btn_write").prop("disabled", false);
		  }
		},
		error: function (request, status, error) {
			console.log('code: '+request.status+"\n"+'message: '+request.responseText+"\n"+'error: '+error);
			$("#btn_write").prop("disabled", false);
		}
	});
}

function checkpw() 	 {
	ret1 = true;
		var strTmp = $("#passwd").val();
		if(strTmp == "") return;

	for (var i=0; i<strTmp.length; i++) {
		var ch = strTmp.charAt(i);
		if(!((ch>="0" && "9">=ch) || (ch>="a" && "z">=ch) || (ch>="A" && "Z">=ch) || ch=="!" || ch=="@" || ch=="$" || ch=="%" || ch=="^" || ch=="&" || ch=="*"))
		{
	        text = "<strong>비밀번호</strong>에는 문자 " +ch+ " 를 사용할 수 없습니다"
	        
			$("#passwd_danger_text").html(text);
	        $("#passwd_danger_text").show();	
			$("#passwd").val('');
			$("#passwdok").val('');
			$("#passwd").focus();
			ret1 = false;
		}
	}
	if(strTmp.length < 4 || strTmp.length > 15) {
	   text = "<strong>비밀번호</strong>를 4자 이상 입력해 주십시오."
	   $("#passwd_danger_text").html(text);
	   $("#passwd_danger_text").show();
	   $("#passwd").val('');
	   $("#passwdok").val('');
	   $("#passwd").focus();
	   ret1 = false;
	}
	if($("#passwd").val() != $("#passwdok").val()) {
	    text = "<strong>비밀번호</strong>확인이 틀렸습니다.다시 입력해 주십시요"
	    $("#passwd_danger_text").html(text);
	    $("#passwd_danger_text").show();	
		$("#passwd").val('');
		$("#passwdok").val('');
		$("#passwd").focus();
		ret1 = false;
	}
	return ret1;
}

function checkpw2() {
	ret = true
	password = $("#passwd").val();

	var posstr="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
    var strstr="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
	var strnum="1234567890";
	var tmp = password.length;
    var tmp1 = 0;   // 비밀번호 허용된 문자가 아닌지 확인
	var tmp2 = 0;   //비밀번호가 문자로만 이루어지는지 확인.
	var tmp4 = 0;   //비밀번호가 숫자로만 이루어지는지 확인.

    for(i=1;i<=tmp;i++){
        tmp3 = password.substring(i-1,i);    //한글자씩 뽑는다.
	   if(posstr.indexOf(tmp3)==-1){   //비밀번호로 허용된 문자가 아닌 문자가 들어온 경우.
         tmp1++
       }
       if(strstr.indexOf(tmp3)!=-1){   //비밀번호에 문자만 포함된경우.
         tmp2++
       }
	   if(strnum.indexOf(tmp3)!=-1){   //비밀번호에 숫자만 포함된경우.
         tmp4++
       }
    }
    if(tmp1!=0 || tmp2==0 || tmp4==0 || password.length<4 || password.length>15){
	    text = "<strong>비밀번호</strong>는 영문과 숫자의 조합 4~15자리내에서 입력하세요"
	    $("#passwd_danger_text").html(text);
	    $("#passwd_danger_text").show();

		$("#passwd").val('')
		$("#passwdok").val('');;
		$("#passwd").focus();
        ret = false;
    }
	return ret;
}

// 파일 input 에 변화가 있다면 업로드
$('#filename1').change(
	function(){
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
	$.ajax({
        url: "./profile_uploadAjax.php",
        type: "POST",
		data: fdd,
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        success:  function(data){
		var obj = $.parseJSON(data)
		  if (obj.prog == "true") {
			var file = myFunction(obj.filename);
			$('#profile1').css("background-image",);
			bgimg = "../data/profile/"+ file.value1;
			$('#profile1').css('background-image','url('+bgimg+')');

		  }  //  if (obj.success == "true") {
        } // success
    }); 
	return false;
});

function fileUpload2() {
	document.getElementById("frm3").target = "uploadIFrame";
	document.getElementById("frm3").action = "./profile_uploadAjax.php"
	document.getElementById("frm3").submit();
	setTimeout("file_view2()",500); // 파일 업로드 시간 때문에 timeout 둠
}

// 이미지 변경
function file_view2() { // 업로드 된 이미지 현재 페이지에 보여주기
	var data = document.getElementById('uploadIFrame').contentWindow.document.body.innerText;
/* */	var obj = JSON.parse(data);
  if (obj.prog == "true") {
	 var file = myFunction(obj.filename);
	 $("#profile1").attr("src","../data/profile/"+ file.value1);
  }  //  if (obj.success == "true") {
}

function myFunction(data) { // 파일명 자르기
  var temp = data;
  var file = temp.split('||');

  var filename = file[0].substring(0,(file[0].lastIndexOf(".") + 1)-1).toLowerCase();
  return {value1: file[0]};
}
