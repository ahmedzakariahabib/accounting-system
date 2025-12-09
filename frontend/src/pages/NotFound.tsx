import {  MoveLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center flex-1 p-8">
      <div className="flex flex-col items-center text-center">
        <span className="mb-4 material-symbols-outlined text-9xl text-primary/50 dark:text-teal-400/50">
        <SearchX size={150}/>

        </span>
        <h1 className="mb-2 text-6xl font-extrabold text-primary dark:text-teal-400">
          404
        </h1>
        <h2 className="mb-4 text-3xl font-bold text-gray-800 dark:text-gray-200">
          الصفحة غير موجودة
        </h2>
        <p className="max-w-md mb-8 text-gray-600 dark:text-gray-400">
          عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها. ربما تم حذفها أو
          أن الرابط الذي اتبعته غير صحيح.
        </p>
        <a
          className="inline-flex items-center gap-2 px-6 py-3 text-base font-bold text-white transition-colors rounded-lg shadow-sm bg-primary hover:bg-primary/90"
          href="/dashboard"
        >
          <span className="material-symbols-outlined"><MoveLeft/></span>
          العودة إلى لوحة التحكم
        </a>
      </div>
    </main>
  );
}
