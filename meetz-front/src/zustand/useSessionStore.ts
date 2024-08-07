import { create } from 'zustand'

interface sessionStore{
    starName:string;
    fanName:string;
    wait:number;
    remain:number;
    settingDone:Boolean;
    fanId:string;
    token:string;
    timer:number;
    nextStarName:string;
    setStartName:(nickname:string)=>void;
    setFanName:(nickname:string)=>void;
    setWait:(num:number)=>void;
    setRemain:(num:number)=>void;
    setSettingDone:(setting:boolean)=>void;
    setFanId:(id:string)=>void;
    setToken:(t:string)=>void;
    setTimer:(time:number)=>void;
    setNextStarName:(nickname:string)=>void;
}
export const useSessionStore = create<sessionStore>((set)=>({
    starName:"",
    fanName:"",
    wait:200,
    remain:200,
    settingDone:true,
    fanId:"",
    token:"",
    timer:0,
    nextStarName:"",
    setStartName:(nickname)=>set({starName:nickname}),
    setFanName:(nickName)=>set({fanName:nickName}),
    setWait:(num)=>set({wait:num}),
    setRemain:(num)=>set({remain:num}),
    setSettingDone:(setting)=>set({settingDone:setting}),
    setFanId:(id)=>set({fanId:id}),
    setToken:(t)=>set({token:t}),
    setTimer:(time)=>set({timer:time}),
    setNextStarName:(nickname)=>set({nextStarName:nickname})

}))