export const PageContainer = ({ title, children, actionButton }) => {
  const showHeader = Boolean(title) || Boolean(actionButton);

  return (
    <div className="flex flex-col w-full space-y-4">
      {showHeader && (
        <div className="flex justify-between items-center gap-4">
          {title ? (
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          ) : (
            <span />
          )}
          {actionButton}
        </div>
      )}
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 w-full">
        {children}
      </div>
    </div>
  );
};
