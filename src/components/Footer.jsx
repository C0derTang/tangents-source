const Footer = ({ currentPage, totalPages, onPageChange }) => {
    return (
      <div className="bg-gray-800 text-white p-4 rounded-lg mt-4 flex justify-between items-center">
        <span>&copy; 2024 Christopher Tang. All rights reserved.</span>
        <div>
            <p className="inline px-4">Page {currentPage} of {totalPages}</p>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Next
          </button>
        </div>
      </div>
    );
  };
  
  export default Footer;