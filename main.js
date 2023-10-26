import 'normalize.css';
import './style.css';
import './firebase.js';

const $ = (selector, { parent = document } = {}) => selector === "body" ? document.body : (selector === "head" ? document.head : parent.querySelector(selector));

const $$ = (selector) => document.querySelectorAll(selector); 


const PLACEHOLDER_IMG = "/assets/bk-placeholder.png"
const bookBestSeller = $("#best-seller-titles");
const bestSellerTemplate = $("#best-seller-template");

const setTexts = ( data, { parent = document } = {} ) => {
	for(const [key, value] of Object.entries(data)) {
		setText(key, value, { parent });
	}
}

const setText = (selector, value, { parent = document } = {}) => {
	$(`[data-book-${selector}]`, { parent }).textContent = value.toString();

	return $(`[data-book-${selector}]`, { parent });
}

const setAttr = (selector, value, { parent = document, attr = null, element = null } = {}) => {
	attr = attr ?? `data-book-${selector}`;

	element ? element.setAttribute(attr, value) : $(`[data-book-${selector}]`, { parent }).setAttribute(attr, value)

	return element ?? $(`[data-book-${selector}]`, { parent });
}

const renderCards = ({
	rank,
	isbn,
	cover,
	title,
	author,
	link,
	publisher,
	description,
	ranklastweek,
	weeksonlist,
}) => {
	const element = bestSellerTemplate.content.cloneNode(true);
	const parent = element;

	setAttr('rank', rank, { parent });

	const cover_elem = setAttr('cover', PLACEHOLDER_IMG, { parent, attr: 'src'});

	cover.then( (url) => setAttr(null, url, {
		element: cover_elem,
		attr: 'src'
	})).finally( () => {
		cover_elem.classList.remove('blur');
	});

	setAttr('link', link, { parent, attr: 'href' });
	setTexts({
		title,
		author,
		publisher,
		description,
		ranklastweek,
		weeksonlist
	}, { parent });

	document.querySelector("#best-seller-titles").appendChild(element)
}

document.addEventListener("DOMContentLoaded", () => {
	bookBestSeller.innerHTML = "";
	fetch(`https://api.nytimes.com/svc/books/v3/lists.json?list-name=hardcover-fiction&api-key=${import.meta.env['PUBLIC_NYT_API_KEY']}`)
	.then( (res) => res.json())
	.then( (res) => res.results)
	.then( (res) => {
		const results = res.map( (bookResp) => {
			const { rank, 
				isbns: [ book_isbn10 ], 
				book_details: [ book_info ], 
				rank_last_week: ranklastweek = "n/a", 
				weeks_on_list: weeksonlist = "New this week!", amazon_product_url: link 
			} = bookResp

			const { isbn10 : isbn } = book_isbn10;
			const { title, author, publisher, description } = book_info;

			const cover = fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${import.meta.env['PUBLIC_BOOKS_API_KEY']}`, {
				'method': 'get'
			})
				.then(response => response.json())
				.then(data => data.items[0].volumeInfo.imageLinks.thumbnail.toString().replace(/^http:\/\//i, 'https://'))
				.catch( _ => PLACEHOLDER_IMG)

			return renderCards({
				rank,
				isbn,
				cover,
				title,
				author,
				publisher,
				description,
				link,
				ranklastweek,
				weeksonlist,
			})
		});
	})
	.catch( (error) => {
		console.error(error);
		// renderBooks()
	}).finally( _ => {
		
		$("body").classList.remove("blur");
	});

})

$('body').addEventListener('scroll', () => {
	const scroll = $('body').scrollTop;
	if(scroll > 50) {
		$('#masthead').style['height'] = '50px';
		$('#masthead').style['padding']= '8px';
		$('#nyt-logo').style['height'] = '35px';
	}else {
		$('#masthead').style['height'] = '100px';
		$('#masthead').style['padding']= '10px';
		$('#nyt-logo').style['height'] = '80px';
	}
})



