/**
 * Contenedor de página (inspirado en admin shell de torneos): título, subtítulo y card única con aire.
 */
export const PageContainer = ({ title, subtitle, children, actionButton }) => {
  return (
    <div className="space-y-6">
      {(title || actionButton) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {title && (
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
            )}
          </div>
          {actionButton && <div className="shrink-0">{actionButton}</div>}
        </div>
      )}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
        {children}
      </div>
    </div>
  );
};

export const FormPage = ({ title, subtitle, children, maxWidth = "max-w-3xl" }) => (
  <PageContainer title={title} subtitle={subtitle}>
    <div className={`mx-auto w-full ${maxWidth}`}>{children}</div>
  </PageContainer>
);
