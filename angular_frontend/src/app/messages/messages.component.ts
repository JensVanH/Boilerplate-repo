import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { DbConnectionService } from '../services/db-connection.service';
import { UserService } from '../services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent {
  @ViewChild('chat') private myScrollContainer: ElementRef;

  lastMessages: Message[] = [];
  messages: Message[] = [];
  message: string = "";

  selected: number = -1;
  selectedUserName: string = "";

  locked: boolean = false;
  scrollToBottomNeeded: boolean = false;

  timeToRefresh = 1000; // interval for data refreshing, time in ms
  interval;

  focus: boolean = false;

  // enter focus mode when screen width is smaller than 1000 pixels
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.focus = window.innerWidth < 1000;
  }

  constructor(
    private db: DbConnectionService,
    private route: ActivatedRoute,
    public user: UserService
  ) {
    // repeatedly check for new messages
    this.interval = setInterval(() => {
      this.fetchMessages();
    }, this.timeToRefresh);  
  }

  // scroll to bottom of chat after data change
  ngAfterViewChecked() {        
    if (this.scrollToBottomNeeded){
      this.scrollToBottom();
      this.scrollToBottomNeeded = false;
    }        
  }

  // scrolls to bottom of chat
  scrollToBottom(): void {
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }                 
  }

  ngOnInit() {
    this.db.getLastMessages(this.user.getLoginToken()).then(r => this.lastMessages = r['messages']);

    // get url query params
    this.route.queryParamMap.subscribe(qMap => {
      // when query has 'id' parameter show chat with user
      let uId = qMap['params'].id;
      if (uId){
        this.db.getUserData(uId, this.user.getLoginToken()).then(l => {
          // enter focus mode when id is given
          this.focus = true;
          this.selected = parseInt(uId);
          this.selectedUserName = l['userName'];
          this.fetchMessages();
        })
      } else {
        // reset variables
        this.focus = false;
        this.selected = 1;
        this.messages = [];
        this.message = "";
        this.selectedUserName = "";
      }
    })
  }

  // stop checking for new messages when leaving page
  ngOnDestroy(){
    clearInterval(this.interval)
  }

  // open chat window
  selectPerson(message: Message){
    if (this.locked)
      return;
    this.messages = [];
    this.selected = message.senderID === this.user.getId() ? message.receiverID : message.senderID;
    this.selectedUserName = message.senderID === this.user.getId() ? message.receiver : message.sender;
    this.db.getMessages(this.user.getLoginToken(), this.selected).then(r => {
      this.messages = r['messages'];
      this.scrollToBottomNeeded = true;
    });
    this.message = "";
  }

  // update data
  fetchMessages(){
    // fetch last messages
    this.db.getLastMessages(this.user.getLoginToken()).then(r => this.lastMessages = r['messages']);
    if (this.selected < 0)
      return;
    // fetch messages from open chat
    this.db.getMessages(this.user.getLoginToken(), this.selected).then(r => {
      let m = r['messages'];
      // add message and scroll to bottom when new messages are fetched
      if (m.length > this.messages.length){
        for (let i = this.messages.length; i < m.length; i++)
          this.messages.push(m[i]);
        this.scrollToBottomNeeded = true;
      }
    });
  }

  // sends message on "Enter" keypress
  keyPressed(event){
    if(event.key === "Enter")
      this.sendMessage();
  }

  sendMessage(){
    this.locked = true; // safety while sending message
    this.db.postMessage(this.user.getLoginToken(), this.selected, this.message).then(r => {
      this.message = ""; // clear input field
      // add new message locally
      let m = r['message'];
      this.messages.push(m);
      m.sender = this.user.getUserName();
      m.receiver = this.selectedUserName;
      this.moveLastMessageUp(m);
      this.locked = false;
      this.scrollToBottomNeeded = true;
    })
  }

  // move last message up when sending message
  moveLastMessageUp(m: Message){
    for (let i = 0; i < this.lastMessages.length; i++){
      if (this.lastMessages[i].receiverID === this.selected || this.lastMessages[i].senderID === this.selected){
        // set chat to top of recent messages list
        this.lastMessages.unshift(...this.lastMessages.splice(i, 1));
        // update last message
        this.lastMessages[0].message = m.message;
        return;
      }
    }
    // When no previous message is found, add message
    this.lastMessages.unshift(m);
  }

  simplifyDate(d: string){
    return d.split("T")[0]
  }
}

export interface Message {
  messageID: number,
  receiverID: number,
  senderID: number,
  message: string,
  createdAt: Date,
  sender: string,
  receiver: string,
  viewed: boolean
}

