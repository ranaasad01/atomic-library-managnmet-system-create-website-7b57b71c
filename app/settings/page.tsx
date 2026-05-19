export const dynamic = "force-dynamic";
export default function SettingsPage() {
  return (
    <main className="min-h-screen">
      <section className="py-20 px-6 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Settings
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Explore our settings section for details and more information.
          </p>
        </div>
      </section>
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6">
            About Settings
          </h2>
          <p className="text-slate-600 leading-relaxed">
            This page is being prepared with full content. Check back soon for
            complete information about our settings offerings.
          </p>
          <p className="text-slate-600 leading-relaxed mt-4">
            Admin: Rao Ali
          </p>
        </div>
      </section>
    </main>
  );
}