// course.service.js
// Returns a fixed list of CS courses.
// Production: replace with  api.get('/courses')

import api from '../../../api/api'; // ready for production swap

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
  // ── PRODUCTION ──
  // const response = await api.get('/courses');
  // return response.data;

  // ── MOCK ──
  return new Promise((resolve) => {
    setTimeout(() => resolve(COURSES), 600);
  });
};