// 1.  Выносим логику в именованную функцию
const initMovieTable = () => {
  const moviesData = [
    { id: 26, title: "Побег из Шоушенка", imdb: 9.3, year: 1994 },
    { id: 25, title: "Крёстный отец", imdb: 9.2, year: 1972 },
    { id: 27, title: "Крёстный отец 2", imdb: 9.0, year: 1974 },
    { id: 1047, title: "Тёмный рыцарь", imdb: 9.0, year: 2008 },
    { id: 223, title: "Криминальное чтиво", imdb: 8.9, year: 1994 },
  ];

  const tbody = document.querySelector(".movie-tbody");
  const headers = document.querySelectorAll(".movie-table th");

  if (!tbody) return;

  /* ==========================================================================
     1. ИНИЦИАЛИЗАЦИЯ: Генерация HTML-таблицы и запись data-* атрибутов
     ========================================================================== */
  moviesData.forEach((movie) => {
    const tr = document.createElement("tr");

    // Записываем данные в data-атрибуты для последующей сортировки по DOM
    tr.dataset.id = movie.id;
    tr.dataset.title = movie.title;
    tr.dataset.year = movie.year;
    tr.dataset.imdb = movie.imdb.toFixed(2);

    tr.innerHTML = `
      <td>#${movie.id}</td>
      <td>${movie.title}</td>
      <td>(${movie.year})</td>
      <td>imdb: ${movie.imdb.toFixed(2)}</td>
    `;

    //  Заменили appendChild на append
    tbody.append(tr);
  });

  /* ==========================================================================
     2. НАСТРОЙКА ЦИКЛИЧЕСКОЙ СОРТИРОВКИ 
     ========================================================================== */
  const sortingSequence = [
    { key: "id", dir: "asc" },
    { key: "id", dir: "desc" },
    { key: "title", dir: "asc" },
    { key: "title", dir: "desc" },
    { key: "year", dir: "asc" },
    { key: "year", dir: "desc" },
    { key: "imdb", dir: "asc" },
    { key: "imdb", dir: "desc" },
  ];

  let currentSortStep = 0;

  /* ==========================================================================
     3. ФУНКЦИЯ СОРТИРОВКИ С АЛГОРИТМОМ DIFF (Advanced)
     ========================================================================== */
  function sortTable() {
    const { key, dir } = sortingSequence[currentSortStep];

    // Извлекаем tr-элементы напрямую из DOM-дерева
    const currentRowsInDOM = Array.from(tbody.querySelectorAll("tr"));

    // Создаем отсортированный массив (это то, как элементы ДОЛЖНЫ стоять)
    const sortedRows = [...currentRowsInDOM].sort((rowA, rowB) => {
      const valA = rowA.dataset[key];
      const valB = rowB.dataset[key];

      // Числовая сортировка для id, year, imdb
      if (key === "id" || key === "year" || key === "imdb") {
        return dir === "asc"
          ? Number(valA) - Number(valB)
          : Number(valB) - Number(valA);
      }

      // Строковая сортировка для названий (title)
      return dir === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });

    // Визуальное обновление стрелок в шапке таблицы (id ↑, title ↓ и т.д.)
    headers.forEach((th) => {
      th.textContent = th.dataset.sort;
    });
    const activeHeader = Array.from(headers).find(
      (th) => th.dataset.sort === key,
    );
    if (activeHeader) {
      activeHeader.textContent += dir === "asc" ? " ↑" : " ↓";
    }

    // РЕАЛИЗАЦИЯ DIFF: Сравниваем реальный DOM и отсортированный массив
    for (let i = 0; i < sortedRows.length; i++) {
      const targetRow = sortedRows[i]; // Элемент, который должен тут стоять
      const currentRowInDOM = tbody.children[i]; // Элемент, который сейчас стоит в DOM

      // Если текущий элемент в DOM не совпадает с целевым, перемещаем его точечно
      if (currentRowInDOM !== targetRow) {
        tbody.insertBefore(targetRow, currentRowInDOM);
      }
    }

    // Переходим к следующему шагу сортировки в цикле
    currentSortStep = (currentSortStep + 1) % sortingSequence.length;
  }

  // Вынесли "Magic number" в константу
  const SORT_INTERVAL_MS = 2000;

  //  Сохраняем интервал в переменную
  // eslint-disable-next-line no-unused-vars
  const intervalId = setInterval(sortTable, SORT_INTERVAL_MS);
};

//  Передаем именованную функцию в слушатель
document.addEventListener("DOMContentLoaded", initMovieTable);
