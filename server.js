const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mock Data (No Database Needed)
const courses = [
  {
    _id: '1',
    title: 'Complete Web Development Bootcamp',
    description: 'Learn HTML, CSS, JavaScript, React, Node.js and more!',
    category: 'Development',
    price: 89.99,
    originalPrice: 199.99,
    duration: 60,
    rating: 4.8,
    studentsEnrolled: 1500,
    instructor: { name: 'John Doe', email: 'john@example.com' }
  },
  {
    _id: '2',
    title: 'Data Science & Machine Learning', 
    description: 'Python, Pandas, NumPy, Scikit-learn, TensorFlow',
    category: 'Data Science',
    price: 99.99,
    originalPrice: 249.99, 
    duration: 80,
    rating: 4.9,
    studentsEnrolled: 1200,
    instructor: { name: 'Jane Smith', email: 'jane@example.com' }
  },
  {
    _id: '3',
    title: 'Digital Marketing Mastery',
    description: 'SEO, Social Media, Google Ads, Analytics',
    category: 'Marketing', 
    price: 79.99,
    originalPrice: 179.99,
    duration: 45,
    rating: 4.7,
    studentsEnrolled: 800,
    instructor: { name: 'Mike Johnson', email: 'mike@example.com' }
  }
];

const videos = [
  {
    _id: '1',
    title: 'HTML & CSS Crash Course',
    description: 'Learn the fundamentals of web development with HTML and CSS in this comprehensive tutorial.',
    youtubeId: 'hdI2bqOjy3c',
    duration: 45,
    views: 12000,
    category: 'Development',
    instructor: { name: 'John Doe', email: 'john@example.com' }
  },
  {
    _id: '2',
    title: 'JavaScript Fundamentals',
    description: 'Master JavaScript basics including variables, functions, and DOM manipulation.',
    youtubeId: 'DLX62G4lc44', 
    duration: 60,
    views: 18000,
    category: 'Development',
    instructor: { name: 'John Doe', email: 'john@example.com' }
  },
  {
    _id: '3',
    title: 'React.js Tutorial for Beginners',
    description: 'Learn React.js from scratch with practical examples and projects.',
    youtubeId: 'jS4aFq5-91M',
    duration: 120,
    views: 25000,
    category: 'Development',
    instructor: { name: 'Jane Smith', email: 'jane@example.com' }
  }
];

let users = [];
let enrollments = [];

// Routes
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'EduLearn API is running!',
    endpoints: {
      courses: '/api/courses',
      videos: '/api/videos', 
      register: '/api/auth/register',
      login: '/api/auth/login'
    }
  });
});

// Auth Routes
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name, email and password'
    });
  }

  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists'
    });
  }

  const user = {
    _id: Date.now().toString(),
    name,
    email,
    role: 'student',
    createdAt: new Date()
  };
  
  users.push(user);
  
  res.json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token: 'mock_jwt_token_' + Date.now()
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password'
    });
  }

  let user = users.find(user => user.email === email);
  
  // If user doesn't exist, auto-create one (for demo)
  if (!user) {
    user = {
      _id: Date.now().toString(),
      name: 'Demo User',
      email: email,
      role: 'student',
      createdAt: new Date()
    };
    users.push(user);
  }

  res.json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token: 'mock_jwt_token_' + Date.now()
  });
});

// Course Routes
app.get('/api/courses', (req, res) => {
  const { category, limit = 10, page = 1 } = req.query;
  
  let filteredCourses = courses;
  
  if (category) {
    filteredCourses = filteredCourses.filter(course => 
      course.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedCourses = filteredCourses.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    count: paginatedCourses.length,
    total: filteredCourses.length,
    data: paginatedCourses
  });
});

app.get('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c._id === req.params.id);
  
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }
  
  res.json({
    success: true,
    data: course
  });
});

app.post('/api/courses/:id/enroll', (req, res) => {
  const courseId = req.params.id;
  const course = courses.find(c => c._id === courseId);
  
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  // Mock enrollment
  const enrollment = {
    _id: Date.now().toString(),
    courseId: courseId,
    studentId: 'mock_student_id',
    enrolledAt: new Date(),
    progress: 0
  };
  
  enrollments.push(enrollment);
  course.studentsEnrolled += 1;
  
  res.json({
    success: true,
    message: 'Successfully enrolled in course!',
    data: enrollment
  });
});

// Video Routes
app.get('/api/videos', (req, res) => {
  const { category, limit = 12, page = 1 } = req.query;
  
  let filteredVideos = videos;
  
  if (category) {
    filteredVideos = filteredVideos.filter(video => 
      video.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedVideos = filteredVideos.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    count: paginatedVideos.length,
    total: filteredVideos.length,
    data: paginatedVideos
  });
});

app.get('/api/videos/:id', (req, res) => {
  const video = videos.find(v => v._id === req.params.id);
  
  if (!video) {
    return res.status(404).json({
      success: false,
      message: 'Video not found'
    });
  }
  
  // Increment views
  video.views += 1;
  
  res.json({
    success: true,
    data: video
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('🚀 EduLearn Backend Server Started!');
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}`);
  console.log('💡 No MongoDB required - using mock data');
});
