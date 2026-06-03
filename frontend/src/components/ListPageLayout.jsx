import { PageContainer } from "./PageContainer";

/**
 * Layout para listados CRUD: título, búsqueda y tabla con espaciado consistente.
 */
export const ListPageLayout = ({
  title,
  subtitle,
  search,
  actions,
  children,
}) => (
  <PageContainer title={title} subtitle={subtitle} actionButton={actions}>
    <div className="space-y-5">
      {search && (
        <div className="rounded-lg border border-gray-200 bg-gray-50/80 p-4">
          {search}
        </div>
      )}
      <div className="list-table-shell">{children}</div>
    </div>
  </PageContainer>
);
