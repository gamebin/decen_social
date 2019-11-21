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
			  location.href = "./member-list.php"
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