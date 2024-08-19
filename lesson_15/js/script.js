document.addEventListener('click', function (e) {
	const targetElement = e.target;
	if (targetElement.closest('.burger-button')) {
		document.documentElement.classList.toggle('menu-open');
	}
})