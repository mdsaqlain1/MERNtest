import { useNavigate } from 'react-router-dom';

export const Landing = () => {
    const navigate = useNavigate();
  return (
    <div>
        <div className='py-2'>
        <button
            onClick={() => navigate('/login')}
                className=" bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Login 
              </button>
        </div>
    </div>
  )
}
