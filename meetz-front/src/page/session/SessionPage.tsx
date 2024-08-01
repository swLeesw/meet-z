
import Session from './components/Session';
import { Session as OVSession, Subscriber, Publisher } from 'openvidu-browser';
import { useOpenvidu } from '../../hooks/session/useOpenvidu';
import { useEffect } from 'react';
import logo_white from '/src/assets/images/logo-white.png'
import camera_icon from '/src/assets/images/camera.png'

function FanMeeting() {
  const { session, sessionId, publisher, subscriber, joinSession} = useOpenvidu();
  useEffect(() => {
	joinSession();
  }, []);
  return (
	<div>
		<div className='flex flex-col justify-center items-center h-screen bg-black'>
			<div>
				<img className='w-56 mb-[48px]' src={logo_white} />
			</div>
			<div className='flex w-[846px] justify-between'>
				<p className='text-xl text-white font-bold'>MEETZMEETZ 팬싸인회</p>
				<p className='text-2xl text-[#FE9374] font-semibold'>01:00</p>
			</div>

			<div className='flex w-[846px]'>
				{session && (
					<Session
						publisher={publisher as Publisher}
						subscriber={subscriber as Subscriber}
					/>
				)}
			</div>
			<div className='flex flex-col justify-center items-center gap-4'>
				<div className="w-[846px] h-[80px] bg-[#FE9374] mt-4">
					<p>MEMO</p>
				</div>
				<img className='w[48px] h-[48px]' src={camera_icon} />
			</div>
			
		</div>
	</div>
);
}

export default FanMeeting;