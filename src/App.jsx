import { useEffect, useState } from 'react';
import Auth from './components/Auth';
import Header from './components/Header';
import Footer from './components/Footer';
import MarkdownEditor from './components/MarkdownEditor';
import Comments from './components/Comments';
import MarkdownRenderer from './components/MarkdownRenderer';
import { db, auth } from './firebase';
import { getDocs, collection, addDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [blogList, setBlogList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage] = useState(10);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlogId, setCurrentBlogId] = useState(null);
  const [user, setUser] = useState(null);

  const blogsCollectionRef = collection(db, 'blogs');

  useEffect(() => {
    const getBlogList = async () => {
      try {
        const data = await getDocs(blogsCollectionRef);
        const filteredData = data.docs.map((doc) => {
          const docData = doc.data();
          const time = docData.time instanceof Timestamp ? docData.time.toDate().toLocaleString() : docData.time;
          return {
            ...docData,
            id: doc.id,
            time,
          };
        });
        filteredData.sort((a, b) => new Date(b.time) - new Date(a.time));
        setBlogList(filteredData);
      } catch (err) {
        console.error(err);
      }
    };

    getBlogList();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  const createNewBlog = async (title, content) => {
    if (title && content) {
      const newDoc = await addDoc(blogsCollectionRef, {
        title,
        content,
        time: Timestamp.now(),
      });
      setBlogList((prevBlogList) => [
        {
          id: newDoc.id,
          title,
          content,
          time: new Date().toLocaleString(),
        },
        ...prevBlogList,
      ]);
      alert('New blog created!');
    } else {
      alert('Title and content are required to create a new blog');
    }
  };

  const handleEditClick = (blogId) => {
    setCurrentBlogId(blogId);
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsEditing(false);
    const updatedBlogList = await getBlogs();
    updatedBlogList.sort((a, b) => new Date(b.time) - new Date(a.time));
    setBlogList(updatedBlogList);
  };

  const handleDelete = async (blogId) => {
    const blogDoc = doc(db, 'blogs', blogId);
    await deleteDoc(blogDoc);
    const updatedBlogList = await getBlogs();
    updatedBlogList.sort((a, b) => new Date(b.time) - new Date(a.time));
    setBlogList(updatedBlogList);
  };

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogList.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogList.length / blogsPerPage);

  const onPageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <Header />
      <Auth setUser={setUser} />
      {user && user.email === 'tangchristopher111@gmail.com' && (
        <div className="bg-gray-800 p-4 rounded-lg mt-4">
          <MarkdownEditor
            docId={null}
            isNew={true}
            onSave={(title, content) => createNewBlog(title, content)}
          />
        </div>
      )}

      <div className="mt-8 space-y-8">
        {currentBlogs.map((blog) => (
          <div key={blog.id} className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-2xl font-bold">{blog.title}</h3>
            <p className="text-gray-400">{blog.time}</p>
            {isEditing && currentBlogId === blog.id ? (
              <MarkdownEditor docId={blog.id} isNew={false} onSave={handleSave} />
            ) : (
              <>
                <div className="mt-4">
                  <MarkdownRenderer content={blog.content} />
                </div>
                {user && user.email === 'tangchristopher111@gmail.com' && (
                  <div className="mt-4 flex space-x-4">
                    <button onClick={() => handleEditClick(blog.id)} className="bg-yellow-500 text-white px-4 py-2 rounded">Edit</button>
                    <button onClick={() => handleDelete(blog.id)} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
                  </div>
                )}
                <Comments blogId={blog.id} user={user} />
              </>
            )}
          </div>
        ))}
      </div>

      <Footer
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}

export default App;
