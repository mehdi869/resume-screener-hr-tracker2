import { useState, useEffect } from 'react';
import { Send, FileText, User, Mail, ExternalLink } from 'lucide-react';
import api from '../api/axios';
import Button from '../components/Button';
import Badge from '../components/Badge';
import ScoreRing from '../components/ScoreRing';
import DropZone from '../components/DropZone';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorAlert from '../components/ErrorAlert';

function scoreBadgeVariant(score) {
  if (score >= 80) return 'success';
  if (score >= 60) return 'warning';
  return 'error';
}

export default function Applications() {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [applications, setApplications] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingApps, setLoadingApps] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [form, setForm] = useState({
    candidateName: '',
    email: '',
    resumeRawText: '',
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (selectedJobId) fetchApplications(selectedJobId);
    else setApplications([]);
  }, [selectedJobId]);

  async function fetchJobs() {
    try {
      setLoadingJobs(true);
      const { data } = await api.get('/jobs');
      setJobs(data);
      if (data.length > 0) setSelectedJobId(data[0]._id);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load jobs');
    } finally {
      setLoadingJobs(false);
    }
  }

  async function fetchApplications(jobId) {
    try {
      setLoadingApps(true);
      setError(null);
      const { data } = await api.get(`/applications/job/${jobId}`);
      setApplications(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load applications');
      setApplications([]);
    } finally {
      setLoadingApps(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selectedJobId) {
      setError('Please select a job position first.');
      return;
    }
    if (!form.candidateName.trim() || !form.email.trim() || !form.resumeRawText.trim()) return;
    try {
      setSubmitting(true);
      setError(null);
      setSuccessMsg('');
      const { data } = await api.post('/applications', {
        job2Id: selectedJobId,
        candidateName: form.candidateName.trim(),
        email: form.email.trim(),
        resumeRawText: form.resumeRawText.trim(),
      });
      setApplications((prev) => [data, ...prev]);
      setForm({ candidateName: '', email: '', resumeRawText: '' });
      setSuccessMsg('Application submitted successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  }

  function handleFileContent(content) {
    setForm((f) => ({ ...f, resumeRawText: content }));
  }

  const selectedJob = jobs.find((j) => j._id === selectedJobId);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-100">Applications</h1>
        <p className="text-sm text-zinc-500 mt-1">Screen and review candidate resumes</p>
      </div>

      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-300">
          {successMsg}
        </div>
      )}

      <div className="card p-5 space-y-4">
        {loadingJobs ? (
          <div className="h-10 bg-zinc-800 rounded animate-pulse" />
        ) : jobs.length === 0 ? (
          <p className="text-sm text-zinc-500 text-center py-4">
            No jobs available. Create a job posting first.
          </p>
        ) : (
          <>
            <div>
              <label className="input-label" htmlFor="job-select">Select Position</label>
              <select
                id="job-select"
                className="input-field"
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
              >
                {jobs.map((job) => (
                  <option key={job._id} value={job._id}>
                    {job.title}
                  </option>
                ))}
              </select>
            </div>

            {selectedJob && (
              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                <Badge variant="info">{applications.length} applications</Badge>
                <span className="text-zinc-700">|</span>
                <span className="truncate max-w-[300px]">{selectedJob.description || 'No description'}</span>
              </div>
            )}
          </>
        )}
      </div>

      {selectedJobId && (
        <>
          <div className="card p-5">
            <h2 className="text-base font-semibold text-zinc-100 mb-5">Submit New Application</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="input-label" htmlFor="name">
                    <User className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                    Candidate Name
                  </label>
                  <input
                    id="name"
                    className="input-field"
                    placeholder="John Doe"
                    value={form.candidateName}
                    onChange={(e) => setForm((f) => ({ ...f, candidateName: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="input-label" htmlFor="email">
                    <Mail className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="input-field"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="input-label">
                  <FileText className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                  Resume Text
                </label>
                <div className="space-y-3">
                  <DropZone onFileContent={handleFileContent} />
                  <textarea
                    className="input-field min-h-[160px] resize-y font-mono text-xs leading-relaxed"
                    placeholder="Paste resume text here, or drag & drop a file above..."
                    value={form.resumeRawText}
                    onChange={(e) => setForm((f) => ({ ...f, resumeRawText: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" loading={submitting} disabled={
                  !form.candidateName.trim() || !form.email.trim() || !form.resumeRawText.trim()
                }>
                  <Send className="w-4 h-4" />
                  Submit Application
                </Button>
              </div>
            </form>
          </div>

          <div>
            <h2 className="text-base font-semibold text-zinc-100 mb-4">
              Candidates ({applications.length})
            </h2>

            {loadingApps ? (
              <LoadingSkeleton type="list" count={3} />
            ) : applications.length === 0 ? (
              <div className="card p-12 text-center">
                <FileText className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                <p className="text-sm text-zinc-500">No applications for this position yet.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {applications.map((app) => (
                  <div key={app._id} className="card-hover overflow-hidden">
                    <button
                      onClick={() => setExpandedId(expandedId === app._id ? null : app._id)}
                      className="w-full text-left p-5 flex items-center gap-4"
                    >
                      <ScoreRing score={app.aiScore ?? 0} size="md" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-zinc-100 truncate">{app.candidateName}</p>
                        <p className="text-sm text-zinc-500 truncate">{app.email}</p>
                      </div>
                      <Badge variant={scoreBadgeVariant(app.aiScore)}>
                        {app.aiScore ?? 0}% match
                      </Badge>
                      <ExternalLink className={`w-4 h-4 text-zinc-600 transition-transform duration-200 ${expandedId === app._id ? 'rotate-180' : ''}`} />
                    </button>

                    {expandedId === app._id && (
                      <div className="px-5 pb-5 pt-0 border-t border-zinc-800/40 mt-0">
                        <div className="pt-4 space-y-3">
                          <div className="flex items-center gap-2 text-sm text-zinc-400">
                            <Mail className="w-3.5 h-3.5" />
                            {app.email}
                          </div>

                          {app.aiSummary ? (
                            <div className="bg-zinc-900/50 rounded-lg p-4">
                              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                                AI Screening Summary
                              </p>
                              <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                                {app.aiSummary}
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-zinc-500 italic">No AI summary available</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
