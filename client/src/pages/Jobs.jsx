import { useState, useEffect } from 'react';
import { Plus, Briefcase, Users } from 'lucide-react';
import api from '../api/axios';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorAlert from '../components/ErrorAlert';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get('/jobs');
      setJobs(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    try {
      setSubmitting(true);
      const { data } = await api.post('/jobs', {
        title: form.title.trim(),
        description: form.description.trim(),
      });
      setJobs((prev) => [data, ...prev]);
      setShowModal(false);
      setForm({ title: '', description: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create job');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold text-zinc-100">Job Listings</h1>
        </div>
        <LoadingSkeleton type="list" count={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header section: stays inline on mobile view nicely */}
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-zinc-100 truncate">Job Listings</h1>
          <p className="text-sm text-zinc-500 mt-1 hidden sm:block">Manage your open positions</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="shrink-0">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Job</span>
          <span className="sm:hidden">New</span>
        </Button>
      </div>

      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

      {jobs.length === 0 ? (
        <div className="card p-8 sm:p-16 text-center">
          <Briefcase className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-400 font-medium">No job openings yet</p>
          <p className="text-sm text-zinc-500 mt-1 mb-4">Create your first job posting to start screening candidates.</p>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4" />
            Create Job
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <div 
              key={job._id} 
              className="card-hover p-4 flex items-center justify-between gap-4 overflow-hidden"
            >
              {/* Left group: Icon + Titles */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="p-2 rounded-xl bg-indigo-500/10 shrink-0">
                  <Briefcase className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-zinc-100 truncate text-sm sm:text-base">
                    {job.title}
                  </h3>
                  <p className="text-sm text-zinc-500 truncate mt-0.5">
                    {job.description || 'No description provided'}
                  </p>
                </div>
              </div>

              {/* Right group: Candidate count badge matching Applications page layout */}
              <div className="shrink-0">
                <Badge variant="info">
                  <Users className="w-3 h-3" />
                  <span>{job.applicationCount ?? 0}</span>
                  <span className="hidden sm:inline"> candidates</span>
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal form updates for clean viewports */}
      <Modal isOpen={showModal} onClose={() => !submitting && setShowModal(false)} title="New Job Posting">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="input-label" htmlFor="title">Job Title</label>
            <input
              id="title"
              className="input-field"
              placeholder="e.g. Senior Frontend Engineer"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
              autoFocus
            />
          </div>
          <div>
            <label className="input-label" htmlFor="desc">Job Description</label>
            <textarea
              id="desc"
              className="input-field min-h-[120px] resize-y"
              placeholder="Describe the role, responsibilities, and required skills..."
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting} disabled={!form.title.trim()}>
              Create Job
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}