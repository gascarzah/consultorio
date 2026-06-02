
export const PageContainer = ({ title, children, actionButton }) => {
  return (
    <div className="flex flex-col min-h-screen w-full h-full space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-sky-800">{title}</h2>
        {actionButton}
      </div>
      <div className="flex-1 bg-white rounded-lg shadow-md border border-gray-200 w-full h-full">
        {children}
      </div>
    </div>
  );
}; 