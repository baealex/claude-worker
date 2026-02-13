import { BrowserRouter, Routes, Route } from 'react-router';
import MainLayout from './components/templates/MainLayout';
import Dashboard from './routes/Dashboard';
import ProjectDetail from './routes/ProjectDetail';
import JobDetail from './routes/JobDetail';
import Settings from './routes/Settings';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="projects/:id" element={<ProjectDetail />} />
                    <Route path="projects/:id/jobs/:jobId" element={<JobDetail />} />
                    <Route path="settings" element={<Settings />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
