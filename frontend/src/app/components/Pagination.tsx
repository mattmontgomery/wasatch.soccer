import styles from "./pagination.module.css";

export default function Pagination({
  pagination,
  renderLink,
}: {
  pagination: App.Pagination;
  renderLink: (page: number, text?: string) => React.ReactElement;
}): React.ReactElement {
  return (
    <div className={styles.pagination}>
      {pagination.page > 1 && (
        <span>{renderLink(pagination.page - 1, "Prev")}</span>
      )}
      {pagination.page > 1 ? (
        Array(pagination.page - 1)
          .fill(null)
          .map((page, idx) => <span key={idx}>{renderLink(idx + 1)}</span>)
      ) : (
        <></>
      )}
      <span className={styles.current}>{pagination.page}</span>
      {pagination.pageCount > pagination.page ? (
        Array(pagination.pageCount - pagination.page)
          .fill(null)
          .slice(0, 5)
          .map((page, idx) => (
            <span key={idx}>{renderLink(idx + 1 + pagination.page)}</span>
          ))
      ) : (
        <></>
      )}
      {pagination.page < pagination.pageCount && (
        <span>{renderLink(pagination.page + 1, "Next »")}</span>
      )}
    </div>
  );
}
