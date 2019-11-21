<?php	
	function get_page_nums($cur_page,$totpage,$page_per_block){
		$pageArry=array();
		$pageArry["data"]=array();
		$pageArry["cur_page"]=$cur_page;
		$pre_page = $cur_page - 1;
		$next_page = $cur_page + 1;
		$member_page = 0;
		$block = 1;
		$rstHTML ="";
		// 전체 블럭수를 구한다.
		if ($totpage % $page_per_block == 0 ) {
			$total_block = (int)($totpage / $page_per_block);
		} else { 
			$total_block = (int)($totpage / $page_per_block) + 1;
		}
		
		// 현재 페이지의 블럭 위치를 구한다.
		if ($cur_page % $page_per_block == 0 ) {
			$block = (int)($cur_page / $page_per_block);
		} else {
			$block = (int)($cur_page / $page_per_block) + 1;
		}
		
		$first_page = ($block -1 ) * $page_per_block + 1;
		$last_page = $block*$page_per_block;

		if ($total_block <= $block) {
			$last_page = $totpage;
		}
		if ($pre_page >= 1) {
			$rstHTML = $rstHTML.
			
			 '<li class="page-item">'.
              '<a class="page-link bg-secondary border-dark text-light" href="Javascript:list('.$pre_page.')" tabindex="-1" aria-disabled="true">이전</a>'.
            '</li>';
		}
		$direct_page = $first_page;
		while($direct_page <= $last_page) {
		//echo "direct_page = ".$direct_page ."<BR>";
			if ((int)($direct_page) == (int)($cur_page)) {
				$rstHTML = $rstHTML.
					 '<li class="page-item">'.
					 '<a class="page-link bg-primary border-dark text-light" href="#">'.$direct_page.'</a></li>';			
			} else {
				$rstHTML = $rstHTML.
					'<li class="page-item">'.
						'<a class="page-link bg-secondary border-dark text-light" href="JavaScript:list('.$direct_page.')">'.$direct_page.'</a>'.
					'</li>';				
			}
			$direct_page = $direct_page + 1;
		};
		if ($next_page <=	$totpage) {
			$rstHTML = $rstHTML.
			'<li class="page-item">'.
			  '<a class="page-link bg-secondary border-dark text-light"  href="Javascript:list('.$next_page.')">다음</a>'.
			'</li>';
		}
		return $rstHTML;
	}
?>