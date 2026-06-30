import { useState, useEffect, useMemo } from 'react';
import { Users, FileSearch, Brain, UserCheck } from 'lucide-react';
import api from '../api/axios';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';
import ScoreRing from '../components/ScoreRing';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorAlert from '../components/ErrorAlert';

function scoreBadgeVariant(score) {
  if (score >= 80) return 'success';
  if (score >= 60) return 'warning';
  return 'error';
}

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const { data: jobsData } = await api.get('/jobs');

        if (cancelled) return;

        const appPromises = jobsData.map((job) =>
          api.get(`/applications/job/${job._id}`).then((res) =>
            res.data.map((app) => ({ ...app, jobTitle: job.title }))
          )
        );
        const appsNested = await Promise.all(appPromises);
        const allApps = appsNested.flat();

        if (!cancelled) {
          setJobs(jobsData);
          setApplications(allApps);
        }
      } catch (err) {
        if (!cancelled) setError(err.isServerWaking ? err.message : (err.response?.data?.message || 'Failed to load dashboard data'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, []);

  const stats = useMemo(() => {
    const totalApps = applications.length;
    const scores = applications.map((a) => a.aiScore ?? 0);
    const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const shortlisted = scores.filter((s) => s >= 80).length;
    return { totalApps, avg, shortlisted, totalJobs: jobs.length };
  }, [applications, jobs]);

  const recentApps = useMemo(
    () =>
      [...applications]
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 8),
    [applications]
  );

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-100">Dashboard</h1>
          <p className="text-sm text-zinc-500 mt-1">Overview of your hiring pipeline</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <LoadingSkeleton type="card" count={4} />
        </div>
        <LoadingSkeleton type="table" count={5} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-100">Dashboard</h1>
        <p className="text-sm text-zinc-500 mt-1">Overview of your hiring pipeline</p>
      </div>

      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Applications"
          value={stats.totalApps}
          icon={Users}
          accent="indigo"
          trend={stats.totalApps > 0 ? { direction: 'up', value: `${stats.totalApps}` } : undefined}
        />
        <StatCard
          title="Resumes Screened"
          value={stats.totalApps}
          icon={FileSearch}
          accent="emerald"
        />
        <StatCard
          title="Avg. AI Match Score"
          value={`${stats.avg}%`}
          icon={Brain}
          accent="amber"
        />
        <StatCard
          title="Shortlisted"
          value={stats.shortlisted}
          icon={UserCheck}
          accent="rose"
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">Recent Applications</h2>
        {recentApps.length === 0 ? (
          <div className="card p-12 text-center">
            <FileSearch className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
            <p className="text-sm text-zinc-500">No applications yet. Upload resumes to get started.</p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800/60">
                    <th className="text-left px-6 py-3.5 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Candidate
                    </th>
                    <th className="text-left px-6 py-3.5 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="text-left px-6 py-3.5 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="text-center px-6 py-3.5 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      AI Score
                    </th>
                    <th className="text-left px-6 py-3.5 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/40">
                  {recentApps.map((app) => (
                    <tr key={app._id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-zinc-200 whitespace-nowrap">
                        {app.candidateName}
                      </td>
                      <td className="px-6 py-4 text-zinc-400 whitespace-nowrap">{app.email}</td>
                      <td className="px-6 py-4 text-zinc-300 whitespace-nowrap">{app.jobTitle}</td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <ScoreRing score={app.aiScore ?? 0} size="sm" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={scoreBadgeVariant(app.aiScore)}>
                          {app.aiScore >= 80 ? 'Shortlisted' : app.aiScore >= 60 ? 'Consider' : 'Review'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
