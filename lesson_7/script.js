/* показ формы добавления статьи */

function showElement() {
    const addArticle = document.querySelector('.add_article');
    addArticle.hidden = false;
}

/* окно статистики */

const statistics = document.querySelector('.statistics');

function showStatistics() {
    showCount();
    statistics.showModal();
}

/* закрыть окно статистики */

const closeBtn = statistics.querySelector("[data-close]");

closeBtn.addEventListener('click', () => {
    statistics.close('x');
});

statistics.addEventListener('click', (e) => {
    if (e.target === statistics) statistics.close('backdrop');
});

/* кол-во статей */

function showCount() {
    const articleCount = document.querySelectorAll('.articles article').length;
    document.getElementById('article-count').textContent = articleCount;
}

/* показ/скрытие блока "нет статей" */

function updateNoArticles() {
    const noArticles = document.querySelector('.no_articles');
    const articles = document.querySelector('.articles');
    const hasArticles = articles.querySelectorAll('article').length > 0;
    noArticles.hidden = hasArticles;
    articles.hidden = !hasArticles;
}

/* сброс и скрытие формы */

const addArticle = document.querySelector('.add_article');
const deleteForm = document.querySelector('.form_art');
const cancelBtn = document.querySelector('.cancel');

cancelBtn.addEventListener('click', () => {
    deleteForm.reset();
    addArticle.hidden = true;
});

/* создание карточки статьи */

function createArticle(headline, text) {
    const template = document.getElementById('article_template');
    const clone = template.content.cloneNode(true);

    clone.querySelector('.article_text h4').textContent = headline;
    clone.querySelector('.article_text p').textContent = text;
    clone.querySelector('.art_pic').src = "images/статья 4 архитектура.jpg";
    return clone;
}

/* добавление статьи */

const articles = document.querySelector('.articles');
const addBtn = document.querySelector('.sub');
addBtn.addEventListener('click', addArticleTemplate);

function addArticleTemplate(e) {
    e.preventDefault();
    const headline = document.querySelector('.headline').value;
    const text = document.querySelector('.text_art').value;

    articles.appendChild(createArticle(headline, text));
    saveToStorage(headline, text);
    updateNoArticles();

    deleteForm.reset();
    addArticle.hidden = true;
}

/* удаление статей — делегирование */

articles.addEventListener('click', (e) => {
    if (e.target.closest('.delete_article')) {
        const article = e.target.closest('article');
        const headline = article.querySelector('.article_text h4').textContent;
        removeFromStorage(headline);
        article.remove();
        updateNoArticles();
    }
});

/* сохранение в localStorage */

function saveToStorage(headline, text) {
    const stored = JSON.parse(localStorage.getItem('articles') || '[]');
    stored.push({ headline, text });
    localStorage.setItem('articles', JSON.stringify(stored));
}

/* удаление из localStorage */

function removeFromStorage(headline) {
    const stored = JSON.parse(localStorage.getItem('articles') || '[]');
    const updated = stored.filter(a => a.headline !== headline);
    localStorage.setItem('articles', JSON.stringify(updated));
}

/* загрузка статей из localStorage при входе на страницу */

function loadFromStorage() {
    const stored = JSON.parse(localStorage.getItem('articles') || '[]');
    const articles = document.querySelector('.articles');
    stored.forEach(item => {
        articles.appendChild(createArticle(item.headline, item.text));
    });
    updateNoArticles();
}

loadFromStorage();