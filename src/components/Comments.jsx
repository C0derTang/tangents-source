import { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, query, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

const Comments = ({ blogId, user }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsCollectionRef = collection(db, 'blogs', blogId, 'comments');
        const q = query(commentsCollectionRef);
        const querySnapshot = await getDocs(q);
        const commentsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setComments(commentsData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchComments();
  }, [blogId]);

  const handleAddComment = async () => {
    if (newComment.trim() === '') return;
    const commentsCollectionRef = collection(db, 'blogs', blogId, 'comments');
    await addDoc(commentsCollectionRef, {
      text: newComment,
      author: user.email,
      timestamp: Timestamp.now(),
    });
    setNewComment('');
    const updatedComments = await getDocs(query(commentsCollectionRef));
    setComments(updatedComments.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })));
  };

  return (
    <div>
      <h4>Comments</h4>
      <div>
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-700 p-2 rounded mb-2">
            <p>{comment.text}</p>
            <small>{comment.author}</small>
          </div>
        ))}
      </div>
      {user && (
        <div className="mt-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            rows="4"
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
          <button onClick={handleAddComment} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
            Add Comment
          </button>
        </div>
      )}
    </div>
  );
};

export default Comments;
