export default function LoadingSpinner() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
        <div className="text-center">
          <p className="text-lg font-semibold text-slate-800">
            Parliament in Session
          </p>
          <p className="text-slate-600 mt-1">
            Experts are deliberating on your question...
          </p>
        </div>
      </div>
    </div>
  );
}
