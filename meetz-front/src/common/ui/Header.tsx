import { useUserStore } from '../../zustand/useUserStore';
import logo from '/src/assets/images/logo.png';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const { clearUserData } = useUserStore();

  const logoutHandler = () => {
    localStorage.clear();
    clearUserData();
    alert('로그아웃 되었습니다.');
    navigate('/');
  };

  return (
    <div className='bg-white border-b border-gray-300 border-opacity-50 flex shadow-lg justify-center'>
      <div className='flex max-w-screen-xl justify-between items-center w-full px-9 py-10'>
        <Link to='yet'>
          <img src={logo} alt='Meet:Z 로고' className='h-8' />
        </Link>
        <div className='flex justify-between w-full max-w-sm'>
          <div className='relative group'>
            <Link to='end' className='text-2xl font-bold'>
              완료된 미팅
            </Link>
            <div className='absolute bottom-[-8px] left-1/2 h-[2px] w-0 bg-[#ff4f5d] transition-all duration-200 group-hover:left-0 group-hover:w-full'></div>
          </div>
          <div className='relative group'>
            <Link to='yet' className='text-2xl font-bold'>
              미완료 미팅
            </Link>
            <div className='absolute bottom-[-8px] left-1/2 h-[2px] w-0 bg-[#ff4f5d] transition-all duration-200 group-hover:left-0 group-hover:w-full'></div>
          </div>
          <div className='relative group'>
            <button className='text-2xl font-bold' onClick={logoutHandler}>
              로그아웃
            </button>
            <div className='absolute bottom-[-8px] left-1/2 h-[2px] w-0 bg-[#ff4f5d] transition-all duration-200 group-hover:left-0 group-hover:w-full'></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
