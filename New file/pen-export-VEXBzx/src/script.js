$(document).ready(function () {
	var currCell = $('.svg-wrapper svg .data-row:eq(0)').find('.data-col').not('.no-target').first(),
			targetCell,
			indexFromEnd;
	
	//currCell.find('a').focus();
	
	$('.svg-wrapper svg').on('focus', function (e) {
		e.preventDefault();
		currCell.find('a').focus();
	});

	$('.svg-wrapper svg a').on('click, focus', function (e) {
		e.preventDefault();
		currCell = $(this).parent('g');
	});

	$('.svg-wrapper svg').keydown(function (e) {
		if (e.which != 13) {
			e.preventDefault();
		}
		targetCell = '';
		indexFromEnd = '';

		if (e.which == 39) {//Right
			targetCell = currCell.nextAll(':not(.no-target)').first();
			if (targetCell.length == 0) {
				targetCell = currCell.closest('.data-row').next('.data-row').find('.data-col').not('.no-target').first();
			}
		} else if (e.which == 37) {//Left
			targetCell = currCell.prevAll(':not(.no-target)').first();
			if (targetCell.length == 0) {
				targetCell = currCell.closest('.data-row').prev('.data-row').find('.data-col').not('.no-target').last();
			}
		} else if (e.which == 38) {//Up
			indexFromEnd = (currCell.closest('.data-row').find('.data-col').length - currCell.index()) * -1;
			targetCell = currCell.closest('.data-row').prev('.data-row').find('.data-col:eq(' + indexFromEnd + ')').not('.no-target');
			if (targetCell.length == 0) {
				targetCell = currCell.closest('.data-row').prevAll('.data-row').eq(1).find('.data-col:eq(' + indexFromEnd + ')').not('.no-target');
			}
		} else if (e.which == 40) {//Down
			indexFromEnd = (currCell.closest('.data-row').find('.data-col').length - currCell.index()) * -1;
			targetCell = currCell.closest('.data-row').next('.data-row').find('.data-col:eq(' + indexFromEnd + ')').not('.no-target');
			if (targetCell.length == 0) {
				targetCell = currCell.closest('.data-row').nextAll('.data-row').eq(1).find('.data-col:eq(' + indexFromEnd + ')').not('.no-target');
			}
		}

		if (targetCell.length > 0) {
			currCell = targetCell;
			currCell.find('a').focus();
		}
	});
});