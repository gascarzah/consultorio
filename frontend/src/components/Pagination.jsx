
export const Pagination = ({
  totalPosts,
  postsPerPage,
  setCurrentPage,
  currentPage,
  handlePrev,
  handleNext,
  disabledPrev,
  setDisabledPrev,
  disabledNext,
  setDisabledNext,
}) => {
  return (
    <div className="flex justify-center">
      <nav aria-label="Page navigation example">
        <ul className="list-style-none flex gap-1">
          <li>
            <button
              disabled={disabledPrev}
              className="relative block rounded bg-sky-600 py-1.5 px-3 text-sm  text-neutral-600 transition-all duration-300 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white"
              onClick={handlePrev}
            >
              <span aria-hidden="true">&laquo;</span>
            </button>
          </li>
          <li>
            <a
              className="relative block rounded bg-sky-600 py-1.5 px-3 text-sm text-neutral-600 transition-all duration-300 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white"
              href="#"
            >
              {currentPage + 1}
            </a>
          </li>

          <li>
            <button
              disabled={disabledNext}
              className="relative block rounded bg-sky-600 py-1.5 px-3 text-sm text-neutral-600 transition-all duration-300 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white"
              onClick={ handleNext}
            >
              <span aria-hidden="true">&raquo;</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};


