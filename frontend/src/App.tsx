import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Box } from '@mui/material'
import ModelBuilder from './components/ModelBuilder'

function App() {
  return (
    <Router>
      <Box sx={{ height: '100vh', width: '100vw' }}>
        <Routes>
          <Route path="/" element={<ModelBuilder />} />
        </Routes>
      </Box>
    </Router>
  )
}

export default App
