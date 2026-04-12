import { BookOpen, CheckCircle, Clock, Home } from 'lucide-react';

function AdminDashboardPage({ dashboardStats, fatwas, onOpenFatwas }) {
  const stats = dashboardStats?.stats || {
    total: fatwas.length,
    new: fatwas.filter((fatwa) => fatwa.status === 'new').length,
    answered: fatwas.filter((fatwa) => fatwa.status === 'published' || fatwa.status === 'answered').length,
    gaza: fatwas.filter((fatwa) => fatwa.location === 'قطاع غزة').length,
  };
  const latestFatwas = dashboardStats?.latestFatwas || fatwas.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={<BookOpen className="h-8 w-8" />} color="bg-blue-100 text-blue-600" label="إجمالي الفتاوى" value={stats.total} />
        <StatCard icon={<Clock className="h-8 w-8" />} color="bg-amber-100 text-amber-600" label="بانتظار الرد" value={stats.new} />
        <StatCard icon={<CheckCircle className="h-8 w-8" />} color="bg-emerald-100 text-emerald-600" label="تمت الإجابة" value={stats.answered} />
        <StatCard icon={<Home className="h-8 w-8" />} color="bg-purple-100 text-purple-600" label="من غزة" value={stats.gaza} />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-bold">أحدث الفتاوى الواردة</h3>
          <button onClick={onOpenFatwas} className="text-sm text-emerald-600 hover:underline">
            عرض الكل
          </button>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {latestFatwas.map((fatwa) => (
            <div key={fatwa.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900 dark:text-white truncate max-w-md">{fatwa.question}</p>
                <p className="text-sm text-gray-500 mt-1">{fatwa.name || 'مجهول'} • {fatwa.location} • {fatwa.date}</p>
              </div>
              <span className={`px-3 py-1 text-xs rounded-full font-medium ${fatwa.status === 'new' ? 'bg-amber-100 text-amber-800' : fatwa.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}>
                {fatwa.status === 'new' ? 'جديدة' : fatwa.status === 'published' ? 'منشورة' : fatwa.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ color, icon, label, value }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center">
      <div className={`p-4 rounded-full ${color} ml-4`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
