import { Routes, Route, Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold tracking-tight">Forge</h1>
      <p className="text-slate-400 text-lg max-w-md text-center">
        Enterprise Project Management Platform
      </p>
      <div className="flex gap-4">
        <Link
          to="/"
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-colors font-medium"
        >
          Home
        </Link>
      </div>
      <p className="text-sm text-slate-500 mt-8">
        Monorepo scaffold ready · CMS-001 complete
      </p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}
