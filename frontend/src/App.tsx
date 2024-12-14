import './App.css'
import { DataTable } from './components/myComponents/DataTable'
import { columns } from './components/myComponents/columns'
import { AddStudentModal } from './components/myComponents/AddStudentModal'
import type { Student } from './components/myComponents/columns'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { GradesModal } from './components/myComponents/GradesModal'

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<{id: string, name: string} | null>(null)

  
  const [data, setData] = useState<Student[]>([]);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
useEffect(() => {
  axios.get(`${API_URL}/api/v1/students`)
    .then(response => {
      setData(response.data.data);
    })
    .catch(error => {
      console.error(error);
    });
}, []);

const handleAddStudent = async (name: string) => {
  try {
    const response = await axios.post(`${API_URL}/api/v1/students`, { name });
    if (response.data && response.data.data) {
      const getResponse = await axios.get(`${API_URL}/api/v1/students`);
      setData(getResponse.data.data);
      setIsModalOpen(false);
    }
  } catch (error: any) {
    console.error('Error adding student:', error.response?.data || error.message);
    alert('Failed to add student. Please try again.');
  }
};

const handleRowClick = (student: Student) => {
    setSelectedStudent({ id: student.id, name: student.name })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <h2 className="text-2xl font-bold text-blue-600">SMS</h2>
            </div>
            <div className="hidden md:flex space-x-6">
              <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-lg font-medium">Students</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-lg font-medium">Reports</a>
            </div>
          </div>
        </div>
      </nav>

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-extrabold text-gray-900">Student Management System</h1>
              <p className="mt-4 text-lg text-gray-600">Manage and track student records efficiently</p>
            </div>
            <div className="mt-6 md:mt-0">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-lg text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 transition duration-300"
              >
                Add New Student
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-8">
            <DataTable 
              columns={columns} 
              data={data}
              onRowClick={handleRowClick}  />
          </div>
        </div>
      </main>

      <AddStudentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddStudent}
      />
      
      <GradesModal
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        studentId={selectedStudent?.id ?? null}
        studentName={selectedStudent?.name ?? ''}
      />
    </div>
  )
}

export default App