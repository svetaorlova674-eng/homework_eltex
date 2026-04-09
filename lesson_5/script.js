/* показ формы */

function showElement() {
    const addArticle = document.getElementById('add_article');
    addArticle.hidden = false;
}

/* диалог */

function showStatistics() {
    showCount();
    const statistics = document.getElementById('statistics');
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

/*  сброс и скрытие формы */

const addArticle = document.getElementById('add_article');
const deleteForm = document.querySelector('.form_art');
const cancelBtn = document.getElementById('cancel');

cancelBtn.addEventListener('click', () => {
    deleteForm.reset();
    addArticle.hidden = true;
});

/* добавление статьи */

const addBtn = document.getElementById('sub');
addBtn.addEventListener('click', addArticleTemplate);

function addArticleTemplate(e) {
    e.preventDefault();
    const template = document.getElementById('article_template');
    const clone = template.content.cloneNode(true);
    const articles = document.querySelector('.articles');
    articles.appendChild(clone);
}