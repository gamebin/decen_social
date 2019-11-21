  <nav class="navbar navbar-expand-lg fixed-top navbar-dark bg-primary shadow-sm" style="background: linear-gradient(135deg, rgba(0,212,255,1) 0%, rgba(0,123,255,1) 100%);">
    <a class="navbar-brand mr-auto mr-lg-0" href="./timeline.php"><img src="../assets/img/logo-light.svg" style="height: 2rem;"></a>
    <button class="navbar-toggler p-0 border-0" type="button" data-toggle="offcanvas">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="navbar-collapse offcanvas-collapse" id="navbarsExampleDefault">
      <ul class="navbar-nav ml-auto">
        <li class="nav-item active">
          <a class="nav-link" href="./product.php"><i class="fas fa-box-open"></i> <span class="d-inline d-lg-none ml-1">상품 리스트</span></a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="./profile.php"><i class="fas fa-user"></i> <span class="d-inline d-lg-none ml-1">마이페이지</span></a>
        </li>
      </ul>
      <form class="form-inline my-2 my-lg-0 ml-lg-3">
        <div class="input-group">
          <input type="text" class="form-control border-light" placeholder="검색">
          <div class="input-group-append">
            <button class="btn btn-outline-light" type="button" id="button-addon2"><i class="fas fa-search"></i></button>
          </div>
        </div>
      </form>
    </div>
  </nav>
<script>
function go_profile(userid) {
	document.nav_frm.profileId.value =userid;
	document.nav_frm.method = "post";
	document.nav_frm.action = "./profile.php";
	document.nav_frm.submit();
}
</script>

<form name="nav_frm" method="post">
  <input type="hidden" name="profileId" value="">
</form>