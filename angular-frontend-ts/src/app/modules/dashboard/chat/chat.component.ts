import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { HttpService, HelperService, DataService, SocketService } from 'app/services';
import { api } from 'app/constants/api.constant';
import { messages } from 'app/constants/messages.constants';
import { evetns } from 'app/constants/socket-events';
import { environment } from '../../../../environments/environment';

import { DialogService } from 'primeng/dynamicdialog';

import { ToastrService } from 'ngx-toastr';
import * as RecordRTC from 'recordrtc';

import { ScheduleCallDialogComponent } from '../schedule-call-dialog/schedule-call-dialog.component';

declare var $: any;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

  filesData: any = null;
  isUploading: any = false;
  url: any = '';
  fileName: any = '';
  maxSize: any = 25;

  isRecording: boolean = false;
  recordingTime: number = 0;
  recorder: any = '';
  intervalId: any = '';

  public isEmojiPickerVisible: boolean = false;

  client: any;
  chats: any = [];
  calls: any = null;
  chatListener: any;

  message: any = {
    client: null,
    user: null,
    sender: null,
    text: '',
    image: null,
    audio: null,
    video: null,
    document: null,
  };

  @ViewChild('fileUpload', { static: false }) fileUploadEl: ElementRef = {} as ElementRef;

  constructor(private httpService: HttpService,
    public helperService: HelperService,
    public dataService: DataService,
    private toastr: ToastrService,
    public dialogService: DialogService,
    public socketService: SocketService) {

    this.client = this.helperService.getClient();
    this.chatListener = this.socketService.socketOn(`${evetns.chat.client}${this.client.id}`)
      .subscribe(data => {
        console.log('----------- Chat Listener ---------------');
        console.log(data.message);
        this.getChat(this.client.id);
      })
  }

  ngOnInit(): void {
    this.getChat(this.client.id);
    this.getCalls();
  }

  scrollToBottom(time = 50): void {
    setTimeout(() => { $('.chat-messages-wrapper').animate({ scrollTop: $('.chat-messages-wrapper')[0].scrollHeight }); }, time);
  }

  getChat(clientId: any) {
    this.httpService.call(api.getChat(clientId))
      .then(success => {
        this.chats = success;
        this.scrollToBottom();
      }, error => {
        console.log(error);
        this.toastr.error(error.message);
      });
  }

  getCalls(): void {
    this.httpService.call(api.getCallTasks)
      .then(success => {

        if (success.calls.length) {
          this.calls = success.calls[0];
          console.log(this.calls);
        }

      }, error => {
        console.log(error);
        this.toastr.error(error.message);
      });
  }

  scheduleCall(): void {

    const ref = this.dialogService.open(ScheduleCallDialogComponent, {
      styleClass: 'confirm-dismiss-diloag',
      showHeader: false,
      data: {
      }
    });

    ref.onClose.subscribe(({ isSuccess }: any) => {
      this.getCalls();
    });

  }

  cancelCall(call: any) {
    this.helperService.openURLInNewTab(call.cancelURI)
  }

  attachmentUpload(): void {
    this.fileUploadEl.nativeElement.click();
  }

  fileReader(files: any, extensions: any = ['.png', '.jpg', '.jpeg', '.mp4']): any {
    const allowed = this.helperService.validatFileType(files.target.files, extensions);

    if (allowed) {
      const sizeAllowed = this.helperService.validatFileSize(files.target.files, this.maxSize);
      if (sizeAllowed) {
        this.filesData = files.target.files;
        console.log(this.filesData)
        this.uploadFile();
      } else {
        this.toastr.error(`Please select a file less than ${this.maxSize} MB`);
      }
    }
    else {
      this.toastr.error(messages.incorrectFormat);
    }
  }

  uploadFile(): void {

    this.isUploading = true;
    this.fileName = '';
    this.url = '';
    const formData = new FormData();

    for (let i = 0; i < this.filesData.length; i++) {
      formData.append('file', this.filesData[i]);
    }

    this.httpService.call(api.fileUpload, formData, true)
      .then(success => {

        this.fileName = '';
        this.url = '';
        this.isUploading = false;

        if (success.format === 'png' || success.format === 'jpg' || success.format === 'jpeg') {
          this.message.image = success.url;
        } else if (success.format === 'mp4') {
          this.message.video = success.url;
        } else {
          this.message.document = success.url;
        }

        setTimeout(() => {
          this.sendMsg();
        }, 1500);

      }, error => {
        console.log(error);
        this.toastr.error(error);
      });

  }

  async recordVoice() {

    this.isRecording = true;
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true
    });
    this.recorder = new RecordRTC(stream, {
      type: 'audio',
      mimeType: 'audio/wav',
      disableLogs: true,
    });
    this.recorder.startRecording();
    this.intervalId = setInterval(() => {
      this.recordingTime += 1;
    }, 1000);
  }

  async stopRecording(isSave: any) {
    this.isRecording = false;
    clearInterval(this.intervalId);
    this.recorder.stopRecording(() => {

      if (isSave) {
        const blob = this.recorder.getBlob();
        const formData = new FormData();
        formData.append('file', blob);

        this.httpService.call(api.fileUpload, formData, true)
          .then(success => {

            this.message.audio = success.url;

            setTimeout(() => {
              this.sendMsg();
            }, 1500);

          }, error => {
            console.log(error);
            this.toastr.error(error);
          });

      }

    });
  }

  public addEmoji(event: any) {
    this.message.text += event.emoji.native;
    this.isEmojiPickerVisible = false;
  }

  sendMsg(): void {

    this.message.client = this.client.id;
    this.message.sender = this.client.id;
    // this.message.user = this.client.onboarding.coach;
    this.message.user = environment.coach;

    this.httpService.call(api.sendMessage, this.message)
      .then(success => {

        this.message = {
          client: null,
          user: null,
          sender: null,
          text: '',
          image: null,
          audio: null,
          document: null
        };

        this.getChat(this.client.id);

      }, error => {
        console.log(error);
        this.toastr.error(error.message);
      });
  }

  ngOnDestroy() {
    if (this.chatListener) {
      this.chatListener.unsubscribe();
    }
  }

}
