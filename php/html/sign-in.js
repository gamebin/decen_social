function fn_sign_in() {
     if ($("#inputEmail").val() < 1) {
          alert("아이디를 입력하세요.");
          $("#inputEmail").focus();
          return;
     }
     if ($("#inputPassword").val() < 1) {
          alert("비밀번호를 입력하세요.");
          $("#inputPassword").focus();
          return;
     }
	$.ajax({
		type: 'POST',
		dataType: 'json',
		url: "./sign-inAjax.php?callback=?",
		data: {
			"UserID" : $("#inputEmail").val(),
			"passwd" : $("#inputPassword").val(),
		},
		success: function (data) {
		  if(data.prog == "true"){
			  location.href = "./profile.php"
		  } else {
			alert(data.msg);
		  }
		},
		error: function (request, status, error) {
			console.log('code: '+request.status+"\n"+'message: '+request.responseText+"\n"+'error: '+error);
		}
	});
}

function passwd_onkeyup(event) {
	if (event.keyCode == 13) { // Enter 키 입력확인
	  fn_sign_in();
	}
}

function email_onkeyup(event) {
	if (event.keyCode == 13) { // Enter 키 입력확인
	  find_userid();
	}
}

function find_userid() {
     if ($("#inputEmail").val() < 1) {
          alert("이메일을 입력하세요.");
          $("#inputEmail").focus();
          return;
     }
	$.ajax({
		type: 'POST',
		dataType: 'json',
		url: "./find-useridAjax.php?callback=?",
		data: {
			"email" : $("#inputEmail").val(),
		},
		success: function (data) {
		  if(data.prog == "true"){
			alert(data.msg);
		  } else {
			alert(data.msg);
		  }
		},
		error: function (request, status, error) {
			console.log('code: '+request.status+"\n"+'message: '+request.responseText+"\n"+'error: '+error);
		}
	});
}

function findpw_onkeyup(event) {
	if (event.keyCode == 13) { // Enter 키 입력확인
	  find_password();
	}
}

function find_password() {
      if ($("#inputUserid").val() < 1) {
          alert("아이디를 입력하세요.");
          $("#inputUserid").focus();
          return;
     }
	 if ($("#inputEmail").val() < 1) {
          alert("이메일을 입력하세요.");
          $("#inputEmail").focus();
          return;
     }
	$.ajax({
		type: 'POST',
		dataType: 'json',
		url: "./find-passwordAjax.php?callback=?",
		data: {
			"userID" : $("#inputUserid").val(),
			"email" : $("#inputEmail").val(),
		},
		success: function (data) {
		  if(data.prog == "true"){
			alert(data.msg);
		  } else {
			alert(data.msg);
		  }
		},
		error: function (request, status, error) {
			console.log('code: '+request.status+"\n"+'message: '+request.responseText+"\n"+'error: '+error);
		}
	});
}

function chkuserid() {
	ret = true
	userid = $("#UserID").val();

	var posstr="abcdefghijklmnopqrstuvwxyz1234567890"
    var strstr="abcdefghijklmnopqrstuvwxyz"
	var strnum="1234567890";
	var tmp = userid.length;
    var tmp1 = 0;   // 아이디가 허용된 문자가 아닌지 확인
	var tmp2 = 0;   // 아이디가 문자로만 이루어지는지 확인.
	var tmp4 = 0;   // 아이디가 숫자로만 이루어지는지 확인.

    for(i=1;i<=tmp;i++){
        tmp3 = userid.substring(i-1,i);    //한글자씩 뽑는다.
	   if(posstr.indexOf(tmp3)==-1){   //아이디로 허용된 문자가 아닌 문자가 들어온 경우.
         tmp1++
       }
  /*     if(strstr.indexOf(tmp3)!=-1){   //아이디에 문자만 포함된경우.
         tmp2++
       }
	   if(strnum.indexOf(tmp3)!=-1){   //아이디에 숫자만 포함된경우.
         tmp4++
       } */
    }
//    if(tmp1!=0 || tmp2==0 || tmp4==0 || userid.length<4 || userid.length>12){
	if(tmp1!=0 || userid.length<4 || userid.length>20){
        alert('아이디는 영문(소문자)과 숫자의 조합 4~20자리내에서 입력하세요');
		$("#UserID").val('')
		$("#UserID").focus();
        ret = false;
    }
	return ret;
}

function chkuserid02() {
	$.ajax({
		type: 'POST',
		dataType: 'json',
		url: "./sign-up_checkidAjax.php?callback=?",
		data: {
			"UserID" : $("#UserID").val() ,
		},
		success: function (data) {
		  if(data.prog == "true") {
	        text = "<strong>사용 가능한 아이디</strong>입니다."
	        $("#userid_success_text").html(text);
	        $("#userid_success_text").show();
	        $("#userid_danger_text").text('');
	        $("#userid_danger_text").hide();

			$("#userid_chk").val("Y");
			fn_sign_up02();
			return true;
		  } else {
	        text = "<strong>이미 존재하는 아이디</strong>입니다."
	        $("#userid_success_text").text('');
	        $("#userid_success_text").hide();
	        $("#userid_danger_text").html(text);
	        $("#userid_danger_text").show();

			$("#userid_chk").val("N");
			return false;
		  }
		},
		error: function (request, status, error) {
			$("#userid_chk").val("N");
			return false;
		}
	});
}

