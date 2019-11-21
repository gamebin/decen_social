function GoWrite() {
    if ($("#boardtext").val().length < 1) {
        alert("글을 입력하세요.");
        $("#boardtext").focus();
        return;
    }
	$.ajax({
        url: './timeline_writeAjax.php?callback=?',
        type: 'POST',
		data: {
		  "boardtext" :$("#boardtext").val(),
       },
        contentType: 'application/x-www-form-urlencoded;charset=UTF-8', 
        dataType: 'html',
        success: function (data) {
//	      $("#pro_con01").empty();
		  $(data).prependTo($("#pro_con01"));
	      $("#boardtext").val('');
	    },
        error: function(xhr, status, error) {
		 alert("error : "+error);
	    }
 	});
}

function GoWrite_review(num) {
    if ($("#review_cont_"+num).val().length < 1) {
        alert("글을 입력하세요.");
        $("#review_cont_"+num).focus();
        return;
    }
	$.ajax({
        url: './timeline_review_writeAjax.php?callback=?',
        type: 'POST',
		data: {
		  "review" :$("#review_cont_"+num).val(),
		  "num" :num,
       },
        contentType: 'application/x-www-form-urlencoded;charset=UTF-8', 
        dataType: 'html',
        success: function (data) {
console.log("data="+data)
console.log("num="+num)
		  $("#pro_con01_"+num).empty();
		  $(data).appendTo($("#pro_con01_"+num));
	      $("#review_cont_"+num).val('');
		  reviewcnt = $("#review_cnt_"+num).text();
		  reviewcnt = Number(pg) + 1;
	      $("#review_cnt_"+num).text(reviewcnt);
	    },
        error: function(xhr, status, error) {
		 alert("error : "+error);
	    }
 	});
}

function remove_review_board(reviewSerno, num) {
	$.ajax({
        url: './timeline_review_removelikedAjax.php?callback=?',
        type: 'POST',
		data: {
		  "reviewSerno": reviewSerno,
		  "num": num,
       },
        contentType: 'application/x-www-form-urlencoded;charset=UTF-8', 
        dataType: 'json',
        success: function (data) {
			if(data.prog == "true"){
			  $("#review_"+reviewSerno).remove();
//			  $("#reviewcnt").text(data.reviewcnt);
			} else {
				alert(data.msg);
			}
	    },
        error: function(xhr, status, error) {
		 alert("error : "+error);
	    }
 	});
}
// 상품 불러오기
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
		  $("#pro_con02").empty();
		  $(data).appendTo($("#pro_con02"));
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
//	      $("#pro_con02").empty();
		  $(data).appendTo($("#pro_con02"));
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