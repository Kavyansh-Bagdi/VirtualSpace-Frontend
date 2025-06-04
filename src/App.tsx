import './App.css'

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="about" element={<AuthPage />} />
      </Routes>
    </Suspense>
  )
}

export default App
