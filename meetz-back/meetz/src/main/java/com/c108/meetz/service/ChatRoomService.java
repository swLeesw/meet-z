package com.c108.meetz.service;

import com.c108.meetz.domain.*;
import com.c108.meetz.dto.request.ChatInfo;
import com.c108.meetz.dto.response.ChatListResponseDto;
import com.c108.meetz.dto.response.ChatRoomListResponseDto;
import com.c108.meetz.dto.response.ChatRoomListResponseDto.ChatRoomList;
import com.c108.meetz.exception.BadRequestException;
import com.c108.meetz.exception.NotFoundException;
import com.c108.meetz.repository.*;
import com.c108.meetz.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import static com.c108.meetz.domain.Role.FAN;


import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class ChatRoomService {
    private final UserRepository userRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final ChatRepository chatRepository;
    private final ManagerRepository managerRepository;
    private final MeetingRepository meetingRepository;

    public ChatRoomListResponseDto getChatRoomList(int meetingId){
        Manager manager = getManager();
        Meeting meeting = meetingRepository.findById(meetingId).orElseThrow(()->new NotFoundException("Meeting not found"));
        if(meeting.getManager().getManagerId() != manager.getManagerId()){
            throw new BadRequestException("접근 권한이 없습니다.");
        }
        ChatRoom chatRoom = chatRoomRepository.findByMeeting_MeetingId(meetingId).orElseThrow(()-> new NotFoundException("chatRoom not found"));
        List<User> users = userRepository.findByMeeting_MeetingIdAndRole(meetingId, FAN);
        List<ChatRoomList> rooms = users.stream()
                .map(user -> {
                    Chat chat = chatRepository.findRecentChatByChatRoomAndUserId(chatRoom, user.getUserId(), PageRequest.of(0, 1)).stream().findFirst().orElse(null);
                    return ChatRoomList.of(chat, user);
                })
                .sorted(ChatRoomList.BY_RECENT_DATE_DESC)
                .collect(Collectors.toList());
        return ChatRoomListResponseDto.from(chatRoom.getChatRoomId(), manager.getManagerId(), rooms);
    }
    public ChatListResponseDto getChatListForManager(int meetingId, int userId){
        Manager manager = getManager();
        ChatRoom chatRoom = chatRoomRepository.findByMeeting_MeetingId(meetingId).orElseThrow(()-> new NotFoundException("chatRoom not found"));
        if(manager.getManagerId() != chatRoom.getMeeting().getManager().getManagerId()){
            throw new BadRequestException("접근 권한이 없습니다.");
        }
        List<ChatInfo> chats = chatRepository.findAllByChatRoomAndUserId(chatRoom, userId).stream()
                .map(ChatInfo::from)
                .toList();
        return ChatListResponseDto.from(0, manager.getManagerId(), chats);
    }

    public ChatListResponseDto getChatListForFan(){
        User user = getUser();
        ChatRoom chatRoom = chatRoomRepository.findByMeeting_MeetingId(user.getMeeting().getMeetingId()).orElseThrow(()-> new NotFoundException("chatRoom not found"));
        List<ChatInfo> chats = chatRepository.findAllByChatRoomAndUserId(chatRoom, user.getUserId()).stream()
                .map(ChatInfo::from)
                .toList();
        return ChatListResponseDto.from(user.getUserId(), user.getMeeting().getManager().getManagerId(), chats);
    }
    private Manager getManager(){
        String email = SecurityUtil.getCurrentUserEmail();
        return managerRepository.findByEmail(email).orElseThrow(()->
                new NotFoundException("manager not found"));
    }
    private User getUser(){
        String email = SecurityUtil.getCurrentUserEmail();
        return userRepository.findByEmail(email).orElseThrow(()->
                new NotFoundException("user not found"));
    }

}
