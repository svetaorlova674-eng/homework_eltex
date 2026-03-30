/* показ формы */

function showElement() {
    const addArticle = document.querySelector('.add_article');
    addArticle.hidden = false;
}

/* диалог */

const statistics = document.querySelector('.statistics');

function showStatistics() {
    showCount();
    statistics.showModal();
}

/* крестик в диалоге */

const closeBtn = statistics.querySelector("[data-close]");

closeBtn.addEventListener('click', () => {
    statistics.close('x');
});

statistics.addEventListener('click', (e) => {
    if (e.target === statistics) statistics.close('backdrop');
});

/* кол-во статей */

function showCount() {
    const articleCount = document.getElementsByTagName('article').length;
    document.getElementById('article-count').textContent = articleCount;
}

/* сброс и скрытие формы */

const addArticle = document.querySelector('.add_article');
const deleteForm = document.querySelector('.form_art');
const cancelBtn = document.querySelector('.cancel');

cancelBtn.addEventListener('click', () => {
    deleteForm.reset();
    addArticle.hidden = true;
});

/* добавление статьи */

const addBtn = document.querySelector('.sub');
addBtn.addEventListener('click', addArticleTemplate);

function addArticleTemplate(e) {
    e.preventDefault();
    const headline = document.querySelector('.headline').value;

    const template = document.getElementById('article_template');
    const clone = template.content.cloneNode(true);

    clone.querySelector('.article_text p').textContent = headline;

    const articles = document.querySelector('.articles');
    articles.appendChild(clone);

/*     удаление добавленных статей */

    const newArticle = articles.lastElementChild;
    newArticle.querySelector('.delete_article').addEventListener('click', () => {
        newArticle.remove();
    });

    deleteForm.reset();
    addArticle.hidden = true;
}

/* удаление статьи (нажатие на корзину) */

document.querySelectorAll('.delete_article').forEach(deleteBtn => {
    deleteBtn.addEventListener('click', () => {
        deleteBtn.closest('article').remove();
    });
});
