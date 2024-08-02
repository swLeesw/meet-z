import { useState, useCallback, useEffect } from 'react';
import { OpenVidu, Session as OVSession, Subscriber, Publisher } from 'openvidu-browser';
import { createSession, createToken } from '../../apis/session/openviduAPI';

export const useOpenvidu = () => {
    const [session, setSession] = useState<OVSession | ''>('');
	const [sessionId, setSessionId] = useState<string>('');
	const [subscriber, setSubscriber] = useState<Subscriber | null>(null);
	const [publisher, setPublisher] = useState<Publisher | null>(null);
	const [OV, setOV] = useState<OpenVidu | null>(null);

  const leaveSession = useCallback(() => {
        if (session) session.disconnect();

        setOV(null);
        setSession('');
        setSessionId('');
        setSubscriber(null);
        setPublisher(null);
    }, [session]);

    const joinSession = () => {
        
        console.log(sessionId)
        if(sessionId!='')return;
        const OVs = new OpenVidu();
        sessionIdChangeHandler();
        setOV(OVs);
        setSession(OVs.initSession());
    };

    useEffect(() => {
        window.addEventListener('beforeunload', leaveSession);

        return () => {
            window.removeEventListener('beforeunload', leaveSession);
        };
    }, [leaveSession]);

    const sessionIdChangeHandler = (
        // event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setSessionId('meetz');
    };

    useEffect(() => {
        if (session === '') return;

        session.on('streamDestroyed', event => {
            if (subscriber && event.stream.streamId === subscriber.stream.streamId) {
                setSubscriber(null);
            }
        });
    }, [subscriber, session]);

    useEffect(() => {
		if (session === '') return;

		session.on('streamCreated', event => {
			const subscribers = session.subscribe(event.stream, '');
            console.log("!!");
            console.log(subscribers)
			setSubscriber(subscribers);
		});

		const getToken = async (): Promise<string> => {
			try {
				const sessionIds = await createSession(sessionId);
				const token = await createToken(sessionIds);
				return token;
			} catch (error) {
				throw new Error('Failed to get token.');
			}
		};

		getToken()
			.then(token => {
				session
					.connect(token)
					.then(() => {
						if (OV) {
							const publishers = OV.initPublisher(undefined, {
								audioSource: undefined,
								videoSource: undefined,
								publishAudio: true,
								publishVideo: true,
								mirror: true,
                                
							});

							setPublisher(publishers);
							session
								.publish(publishers)
								.then(() => {})
								.catch(() => {});
						}
					})
					.catch(() => {});
			})
			.catch(() => {});
	}, [session, OV, sessionId]);
    return {
        session,
        sessionId,
        publisher,
        subscriber,
        joinSession,
        setSessionId,
        leaveSession
      };

}