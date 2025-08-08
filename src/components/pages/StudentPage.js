import { useEffect, useState } from 'react';
import axios from 'axios';
import StudentForm from '../students/StudentForm';
import StudentTable from '../students/StudentTable';
import Sidebar from '../Sidebar/Sidebar';

const StudentPage = () => {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get('http://localhost:5000/api/students');
      setStudents(res.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteStudent = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/students/${id}`);
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter students based on search term
  const filteredStudents = students.filter((student) => {
    const term = searchTerm.toLowerCase();
    return (
      student.name?.toLowerCase().includes(term) ||
      student.mobileNumber?.toLowerCase().includes(term)
    );
  });

  // Get current students for pagination
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const handleEdit = (student) => {
    setEditingStudent(student);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingStudent(null);
  };

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-gray-50 to-blue-50">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-blue-600 to-blue-800 shadow-xl">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Student Management</h1>
              <p className="text-gray-600 mt-1">
                {filteredStudents.length} {filteredStudents.length === 1 ? 'student' : 'students'} found
              </p>
            </div>
            <div className="flex space-x-4 mt-4 md:mt-0">
              {/* Search Box */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search students..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <button
                onClick={() => {
                  setEditingStudent(null);
                  setModalOpen(true);
                }}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add Student</span>
              </button>
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {isLoading ? (
              <div className="p-8 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <StudentTable
                students={currentStudents}
                setEditingStudent={handleEdit}
                deleteStudent={deleteStudent}
              />
            )}
          </div>

          {/* Pagination */}
          {filteredStudents.length > studentsPerPage && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-600">
                Showing {indexOfFirstStudent + 1} to {Math.min(indexOfLastStudent, filteredStudents.length)} of {filteredStudents.length} entries
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white hover:bg-gray-100 border border-gray-300'}`}
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`px-4 py-2 rounded-lg ${currentPage === number ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100 border border-gray-300'}`}
                  >
                    {number}
                  </button>
                ))}
                
                <button
                  onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white hover:bg-gray-100 border border-gray-300'}`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Add/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-2xl relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {editingStudent ? 'Edit Student' : 'Add New Student'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="max-h-[80vh] overflow-y-auto p-2">
              <StudentForm
                fetchStudents={fetchStudents}
                editingStudent={editingStudent}
                setEditingStudent={setEditingStudent}
                onClose={handleCloseModal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPage;