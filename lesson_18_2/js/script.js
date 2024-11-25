

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

// Динамічний адаптив для перенесення блоків коду в друге місце

// Dynamic Adapt v.1
// HTML data-da="where(uniq class name),when(breakpoint),position(digi)"
// e.x. data-da=".item,992,2"
// Andrikanych Yevhen 2020
// https://www.youtube.com/c/freelancerlifestyle

class DynamicAdapt {
	constructor(type) {
		this.type = type
	}
	init() {
		// масив об'єктів
		this.оbjects = []
		this.daClassname = '_dynamic_adapt_'
		// масив DOM-елементів
		this.nodes = [...document.querySelectorAll('[data-da]')]

		// наповнення оbjects об'єктами
		this.nodes.forEach((node) => {
			const data = node.dataset.da.trim()
			const dataArray = data.split(',')
			const оbject = {}
			оbject.element = node
			оbject.parent = node.parentNode
			оbject.destination = document.querySelector(`${dataArray[0].trim()}`)
			оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : '767'
			оbject.place = dataArray[2] ? dataArray[2].trim() : 'last'
			оbject.index = this.indexInParent(оbject.parent, оbject.element)
			this.оbjects.push(оbject)
		})

		this.arraySort(this.оbjects)

		// масив унікальних медіа-запитів
		this.mediaQueries = this.оbjects
			.map(({ breakpoint }) => `(${this.type}-width: ${breakpoint}px),${breakpoint}`)
			.filter((item, index, self) => self.indexOf(item) === index)

		// навішування слухача на медіа-запит
		// та виклик оброблювача при першому запуску
		this.mediaQueries.forEach((media) => {
			const mediaSplit = media.split(',')
			const matchMedia = window.matchMedia(mediaSplit[0])
			const mediaBreakpoint = mediaSplit[1]

			// масив об'єктів з відповідним брейкпоінтом
			const оbjectsFilter = this.оbjects.filter(({ breakpoint }) => breakpoint === mediaBreakpoint)
			matchMedia.addEventListener('change', () => {
				this.mediaHandler(matchMedia, оbjectsFilter)
			})
			this.mediaHandler(matchMedia, оbjectsFilter)
		})
	}
	// Основна функція
	mediaHandler(matchMedia, оbjects) {
		if (matchMedia.matches) {
			оbjects.forEach((оbject) => {
				// оbject.index = this.indexInParent(оbject.parent, оbject.element);
				this.moveTo(оbject.place, оbject.element, оbject.destination)
			})
		} else {
			оbjects.forEach(({ parent, element, index }) => {
				if (element.classList.contains(this.daClassname)) {
					this.moveBack(parent, element, index)
				}
			})
		}
	}
	// Функція переміщення
	moveTo(place, element, destination) {
		element.classList.add(this.daClassname)
		if (place === 'last' || place >= destination.children.length) {
			destination.append(element)
			return
		}
		if (place === 'first') {
			destination.prepend(element)
			return
		}
		destination.children[place].before(element)
	}
	// Функція повернення
	moveBack(parent, element, index) {
		element.classList.remove(this.daClassname)
		if (parent.children[index] !== undefined) {
			parent.children[index].before(element)
		} else {
			parent.append(element)
		}
	}
	// Функція отримання індексу всередині батьківського єлементу
	indexInParent(parent, element) {
		return [...parent.children].indexOf(element)
	}
	// Функція сортування масиву по breakpoint та place
	// за зростанням для this.type = min
	// за спаданням для this.type = max
	arraySort(arr) {
		if (this.type === 'min') {
			arr.sort((a, b) => {
				if (a.breakpoint === b.breakpoint) {
					if (a.place === b.place) {
						return 0
					}
					if (a.place === 'first' || b.place === 'last') {
						return -1
					}
					if (a.place === 'last' || b.place === 'first') {
						return 1
					}
					return 0
				}
				return a.breakpoint - b.breakpoint
			})
		} else {
			arr.sort((a, b) => {
				if (a.breakpoint === b.breakpoint) {
					if (a.place === b.place) {
						return 0
					}
					if (a.place === 'first' || b.place === 'last') {
						return 1
					}
					if (a.place === 'last' || b.place === 'first') {
						return -1
					}
					return 0
				}
				return b.breakpoint - a.breakpoint
			})
			return
		}
	}
}
const da = new DynamicAdapt("max");
da.init();


