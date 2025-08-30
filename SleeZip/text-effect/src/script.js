document.querySelectorAll('.smoke').forEach(elem => elem.innerHTML = '<div><span>' + elem.textContent.trim().split('').join('</span><span>') + '</span></div>');

const trigger = () => {
	document.querySelector('.smoke').classList.add('active')
	setTimeout(() => {
		document.querySelector('.smoke').classList.remove('active');
		
		setTimeout(() => trigger(), 3000);
	}, 2000);
}

trigger()