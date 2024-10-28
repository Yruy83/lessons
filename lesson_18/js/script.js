

document.addEventListener('click', function (e) {
	const targetElement = e.target;
	if (targetElement.closest('.menu-burger')) {
		document.documentElement.classList.toggle('menu-open');
		document.body.classList.toggle('lock');  /* Додавання-прибирання класу "lock" до "body" за допомогою якого будемо забороняти скролити сторінку при активному(відкритому меню бургер)*/
	}
})

// Плавна прокрутка

const menuLinks = document.querySelectorAll('.navigation__link[data-goto]');
// Збираємо масив обєктів які будуть приймати участь в навігації (зібрати масив посилань у яких є дата-атрибут "data-goto") 

//  Перевірка чи є щось (текс) в .navigation__link[data-goto]

// if (menuLinks.length > 0) {}  

// якщо є продовжуємо роботу

if (menuLinks.length > 0) {    	                /* Перевірка чи є щось (текс) в .navigation__link[data-goto], якщо є продовжуємо роботу*/

	menuLinks.forEach(menuLink => {             /* Проходимо по кожному menuLink за допомогою "forEach"*/
		menuLink.addEventListener('click', onMenuLinkClick); /*Вішаємо на кожен menuLink по якому пройшли "forEach" подію "click", та переходимо в функцію "onMenuLinkClick"*/

	});

	function onMenuLinkClick(e) {             /* Створюємо функцію "onMenuLinkClick" з аргументом "(е)"*/

		const menuLink = e.target;               /* Отримуємо обєкт на який клікаємо, для цього створюємо "const menuLink = e.target" і отримуємо обєкт на який фактично ми клікаємо тобто саме посилання*/
		
		if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {          /* Створюємо важливу умову: по-перше перевіряємо чи заповнений дата атрибут "goto" (чи є там всередині щось), по-друге перевірити чи існує взагалі обєкт на який посилається сам дата атрибут */

			const gotoBlock = document.querySelector(menuLink.dataset.goto);          /* Отримуємо в константу сам обєкт "menuLink.dataset.goto"*/

			const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset - document.querySelector('header').offsetHeight;  /* Вираховуємо положення обєкту обовязково з врахування висоти шапки "header". "gotoBlock.getBoundingClientRect().top" - отримуємо місце положення обєкта від верху в пікселях. "pageYOffset" - прибавляємо кількість прокручених пікселів по осі "Y". "document.querySelector('header').offsetHeight" - віднімаємо висоту шапки, якщо цього не зробити, то шапка буде наїзджати на секцію і перекривати собою контент секції.*/

			if (document.documentElement.classList.contains('menu-open')) {   /* Перевірка. Якщо документ "html" має клас "menu-open", то ....*/
				document.documentElement.classList.remove('menu-open');        /* ...то прибираємо клас "menu-open"*/
				document.body.classList.remove('lock');                         /* ...та прибираємо клас "lock"*/
			}
			
			window.scrollTo({       /* Фрагмент який заставляє прокрутитися до потрібного місця*/

				top: gotoBlockValue,    /* Прокрутка зверху*/
				behavior: "smooth"       /* "smooth" - плавна прокрутка*/
			})

			e.preventDefault(); /* Прибирання властивостей в посиланнях які приймають участь в плавному скролі*/
		}
	}
}