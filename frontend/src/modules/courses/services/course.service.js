// course.service.js
import api from '../../../api/api';

const COURSES = [
  { id: 'c01', title: 'Data Structures',         icon: '🌲', tag: 'Core CS'       },
  { id: 'c02', title: 'Algorithms',               icon: '⚙️', tag: 'Core CS'       },
  { id: 'c03', title: 'Database Systems',         icon: '🗄️', tag: 'Data'          },
  { id: 'c04', title: 'Web Engineering',          icon: '🌐', tag: 'Development'   },
  { id: 'c05', title: 'Operating Systems',        icon: '💻', tag: 'Core CS'       },
  { id: 'c06', title: 'Computer Networks',        icon: '📡', tag: 'Networking'    },
  { id: 'c07', title: 'Artificial Intelligence',  icon: '🤖', tag: 'AI/ML'         },
  { id: 'c08', title: 'Machine Learning',         icon: '🧠', tag: 'AI/ML'         },
  { id: 'c09', title: 'Software Engineering',     icon: '🏗️', tag: 'Development'   },
  { id: 'c10', title: 'Object-Oriented Programming', icon: '📦', tag: 'Core CS'   },
  { id: 'c11', title: 'Computer Architecture',   icon: '🔩', tag: 'Hardware'      },
  { id: 'c12', title: 'Cybersecurity',            icon: '🔐', tag: 'Security'      },
  { id: 'c13', title: 'Cloud Computing',          icon: '☁️', tag: 'Infrastructure' },
  { id: 'c14', title: 'Mobile Development',       icon: '📱', tag: 'Development'   },
  { id: 'c15', title: 'Theory of Computation',   icon: '🔢', tag: 'Core CS'       },
];

export const fetchCourses = async () => {
  try {
    const response = await api.get('/courses', { timeout: 5000 });
    if (Array.isArray(response?.data) && response.data.length > 0) {
      return response.data;
    }
    return COURSES; // backend returned empty — fall back anyway
  } catch (error) {
    // Network error, backend down, or no internet — use offline fallback
    console.log('Course API unreachable, using offline fallback:', error.message);
    return COURSES;
  }
};