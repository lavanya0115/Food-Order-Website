import { AlertCircle, PackageOpen } from "lucide-react";
export const Spinner = () => (
  <div className="grid min-h-48 place-items-center">
    <div className="size-10 animate-spin rounded-full border-4 border-rose-100 border-t-brand" />
  </div>
);
export function EmptyState({
  title = "Nothing here",
  message = "No records were found.",
}) {
  return (
    <div className="card p-10 text-center">
      <PackageOpen className="mx-auto text-stone-300" size={44} />
      <h3 className="mt-3 font-black">{title}</h3>
      <p className="mt-1 text-sm text-stone-500">{message}</p>
    </div>
  );
}
export function ErrorState({ message }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
      <AlertCircle className="mr-2 inline" size={18} />
      {message}
    </div>
  );
}
