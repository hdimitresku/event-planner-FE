import { BusinessLayout } from "../../components/business/layout"

export default function DashboardPage() {
  return (
    <BusinessLayout>
      <section className="relative w-full py-16 md:py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-gray-100 via-sky-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800">
        {/* Enhanced abstract background elements with better contrast */}
        <div className="absolute inset-0 overflow-hidden opacity-40 dark:opacity-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-sky-300 to-sky-400 dark:bg-sky-700 blur-3xl"></div>
          <div className="absolute top-40 -left-20 w-60 h-60 rounded-full bg-gradient-to-tr from-emerald-300 to-emerald-400 dark:bg-emerald-700 blur-3xl"></div>
          <div className="absolute bottom-20 left-1/2 w-40 h-40 rounded-full bg-gradient-to-r from-violet-200 to-purple-300 dark:bg-purple-700 blur-2xl opacity-60"></div>
        </div>

        {/* Subtle texture overlay for light mode */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(0,0,0,0.15)_1px,_transparent_0)] bg-[length:20px_20px]"></div>

        <div className="container px-4 md:px-8 py-8 md:py-12 relative">
          {/* Rest of the content */}
          // ... existing code ...
        </div>
      </section>
    </BusinessLayout>
  )
}