function chkemail() {
	$.ajax({
		type: 'POST',
		dataType: 'json',
		url: "./sign-up_checkemailAjax.php?callback=?",
		data: {
			"email" : $("#email").val() ,
		},
		success: function (data) {
		  if(data.prog == "true") {

	        text = "<strong>사용 가능한 이메일</strong>입니다."
	        $("#email_success_text").html(text);
	        $("#email_success_text").show();
	        $("#email_danger_text").text('');
	        $("#email_danger_text").hide();

			$("#email_chk").val("Y");
			fn_sign_up02();
			return true;
		  } else {
	        text = "<strong>이미 존재하는 이메일</strong>입니다."
	        $("#email_success_text").text('');
	        $("#email_success_text").hide();
	        $("#email_danger_text").html(text);
	        $("#email_danger_text").show();

			$("#email_chk").val("N");
			return false;
		  }
		},
		error: function (request, status, error) {
			$("#email_chk").val("N");
			return false;
		}
	});
}

function fn_sign_up() {
    $("#btn_write").prop("disabled", true);
	if ($("#UserID").val() < 1) {
          alert("아이디를 입력하세요.");
          $("#UserID").focus();
		  $("#btn_write").prop("disabled", false);
          return;
    }
	if ($("#UserID").val().length > 0) {
		if(chkuserid() == false) {
			$("#btn_write").prop("disabled", false);
			return;
		}
	}
	useridchk = $("#userid_chk").val();
	if (useridchk == "N" && $("#UserID").val().length > 0) {
		if(!chkuserid02()) {
			$("#btn_write").prop("disabled", false);
			return;
		} else {
			$("#btn_write").prop("disabled", false);
			return;
		}
	}
	if ($("#UserName").val() < 1) {
       alert("이름을 입력하십시오");
       $("#UserName").focus();
	   $("#btn_write").prop("disabled", false);
       return;
    }
	if ($("#email").val() < 1) {
          alert("이메일을 입력하세요.");
          $("#email").focus();
		  $("#btn_write").prop("disabled", false);
          return;
    }
	if ($("#email").val().length > 0) {
		if(tomail() == false) {
			$("#btn_write").prop("disabled", false);
			return;
		}
	}
	emailchk = $("#email_chk").val();
	if (emailchk == "N" && $("#email").val().length > 0) {
		if(!chkemail()) {
			$("#btn_write").prop("disabled", false);
			return;
		} else {
			$("#btn_write").prop("disabled", false);
			return;
		}
	}

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
	if ($("#passwd").val().length > 0) {
		if(!checkpw()) {
			$("#btn_write").prop("disabled", false);
			return;
		} else {
	        $("#email_success_text").text('');
	        $("#email_success_text").hide();
	        $("#email_danger_text").text('');
	        $("#email_danger_text").hide();
		}
	}
	if ($("#passwd").val().length > 0) {
		if(!checkpw2()) {
			$("#btn_write").prop("disabled", false);
			return;
		} else {
	        $("#email_success_text").text('');
	        $("#email_success_text").hide();
	        $("#email_danger_text").text('');
	        $("#email_danger_text").hide();
		}
	}
	fn_sign_up02();
}

function fn_sign_up02() {
	$("#passwd_danger_text").text('');
	$("#passwd_danger_text").hide();

	if ($("#UserID").val() < 1) {
          alert("아이디를 입력하세요.");
          $("#UserID").focus();
		  $("#btn_write").prop("disabled", false);
          return;
    }
	if ($("#UserID").val().length > 0) {
		if(chkuserid() == false) {
			return;
		}
	}
	if ($("#UserName").val() < 1) {
       alert("이름을 입력하십시오");
       $("#UserName").focus();
	   $("#btn_write").prop("disabled", false);
       return;
    }
	if ($("#email").val() < 1) {
          alert("이메일을 입력하세요.");
          $("#email").focus();
		  $("#btn_write").prop("disabled", false);
          return;
    }
	if ($("#email").val().length > 0) {
		if(tomail() == false) {
			$("#btn_write").prop("disabled", false);
			return;
		}
	}
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
	useridchk = $("#userid_chk").val();
	emailchk = $("#email_chk").val();
	if (useridchk == "N") {
		chkuserid02();
		return;
	}
	if (emailchk == "N") {
		chkemail();
		return;
	}
  if (emailchk == "Y" && useridchk == "Y") {	// 사용 가능 이메일이라면
	$.ajax({
		type: 'POST',
		dataType: 'json',
		url: "./sign-upAjax.php?callback=?",
		data: {
			"UserID" : $("#UserID").val(),
			"email" : $("#email").val(),
			"UserName" : $("#UserName").val(),
			"passwd" : $("#passwd").val(),
		},
		success: function (data) {
		  if(data.prog == "true"){
			alert("회원가입이 완료되었습니다.");
			location.href="./sign-in.php";
		  } else {
			alert(data.msg);
		  }
		},
		error: function (request, status, error) {
			console.log('code: '+request.status+"\n"+'message: '+request.responseText+"\n"+'error: '+error);
		}
	});
  } else {
	  alert("중복된 아이디 혹은 이메일이 있습니다.");
	  $("#btn_write").prop("disabled", false);
  }
}

// 이메일 검증
function tomail() {
	ret = true;
	email = $("#email").val();
	var regex=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;   
		  
	if(regex.test(email) === false) {  
		alert("잘못된 이메일 형식입니다.");  
		$("#email").focus();	
		return false;  
	} else {  
		return ret;
	}
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
